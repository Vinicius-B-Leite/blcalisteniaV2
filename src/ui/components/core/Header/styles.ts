import { StyleSheet } from "react-native"
import { spacings } from "../../../theme/tokens/spacings"

export const styles = StyleSheet.create({
	root: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		paddingVertical: spacings.padding[16],
	},
	verticalCenterTitle: {
		position: "absolute",
		left: 0,
		right: 0,
		textAlign: "center",
	},
})
