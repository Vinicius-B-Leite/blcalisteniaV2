import { ITestableRepository } from "./ITestableRepository"

const testableRepositoryStructure: ITestableRepository = {
	clear: async () => {},
	seed: async () => {},
}

const getTestableRepositoryMethods = (): (keyof ITestableRepository)[] => {
	return Object.keys(testableRepositoryStructure) as (keyof ITestableRepository)[]
}

export function isTestableRepository(repo: unknown): repo is ITestableRepository {
	if (typeof repo !== "object" || repo === null) {
		return false
	}

	const methods = getTestableRepositoryMethods()

	return methods.some(
		(method) =>
			method in repo &&
			typeof (repo as Record<string, unknown>)[method] === "function",
	)
}

export function asTestableRepository<T>(repo: T): T & ITestableRepository {
	if (!isTestableRepository(repo)) {
		throw new Error(
			"Repository is not testable. Make sure you're using InMemory implementation in test environment.",
		)
	}
	return repo as T & ITestableRepository
}
