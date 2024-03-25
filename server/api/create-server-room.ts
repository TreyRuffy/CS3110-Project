import { createRoom } from '~/server/room-manager'
import { Client, Game } from '~/server/util'
import { CountriesBuilder, createQuestions } from '~/utils/countries'

export default defineEventHandler((event) => {
  const query = getQuery(event)
  console.log('Creating room with query:', query)
  const room = createRoom(new Client('Username'))
  const countryBuilder = new CountriesBuilder()
  if (query.region) {
    switch (query.region) {
      case 'world':
        countryBuilder.all()
        break
      case 'africa':
        countryBuilder.filterByRegion('Africa')
        break
      case 'americas':
        countryBuilder.filterByRegion('Americas')
        break
      case 'asia':
        countryBuilder.filterByRegion('Asia')
        break
      case 'europe':
        countryBuilder.filterByRegion('Europe')
        break
      case 'oceania':
        countryBuilder.filterByRegion('Oceania')
        break
      case 'canada':
        countryBuilder.filterByCountry('Canada')
        break
      case 'japan':
        countryBuilder.filterByCountry('Japan')
        break
      case 'usa':
        countryBuilder.filterByCountry('United States')
        break
    }
  }
  countryBuilder.build().then((countries) => {
    room._currentGame = new Game(createQuestions(countries))
  })
  return {
    joinCode: room.joinCode,
    roomUuid: room.uuid,
  }
})
