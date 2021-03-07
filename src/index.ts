import { getPaths } from './helpers'
import { mock as mockData } from './mock'
import { promptPaths, promptUrl } from './prompts'
import { getMetadata, flattenData, cleanupPathMaps } from './parser'
import { fetcher } from './api'

//const defaultUrl = 'https://jsonplaceholder.typicode.com/posts'

;(async () => {
  // prompt for a url to query from the user
  //const { url } = await promptUrl()

  // faking returning data as any
  const response = mockData // await fetcher(url || defaultUrl) || mockData

  // get a path map based on data
  const initialMap = getPaths(response)
  const pathMap = cleanupPathMaps(initialMap)

  // prompt user to select paths
  const { userTemplates } = await promptPaths(pathMap)
  const paths = userTemplates
    .map((template) => pathMap?.[template])
    .flat()
    .filter(Boolean)

  // flatten the table data by user path
  const metadata = getMetadata(response, paths)
  const tableData = flattenData(response, metadata)

  console.log(userTemplates)
  //console.log(tableData)
  console.log(JSON.stringify(tableData, null, 2))
})()
