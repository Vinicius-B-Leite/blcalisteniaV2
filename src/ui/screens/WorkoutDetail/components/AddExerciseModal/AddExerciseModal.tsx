import { Modal, Button, Text, Input, Icon, Pressable } from "@/components/core"
import { View } from "react-native"
import { useAppTheme } from "@/themes/hooks"
import { createStyles } from "./styles"
import { MuscleGroupSelector } from "./MuscleGroupSelector"
import { useAddExerciseModal } from "./useAddExerciseModal"

interface AddExerciseModalProps {
	visible: boolean
	onClose: () => void
}

export const AddExerciseModal = ({ visible, onClose }: AddExerciseModalProps) => {
	const { theme } = useAppTheme()
	const styles = createStyles(theme)
	const { states, actions } = useAddExerciseModal()

	return (
		<Modal.Root visible={visible} onClose={onClose}>
			<Modal.Header />

			<Modal.Title>Adicionar exercício</Modal.Title>

			<Modal.Content style={styles.content}>
				<View style={styles.formSection}>
					<Pressable.Root
						onPress={actions.handleSearchExercises}
						style={styles.searchButton}>
						<Text
							variant="body-large-regular"
							style={styles.searchButtonText}>
							Buscar exercícios
						</Text>
						<Icon name="arrowRightTop" size={20} />
					</Pressable.Root>

					<Input.Root>
						<Input.Label>Nome do exercício</Input.Label>
						<Input.FieldWrapper>
							<Input.Field
								placeholder="Criar exercício"
								value={states.exerciseName}
								onChangeText={actions.handleExerciseNameChange}
							/>
						</Input.FieldWrapper>
					</Input.Root>

					<View style={styles.numberInputsRow}>
						<View style={styles.numberInputContainer}>
							<Text
								variant="body-small-bold"
								style={styles.numberInputLabel}>
								Séries
							</Text>
							<Input.Root>
								<Input.FieldWrapper>
									<Input.Field
										value={states.series}
										onChangeText={actions.handleSeriesChange}
										keyboardType="numeric"
										placeholder="0"
										style={styles.numberInputField}
									/>
								</Input.FieldWrapper>
							</Input.Root>
						</View>

						<View style={styles.numberInputContainer}>
							<Text
								variant="body-small-bold"
								style={styles.numberInputLabel}>
								Repetições
							</Text>
							<Input.Root>
								<Input.FieldWrapper>
									<Input.Field
										value={states.reps}
										onChangeText={actions.handleRepsChange}
										keyboardType="numeric"
										placeholder="0"
										style={styles.numberInputField}
									/>
								</Input.FieldWrapper>
							</Input.Root>
						</View>

						<View style={styles.numberInputContainer}>
							<Text
								variant="body-small-bold"
								style={styles.numberInputLabel}>
								Descanso
							</Text>
							<Input.Root>
								<Input.FieldWrapper>
									<Input.Field
										value={states.rest}
										onChangeText={actions.handleRestChange}
										keyboardType="numeric"
										placeholder="0"
										style={styles.numberInputField}
									/>
								</Input.FieldWrapper>
							</Input.Root>
						</View>
					</View>
				</View>

				<View style={styles.bottomSection}>
					<MuscleGroupSelector
						selectedGroup={states.selectedGroup}
						onGroupChange={actions.handleGroupChange}
					/>

					<View style={styles.buttonsWrapper}>
						<Button.Root onPress={() => actions.handleAdd(onClose)}>
							<Button.Content>Adicionar</Button.Content>
						</Button.Root>

						<Button.Root variant="ghost" onPress={onClose}>
							<Button.Content>Cancelar</Button.Content>
						</Button.Root>
					</View>
				</View>
			</Modal.Content>
		</Modal.Root>
	)
}
