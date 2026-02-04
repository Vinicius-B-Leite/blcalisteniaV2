import Svg, { G, Path, Defs, ClipPath, Rect } from "react-native-svg"
import { Icon } from "../IconTypes"

export const IconNotification = ({ size, color }: Icon.IconMapProp) => {
	return (
		<Svg width={size} height={size} viewBox="0 0 30 30" fill="none">
			<G clip-path="url(#clip0_2687_7663)">
				<Path
					d="M8 21H22V14.031C22 10.148 18.866 7 15 7C11.134 7 8 10.148 8 14.031V21ZM15 5C19.97 5 24 9.043 24 14.031V23H6V14.031C6 9.043 10.03 5 15 5ZM12.5 24H17.5C17.5 24.663 17.2366 25.2989 16.7678 25.7678C16.2989 26.2366 15.663 26.5 15 26.5C14.337 26.5 13.7011 26.2366 13.2322 25.7678C12.7634 25.2989 12.5 24.663 12.5 24Z"
					fill={color}
				/>
			</G>
			<Defs>
				<ClipPath id="clip0_2687_7663">
					<Rect
						width="24"
						height="24"
						fill={color}
						transform="translate(3 3)"
					/>
				</ClipPath>
			</Defs>
		</Svg>
	)
}
