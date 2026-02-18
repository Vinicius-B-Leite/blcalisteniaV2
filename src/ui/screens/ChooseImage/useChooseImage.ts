import { useState } from "react"
import { useRouter } from "expo-router"

export const useChooseImage = () => {
	const router = useRouter()
	const [selectedImage, setSelectedImage] = useState<string | undefined>()

	const handleImageSelect = (imageId: string) => {
		setSelectedImage(imageId)
	}

	const handleAddImage = () => {
		console.log("Add image from device")
		// TODO: Implementar lógica para adicionar imagem do dispositivo
	}

	return {
		states: {
			selectedImage,
		},
		actions: {
			handleImageSelect,
			handleAddImage,
		},
	}
}
