export interface ImagePickerResult {
	canceled: boolean
	assets?: Array<{
		uri: string
		width: number
		height: number
		fileName?: string
	}>
}

export interface IImageService {
	pickImageFromGallery: () => Promise<ImagePickerResult>

	saveImageToAppDirectory: (
		uri: string,
		prefix: string,
	) => Promise<{ localUri: string }>

	getImagePath: (imageUrl?: string) => string | undefined

	deleteImage: (imageUrl: string) => Promise<void>

	isLocalImageUri: (imageUrl?: string) => boolean
}
