# choo-promise [![Build Status](https://travis-ci.org/rahatarmanahmed/choo-promise.svg?branch=master)](https://travis-ci.org/rahatarmanahmed/choo-promise)
A plugin for [choo](https://github.com/yoshuawuyts/choo) (or [barracks](https://github.com/yoshuawuyts/barracks)) that allows you to return promises to end effects and subscriptions. The send function passed to effects and subscriptions is also promisified.

## Installing
`npm install choo-promise`

## Example usage
```js
var choo = require('choo')
var chooPromise = require('choo-promise')
var Bluebird = require('bluebird')

var app = choo()
// You can optionally provide your own promise implementation
app.use(chooPromise({ Promise: Bluebird }))

app.model({
  state: { value: null }
  effects: {
    updateValue: async (state, data, send) => {
      var value = await fetchSomeData(data)
      return send('setValue', { value })
    }
  },
  subscriptions: {
    initValue: (send) => {
      var value = await fetchSomeData(data)
      return send('setValue', { value })
    }
  }
})
```

### Isn't there another package that does this?

Yup! There's [`barracks-promisify-plugin`](https://github.com/myobie/barracks-promisify-plugin), which does pretty much exactly the same thing. The only differences (at the time of writing) are:

- `barracks-promisify-plugin` uses ES6 features, which you may or may not care about (some tools don't yet support ES6 syntax without pre-transpiling, like uglify). `choo-promise` doesn't use ES6 features.
- `choo-promise` gives you the option to provide your own Promise implementation (like Bluebird) if you want. It will default to the native Promise.
