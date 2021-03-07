import fetch from 'node-fetch'

export async function fetcher(url: string) {
  const res = await fetch(url)

  // check for errors
  if (!res.ok) {
    throw new Error(res.statusText)
  }
  // await json
  return res.json()
}
