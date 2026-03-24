import { IAuthRepo } from "@/domains/Auth"
import { select } from "@/utils"

const AuthRepo = select.env<IAuthRepo>({
	test: () => require("./inMemory/InMemoryAuthRepo").InMemoryAuthRepo,
	default: () => require("./watermelon/WatermelonAuthRepo").WatermelonAuthRepo,
})

export { AuthRepo }
