import { get, getPaths, flattenByPath } from "./helpers";
import { mock } from "./mock";
const paths = getPaths(mock, true);
console.log(paths);
console.log(flattenByPath(mock, '*.c.e.*.f'))
