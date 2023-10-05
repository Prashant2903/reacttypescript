import { IEnvironment } from '@/models/common'

//Select the corresponding variable definition file according to the construction environment
const env = process.env.NODE_ENV
const environment = require('./' + env + '.ts').default as IEnvironment
export default environment
