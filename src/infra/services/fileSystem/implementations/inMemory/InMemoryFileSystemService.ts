import {
	IFileSystemService,
	FileInfo,
	CopyOptions,
	MakeDirectoryOptions,
} from "../../IFileSystemService"
import { AppError } from "@/errors"

const files = new Map<string, string>()
const directories = new Set<string>()

export const InMemoryFileSystemService: IFileSystemService = {
	documentDirectory: "memory://documents/",

	getInfoAsync: async (fileUri): Promise<FileInfo> => {
		if (directories.has(fileUri)) {
			return { exists: true, isDirectory: true, uri: fileUri }
		}
		if (files.has(fileUri)) {
			return { exists: true, isDirectory: false, uri: fileUri }
		}
		return { exists: false }
	},

	createDirectory: async (dirUri, _options?: MakeDirectoryOptions) => {
		directories.add(dirUri)
	},

	ensureDirectoryExists: async (dirUri) => {
		directories.add(dirUri)
	},

	copy: async ({ from, to }: CopyOptions) => {
		files.set(to, from)
	},

	delete: async (fileUri) => {
		try {
			files.delete(fileUri)
			directories.delete(fileUri)
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
