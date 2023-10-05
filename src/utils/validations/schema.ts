import { t } from 'i18next'
import * as yup from 'yup'

/**
 * Create custom schema logic
 */

/**
 * Check whether the string length is within the specified range
 * @param min Minimum string length value
 * @param max Maximum string length value
 * @returns schema
 */
export const strLengthRangeSchema = (min = 0, max = 10) =>
  yup.string().nullable().test({
    name: 'strLengthRangeSchema',
    exclusive: true,
    params: { min, max }, // The value here can be brought to message for use
    message: t('__validation_strLengthRange', { min, max })!,
    test: (value) => {
      const valueStr = String(value)
      return valueStr.length >= min && valueStr.length <= max
    }
  })

/**
* Check whether the number of digits is within the range
 * @param max Maximum amount of digits
 * @returns schema
*/
export const maxDigitNumberSchema = (max = 1) =>
  yup.number().nullable().test({
    name: 'maxDigitNumberSchema',
    exclusive: true,
    params: { max },
    message: t('__validation_maxDigitNumber', { max })!,
    test: (value) => {
      if (!value) return true
      return value < Math.pow(10, max)
    }
  })
