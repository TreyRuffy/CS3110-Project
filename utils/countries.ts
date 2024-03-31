import { ofetch } from 'ofetch'
import type { Question } from '~/server/util'

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
      if (c.name.common === 'Afghanistan') {
        c.flags.svg = 'https://flagcdn.com/af.svg'
        c.flags.png = 'https://flagcdn.com/w320/af.png'
      }
    })
  }
  return restcountries
}

export function createQuestions(countries: Country[], count?: number): Question[] {
  const questions: Question[] = []
  for (let i = 0; i < (count || 10); i++) {
    const correct = countries[Math.floor(Math.random() * countries.length)]
    countries = countries.filter((c) => c.name.common !== correct.name.common)
    // get 3 random countries that are not the correct one
    const wrong = Array.from({ length: 3 }, () => {
      let country = countries[Math.floor(Math.random() * countries.length)]
      while (country === correct) {
        country = countries[Math.floor(Math.random() * countries.length)]
      }
      countries = countries.filter((c) => c.name.common !== country.name.common)
      return country
    })
    questions.push({
      question: 'What is the name of this country?',
      answers: [correct.name.common, wrong.map((c) => c.name.common)],
      image: correct.flags.svg,
    })
  }
  return questions
}

export async function getCountry(name: string) {
  return await getCountries().then((countries) => {
    return countries.find((c) => c.name.common === name)
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

  async build() {
    const countries = await getCountries()
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
