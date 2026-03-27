import { defaultExercises } from "@/constants"
import { useExerciseRepo } from "@/infra/repos"
import { useEffect, useState } from "react"

export const useDatabaseSeed = () => {
	const exerciseRepo = useExerciseRepo()
	const [isSeeding, setIsSeeding] = useState(true)

	const execute = async () => {
		try {
			await seedExercises()
		} finally {
			setIsSeeding(false)
		}
	}

	const seedExercises = async () => {
		const existing = await exerciseRepo.getAllExercises()
		if (existing.length > 0) return

		await Promise.all(
			defaultExercises.map((exercise) =>
				exerciseRepo.createExercise({ ...exercise, userId: null }),
			),
		)
	}

	useEffect(() => {
		execute()
	}, [])

	return { execute, isSeeding }
}
