import {env} from './config'
type RequestOptions = {
  method: RequestMethod,
  url: string,
  headers?: {[key: string]: string },
  body: any,
}
export type RequestMethod = 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE'

export const makeRequest = (requestData: RequestOptions, type: 'JSON' | 'FormData' = 'JSON'): Promise<any> => {
  return new Promise((resolve, reject) => {
    const apiBaseUrl = env.baseUrl;
    const {url: path, headers, body, method} = requestData;
    const requestOptions = type === 'JSON' ? {
      method,
      credentials: 'omit' as RequestCredentials,
      headers: {
        ...(headers || {}),
        'Content-Type': 'application/json'
      }
    } : {method, credentials: 'omit' as RequestCredentials, body, headers}
    if(method !== 'GET' && method !== 'DELETE') {
      if (type === 'JSON') {
        requestOptions.body = JSON.stringify(body)
      } else {
        requestOptions.body = body
      }
    }
    const url = new URL(`${apiBaseUrl}/${path}`).href
    fetch(url, {...requestOptions, credentials: 'omit'})
      .then(res => method !== 'DELETE' ? res.json(): res.text())
      .then((response) => {
        if(response.code){
          reject(response)
        } else {
          resolve(response)
        }
      })
      .catch(error => {
        console.log({error})
        reject(error)
      })
  });
}