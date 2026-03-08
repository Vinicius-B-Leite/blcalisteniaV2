import { useState, useEffect } from "react"
import { useRouter, useLocalSearchParams } from "expo-router"
import { useGetWorkoutById } from "src/domain/Workout/useCases/useGetWorkoutById"
import { useUpdateWorkout } from "src/domain/Workout/useCases/useUpdateWorkout"
import { useImageService } from "src/infra/imageService/ImageServiceProvider"
import { Alert } from "react-native"

export const useChooseImage = () => {
	const router = useRouter()
	const params = useLocalSearchParams<{ workoutId: string }>()
	const imageService = useImageService()
	const { workout } = useGetWorkoutById({
		id: params.workoutId,
		onError: () => router.back(),
	})

	const [selectedImage, setSelectedImage] = useState<string | undefined>(
		workout?.imageUrl,
	)
	const [isAddingImage, setIsAddingImage] = useState(false)

	const { execute: updateWorkout, isLoading: isUpdating } = useUpdateWorkout()

	// Atualizar selectedImage quando o workout for carregado
	useEffect(() => {
		if (workout?.imageUrl) {
			setSelectedImage(workout.imageUrl)
		}
	}, [workout?.imageUrl])

	const handleImageSelect = (imageId: string) => {
		setSelectedImage(imageId)
	}

	const handleAddImage = async () => {
		try {
			setIsAddingImage(true)

			// Abrir galeria e obter imagem
			const result = await imageService.pickImageFromGallery()

			if (!result.canceled && result.assets?.[0]) {
				const selectedImageUri = result.assets[0].uri

				// Salvar imagem no diretório do app
				if (workout?.id) {
					const { localUri } = await imageService.saveImageToAppDirectory(
						selectedImageUri,
						workout.id,
					)
					setSelectedImage(localUri)
				}
			}
		} catch (error) {
			console.error("Error adding image:", error)
			Alert.alert("Erro", "Não foi possível adicionar a imagem. Tente novamente.")
		} finally {
			setIsAddingImage(false)
		}
	}

	const handleConfirm = async () => {
		if (!workout || !selectedImage) return

		try {
			await updateWorkout({
				...workout,
				imageUrl: selectedImage,
			})

			router.back()
		} catch (error) {
			console.error("Error updating workout image:", error)
			Alert.alert("Erro", "Não foi possível salvar a imagem. Tente novamente.")
		}
	}

	return {
		states: {
			selectedImage,
			isAddingImage,
			isUpdating,
			workout,
		},
		actions: {
			handleImageSelect,
			handleAddImage,
			handleConfirm,
		},
	}
}
