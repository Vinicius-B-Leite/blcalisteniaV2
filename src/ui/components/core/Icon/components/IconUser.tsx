import Svg, { Path, Circle } from "react-native-svg"
import { Icon } from "../IconTypes"

export const IconUser = ({ size, color }: Icon.IconMapProp) => {
	return (
		<Svg width={size} height={size} viewBox="0 0 28 28" fill="none">
			<Circle
				cx={14}
				cy={9.33333}
				r={4.66667}
				stroke={color}
				strokeWidth={1.95833}
			/>
			<Path
				d="M5.83398 24.6458C5.83398 20.1375 9.49232 16.4792 14.0007 16.4792C18.509 16.4792 22.1673 20.1375 22.1673 24.6458"
				stroke={color}
				strokeWidth={1.95833}
				strokeLinecap="round"
			/>
		</Svg>
	)
}
