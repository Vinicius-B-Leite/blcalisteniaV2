import { createContext, useContext } from "react"
import { IImageService } from "./IImageService"

const ImageServiceContext = createContext({} as IImageService)

export const ImageServiceProvider = ImageServiceContext.Provider

export const useImageService = () => {
	const context = useContext(ImageServiceContext)
	if (!context) {
		throw new Error("useImageService must be used within an ImageServiceProvider")
	}
	return context
}
