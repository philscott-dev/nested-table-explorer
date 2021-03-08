/**
 * Get Path Map
 */

interface ObjPaths {
  data: any
  path: (string | number)[]
}

export interface PathMap {
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
  while (nodes.length > 0) {
    const lastIndex = nodes.length - 1

    // get the last node
    const node = nodes.slice(lastIndex)[0]

    // remove that index from the array
    nodes = nodes.slice(0, lastIndex)

    // generate indicies or keys
    const keys = Array.isArray(node.data)
      ? Array.from({ length: node.data.length }, (_, i) => i)
      : Object.keys(node.data)

    // temp holder for object keys
    let objKeys: (string | number)[] = []

    for (const key of keys) {
      if (typeof node.data[key] === 'object') {
        // handle nested objects and arrays
        const path = handleIndexOrStringPaths(node.path, key)
        const template = createTemplateString(path)
        const pathString = path.join('.')
        pathMap[template] = [...(pathMap?.[template] ?? []), pathString]
        nodes = [
          {
            data: node.data[key],
            path,
          },
          ...nodes,
        ]
      } else {
        // collect the keys that are on top level objects
        objKeys = [...objKeys, key]
      }
    }

    for (const k of objKeys) {
      // add top level keys to path array
      const path = handleIndexOrStringPaths(node.path, k)
      const template = createTemplateString(path)
      const pathString = path.join('.')
      pathMap[template] = [...(pathMap?.[template] ?? []), pathString]
    }
  }

  return pathMap
}

// https://github.com/you-dont-need/You-Dont-Need-Lodash-Underscore#_get
export const get = (obj: any, path: string, defaultValue?: any) => {
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

// path templates that look like "myKey[100]""
export function parseIndexPath(key: string) {
  const start = key.indexOf('[')
  const end = key.indexOf(']')

  if (start < 0 || end < 0 || end < start) {
    return { key }
  }

  return {
    key: key.substring(0, start),
    index: parseInt(key.substring(start + 1, end), 10),
  }
}

export function parseKey(
  key: string,
  index: number,
): [string | undefined, number | undefined] {
  if (index === 0) {
    const n = parseInt(key, 10)!
    return [undefined, n]
  }

  if (key.endsWith(']')) {
    const parsed = parseIndexPath(key)
    return [parsed.key, parsed.index]
  }

  return [key, undefined]
}

export function isObject(x: any) {
  return !!x && !Array.isArray(x) && x.constructor === Object
}

export function arrayToCsv(items: any[], paths: string[]) {
  const header = paths.map((path) => {
    const p = path.split('.')
    const h = p[p.length - 1]
    return h.endsWith(']') ? h.substring(0, h.indexOf('[')) : h
  })
  return [
    header.join(','), // header row first
    ...items.map((row) =>
      header
        .map((fieldName) => {
          let field = row[fieldName]

          if (Array.isArray(field)) {
            field = field.join('\r\n')
          }
          return JSON.stringify(field, (key: string, value: any) =>
            value === null ? '' : value,
          )
        })
        .join(','),
    ),
  ]
    .join('\r\n')
    .split('\\r\\n') // doing this for nested arrays that should be split
    .join('\r\n') // TODO: get rid of this...
}

export function getPathsFromTemplates(userTemplates: string[], pathMap: PathMap) {
  return userTemplates
    .map((template) => pathMap?.[template])
    .flat()
    .filter(Boolean)
}


/**
 * Private Helpers
 */

function handleIndexOrStringPaths(
  path: (string | number)[],
  key: string | number,
) {
  if (!path.length) {
    return [key]
  }
  if (typeof key === 'number') {
    return [
      ...path.slice(0, path.length - 1),
      path[path.length - 1] + `[${key}]`,
    ]
  }
  return path.concat(key)
}

function createTemplateString(path: (string | number)[]) {
  return path
    .map((p) => {
      if (typeof p === 'number') {
        return '*'
      }
      if (p.endsWith(']')) {
        const { key } = parseIndexPath(p)
        return `${key}[*]`
      }
      return p
    })
    .join('.')
}