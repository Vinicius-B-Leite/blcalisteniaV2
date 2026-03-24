type EnvOptions<T> = {
	test?: T | (() => T)
	prod?: T | (() => T)
	dev?: T | (() => T)
	default: T | (() => T)
}

const env = <T>(options: EnvOptions<T>): T => {
	const env = process.env.NODE_ENV

	let key: keyof EnvOptions<T>
	if (env === "test") key = "test"
	else if (env === "development") key = "dev"
	else if (env === "production") key = "prod"
	else key = "default"

	let value = options[key]
	if (value === undefined) {
		value = options.default
	}

	return typeof value === "function" ? (value as () => T)() : value
}

export const select = {
	env,
}
