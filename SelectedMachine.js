import { machine, useContext, useState } from './StateMachine.js'

const selectedMachine = (container, makeNode) => machine({
  initialState: 'unitialized',
  context: {},
  states: {
    unitialized: {
      on: {
        INIT: {
          service(event) {
            useContext()[1]({selectorMachine: event.selectorMachine})
            useState()[1]('waiting')
          }
        }
      }
    },
    waiting: {
      on: {
        SELECT: { target: 'clearing' },
      }
    },
    clearing: { onEntry: 'clear' },
    drawing: { onEntry: 'draw' },
  },
  actions: {
    clear(event) {
      while(container.firstChild)
        container.removeChild(container.firstChild)
      useState()[1]('drawing')
    },
    draw(event) {
      event.items.forEach((item) => {
        const [{selectorMachine}] = useContext()
        const node = makeNode(item, () => selectorMachine.transition('DESELECT', {item: item}))
        container.appendChild(node)
      })
      useState()[1]('waiting')
    },
  }
})

export { selectedMachine }
