import { machine, useContext, useState } from './StateMachine.js'

const selectedMachine = (add, remove) => machine({
  initialState: 'unitialized',
  context: {},

  states: {
    unitialized: {
      on: {
        INIT: {
          service({selectorMachine}) {
            useContext()[1]({selectorMachine: selectorMachine})
            useState()[1]('waiting')
          }
        }
      }
    },
    waiting: {
      on: {
        SELECT: { target: 'selecting' },
        DESELECT: { target: 'deselecting'}
      }
    },
    selecting: { onEntry: 'select' },
    deselecting: { onEntry: 'deselect' },
  },

  actions: {
    select({item}) {
      const [{selectorMachine}] = useContext()
      add(item, () => selectorMachine.transition('DESELECT', {item: item}))
      useState()[1]('waiting')
    },
    deselect({item}) {
      remove(item)
      useState()[1]('waiting')
    },
  }
})

export { selectedMachine }
