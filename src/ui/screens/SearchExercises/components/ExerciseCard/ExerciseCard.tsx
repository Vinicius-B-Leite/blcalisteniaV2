import { View, Image, Animated } from "react-native"
import { useStyles } from "@/themes"
import { stylesTheme } from "./styles"
import { ExerciseCard as ExerciseCardTypes } from "./types"
import { Text, Icon, Pressable, Skeleton } from "@/components/core"
import { useExerciseCard } from "./useExerciseCard"
import { MUSCLES_GROUP_LABELS } from "@/constants"
import { useState, useEffect } from "react"
import { SEARCH_EXERCISES_SCREEN_TEST_IDS } from "../../constants"

export function ExerciseCard({
	id,
	name,
	musclesGroups,
	bannerUrl,
	onAdd,
	isSelected = false,
	isCustom = false,
	onEdit,
	onDelete,
}: ExerciseCardTypes.Props) {
	const [imageError, setImageError] = useState(false)
	const [isLoading, setIsLoading] = useState(!!bannerUrl)

	//TODO: MELHORAR ISSO AQUI DPS, TLVZ EM CASO DE ERRO USAR IMAGEM DEFAULT
	useEffect(() => {
		if (!bannerUrl) return setImageError(true)

		Image.getSize(
			bannerUrl,
			() => setIsLoading(false),
			() => {
				setImageError(true)
				setIsLoading(false)
			},
		)
	}, [bannerUrl])

	const styles = useStyles(stylesTheme)
	const { states } = useExerciseCard(isSelected)

	const musclesGroupsLabels = musclesGroups
		?.map((muscle) => MUSCLES_GROUP_LABELS[muscle].toLowerCase())
		?.join(", ")

	if (isLoading) {
		return <Skeleton style={styles.loadingItem} />
	}

	const toggleTestID = SEARCH_EXERCISES_SCREEN_TEST_IDS.TOGGLE_EXERCISE_BUTTON({ id })

	return (
		<View
			style={styles.container}
			testID={SEARCH_EXERCISES_SCREEN_TEST_IDS.EXERCISE_ITEM}>
			<View style={styles.content}>
				{bannerUrl && !imageError && !isLoading && (
					<Image
						source={{ uri: bannerUrl }}
						style={styles.image}
						resizeMode="cover"
					/>
				)}
				<View style={styles.textContainer}>
					<Text
						variant="body-small-bold"
						numberOfLines={1}
						testID={SEARCH_EXERCISES_SCREEN_TEST_IDS.EXERCISE_ITEM_NAME({
							id,
						})}>
						{name}
					</Text>
					<Text
						variant="body-small-reg"
						numberOfLines={1}
						testID={SEARCH_EXERCISES_SCREEN_TEST_IDS.EXERCISE_ITEM_MUSCLES({
							id,
						})}>
						{musclesGroupsLabels}
					</Text>
				</View>
			</View>
			<View style={styles.actionsContainer}>
				{isCustom && (
					<>
						<Pressable.Root
							onPress={onDelete}
							style={styles.iconButton}
							testID={SEARCH_EXERCISES_SCREEN_TEST_IDS.DELETE_EXERCISE_BUTTON(
								{ id },
							)}>
							<Icon name="trash" size={20} variant="error" />
						</Pressable.Root>

						{onEdit && (
							<Pressable.Root
								onPress={onEdit}
								style={styles.iconButton}
								testID={SEARCH_EXERCISES_SCREEN_TEST_IDS.EDIT_EXERCISE_BUTTON(
									{
										id,
									},
								)}>
								<Icon name="edit" size={20} variant="default" />
							</Pressable.Root>
						)}
					</>
				)}
				<Pressable.Root onPress={onAdd} testID={toggleTestID}>
					<Animated.View
						style={[
							styles.iconButton,
							{
								backgroundColor: states.backgroundColor,
								transform: [{ rotate: states.rotation }],
							},
						]}>
						<Icon
							name={"plus"}
							size={20}
							variant={isSelected ? "brand" : "default"}
						/>
					</Animated.View>
				</Pressable.Root>
			</View>
		</View>
	)
}
