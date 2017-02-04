import test from 'ava'
import chooPromise from '../index'
import barracks from 'barracks'

test.cb('barracks wraps effects', t => {
  const store = barracks()
  store.use(chooPromise())
  store.model({
    state: { value: '' },
    reducers: {
      appendToValue: (state, data) => {
        return { value: state.value + data }
      }
    },
    effects: {
      testEffect: async (state, data, send) => {
        let newState

        newState = await send('appendToValue', 'a')
        t.deepEqual(newState, { value: 'a' }, 'updated state to a')

        newState = await send('appendToValue', 'b')
        t.deepEqual(newState, { value: 'ab' }, 'updated state to ab')

        t.end()
      }
    }
  })

  const createSend = store.start()
  const send = createSend('test')
  send('testEffect', () => {})
})

test.cb('barracks wraps subscriptions', t => {
  const store = barracks()
  store.use(chooPromise())
  store.model({
    state: { value: '' },
    reducers: {
      appendToValue: (state, data) => {
        return { value: state.value + data }
      }
    },
    subscriptions: {
      testSub: async (send) => {
        let newState

        newState = await send('appendToValue', 'a')
        t.deepEqual(newState, { value: 'a' }, 'updated state to a')

        newState = await send('appendToValue', 'b')
        t.deepEqual(newState, { value: 'ab' }, 'updated state to ab')

        t.end()
      }
    }
  })

  store.start()
})
