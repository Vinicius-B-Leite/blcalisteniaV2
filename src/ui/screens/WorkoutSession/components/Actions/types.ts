import { IconType } from "@/components/core"

export type ActionsProps = {
	completeSet: () => number
	advanceAfterRest: () => void
	plannedRestSeconds: number
}

export type ActionButtonProps = {
	label: string
	isActive: boolean
	iconName: IconType.Names
	onPress?: () => void
	disabled?: boolean
	testID?: string
}
