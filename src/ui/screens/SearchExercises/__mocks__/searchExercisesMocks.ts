import { ExerciseModel } from "@/domains/Exercise"

const defaultExercises: ExerciseModel[] = [
	{
		id: "1",
		name: "Agachamento",
		musclesGroups: ["legs"],
		bannerUrl: null,
		userId: null,
	},
	{
		id: "2",
		name: "Barra Fixa",
		musclesGroups: ["back"],
		bannerUrl: null,
		userId: null,
	},
	{
		id: "3",
		name: "Flexão",
		musclesGroups: ["chest"],
		bannerUrl: null,
		userId: null,
	},
	{
		id: "4",
		name: "Remada",
		musclesGroups: ["back"],
		bannerUrl: null,
		userId: null,
	},
	{
		id: "5",
		name: "Supino",
		musclesGroups: ["chest"],
		bannerUrl: null,
		userId: null,
	},
]

const userExercisesBase: Omit<ExerciseModel, "id" | "userId">[] = [
	{
		name: "Exercício A",
		musclesGroups: ["legs"],
		bannerUrl: null,
	},
	{
		name: "Exercício B",
		musclesGroups: ["biceps"],
		bannerUrl: null,
	},
	{
		name: "Exercício C",
		musclesGroups: ["shoulders"],
		bannerUrl: null,
	},
]

export const searchExercisesMocks = {
	defaultExercises,
	userExercisesBase,
}
