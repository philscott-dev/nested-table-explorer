// https://github.com/you-dont-need/You-Dont-Need-Lodash-Underscore#_get
export const get = (obj: any, path: string, defaultValue = undefined) => {
  const travel = (regexp: RegExp) =>
    String.prototype.split
      .call(path, regexp)
      .filter(Boolean)
      .reduce(
        (res, key) => (res !== null && res !== undefined ? res[key] : res),
        obj,
      )
  const result = travel(/[,[\]]+?/) || travel(/[,[\].]+?/)
  return result === undefined || result === obj ? defaultValue : result
}

/**
 * Get Path Map
 */

interface ObjPaths {
  data: any
  path: string[]
}

interface PathMap {
  [template: string]: string[]
}

export const getPaths = (data: any) => {
  let pathMap: PathMap = {}
  let nodes: ObjPaths[] = [
    {
      data,
      path: [],
    },
  ]
  let index = 0
  while (nodes.length > 0) {
    const node = nodes.pop()!
    const keys = Object.keys(node.data)
    let objKeys: string[] = []

    for (const key of keys) {
      if (typeof node.data[key] === 'object') {
        // handle nested objects and arrays
        const path = node.path.concat(key)
        const template = createTemplateString(path)
        const pathString = path.join('.')
        pathMap[template] = [...(pathMap?.[template] ?? []), pathString]

        nodes.unshift({
          data: node.data[key],
          path,
        })
      } else {
        // collect the keys that are on top level objects
        objKeys = [...objKeys, key]
      }
    }
    for (const k of objKeys) {
      // add top level keys to path array
      const path = node.path.concat(k)
      const template = createTemplateString(path)
      const pathString = path.join('.')
      pathMap[template] = [...(pathMap?.[template] ?? []), pathString]
    }
    index++
  }

  return pathMap
}

function createTemplateString(path: string[]) {
  return path
    .map((p) => {
      const int = parseInt(p, 10)
      return int || int === 0 ? '*' : p
    })
    .join('.')
}
