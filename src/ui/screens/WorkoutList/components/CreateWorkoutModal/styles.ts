import { spacings } from "@/themes/tokens"
import { ThemeType } from "@/themes/types"

export const createStyles = (theme: ThemeType) => ({
	buttonsWrapper: {
		gap: spacings.gap[8],
	},
	content: {
		gap: spacings.gap[16],
	},
	top: {
		gap: spacings.gap[16],
	},
	bottom: {
		gap: spacings.gap[24],
	},
})
