import z from "zod"
import { MUSCLES_GROUPS_ARRAY, MuscleGroup } from "@/constants"

export const schema = z.object({
	name: z.string().min(2, "O nome é obrigatório"),
	musclesGroups: z
		.array(z.enum(MUSCLES_GROUPS_ARRAY as [MuscleGroup, ...MuscleGroup[]]))
		.min(1, "Selecione ao menos um grupo muscular"),
})

export type FormSchema = z.infer<typeof schema>
