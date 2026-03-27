import { ExerciseModel } from "@/domains/Exercise"

const userExercisesBase: Omit<ExerciseModel, "id" | "userId">[] = [
	{
		name: "Exercício Customizado",
		musclesGroups: ["shoulders"],
		bannerUrl: null,
	},
	{
		name: "Outro Exercício Customizado",
		musclesGroups: ["triceps"],
		bannerUrl: null,
	},
]

const defaultExercises: ExerciseModel[] = [
	{
		id: "1",
		name: "Flexão",
		musclesGroups: ["chest"],
		bannerUrl: null,
		userId: null,
	},
	{
		id: "2",
		name: "Agachamento",
		musclesGroups: ["legs"],
		bannerUrl: null,
		userId: null,
	},
	{
		id: "3",
		name: "Rosca Direta",
		musclesGroups: ["biceps"],
		bannerUrl: null,
		userId: null,
	},
]

export const searchExercisesMocks = {
	defaultExercises,
	userExercisesBase,
}
