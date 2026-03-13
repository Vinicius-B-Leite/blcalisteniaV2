import * as ImagePicker from "expo-image-picker"
import { IImageStorage, ImagePickerResult } from "../../IImageStorage"
import { FileSystemService, IFileSystemService } from "../../../fileSystem"

const fileSystemService: IFileSystemService = FileSystemService

const BASE_IMAGES_DIR = `${fileSystemService.documentDirectory}images/`

export const ExpoImageService: IImageStorage = {
	pickImageFromGallery: async (): Promise<ImagePickerResult> => {
		const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync()

		if (status !== "granted") {
			throw new Error("Permissão para acessar a galeria foi negada")
		}

		const result = await ImagePicker.launchImageLibraryAsync({
			mediaTypes: "images",
			allowsEditing: true,
			aspect: [16, 9],
			quality: 0.8,
		})

		return {
			canceled: result.canceled,
			assets: result.assets?.map((asset) => ({
				uri: asset.uri,
				width: asset.width,
				height: asset.height,
				fileName: asset.fileName ?? undefined,
			})),
		}
	},

	saveImageToAppDirectory: async (
		uri: string,
		prefix: string,
	): Promise<{ localUri: string }> => {
		try {
			await fileSystemService.ensureDirectoryExists(BASE_IMAGES_DIR)

			const fileExtension = uri.split(".").pop() || "jpg"
			const timestamp = Date.now()
			const fileName = `${prefix}_${timestamp}.${fileExtension}`
			const destinationUri = `${BASE_IMAGES_DIR}${fileName}`

			await fileSystemService.copy({
				from: uri,
				to: destinationUri,
			})

			return { localUri: destinationUri }
		} catch (error) {
			console.error("Error saving image to app directory:", error)
			throw new Error("Falha ao salvar a imagem: " + error)
		}
	},

	getImagePath: (imageUrl: string): string | undefined => {
		if (!imageUrl || imageUrl.trim() === "") return undefined

		const isAppDirectoryImage = ExpoImageService.isAppDirectoryImage(imageUrl)
		if (isAppDirectoryImage) {
			return imageUrl
		}

		const isFileNameOnly = !imageUrl.includes("/")
		if (isFileNameOnly) {
			return `${BASE_IMAGES_DIR}${imageUrl}`
		}

		return imageUrl
	},

	deleteImage: async (imageUrl: string): Promise<void> => {
		try {
			const isSaveInAppDirectory = ExpoImageService.isAppDirectoryImage(imageUrl)
			if (isSaveInAppDirectory) {
				const fileInfo = await fileSystemService.getInfoAsync(imageUrl)
				if (fileInfo.exists) {
					await fileSystemService.delete(imageUrl)
				}
			}
		} catch (error) {
			console.error("Error deleting image:", error)
		}
	},

	isAppDirectoryImage: (imageUrl?: string): boolean => {
		return !!imageUrl && imageUrl.startsWith(BASE_IMAGES_DIR)
	},
}
