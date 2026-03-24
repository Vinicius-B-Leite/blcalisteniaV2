import { IFileSystemService } from "../IFileSystemService"
import { select } from "@/utils"

const FileSystemService = select.env<IFileSystemService>({
	test: () => require("./inMemory/InMemoryFileSystemService").InMemoryFileSystemService,
	default: () => require("./expo/ExpoFileSystemService").ExpoFileSystemService,
})

export { FileSystemService }
