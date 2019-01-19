import { machine, useContext, useState } from './StateMachine.js'

const matchedMachine = (addItem, clearItems, limit) => machine({
  initialState: 'unitialized',
  context: {},
  states: {
    unitialized: {
      on: {
        INIT: {
          service({selectorMachine}){
            useContext()[1]({selectorMachine: selectorMachine})
            useState()[1]('waiting')
          }
        }
      }
    },
    waiting: {
      on: {
        REMATCH: { target: 'clearing' }
      }
    },
    clearing: { onEntry: 'clear' },
    drawing: { onEntry: 'draw' },
  },
  actions: {
    clear(){
      clearItems()
      useState()[1]('drawing')
    },
    draw({matched}){
      const [{selectorMachine}] = useContext()
      matched.slice(0, limit).forEach(item => addItem(
        item, () => selectorMachine.transition('SELECT', {item: item})))
      useState()[1]('waiting')
    }
  }
})

export { matchedMachine }
