import { machine, useContext, useState } from './StateMachine.js'

function insertChild (node, parent, greaterThan) {
  const index = Array.from(parent.children).findIndex(child => greaterThan(child, node))
  index < 0 ? parent.appendChild(node) : parent.insertBefore(node, parent.children[index])
}

function makeUtils (params) {
  const machines = []
  const { matchedLimit, matchedTag, matchedClass, selectedTag, selectedClass } = Object.assign(
    // default values
    {
      matchedLimit: 20,
      matchedTag: 'div',
      matchedClass: 'select-matched-element',
      selectedTag: 'span',
      selectedClass: 'select-selected-element'
    },
    // can be overriden if necessary
    params
  )
  const selectedCloseClass = selectedClass + '-close'
  return ({
    matchedLimit: matchedLimit,
    makeMatched: (index, text) => {
      const node = document.createElement(matchedTag)
      node.innerHTML = text
      node.classList.add(matchedClass)
      node.addEventListener('click', () => machines[index].transition('SELECT'))
      return node
    },
    makeSelected: (index, text) => {
      const node = document.createElement(selectedTag)
      node.innerHTML = text
      const nodeClose = document.createElement('span')
      nodeClose.innerHTML = 'x'
      node.classList.add(selectedClass)
      nodeClose.classList.add(selectedCloseClass)
      nodeClose.addEventListener('click', () => machines[index].transition('DESELECT'))
      node.appendChild(nodeClose)
      return node
    },
    machines: machines
  })
}

function selector (values, params) {
  const { inputField, matchedContainer, selectedContainer } = params
  const { matchedLimit, makeMatched, makeSelected, machines } = makeUtils(params)

  const selectorMachine = (index, text) => machine({
    initialState: 'unmatched',
    context: { node: null },
    states: {
      matched: {
        on: {
          SHOW_MATCHED: { target: 'visible' },
          REMATCH: { target: 'rematching' },
          HIDE_MATCHED: { target: 'matched' }
        }
      },
      visible: {
        onEntry: () => {
          const node = makeMatched(index, text)
          useContext()[1]({node: node})
          insertChild(node, matchedContainer, child => child.innerHTML > node.innerHTML)
        },
        onExit: () => {
          matchedContainer.removeChild(useContext()[0].node)
          useContext()[1]({node: null})
        },
        on: {
          REMATCH: { target: 'rematching' },
          SELECT: { target: 'selected' },
          HIDE_MATCHED: { target: 'matched' }
        }
      },
      unmatched: {
        on: {
          REMATCH: { target: 'rematching' },
          HIDE_MATCHED: { target: 'unmatched' },
          SHOW_MATCHED: { target:  'unmatched' }
        }
      },
      rematching: { onEntry: 'rematch' },
      selected: {
        onEntry: () => {
          const node = makeSelected(index, text)
          useContext()[1]({node: node})
          selectedContainer.appendChild(node)
        },
        onExit: () => {
          selectedContainer.removeChild(useContext()[0].node)
          useContext()[1]({node: null})
        },
        on: {
          DESELECT: { target: 'rematching' },
          REMATCH: { target: 'selected' },
          HIDE_MATCHED: { target:  'selected' },
          SHOW_MATCHED: { target:  'selected' }
        }
      }
    },
    actions: {
      rematch: () =>
        useState()[1](text.toLowerCase().indexOf(inputField.value.toLowerCase()) < 0 ?
                      'unmatched' : 'matched')
    }
  })

  function hideVisible () {
    machines.forEach(machine => machine.transition('HIDE_MATCHED'))
  }

  function showVisible () {
    for (let i = 0; i < machines.length && matchedContainer.children.length < matchedLimit; i++) {
      machines[i].transition('SHOW_MATCHED')
    }
  }

  function rematchAll () {
    machines.forEach(machine => machine.transition('REMATCH'))
  }

  values.forEach((text, index) => { machines[index] = selectorMachine(index, text) })
  rematchAll()
  showVisible()

  inputField.addEventListener(
    'input', () => {
      rematchAll()
      showVisible()
    })

  matchedContainer.addEventListener(
    'click', () => {
      hideVisible()
      showVisible()
    },
    false)

  selectedContainer.addEventListener(
    'click', () => {
      hideVisible()
      showVisible()
    },
    false)
}

export { selector }
