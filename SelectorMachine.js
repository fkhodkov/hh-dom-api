import { machine, useContext, useState } from './StateMachine.js'

function selectorMachine(items, makeQueryMatcher, matchedMachine, selectedMachine) {
  const result = machine ({
    initialState: 'unitialized',
    context: {
      matched: items,
      selected: new Set([]),
      query: ''
    },
    states: {
      unitialized: {
        onExit: 'updateMatch',
        on: {
          INIT: { target: 'waiting' }
        }
      },
      waiting: {
        on: {
          SELECT: { target: 'selecting' },
          DESELECT: { target: 'deselecting' },
          REMATCH: { target: 'matching' }
        }
      },
      selecting: {
        onEntry: ({item}) => {
          const [{selected}, setContext] = useContext()
          if(selected.has(item))
            throw new Error("Attempt to select an already selected item")
          selected.add(item)
          setContext({selected: selected})
          selectedMachine.transition('SELECT', {item: item})
          useState()[1]('waiting')
        },
        onExit: 'updateMatch',
      },
      deselecting: {
        onEntry: ({item}) => {
          const [{selected}, setContext] = useContext()
          if (!selected.delete(item))
            throw new Error("Attempt to delete an unselected item")
          setContext({selected: selected})
          selectedMachine.transition('DESELECT', {item: item})
          useState()[1]('waiting')
        },
        onExit: 'updateMatch'
      },
      matching: {
        onExit: 'updateMatch',
        onEntry: ({query}) => {
          useContext()[1]({ query: query })
          useState()[1]('waiting')
        }
      }
    },
    actions: {
      updateMatch() {
        const[{matched, selected, query}, setContext] = useContext()
        setContext({
          matched: items.filter(makeQueryMatcher(query)).filter(item => !selected.has(item))
        })
        matchedMachine.transition('REMATCH', {matched: useContext()[0].matched})
      }
    }
  })
  matchedMachine.transition('INIT', {selectorMachine: result})
  selectedMachine.transition('INIT', {selectorMachine: result})
  result.transition('INIT')
  return result
}

export { selectorMachine }
