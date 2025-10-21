import { IconSvgProps } from "@components";
import { Svg, Path } from "react-native-svg";

export function ArrowUpIcon({ size = 20, color = 'white' }: IconSvgProps) {
    return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
            <Path id="Vector" d="M5 16L12 9L19 16" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />

        </Svg>
    )
}