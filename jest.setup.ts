jest.mock("expo-router", () => ({
	useRouter: jest.fn(),
	useLocalSearchParams: jest.fn().mockReturnValue({}),
}))

jest.mock("@/hooks", () => ({
	...jest.requireActual("@/hooks"),
	useDebounceValue: (value: unknown) => value,
}))
