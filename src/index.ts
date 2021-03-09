import { getPaths, arrayToCsv, getPathsFromTemplates } from './helpers'
import { mock as mockData } from './mock'
import { promptPaths, promptUrl } from './prompts'
import { getMetadata, flattenData, cleanupPathMaps } from './parser'
import { fetcher } from './api'

;(async () => {
  // prompt for a url to query from the user
  const { url } = await promptUrl()

  // get data via url or mock
  const response = url ? await fetcher(url) : mockData

  console.log('*** Response Data ***')
  console.log(JSON.stringify(response, null, 2))

  // get a path map based on data
  const initialMap = getPaths(response)
  const pathMap = cleanupPathMaps(initialMap)

  // prompt user to select paths
  const { userTemplates } = await promptPaths(pathMap)
  const paths = getPathsFromTemplates(userTemplates, pathMap)

  // flatten the table data by user path
  const metadata = getMetadata(response, paths)
  const tableData = flattenData(response, metadata)

  /**
   * Print Test Data
   */

  console.log('*** Selected Templates ***')
  console.log(userTemplates)

  console.log('*** New Table Data ***')
  console.log(JSON.stringify(tableData, null, 2))

  const csv = arrayToCsv(tableData, userTemplates)
  console.log('*** CSV Export ***')
  console.log(csv)
})()
