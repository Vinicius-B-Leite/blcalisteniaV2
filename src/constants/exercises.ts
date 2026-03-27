import { ExerciseModel } from "@/domains/Exercise"

export const defaultExercises: Omit<ExerciseModel, "id" | "userId">[] = [
	{
		name: "Pull-up",
		musclesGroups: ["back", "biceps"],
		bannerUrl: "https://example.com/pullup.jpg",
	},
	{
		name: "Push-up",
		musclesGroups: ["chest", "triceps", "shoulders"],
		bannerUrl: "https://example.com/pushup.jpg",
	},
	{
		name: "Squat",
		musclesGroups: ["legs"],
		bannerUrl: "https://example.com/squat.jpg",
	},
	{
		name: "Plank",
		musclesGroups: ["core"],
		bannerUrl: "https://example.com/plank.jpg",
	},
	{
		name: "Dips",
		musclesGroups: ["triceps", "chest", "shoulders"],
		bannerUrl: "https://example.com/dips.jpg",
	},
	{
		name: "Leg Raises",
		musclesGroups: ["core", "legs"],
		bannerUrl: "https://example.com/leg-raises.jpg",
	},
	{
		name: "Handstand Push-up",
		musclesGroups: ["shoulders", "triceps", "core"],
		bannerUrl: "https://example.com/handstand-pushup.jpg",
	},
	{
		name: "Muscle-up",
		musclesGroups: ["back", "chest", "biceps", "triceps"],
		bannerUrl: "https://example.com/muscle-up.jpg",
	},
	{
		name: "L-sit",
		musclesGroups: ["core", "shoulders"],
		bannerUrl: "https://example.com/l-sit.jpg",
	},
	{
		name: "Pistol Squat",
		musclesGroups: ["legs", "core"],
		bannerUrl: "https://example.com/pistol-squat.jpg",
	},
]
