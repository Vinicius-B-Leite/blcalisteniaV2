export interface ITestableRepository<T = any> {
	clear(): Promise<void>
	seed(data: T[]): Promise<void>
}
