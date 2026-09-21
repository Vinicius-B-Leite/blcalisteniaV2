import Svg, { Path } from "react-native-svg"
import { Icon } from "../IconTypes"

export const IconCheck = ({ size, color, testID }: Icon.IconMapProp) => {
	return (
		<Svg width={size} height={size} viewBox="0 0 20 20" fill="none" testID={testID}>
			<Path
				fillRule="evenodd"
				clipRule="evenodd"
				d="M16.0771 5.30806C16.3701 5.60096 16.3701 6.07583 16.0771 6.36872L8.41186 14.0339C8.11897 14.3268 7.6441 14.3268 7.35121 14.0339L3.92296 10.6057C3.63007 10.3128 3.63007 9.83789 3.92296 9.54499C4.21586 9.2521 4.69073 9.2521 4.98362 9.54499L7.88153 12.4429L15.0164 5.30806C15.3093 5.01516 15.7842 5.01516 16.0771 5.30806Z"
				fill={color}
			/>
		</Svg>
	)
}
