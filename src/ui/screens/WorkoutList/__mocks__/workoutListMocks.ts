import { WorkoutModel } from "@/domains/Workout"

const createWorkout: WorkoutModel[] = [
	{
		title: "Treino de Força",
		category: "strength",
		imageUrl: "strength.jpg",
		description: "Treino focado em exercícios de força para ganho de massa muscular.",
		weekDaysFrequency: [1, 2],
		id: "1",
	},
	{
		title: "Treino de Resistência",
		category: "resistance",
		imageUrl: "endurance.jpg",
		description:
			"Treino focado em exercícios de resistência para melhorar a capacidade cardiovascular.",
		weekDaysFrequency: [3, 4],
		id: "2",
	},
	{
		title: "Treino de Flexibilidade",
		category: "flexibility",
		imageUrl: "flexibility.jpg",
		description:
			"Treino focado em exercícios de flexibilidade para melhorar a mobilidade e prevenir lesões.",
		weekDaysFrequency: [5, 6],
		id: "3",
	},
]

export const workoutListMocks = {
	createWorkout,
}
