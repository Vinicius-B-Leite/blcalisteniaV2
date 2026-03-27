import { Modal, Button, Text, Input, Icon, Pressable } from "@/components/core"
import { View } from "react-native"
import { useAppTheme } from "@/themes/hooks"
import { createStyles } from "./styles"
import { MuscleGroupSelector } from "./MuscleGroupSelector"
import { useAddExerciseModal } from "./useAddExerciseModal"
import { Controller, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { FormSchema, schema } from "./schema"

type AddExerciseModalProps = {
	visible: boolean
	onClose: () => void
	workoutId: string
}

export const AddExerciseModal = ({
	visible,
	onClose,
	workoutId,
}: AddExerciseModalProps) => {
	const { theme } = useAppTheme()
	const styles = createStyles(theme)
	const { actions } = useAddExerciseModal({ workoutId })

	const form = useForm<FormSchema>({
		resolver: zodResolver(schema),
		mode: "onChange",
		defaultValues: {
			exerciseName: "",
			series: "",
			reps: "",
			rest: "",
			muscleGroup: undefined,
		},
	})

	const handleAdd = form.handleSubmit((formValues) => {
		console.log({
			exerciseName: formValues.exerciseName,
			series: formValues.series,
			reps: formValues.reps,
			rest: formValues.rest,
			muscleGroup: formValues.muscleGroup,
		})
		form.reset()
		onClose()
	})

	const isFormValid = form.formState.isValid

	return (
		<Modal.Root visible={visible} onClose={onClose}>
			<Modal.Header />

			<Modal.Title>Adicionar exercício</Modal.Title>

			<Modal.Content style={styles.content}>
				<View style={styles.formSection}>
					<Pressable.Root
						onPress={() => actions.handleSearchExercises(onClose)}
						style={styles.searchButton}>
						<Text
							variant="body-large-regular"
							style={styles.searchButtonText}>
							Buscar exercícios
						</Text>
						<Icon name="arrowRightTop" size={20} />
					</Pressable.Root>

					<Input.Root control={form.control} name="exerciseName">
						<Input.Label>Nome do exercício</Input.Label>
						<Input.FieldWrapper>
							<Input.Field placeholder="Criar exercício" />
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
										style={styles.numberInputField}
									/>
								</Input.FieldWrapper>
								<Input.Error />
							</Input.Root>
						</View>
					</View>
				</View>

				<View style={styles.bottomSection}>
					<Input.Root control={form.control} name="muscleGroup">
						<Controller
							control={form.control}
							name="muscleGroup"
							render={({ field: { onChange, value } }) => (
								<MuscleGroupSelector
									selectedGroup={value}
									onGroupChange={onChange}
								/>
							)}
						/>
						<Input.Error>
							{form.getFieldState("muscleGroup").error?.message}
						</Input.Error>
					</Input.Root>

					<View style={styles.buttonsWrapper}>
						<Button.Root disabled={!isFormValid} onPress={handleAdd}>
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
