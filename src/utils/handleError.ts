import { Toast } from "@/components/core"
import { AppError } from "@/errors"

export const handleError = (error: unknown, defaultMessage: string) => {
	Toast.show({
		variant: "error",
		message: error instanceof AppError ? error.message : defaultMessage,
	})
}
