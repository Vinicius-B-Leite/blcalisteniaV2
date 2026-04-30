import { Modal, Button, Text, Input, Icon, Pressable } from "@/components/core"
import { View } from "react-native"
import { useAppTheme } from "@/themes/hooks"
import { createStyles } from "./styles"

import { useAddExerciseModal } from "./useAddExerciseModal"
import { WORKOUT_DETAIL_SCREEN_TEST_IDS } from "../../constants"

type AddExerciseModalProps = {
	visible: boolean
	onClose: () => void
	workoutId: string
	workoutExerciseId?: string
}

export const AddExerciseModal = ({
	visible,
	onClose,
	workoutId,
	workoutExerciseId,
}: AddExerciseModalProps) => {
	const { theme } = useAppTheme()
	const styles = createStyles(theme)
	const { actions, states, form } = useAddExerciseModal({
		workoutId,
		onClose,
		workoutExerciseId,
	})

	return (
		<Modal.Root visible={visible} onClose={actions.handleClose}>
			<Modal.Header />

			<Modal.Title>
				{states.isEditMode ? "Editar exercício" : "Adicionar exercício"}
			</Modal.Title>

			<Modal.Content style={styles.content}>
				<View style={styles.formSection}>
					{!states.isEditMode && (
						<Pressable.Root
							onPress={() =>
								actions.handleSearchExercises(actions.handleClose)
							}
							testID={
								WORKOUT_DETAIL_SCREEN_TEST_IDS.SEARCH_EXERCISES_BUTTON
							}
							style={styles.searchButton}>
							<Text
								variant="body-large-regular"
								style={styles.searchButtonText}>
								Buscar exercícios
							</Text>
							<Icon name="arrowRightTop" size={20} />
						</Pressable.Root>
					)}

					<Input.Root control={form.control} name="exerciseName">
						<Input.Label>Exercício selecionado</Input.Label>
						<Input.FieldWrapper>
							<Input.Field
								placeholder="Selecione um exercício"
								editable={false}
							/>
						</Input.FieldWrapper>
						<Input.Error />
					</Input.Root>

					<View style={styles.numberInputsRow}>
						<View style={styles.numberInputContainer}>
							<Text
								variant="body-small-bold"
								style={styles.numberInputLabel}>
								Séries
							</Text>
							<Input.Root control={form.control} name="series">
								<Input.FieldWrapper>
									<Input.Field
										keyboardType="numeric"
										placeholder="0"
										testID={
											WORKOUT_DETAIL_SCREEN_TEST_IDS.SERIES_INPUT
										}
										style={styles.numberInputField}
									/>
								</Input.FieldWrapper>
								<Input.Error />
							</Input.Root>
						</View>

						<View style={styles.numberInputContainer}>
							<Text
								variant="body-small-bold"
								style={styles.numberInputLabel}>
								Repetições
							</Text>
							<Input.Root control={form.control} name="reps">
								<Input.FieldWrapper>
									<Input.Field
										keyboardType="numeric"
										placeholder="0"
										testID={WORKOUT_DETAIL_SCREEN_TEST_IDS.REPS_INPUT}
										style={styles.numberInputField}
									/>
								</Input.FieldWrapper>
								<Input.Error />
							</Input.Root>
						</View>

						<View style={styles.numberInputContainer}>
							<Text
								variant="body-small-bold"
								style={styles.numberInputLabel}>
								Descanso
							</Text>
							<Input.Root control={form.control} name="rest">
								<Input.FieldWrapper>
									<Input.Field
										keyboardType="numeric"
										placeholder="0"
										testID={WORKOUT_DETAIL_SCREEN_TEST_IDS.REST_INPUT}
										style={styles.numberInputField}
									/>
								</Input.FieldWrapper>
								<Input.Error />
							</Input.Root>
						</View>
					</View>
				</View>

				<View style={styles.bottomSection}>
					<View style={styles.buttonsWrapper}>
						{states.isEditMode ? (
							<Button.Root
								disabled={!states.isFormValid}
								isLoading={states.isUpdateLoading}
								onPress={actions.handleSave}
								testID={
									WORKOUT_DETAIL_SCREEN_TEST_IDS.SAVE_CONFIRM_BUTTON
								}>
								<Button.Content>Salvar</Button.Content>
							</Button.Root>
						) : (
							<Button.Root
								disabled={!states.isFormValid}
								onPress={actions.handleAdd}
								testID={
									WORKOUT_DETAIL_SCREEN_TEST_IDS.ADD_CONFIRM_BUTTON
								}>
								<Button.Content>Adicionar</Button.Content>
							</Button.Root>
						)}

						<Button.Root
							variant="ghost"
							onPress={onClose}
							testID={WORKOUT_DETAIL_SCREEN_TEST_IDS.ADD_CANCEL_BUTTON}>
							<Button.Content>Cancelar</Button.Content>
						</Button.Root>
					</View>
				</View>
			</Modal.Content>
		</Modal.Root>
	)
}
