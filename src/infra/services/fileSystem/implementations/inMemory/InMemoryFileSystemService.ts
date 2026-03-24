import {
	IFileSystemService,
	FileInfo,
	CopyOptions,
	MakeDirectoryOptions,
} from "../../IFileSystemService"

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
		files.delete(fileUri)
		directories.delete(fileUri)
	},
}
