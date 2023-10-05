import { Configuration, WebpackPluginInstance } from 'webpack'
const { getPlugin, pluginByName } = require('@craco/craco')
const { GitRevisionPlugin } = require('git-revision-webpack-plugin')
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin')
const gitRevisionPlugin = new GitRevisionPlugin()

/**
 * 
 * @param value 
 * @returns Webpack Config
 */
const addDefinePluginEnvValue = (value: object, webpackConfig: Configuration) => {

  const { isFound, match: plugin }: { isFound: boolean; match: WebpackPluginInstance } =
    getPlugin(webpackConfig, pluginByName('DefinePlugin'))

  if (isFound) {
    const processEnv = plugin.definitions['process.env'] || {}
    plugin.definitions['process.env'] = {
      ...processEnv,
      ...value
    }
  }
}

const addTsconfigPathsPlugin = (webpackConfig: Configuration) => {
  webpackConfig.resolve?.plugins?.push(new TsconfigPathsPlugin({}))
}

const getAppVersionInfo = () => {
  try {
    // use git commit hash as version info
    return `${gitRevisionPlugin.version()}@${gitRevisionPlugin.lastcommitdatetime()}@${Date.now()}`
  } catch (error) {
    return '[NO GIT INFO AS REFERENCE]'
  }
}

module.exports = {
  webpack: {
    configure: (webpackConfig: Configuration, { env, paths }: any) => {

      addDefinePluginEnvValue(
        { APP_VERSION: JSON.stringify(getAppVersionInfo()) },
        webpackConfig
      )

      addTsconfigPathsPlugin(webpackConfig)

      return webpackConfig
    }
  }
}
