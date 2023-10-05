import { AppModeEnum } from '@/constants/enums'
import developmentEnvironment from './development'

// All based on development settings


let productionEnvironment = developmentEnvironment

// Just adjust the parts that are different from development
// Use different constant values ​​according to different build modes
switch (productionEnvironment.appMode) {
  case AppModeEnum.SIT:
    productionEnvironment = { ...productionEnvironment, apiUrl: 'https://xxx.sit/tw/api/' }
    break
  case AppModeEnum.UAT:
    productionEnvironment = { ...productionEnvironment, apiUrl: 'https://xxx.uat/tw/api/' }
    break
  case AppModeEnum.PROD:
    productionEnvironment = { ...productionEnvironment, apiUrl: 'https://react-lab-mock-api.herokuapp.com/api/' }
    break
}

export default productionEnvironment
