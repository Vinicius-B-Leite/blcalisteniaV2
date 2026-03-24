import { IImageStorage } from "../IImageStorage"
import { select } from "@/utils"

const ImageStorageService = select.env<IImageStorage>({
	test: () => require("./inMemory/InMemoryImageStorage").InMemoryImageStorage,
	default: () => require("./expo/ExpoImageStorage").ExpoImageService,
})

export { ImageStorageService }
