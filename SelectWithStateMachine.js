import { selector } from './Selector.js'

const select = document.querySelector('.select')

const inputField = select.querySelector('.select-input')

const matchedContainer = select.querySelector('.select-matched-list')
const selectedContainer = select.querySelector('.select-selected-list')

const getAreasURL = 'https://api.hh.ru/areas'

fetch(getAreasURL).
  then(res => res.json()).
  then(res => {
    const cities = []
    const addArea = area =>
          area.areas.length === 0 ?
          cities.push(area.name) : area.areas.forEach(addArea)
    res.forEach(addArea)
    cities.sort()
    selector(cities, {
      inputField: inputField,
      matchedContainer: matchedContainer,
      selectedContainer: selectedContainer
    })
  })
