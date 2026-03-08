export interface FileInfo {
	exists: boolean
	isDirectory?: boolean
	uri?: string
	size?: number
	modificationTime?: number
}

export interface CopyOptions {
	from: string
	to: string
}

export interface MakeDirectoryOptions {
	intermediates?: boolean
}

export interface IFileSystemService {
	documentDirectory: string

	getInfoAsync: (fileUri: string) => Promise<FileInfo>

	makeDirectoryAsync: (dirUri: string, options?: MakeDirectoryOptions) => Promise<void>

	ensureDirectoryExists: (dirUri: string) => Promise<void>

	copyAsync: (options: CopyOptions) => Promise<void>

	deleteAsync: (fileUri: string) => Promise<void>
}
