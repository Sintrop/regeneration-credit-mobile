import { Svg, Path, Rect } from "react-native-svg";

interface Props {
  size?: number;
  color?: string;
}
export function QrCodeIcon({ size = 20, color = 'white' }: Props) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M3 3h7v7H3V3Zm2 2v3h3V5H5Zm9-2h7v7h-7V3Zm2 2v3h3V5h-3ZM3 14h7v7H3v-7Zm2 2v3h3v-3H5Z" fill={color} />
      <Rect x="14" y="14" width="3" height="3" fill={color} />
      <Rect x="18" y="18" width="3" height="3" fill={color} />
      <Rect x="18" y="14" width="3" height="2" fill={color} />
      <Rect x="14" y="18" width="2" height="3" fill={color} />
    </Svg>
  )
}
