import { get, getPaths } from './helpers'
import { mock } from './mock'

console.log(mock)

// get a path map based on data
const pathMap = getPaths(mock)
console.log(pathMap)

// fake selecting 2 paths from the path map
const userTemplates = ['*.c.e.*.f', '*.c.e.*.h', '*.c.*', '*.c.0.*.0']
const paths = userTemplates
  .map((template) => pathMap?.[template])
  .flat()
  .filter(Boolean)
console.log(paths)

let tableData: any[] = []
for (const path of paths) {
  const keys = path.split('.')

  // get first index
  const index = keys.filter((p) => {
    const int = parseInt(p)
    return int || int === 0
  })[0]
  const i = parseInt(index, 10)

  // get property
  const property = keys[keys.length - 1]

  // get data for path
  const data = get(mock, path)

  // build the new user-created array
  tableData[i] = { ...tableData[i], [property]: data }
}

console.log(tableData)
