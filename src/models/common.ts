import { AppEnvEnum, AppModeEnum } from '@/constants/enums'

export interface IOption {

  value: string

  label: string
}

export interface IEnvironment {

  appEnv: AppEnvEnum

  appMode: AppModeEnum

  apiUrl: string

  apiTimeout: number
}
