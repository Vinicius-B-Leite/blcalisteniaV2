import Svg, { Path, Rect } from "react-native-svg"
import { Icon } from "../IconTypes"

export const IconCalendar = ({ size, color }: Icon.IconMapProp) => {
	return (
		<Svg width={size} height={size} viewBox="0 0 28 28" fill="none">
			<Rect
				x={3.5}
				y={5.25}
				width={21}
				height={19.25}
				rx={1.75}
				stroke={color}
				strokeWidth={1.75}
			/>
			<Path
				d="M3.5 10.5H24.5"
				stroke={color}
				strokeWidth={1.75}
				strokeLinecap="round"
			/>
			<Path
				d="M8.75 3.5V7"
				stroke={color}
				strokeWidth={1.75}
				strokeLinecap="round"
			/>
			<Path
				d="M19.25 3.5V7"
				stroke={color}
				strokeWidth={1.75}
				strokeLinecap="round"
			/>
		</Svg>
	)
}
