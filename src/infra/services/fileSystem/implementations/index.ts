import { IFileSystemService } from "../IFileSystemService"
import { ExpoFileSystemService } from "./expo/ExpoFileSystemService"

let FileSystemService: IFileSystemService

FileSystemService = ExpoFileSystemService

export { FileSystemService }
