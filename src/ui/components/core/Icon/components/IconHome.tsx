import Svg, { Path } from "react-native-svg"
import { Icon } from "../IconTypes"

export const IconHome = ({ size, color }: Icon.IconMapProp) => {
	return (
		<Svg width={size} height={size} viewBox="0 0 28 28" fill="none">
			<Path
				d="M4.58398 10.0833L14.0007 3.5L23.4173 10.0833V22.1667C23.4173 22.6087 23.2417 23.0326 22.9291 23.3452C22.6165 23.6578 22.1927 23.8333 21.7507 23.8333H6.25065C5.80862 23.8333 5.38475 23.6578 5.07219 23.3452C4.75963 23.0326 4.58398 22.6087 4.58398 22.1667V10.0833Z"
				stroke={color}
				strokeWidth={2.29167}
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
			<Path
				d="M10.5 23.8333V14H17.5V23.8333"
				stroke={color}
				strokeWidth={2.29167}
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
		</Svg>
	)
}
