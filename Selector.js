import { machine, useContext, useState } from './StateMachine.js'
import { selectorMachine } from './SelectorMachine.js'
import { matchedMachine } from './MatchedMachine.js'
import { selectedMachine } from './SelectedMachine.js'

function selector(items, params) {
  const { inputField, matchedContainer, selectedContainer } = params
  const { matchedLimit, matchedTag, matchedClass, selectedTag, selectedClass } = Object.assign(
    {
      // default values
      matchedLimit: 20,
      matchedTag: 'div',
      matchedClass: 'select-matched-element',
      selectedTag: 'span',
      selectedClass: 'select-selected-element'
    },
    // can be overriden if necessary
    params
  )
  const {selectedCloseClass} = Object.assign(
    {selectedCloseClass: selectedClass + '-close'},
    params
  )

  const machine = selectorMachine(
    items,
    query => item => item.toLowerCase().indexOf(query.toLowerCase()) >= 0,

    matchedMachine(
      (text, callback) => {
        const node = document.createElement(matchedTag)
        node.classList.add(matchedClass)
        const nodeAdd = document.createElement('button')
        nodeAdd.innerHTML = '+'
        node.appendChild(nodeAdd)
        nodeAdd.addEventListener('click', callback)
        node.appendChild(document.createTextNode(text))
        matchedContainer.appendChild(node)
      },
      () => {
        while(matchedContainer.firstChild)
          matchedContainer.removeChild(matchedContainer.firstChild)
      },
      matchedLimit),

    selectedMachine(
      (item, callback) => {
        const node = document.createElement(selectedTag)
        node.innerHTML = item
        node.classList.add(selectedClass)
        const nodeClose = document.createElement('button')
        nodeClose.innerHTML = 'x'
        nodeClose.classList.add(selectedCloseClass)
        nodeClose.addEventListener('click', callback)
        node.appendChild(nodeClose)
        node.dataset.item = item
        selectedContainer.appendChild(node)
      },
      (item) => {
        selectedContainer.removeChild(
          Array.from(selectedContainer.children).
            find(child => child.dataset.item === item)
        )
      }
    )
  )
  inputField.addEventListener(
    'input', () => machine.transition('REMATCH', {query: inputField.value}))
}

export { selector }
