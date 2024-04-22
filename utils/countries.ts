import { ofetch } from 'ofetch'
import type { Answer } from '~/utils/utils'
import { addQuiz, GenerativeQuiz, getQuiz } from '~/utils/utils'

interface Country {
  name: {
    common: string
    official: string
  }
  cca2: string
  independent: boolean
  region: string
  subregion: string
  flags: {
    svg: string
    png: string
    alt: string
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

export const filters = [
  'world',
  'africa',
  'americas',
  'asia',
  'europe',
  'oceania',
  'canada',
  'japan',
  'usa',
] as const

export async function createQuizzes() {
  return Promise.all(filters.map((f) => createQuiz(f)))
}

export async function createQuiz(filter: (typeof filters)[number]) {
  if (getQuiz(filter) != undefined) {
    return {
      name: filter,
      quiz: getQuiz(filter),
    }
  }
  let countryBuilder: CountriesBuilder | null = null
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
    // TODO fix canada, japan, usa
    case 'canada':
      countryBuilder = new CountriesBuilder().filterByCountry('Canada')
      break
    case 'japan':
      countryBuilder = new CountriesBuilder().filterByCountry('Japan')
      break
    case 'usa':
      countryBuilder = new CountriesBuilder()
        .filterByCountry('United States')
        .filterByCountry('Japan')
        .filterByCountry('Canada')
        .filterByCountry('Mexico')
      break
    default:
      throw new Error('Invalid filter')
  }
  return getCountries().then((countries) => {
    if (countryBuilder === null) {
      return
    }
    const answers: Answer[] = countries.map((c) => ({
      question: 'What is the name of this country?',
      answer: c.name.common,
      image: c.flags.svg,
    }))
    const quizFilter = (answers: Answer[]) => {
      return answers.filter((a) =>
        countryBuilder.build(countries).some((c) => c.name.common === a.answer),
      )
    }
    const quiz = new GenerativeQuiz(answers, quizFilter)
    return addQuiz(filter, quiz)
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
      ? countries.filter((c) => {
          return c.independent
        })
      : countries.filter((c) => {
          return (
            c.independent &&
            (this.filters.region.includes(c.region) ||
              this.filters.subregion.includes(c.subregion) ||
              this.filters.country.includes(c.name.common))
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
