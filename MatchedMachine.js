import { machine, useContext, useState } from './StateMachine.js'

const matchedMachine = (container, makeNode, limit) => machine({
  initialState: 'unitialized',
  context: {},
  states: {
    unitialized: {
      on: {
        INIT: {
          service(event){
            useContext()[1]({selectorMachine: event.selectorMachine})
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
      while(container.firstChild)
        container.removeChild(container.firstChild)
      useState()[1]('drawing')
    },
    draw(event){
      const {matched} = event
      event.matched.slice(0, limit).forEach(item => {
        const [{selectorMachine}] = useContext()
        const node = makeNode(item, () => selectorMachine.transition('SELECT', {item: item}))
        container.appendChild(node)
      })
      useState()[1]('waiting')
    }
  }
})

export { matchedMachine }
