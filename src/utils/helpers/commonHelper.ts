import { t } from 'i18next'

/**
 * generate guid
 * @returns guid
 */
export const getGuid = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0
    const v = c === 'x' ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}

/**
 * Generates required field error message text including field name
 * @param fieldName Field name
 * @returns Required field error message including field name


 */
export const getRequiredMsg = (fieldName: string) => {
  return t('__validation_required_with_name', { name: fieldName })
}
