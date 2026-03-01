import { AuthModel } from "src/domain/Auth/AuthModel"
import UsersModel from "src/infra/database/watermelon/models/UserModel"

export const authAdapters = {
	toDomain: (data: UsersModel): AuthModel => ({
		id: data.id,
		name: data.name,
	}),

	toDTO: (data: AuthModel): Partial<UsersModel> => ({
		name: data.name,
	}),
}
