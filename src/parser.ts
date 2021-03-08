import { get, parseKey, isObject, PathMap } from './helpers'

export interface Metadata {
  index: number
  prop: string
  data: any
  path: string
}

/**
 * Get the data and position information of keys at selected paths
 */

export function getMetadata(response: any, paths: string[]): Metadata[] {
  return paths.map((path) => {
    // split the path
    const keys = path.split('.')

    // working with table data, 1st split should always be a number
    const index = parseInt(keys[0], 10)

    // get property at the end of the template
    const prop = keys[keys.length - 1]

    // get data for path
    const data = get(response, path)

    // return the gathered info to work with
    return { index, prop, data, path }
  })
}

/**
 * Generate new copy of tableData array, with ONLY flattened properties
 */

export function flattenData(response: any, metadata: Metadata[]) {
  let temp: any = []
  // flatten the table by selected path
  for (const { index, data, prop: p } of metadata) {
    //get the prop name without the [*] index
    const prop = p.endsWith(']') ? p.substring(0, p.indexOf('[')) : p

    if (temp[index]?.[prop]) {
      // if the data exists, add it to the flattened prop
      if (Array.isArray(temp[index][prop])) {
        // spread the data if the array exists 
        temp[index][prop] = [...temp[index][prop], data]
      } else {
        // else create an array for the first time
        temp[index][prop] = [temp[index][prop], data]
      }
    } else {
      // else create a new prop top level and add data
      temp[index] = { ...(temp[index] ?? {}), [prop]: data }
    }
  }
  return temp
}

/**
 * Paths selected will be written back to top level of each object and removed
 * from their original position.If used, you should not allow paths with length 
 * of 2 because those paths are the object themselves.
 * = NOT USING IN DEMO index.ts =
 */

export function flattenNestedProp(response: any, metadata: Metadata[]) {
  for (const { index, prop, data, path } of metadata) {
    // spread the original data and add the flattened data to the top level
    if (response[index][prop]) {
      // if the path already exists add value as a new line
      response[index][prop] = `${response[index][prop]}\r\n ${data}`
    } else {
      // else create a new prop top level and add data
      response[index] = { ...response[index], [prop]: data }
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
    }, response)
  }

  return response
}

/**
 * Remove paths from the path map based on some logic
 * Udate this function with more rules/behaior as necessary!!!
 */

export function cleanupPathMaps(pathMap: PathMap) {
  for (const [template, paths] of Object.entries(pathMap)) {
    // remove base path always
    if (template === '*') {
      delete pathMap[template]
    }
  }
  return pathMap
}
