const select = document.querySelector('.select')

const input = select.querySelector('.select-input')
const list = select.querySelector('.select-matched-list')
const selected = select.querySelector('.select-selected-list')

const cities = []
const selectedCities = []

const redraw = () => {
  list.innerHTML = ''
  cities.filter(city => city.indexOf(input.value) >= 0 &&
                selectedCities.findIndex(c => c === city) < 0).
    slice(0, 20).forEach(city => {
      const listNode = document.createElement('p')
      listNode.innerHTML = city
      listNode.classList.add('select-matched-element')
      listNode.addEventListener("click", () => {
        selectedCities.push(city)
        const selectedNode = document.createElement('span')
        const selectedNodeClose = document.createElement('span')
        selectedNodeClose.innerHTML = 'x'
        selectedNode.classList.add('select-selected-element')
        selectedNodeClose.classList.add('select-selected-element-close')
        selectedNodeClose.addEventListener("click", () => {
          selected.removeChild(selectedNode)
          selectedCities.splice(selectedCities.indexOf(city), 1)
          redraw()
        })
        selectedNode.innerHTML = city
        selectedNode.appendChild(selectedNodeClose)
        selected.appendChild(selectedNode)
        list.removeChild(listNode)
      })
      list.appendChild(listNode)
    })
}

fetch('https://api.hh.ru/areas').
  then(res => res.json()).
  then(res => {
    const addArea = area =>
          area.areas.length === 0 ?
          cities.push(area.name) : area.areas.forEach(addArea)
    res.forEach(addArea)
    cities.sort()
    input.addEventListener('input', redraw)
  }).then(redraw)
