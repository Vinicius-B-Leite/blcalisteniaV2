import * as ImagePicker from "expo-image-picker"
import { IImageService, ImagePickerResult } from "../../IImageService"
import { ExpoFileSystemService, IFileSystemService } from "../../../fileSystemService"

const fileSystemService: IFileSystemService = ExpoFileSystemService

const IMAGES_DIR = `${fileSystemService.documentDirectory}images/`

export const ExpoImageService: IImageService = {
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
			await fileSystemService.ensureDirectoryExists(IMAGES_DIR)

			const fileExtension = uri.split(".").pop() || "jpg"
			const timestamp = Date.now()
			const fileName = `${prefix}_${timestamp}.${fileExtension}`
			const destinationUri = `${IMAGES_DIR}${fileName}`

			await fileSystemService.copyAsync({
				from: uri,
				to: destinationUri,
			})

			return { localUri: destinationUri }
		} catch (error) {
			console.error("Error saving image to app directory:", error)
			throw new Error("Falha ao salvar a imagem: " + error)
		}
	},

	getImagePath: (imageUrl?: string): string | undefined => {
		if (!imageUrl) return undefined

		const isLocalUri = imageUrl.startsWith("file://")
		if (isLocalUri) {
			return imageUrl
		}

		const isFileNameOnly = !imageUrl.includes("/")
		if (isFileNameOnly) {
			return `${IMAGES_DIR}${imageUrl}`
		}

		return imageUrl
	},

	deleteImage: async (imageUrl: string): Promise<void> => {
		try {
			// Só deletar se for uma imagem no diretório do app (não as predefinidas)
			const isLocalImage = imageUrl.startsWith(IMAGES_DIR)
			if (isLocalImage) {
				const fileInfo = await fileSystemService.getInfoAsync(imageUrl)
				if (fileInfo.exists) {
					await fileSystemService.deleteAsync(imageUrl)
				}
			}
		} catch (error) {
			console.error("Error deleting image:", error)
		}
	},

	isLocalImageUri: (imageUrl?: string): boolean => {
		return !!imageUrl && imageUrl.startsWith("file://")
	},
}
