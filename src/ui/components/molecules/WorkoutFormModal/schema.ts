import z from "zod"
import { CATEGORIES } from "src/constants"

export const schema = z.object({
	name: z.string().min(1, "O nome do treino é obrigatório"),
	description: z.string().min(1, "A descrição do treino é obrigatória"),
	weekDays: z
		.array(
			z.union([
				z.literal(0),
				z.literal(1),
				z.literal(2),
				z.literal(3),
				z.literal(4),
				z.literal(5),
				z.literal(6),
			]),
		)
		.nonempty("Selecione pelo menos um dia da semana"),
	type: z.enum([
		CATEGORIES.strength,
		CATEGORIES.mobility,
		CATEGORIES.resistance,
		CATEGORIES.flexibility,
	]),
})

export type FormSchema = z.infer<typeof schema>
