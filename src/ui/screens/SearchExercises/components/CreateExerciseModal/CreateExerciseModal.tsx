import { View } from "react-native"
import { Controller } from "react-hook-form"
import { Modal, Button, Input } from "@/components/core"
import { MuscleGroup } from "@/constants"
import { useStyles } from "@/themes"
import { CREATE_EXERCISE_MODAL_TEST_IDS } from "./constants"
import { MuscleGroupSelector } from "./MuscleGroupSelector"
import { stylesTheme } from "./styles"
import { useCreateExerciseModal } from "./useCreateExerciseModal"
import { ExerciseModel } from "@/domains/Exercise"

type CreateExerciseModalProps = {
	visible: boolean
	onClose: () => void
	initialValues?: ExerciseModel
}

export const CreateExerciseModal = (props: CreateExerciseModalProps) => {
	const { states, form, actions } = useCreateExerciseModal(props)
	const styles = useStyles(stylesTheme)

	if (!props.visible) return null

	return (
		<Modal.Root visible={props.visible} onClose={props.onClose}>
			<Modal.Header />

			<Modal.Title>
				{states.isEditMode ? "Editar exercício" : "Criar novo exercício"}
			</Modal.Title>

			<View testID={CREATE_EXERCISE_MODAL_TEST_IDS.MODAL}>
				<Modal.Content style={styles.content}>
					<Input.Root control={form.control} name="name">
						<Input.Label>Nome do exercício</Input.Label>
						<Input.FieldWrapper>
							<Input.Field
								testID={CREATE_EXERCISE_MODAL_TEST_IDS.NAME_INPUT}
								placeholder="Nome do exercício"
							/>
						</Input.FieldWrapper>
						<Input.Error />
					</Input.Root>

					<Input.Root control={form.control} name="musclesGroups">
						<Input.Label>Grupos musculares</Input.Label>
						<Controller
							control={form.control}
							name="musclesGroups"
							render={({ field: { onChange, value } }) => (
								<MuscleGroupSelector
									selectedMuscleGroups={value}
									onToggle={(muscleGroup) =>
										onChange(
											value.includes(muscleGroup)
												? value.filter(
														(mg: MuscleGroup) =>
															mg !== muscleGroup,
													)
												: [...value, muscleGroup],
										)
									}
								/>
							)}
						/>
						<Input.Error>
							{form.getFieldState("musclesGroups").error?.message}
						</Input.Error>
					</Input.Root>

					<View style={styles.buttonsContainer}>
						<Button.Root
							testID={CREATE_EXERCISE_MODAL_TEST_IDS.SUBMIT_BUTTON}
							variant="primary"
							disabled={states.isSubmitDisabled}
							onPress={actions.handleSubmit}>
							<Button.Content>
								{states.isEditMode ? "Salvar" : "Criar"}
							</Button.Content>
						</Button.Root>

						<Button.Root
							testID={CREATE_EXERCISE_MODAL_TEST_IDS.CANCEL_BUTTON}
							variant="ghost"
							onPress={actions.handleCancel}>
							<Button.Content>Cancelar</Button.Content>
						</Button.Root>
					</View>
				</Modal.Content>
			</View>
		</Modal.Root>
	)
}
