import { ofetch } from 'ofetch'
import { addQuiz, GenerativeQuiz } from '~/utils/utils'

interface Country {
  name: {
    common: string
    official: string
    nativeName: {
      [key: string]: {
        official: string
        common: string
      }
    }
  }
  tld: string[]
  cca2: string
  ccn3: string
  cca3: string
  cioc: string
  independent: boolean
  status: string
  unMember: boolean
  currencies: {
    [key: string]: {
      name: string
      symbol: string
    }
  }
  idd: {
    root: string
    suffixes: string[]
  }
  capital: string[]
  altSpellings: string[]
  region: string
  subregion: string
  languages: {
    [key: string]: string
  }
  translations: {
    [key: string]: string
  }
  latlng: number[]
  landlocked: boolean
  borders: string[]
  area: number
  demonyms: {
    [key: string]: {
      f: string
      m: string
    }
  }
  flag: string
  maps: {
    googleMaps: string
    openStreetMaps: string
  }
  population: number
  gini: {
    [key: string]: number
  }
  fifa: string
  car: {
    signs: string[]
    side: string
  }
  timezones: string[]
  continents: string[]
  flags: {
    svg: string
    png: string
    alt: string
  }
  coatOfArms: {
    png: string
    svg: string
  }
  startOfWeek: string
  capitalInfo: {
    latlng: number[]
  }
  postalCode: {
    format: string
    regex: string
  }
}

let restcountries: Country[] = []

async function getCountries() {
  if (restcountries.length === 0) {
    restcountries = (await ofetch('https://restcountries.com/v3.1/all')) as Country[]
    restcountries.find((c) => {
      // use https://flagpedia.net for all countries
      if (!c.flags.svg.includes('flagcdn.com') || !c.flags.png.includes('flagcdn.com')) {
        const id = c.cca2.toLowerCase()
        c.flags.svg = `https://flagcdn.com/${id}.svg`
        c.flags.png = `https://flagcdn.com/w320/${id}.png`
      }
    })
  }
  return restcountries
}

export type Filters =
  | 'world'
  | 'africa'
  | 'americas'
  | 'asia'
  | 'europe'
  | 'oceania'
  | 'canada'
  | 'japan'
  | 'usa'

export function createQuiz(filter: Filters) {
  let countryBuilder = null
  switch (filter) {
    case 'world':
      countryBuilder = new CountriesBuilder().all()
      break
    case 'africa':
      countryBuilder = new CountriesBuilder().filterByRegion('Africa')
      break
    case 'americas':
      countryBuilder = new CountriesBuilder().filterByRegion('Americas')
      break
    case 'asia':
      countryBuilder = new CountriesBuilder().filterByRegion('Asia')
      break
    case 'europe':
      countryBuilder = new CountriesBuilder().filterByRegion('Europe')
      break
    case 'oceania':
      countryBuilder = new CountriesBuilder().filterByRegion('Oceania')
      break
    case 'canada':
      countryBuilder = new CountriesBuilder().filterByCountry('Canada')
      break
    case 'japan':
      countryBuilder = new CountriesBuilder().filterByCountry('Japan')
      break
    case 'usa':
      countryBuilder = new CountriesBuilder().filterByCountry('United States')
      break
    default:
      throw new Error('Invalid filter')
  }
  getCountries().then((countries) => {
    const answers = countries.map((c) => ({
      question: 'What is the name of this country?',
      answer: c.name.common,
      image: c.flags.svg,
    }))
    const quiz = new GenerativeQuiz(answers)
    addQuiz(filter, quiz)
  })
}

export class CountriesBuilder {
  private filters: Record<'region' | 'subregion' | 'country', string[]>
  private allCountries = false

  constructor() {
    this.filters = {
      region: [],
      subregion: [],
      country: [],
    }
  }

  build(countries: Country[]) {
    return this.allCountries
      ? countries
      : countries.filter((c) => {
          return (
            this.filters.region.includes(c.region) ||
            this.filters.subregion.includes(c.subregion) ||
            this.filters.country.includes(c.name.common)
          )
        })
  }

  filterByRegion(region: string) {
    this.filters.region.push(region)
    return this
  }

  filterByCountry(country: string) {
    this.filters.country.push(country)
    return this
  }

  all() {
    this.allCountries = true
    return this
  }
}
