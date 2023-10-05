import 'reflect-metadata'
import { IOption } from '@/models/common'
import i18n from '@/i18n'

const ENUM_DESCRIPTION_METADATA_KEY = Symbol('EnumDescription')

/**
 * How to decorate enumerated attribute descriptions
 * @param description instructions
 * @returns List property decorator function
 */
export function EnumDescription(description: string): any {
  return Reflect.metadata(ENUM_DESCRIPTION_METADATA_KEY, description)
}

/**
 * Get the EnumDescription setting of the Enum class
 * @param target Enum class
 * @param value value
 * @returns EnumDescription setting value
 */
export function getEnumDescription(target: any, value: any): string {
  // check property naming for enum snake upper case(example: HELLO_WORLD)
  const regex = /^[A-Z]+(?:_[A-Z]+)*$/gm
  const prop = Object.getOwnPropertyNames(target).find(
    (x) => target[x] === value && regex.test(x)
  )
  if (prop) {
    const description = Reflect.getMetadata(ENUM_DESCRIPTION_METADATA_KEY, target, prop) as string
    return getI18nText(description)
  } else {
    return value.toString()
  }
}

/**
 * Get the menu array of the Enum category
 * @param target Enum class
 * @returns Menu array generated according to EnumDescription setting value
 */
export function getEnumOptions(target: any): IOption[] {
  const regex = /^[A-Z]+(?:_[A-Z]+)*$/gm
  const options: IOption[] = Object.getOwnPropertyNames(target)
    .filter(prop => {
      regex.lastIndex = 0
      return regex.test(prop)
    })
    .map(prop => {
      const description = Reflect.getMetadata(ENUM_DESCRIPTION_METADATA_KEY, target, prop) as string
      const label = description ? getI18nText(description) : prop
      return {
        value: target[prop],
        label
      }
    })
  return options
}

/**
 * When description places the language key value, it is converted into language text.
 * @param description EnumDescription setting value
 * @returns language script
 */
const getI18nText = (description: string) => {
  if (description) {
    return description.indexOf('__') > -1 ? i18n.t(description) : description
  }
  return ''
}
