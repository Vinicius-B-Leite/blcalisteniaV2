import { IAuthRepo, AuthModel } from "@/domains/Auth"

let idCounter = 1
let currentUser: AuthModel | null = null

export const InMemoryAuthRepo: IAuthRepo = {
	signInAnonymous: async (params) => {
		const newUser: AuthModel = { id: String(idCounter++), name: params.name }
		currentUser = newUser
		return newUser
	},

	getCurrentUser: async () => {
		return currentUser
	},

	logout: async () => {
		currentUser = null
	},
}
