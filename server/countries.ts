import { ofetch } from 'ofetch'
import { type Question } from './util'

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

export default async function getCountries() {
  if (restcountries.length === 0) {
    restcountries = (await ofetch('https://restcountries.com/v3.1/all')) as Country[]
  }
  return restcountries
}

export async function createQuestions(): Promise<Question> {
  return await getCountries().then((c) => {
    const countries = c.filter(
      (c) => c.region === 'Europe' || c.region === 'Asia' || c.region === 'Africa',
    )
    const correct = countries[Math.floor(Math.random() * countries.length)]
    // get 3 random countries that are not the correct one
    const wrong = Array.from({ length: 3 }, () => {
      let country = countries[Math.floor(Math.random() * countries.length)]
      while (country === correct) {
        country = countries[Math.floor(Math.random() * countries.length)]
      }
      return country
    })
    return {
      question: 'What is the name of this country?',
      answers: [correct.name.common, wrong.map((c) => c.name.common)],
      image: correct.flags.svg,
    }
  })
}
