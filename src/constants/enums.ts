
// ==================================
// Define enumerations, avoid magic num or string
// ==================================

import { EnumDescription } from '@/utils/helpers/decoratorHelper'

/**
 *  APP Operating environment
 */
export enum AppEnvEnum {
  /**  development */
  DEVELOPMENT = 'development',
  /**  production */
  PRODUCTION = 'production',
}

/**
 *  APP operating mode
 */
export enum AppModeEnum {
  /**  DEV model */
  DEV = 'DEV',
  /**  SIT model */
  SIT = 'SIT',
  /**  UAT model */
  UAT = 'UAT',
  /**  PROD model */
  PROD = 'PROD',
}

export enum LangEnum {
  /**  en */
  EN = 'en',
  /**  zh-TW */
  ZH_TW = 'zh-TW',
}

// ==================================
// Define a list menu to display fixed menu content on the front end
// ==================================

/**
 *  gender
 */
export class GenderEnum {
  /**
   * male
   */
  @EnumDescription('__male')
  public static readonly MALE = '1'

  /**
   * 女性
   */
  @EnumDescription('__female')
  public static readonly FEMALE = '2'
}
