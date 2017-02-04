import test from 'ava'
import chooPromise from '../index'
import Bluebird from 'bluebird'
import isBluebird from 'is-bluebird'

const sendSuccess = (action, data, cb) => cb(null)
const sendError = (action, data, cb) => cb(new Error('Expected error'))

const { wrapEffects, wrapSubscriptions } = chooPromise()

test('wrapEffects with successful effect', async t => {
  t.plan(2)
  const testEffect = async (state, data, send) => {
    await send('some-other-action', {})
    return 'result'
  }

  const done = (err, result) => {
    t.is(err, null, 'done is not called with an error')
    t.is(result, 'result', 'done is called with a result')
  }

  await wrapEffects(testEffect)('test-action', {}, sendSuccess, done)
})

test('wrapEffects with failing effect', async t => {
  t.plan(2)
  const testEffect = async (state, data, send) => {
    throw new Error('Expected error')
  }

  const done = (err, result) => {
    t.deepEqual(err, new Error('Expected error'), 'done is called with an error')
    t.is(result, undefined, 'done is not called with a result')
  }

  await wrapEffects(testEffect)('test-action', {}, sendSuccess, done)
})

test('wrapEffects respects opts.Promise', t => {
  t.plan(2)
  const testEffect = (state, data, send) => {
    const promise = send('some-other-action', {})
    t.true(isBluebird(promise), 'Promisified send uses Bluebird')
  }

  const { wrapEffects } = chooPromise({ Promise: Bluebird })
  const promise = wrapEffects(testEffect)('test-action', {}, sendSuccess, () => {})
  t.true(isBluebird(promise), 'Promise.resolve uses Bluebird')
})

test('failing send rejects with error', async t => {
  t.plan(2)
  const testEffect = async (state, data, send) => {
    await send('some-other-action', {})
    return 'result'
  }

  const done = (err, result) => {
    t.deepEqual(err, new Error('Expected error'), 'done is called with an error')
    t.is(result, undefined, 'done is not called with a result')
  }

  await wrapEffects(testEffect)('test-action', {}, sendError, done)
})

test('wrapSubscriptions with successful subscription', async t => {
  t.plan(2)
  const testSubscription = async (send) => {
    await send('some-other-action', {})
    return 'result'
  }

  const done = (err, result) => {
    t.is(err, null, 'done is not called with an error')
    t.is(result, 'result', 'done is called with a result')
  }

  await wrapSubscriptions(testSubscription)(sendSuccess, done)
})

test('wrapSubscriptions with failing subscription', async t => {
  t.plan(2)
  const testSubscription = async (send) => {
    throw new Error('Expected error')
  }

  const done = (err, result) => {
    t.deepEqual(err, new Error('Expected error'), 'done is called with an error')
    t.is(result, undefined, 'done is not called with a result')
  }

  await wrapSubscriptions(testSubscription)(sendSuccess, done)
})

test('wrapSubscriptions respects opts.Promise', t => {
  t.plan(2)
  const testSubscription = (send) => {
    const promise = send('some-other-action', {})
    t.true(isBluebird(promise), 'Promisified send uses Bluebird')
  }

  const { wrapSubscriptions } = chooPromise({ Promise: Bluebird })
  const promise = wrapSubscriptions(testSubscription)(sendSuccess, () => {})
  t.true(isBluebird(promise), 'Promise.resolve uses Bluebird')
})
