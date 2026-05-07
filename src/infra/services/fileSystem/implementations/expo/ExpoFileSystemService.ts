import * as FileSystem from "expo-file-system"
import { IFileSystemService, FileInfo } from "../../IFileSystemService"
import { AppError } from "@/errors"

export const ExpoFileSystemService: IFileSystemService = {
	documentDirectory: FileSystem.documentDirectory || "",

	getInfoAsync: async (fileUri: string): Promise<FileInfo> => {
		const info = await FileSystem.getInfoAsync(fileUri)
		return {
			exists: info.exists,
			isDirectory: info.isDirectory,
			uri: info.uri,
			size: "size" in info ? info.size : undefined,
			modificationTime:
				"modificationTime" in info ? info.modificationTime : undefined,
		}
	},

	createDirectory: async (dirUri: string, options) => {
		await FileSystem.makeDirectoryAsync(dirUri, options)
	},

	ensureDirectoryExists: async (dirUri: string) => {
		const dirInfo = await FileSystem.getInfoAsync(dirUri)
		if (!dirInfo.exists) {
			await FileSystem.makeDirectoryAsync(dirUri, { intermediates: true })
		}
	},

	copy: async (options) => {
		await FileSystem.copyAsync(options)
	},

	delete: async (fileUri: string) => {
		try {
			await FileSystem.deleteAsync(fileUri)
		} catch (error) {
			if (error instanceof AppError) {
				throw error
			}
			throw new AppError({
				message: "Ocorreu um erro ao deletar o arquivo",
				property: "fileUri",
				statusCode: 500,
			})
		}
	},
}
