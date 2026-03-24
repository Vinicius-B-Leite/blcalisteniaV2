import { IAuthRepo } from "@/domains/Auth"
import { database } from "src/infra/database"
import UsersModel from "src/infra/database/watermelon/models/UsersModel"
import { authAdapters } from "../../AuthAdapters"

export const WatermelonAuthRepo: IAuthRepo = {
	signInAnonymous: async (params) => {
		try {
			let createdUser: UsersModel | null = null
			await database.write(async () => {
				createdUser = await database.get<UsersModel>("users").create((user) => {
					user.name = params.name
				})
			})

			return authAdapters.toDomain(createdUser!)
		} catch (error) {
			throw new Error("Error signing in: " + error)
		}
	},
	getCurrentUser: async () => {
		try {
			const users = await database.get<UsersModel>("users").query().fetch()

			if (users.length === 0) {
				throw new Error("No user found")
			}

			return authAdapters.toDomain(users[0])
		} catch (error) {
			throw new Error("Error fetching current user: " + error)
		}
	},
	logout: async () => {
		try {
			await database.adapter.unsafeResetDatabase()
		} catch (error) {
			throw new Error("Error logging out: " + error)
		}
	},
}
