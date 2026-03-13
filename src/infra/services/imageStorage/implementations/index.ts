import { IImageStorage } from "../IImageStorage"
import { ExpoImageService } from "./expo/ExpoImageStorage"

let ImageStorageService: IImageStorage

ImageStorageService = ExpoImageService

export { ImageStorageService }
