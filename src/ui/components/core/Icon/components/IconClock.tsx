import Svg, { G, Path, Defs, ClipPath, Rect } from "react-native-svg"
import { Icon } from "../IconTypes"

export const IconClock = ({ size, color }: Icon.IconMapProp) => {
	return (
		<Svg width={size} height={size} viewBox="0 0 28 28" fill="none">
			<G clip-path="url(#clip0_2687_7664)">
				<Path
					d="M13.9785 24.2917C19.674 24.2917 24.291 19.6747 24.291 13.9792C24.291 8.28381 19.674 3.66675 13.9785 3.66675C8.28308 3.66675 3.66602 8.28381 3.66602 13.9792C3.66602 19.6747 8.28308 24.2917 13.9785 24.2917Z"
					stroke={color}
					stroke-width="3"
					stroke-linecap="round"
					stroke-linejoin="round"
				/>
				<Path
					d="M12.832 9.396V15.1252H18.5612"
					stroke={color}
					stroke-width="3"
					stroke-linecap="round"
					stroke-linejoin="round"
				/>
			</G>
			<Defs>
				<ClipPath id="clip0_2687_7664">
					<Rect width="28" height="28" fill={color} />
				</ClipPath>
			</Defs>
		</Svg>
	)
}
