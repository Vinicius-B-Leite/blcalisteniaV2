import Svg, { Path } from "react-native-svg"
import { Icon } from "../IconTypes"

export const IconHeart = ({ size, color }: Icon.IconMapProp) => {
	return (
		<Svg width={size} height={size} viewBox="0 0 14 14" fill="none">
			<Path
				d="M7.00016 12.25L6.29183 11.6008C3.50016 9.11167 1.5835 7.38833 1.5835 5.25C1.5835 3.52667 2.86016 2.25 4.5835 2.25C5.5535 2.25 6.48683 2.68917 7.00016 3.37833C7.5135 2.68917 8.44683 2.25 9.41683 2.25C11.1402 2.25 12.4168 3.52667 12.4168 5.25C12.4168 7.38833 10.5002 9.11167 7.7085 11.6008L7.00016 12.25Z"
				fill={color}
			/>
		</Svg>
	)
}
