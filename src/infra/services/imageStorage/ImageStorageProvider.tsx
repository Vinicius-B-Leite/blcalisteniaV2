import { createContext, useContext } from "react"
import { IImageStorage } from "./IImageStorage"

const ImageStorageContext = createContext({} as IImageStorage)

export const ImageStorageProvider = ImageStorageContext.Provider

export const useImageStorage = () => {
	const context = useContext(ImageStorageContext)
	if (!context) {
		throw new Error("useImageStorage must be used within an ImageStorageProvider")
	}
	return context
}
