import { IImageStorage, ImagePickerResult } from "../../IImageStorage"
import { WORKOUT_BANNER_PATHS } from "@/utils"
import { InMemoryFileSystemService } from "../../../fileSystem/implementations/inMemory/InMemoryFileSystemService"
import { AppError } from "@/errors"

const BASE_IMAGES_DIR = `${InMemoryFileSystemService.documentDirectory}images/`

let imageCounter = 1

export const InMemoryImageStorage: IImageStorage = {
	pickImageFromGallery: async (): Promise<ImagePickerResult> => {
		const uri = `memory://gallery/image-${imageCounter++}.jpg`
		return {
			canceled: false,
			assets: [{ uri, width: 800, height: 600, fileName: uri.split("/").pop() }],
		}
	},

	saveImageToAppDirectory: async (uri: string, prefix: string) => {
		await InMemoryFileSystemService.ensureDirectoryExists(BASE_IMAGES_DIR)

		const fileExtension = uri.split(".").pop() || "jpg"
		const timestamp = Date.now()
		const fileName = `${prefix}_${timestamp}.${fileExtension}`
		const destinationUri = `${BASE_IMAGES_DIR}${fileName}`

		await InMemoryFileSystemService.copy({ from: uri, to: destinationUri })

		return { uri: destinationUri }
	},

	getImagePath: (imageUrl: string): string | undefined => {
		if (!imageUrl || imageUrl.trim() === "") return undefined

		if (InMemoryImageStorage.isAppDirectoryImage(imageUrl)) {
			return imageUrl
		}

		const isFileNameOnly = !imageUrl.includes("/")
		if (isFileNameOnly) {
			return `${BASE_IMAGES_DIR}${imageUrl}`
		}

		return imageUrl
	},

	deleteImage: async (imageUrl: string) => {
		try {
			const isSavedInAppDirectory =
				InMemoryImageStorage.isAppDirectoryImage(imageUrl)
			if (isSavedInAppDirectory) {
				const fileInfo = await InMemoryFileSystemService.getInfoAsync(imageUrl)
				if (!fileInfo.exists) {
					throw new AppError({
						message: "Imagem não encontrada para exclusão",
						property: "imageUrl",
						statusCode: 404,
					})
				}
				await InMemoryFileSystemService.delete(imageUrl)
			}
		} catch (error) {
			if (error instanceof AppError) {
				throw error
			}
			throw new AppError({
				message: "Ocorreu um erro ao deletar a imagem",
				property: "imageUrl",
				statusCode: 500,
			})
		}
	},

	isAppDirectoryImage: (imageUrl: string): boolean => {
		return !!imageUrl && imageUrl.startsWith(BASE_IMAGES_DIR)
	},

	isLocalImage: (imageUrl: string): boolean => {
		const localStartsWith = WORKOUT_BANNER_PATHS.map((path) => path.substring(0, 9))
		const isLocal = localStartsWith.some((localPath) =>
			imageUrl.startsWith(localPath),
		)
		return !!imageUrl && isLocal
	},
}
