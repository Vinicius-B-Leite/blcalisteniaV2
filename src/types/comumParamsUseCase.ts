export type ComumParamsUseCase<SuccessData = unknown, ErrorData = unknown> = {
	onSuccess?(data: SuccessData): void
	onError?(error: ErrorData): void
}
