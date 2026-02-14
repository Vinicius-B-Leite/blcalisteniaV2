import Svg, { Path } from "react-native-svg"
import { Icon } from "../IconTypes"

export const IconArrowRightTop = ({ size, color }: Icon.IconMapProp) => {
	return (
		<Svg width={size} height={size} viewBox="0 0 20 20" fill="none">
			<Path
				d="M14.3271 5.6604L4.99382 14.9937M14.3271 5.6604L14.3271 13.6604M14.3271 5.6604L6.32715 5.6604"
				stroke={color}
				strokeWidth={2.05704}
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
		</Svg>
	)
}
