const { withDangerousMod } = require("@expo/config-plugins")
const fs = require("fs")
const path = require("path")

/**
 * Adiciona as dependências do WatermelonDB no Podfile do iOS
 * @see https://watermelondb.dev/docs/Installation#ios-react-native
 */
const withWatermelonDBPodfile = (config) => {
	return withDangerousMod(config, [
		"ios",
		async (config) => {
			const podfilePath = path.join(
				config.modRequest.platformProjectRoot,
				"Podfile",
			)

			if (!fs.existsSync(podfilePath)) {
				throw new Error(`Podfile não encontrado em: ${podfilePath}`)
			}

			let podfileContent = fs.readFileSync(podfilePath, "utf-8")

			// Verifica se já existe a dependência do WatermelonDB
			if (podfileContent.includes("pod 'simdjson'")) {
				console.log("WatermelonDB dependencies já estão presentes no Podfile")
				return config
			}

			// Código a ser adicionado
			const watermelonDBDependencies = `
# Uncomment this line if you're not using auto-linking or if auto-linking causes trouble
# pod 'WatermelonDB', path: '../node_modules/@nozbe/watermelondb'

# WatermelonDB dependency, should not be needed on modern React Native
# (please file an issue if this causes issues for you)
# pod 'React-jsi', path: '../node_modules/react-native/ReactCommon/jsi', modular_headers: true

# WatermelonDB dependency
pod 'simdjson', path: '../node_modules/@nozbe/simdjson', modular_headers: true
`

			// Procura o target e adiciona as dependências após ele
			const targetRegex = /target ['"].*['"] do/
			const match = podfileContent.match(targetRegex)

			if (match) {
				const targetIndex = podfileContent.indexOf(match[0]) + match[0].length
				podfileContent =
					podfileContent.slice(0, targetIndex) +
					"\n" +
					watermelonDBDependencies +
					podfileContent.slice(targetIndex)
			} else {
				// Se não encontrar o target, adiciona no final
				podfileContent += "\n" + watermelonDBDependencies
			}

			fs.writeFileSync(podfilePath, podfileContent)
			console.log("WatermelonDB dependencies adicionadas ao Podfile com sucesso!")

			return config
		},
	])
}

module.exports = { withWatermelonDBPodfile }
