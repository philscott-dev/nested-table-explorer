import { get, getPaths } from "./helpers";
import { mock } from "./mock";

// get a path map based on data
const pathMap = getPaths(mock);
console.log(pathMap)

// fake selecting 2 paths from the path map
const userTemplates = ['*.c.e.*.f', '*.c.e.*.h']

const paths = userTemplates.map(template => pathMap?.[template])
console.log(paths)
// if(paths){
//   const t = template.split('.')
//   const key = t[t.length - 1]
//   const flattened = paths.map(path => ({[key]: get(mock, path)}))
//   console.log(flattened)
// }

