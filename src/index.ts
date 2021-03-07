import { get, getPaths, parseKey, isObject } from './helpers'
import { mock as mockData } from './mock'

// faking returning data as any
const getMock = (): any => mockData
const mock = getMock()

// get a path map based on data
let pathMap = getPaths(mock)

// clean up available path maps to the user
// TODO: add more if needed
for (const [key, value] of Object.entries(pathMap)) {
  // remove base path
  if (key === '*') {
    delete pathMap[key]
  }
}

// display the path maps available
console.log(pathMap)

// fake selecting paths from the path map
const userTemplates = ['*.c.e[*].f']
const paths = userTemplates
  .map((template) => pathMap?.[template])
  .flat()
  .filter(Boolean)

// get the user selected data from mock array
const flattened = paths.map((path) => {
  // split the path
  const keys = path.split('.')

  // working with table data, 1st split should always be a number
  const index = parseInt(keys[0], 10)

  // get property at the end of the template
  const prop = keys[keys.length - 1]

  // get data for path
  const data = get(mock, path)

  // return the gathered info to work with
  return { index, prop, data, path }
})

// flatten the table by selected path
for (const { index, prop, data, path } of flattened) {
  // spread the original data and add the flattened data to the top level
  if (mock[index][prop]) {
    // if the path already exists add value as a new line
    mock[index][prop] = `${mock[index][prop]}\r\n ${data}`
  } else {
    // else create a new prop top level and add data
    mock[index] = { ...mock[index], [prop]: data }
  }

  // delete the old data at path
  const paths = path.split('.')
  paths.reduce((obj, key, index) => {
    let temp = obj
    const [k, i] = parseKey(key, index)

    // as long as theres an array or object nested
    if (k && isObject(temp)) {
      if (typeof temp[k] === 'object') {
        // if the value is an object or array, assign and continue
        temp = temp[k]
      } else {
        // IMPORTANT: else, it's a value, so delete the nested key!
        delete temp[k]
      }
    }

    // assign array element and continue
    if (typeof i === 'number' && Array.isArray(temp)) {
      temp = temp[i]
    }

    return temp
  }, mock)
}

// Finish
console.log(JSON.stringify(mock, null, 2))
