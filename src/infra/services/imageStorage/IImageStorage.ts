export interface ImagePickerResult {
	canceled: boolean
	assets?: Array<{
		uri: string
		width: number
		height: number
		fileName?: string
	}>
}

export interface IImageStorage {
	pickImageFromGallery: () => Promise<ImagePickerResult>

	saveImageToAppDirectory: (uri: string, prefix: string) => Promise<{ uri: string }>

	getImagePath: (imageUrl: string) => string | undefined

	deleteImage: (imageUrl: string) => Promise<void>

	isAppDirectoryImage: (imageUrl: string) => boolean

	isLocalImage: (imageUrl: string) => boolean
}
