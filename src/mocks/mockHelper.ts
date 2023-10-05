import environment from '@/environment'
import { IBaseRes } from '@/services/models/common'

/**
 * Get the complete api path based on the incoming api relative path
 * @param relatedApiPath  api relative path
 * @returns full api path
 */
export const getApiUrl = (relatedApiPath: string) => {
  const isFullUrl = environment.apiUrl.indexOf('http') > -1
  const fixedPath = relatedApiPath.indexOf('/') === 0 ? relatedApiPath : `/${relatedApiPath}`
  const { protocol, host } = window.location

  return isFullUrl
    ? `${environment.apiUrl}${fixedPath}`
    : `${protocol}//${host}${environment.apiUrl}${fixedPath}`
}

/**
 * Randomly generate fixed-length integers
 * @param length Number length
 * @returns integer
 */
export const getRandomInt = (length: number) => {
  return Math.floor(Math.pow(10, length - 1) + Math.random() * 9 * Math.pow(10, length - 1))
}

/**
 * Randomly generate an integer within the range
 * @param min lower limit
 * @param max upper limit
 * @returns integer
 */
export const getRandomIntRange = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1) + min)
}

/**
 * Randomly generate items in an array
 * @param items Options to be selected
 * @returns Options
 */
export const getRandomArrayItem = (items: number[] | string[] | boolean[]) => {
  const randomIndex = Math.floor(Math.random() * items.length)
  return items.slice(randomIndex, randomIndex + 1)[0]
}

/**
 * Randomly generate array
 * @param arraySize array size
 * @param createItem Methods to generate array items
 * @returns
 */
export const getRandomArray = (arraySize: number, createItem: () => any) => {
  const array: any[] = []
  for (let index = 0; index < arraySize; index++) {
    array.push(createItem())
  }
  return array
}

/**
 * Quickly create response structure
 * @param body response body
 * @param returnCode response returnCode
 * @param returnMsg response returnMsg
 * @returns response structure
 */
export const createRes = <T>(body: T, returnCode: string = '0000', returnMsg: string = ''): IBaseRes<T> => {
  return {
    header: {
      returnCode,
      returnMsg
    },
    body
  }
}
