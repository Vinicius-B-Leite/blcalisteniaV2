import { InputRoot } from "./InputRoot"
import { InputLabel } from "./InputLabel"
import { InputFieldWrapper } from "./InputFieldWrapper"
import { InputField } from "./InputField"
import { InputError } from "./InputError"

export const Input = {
	Root: InputRoot,
	Label: InputLabel,
	FieldWrapper: InputFieldWrapper,
	Field: InputField,
	Error: InputError,
}

export { type Input as InputTypes } from "./InputTypes"
export { inputVariants, inputVariantsKeys } from "./InputVariants"
