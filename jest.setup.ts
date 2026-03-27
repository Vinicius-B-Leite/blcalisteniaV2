jest.mock("expo-router", () => ({
	useRouter: jest.fn(),
}))

jest.mock("@/hooks", () => ({
	...jest.requireActual("@/hooks"),
	useDebounceValue: (value: unknown) => value,
}))
