import { IconType } from "@/components/core"

export type ActionButtonProps = {
	label: string
	isActive: boolean
	iconName: IconType.Names
	onPress?: () => void
}
