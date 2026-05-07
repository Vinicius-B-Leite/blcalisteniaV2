export class AppError extends Error {
	public readonly message: string
	public readonly property: string
	public readonly statusCode: number

	constructor({
		message,
		property,
		statusCode = 500,
	}: {
		message: string
		property: string
		statusCode: number
	}) {
		super(message)
		this.message = message
		this.property = property
		this.statusCode = statusCode
	}
}
