import z from "zod"

export const schema = z.object({
	exerciseName: z.string().min(1, "O nome do exercício é obrigatório"),
	series: z
		.string()
		.min(1, "Campo obrigatório")
		.refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
			message: "Deve ser um número maior que 0",
		}),
	reps: z
		.string()
		.min(1, "Campo obrigatório")
		.refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
			message: "Deve ser um número maior que 0",
		}),
	rest: z
		.string()
		.min(1, "Campo obrigatório")
		.refine((val) => !isNaN(Number(val)) && Number(val) >= 0, {
			message: "Deve ser um número maior ou igual a 0",
		}),
})

export type FormSchema = z.infer<typeof schema>
