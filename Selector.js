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
  const selectedNodes = new Map()

  const machine = selectorMachine(
    items,
    query => item => item.toLowerCase().indexOf(query.toLowerCase()) >= 0,

    matchedMachine(
      (text, callback) => {
        const node = document.createElement(matchedTag)
        node.innerHTML = text
        node.classList.add(matchedClass)
        node.addEventListener('click', callback)
        matchedContainer.appendChild(node)
      },
      () => {
        while(matchedContainer.firstChild)
          matchedContainer.removeChild(matchedContainer.firstChild)
      },
      matchedLimit),

    selectedMachine(
      (text, callback) => {
        const node = document.createElement(selectedTag)
        node.innerHTML = text
        node.classList.add(selectedClass)
        const nodeClose = document.createElement('span')
        nodeClose.innerHTML = 'x'
        nodeClose.classList.add(selectedCloseClass)
        nodeClose.addEventListener('click', callback)
        node.appendChild(nodeClose)
        selectedContainer.appendChild(node)
        selectedNodes.set(text, node)
      },
      (item) => {
        selectedContainer.removeChild(selectedNodes.get(item))
        selectedNodes.delete(item)
      }
    )
  )
  inputField.addEventListener(
    'input', () => machine.transition('REMATCH', {query: inputField.value}))
}

export { selector }
