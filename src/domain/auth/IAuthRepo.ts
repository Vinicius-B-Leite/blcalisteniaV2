import { AuthModel } from "./AuthModel"

export interface IAuthRepo {
	signInAnonymous(params: Pick<AuthModel, "name">): Promise<AuthModel>
	getCurrentUser(): Promise<AuthModel | null>
	logout(): Promise<void>
}
