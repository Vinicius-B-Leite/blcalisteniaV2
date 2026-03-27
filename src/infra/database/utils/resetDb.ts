import { database } from "../watermelon/sqlite"

export const resetDb = async () => {
	try {
		await database.write(async () => {
			await database.unsafeResetDatabase()
		})
		console.log("Database reset successfully!")
	} catch (error) {
		console.error("Error resetting database:", error)
	}
}
