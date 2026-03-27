import z from "zod"
import { MUSCLES_GROUPS, MuscleGroup } from "@/constants"

const muscleGroups = Object.keys(MUSCLES_GROUPS) as [MuscleGroup, ...MuscleGroup[]]

//TODO: REVISAR SCHEMA
export const schema = z.object({
	exerciseName: z.string().min(1, "O nome do exercício é obrigatório"),
	series: z
		.string()
		.min(1, "Número de séries é obrigatório")
		.refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
			message: "Deve ser um número maior que 0",
		}),
	reps: z
		.string()
		.min(1, "Número de repetições é obrigatório")
		.refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
			message: "Deve ser um número maior que 0",
		}),
	rest: z
		.string()
		.min(1, "Tempo de descanso é obrigatório")
		.refine((val) => !isNaN(Number(val)) && Number(val) >= 0, {
			message: "Deve ser um número maior ou igual a 0",
		}),
	muscleGroup: z.enum(muscleGroups, {
		message: "Selecione um grupo muscular",
	}),
})

export type FormSchema = z.infer<typeof schema>
