import { get, getPaths, parseIndexPath } from './helpers'
import { mock } from './mock'

// get a path map based on data
let pathMap = getPaths(mock)
console.log(pathMap)
for (const [key, value] of Object.entries(pathMap)) {
  if (key === '*') {
    delete pathMap[key]
  }
  const data = get(mock, value[0])
  // this is a comment
}

// fake selecting 2 paths from the path map
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
  mock[index] = { ...mock[index], [prop]: data }

  // delete the old data at path
  path.split('.').forEach((key, index) => {

    //const k = parseKey(key, index)
    //TODO: Still trying to figure out how to remove data after flattening!!!
    //console.log(k)
  })
}

console.log(mock)

/** Helpers  */

function parseKey(key: string, index: number) {
  if (index === 0) {
    return [parseInt(key, 10), undefined]
  }

  if (key.endsWith(']')) {
    const parsed = parseIndexPath(key)
    return [parsed.key, parsed.index]
  }

  return [key, undefined]
}
