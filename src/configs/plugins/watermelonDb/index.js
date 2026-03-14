const { withWatermelonDBPodfile } = require("./ios")

/**
 * Plugin Expo para configurar o WatermelonDB no iOS
 */
const withWatermelonDB = (config) => {
	config = withWatermelonDBPodfile(config)
	return config
}

module.exports = withWatermelonDB
