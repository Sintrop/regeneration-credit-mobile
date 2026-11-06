import ContentLoader, {Rect, Circle} from 'react-content-loader/native';
import { useWindowDimensions } from 'react-native';
import colors from "../../../theme/colors";

export function LoadingUserItem() {
  const { width } = useWindowDimensions();

  return (
    <ContentLoader
      speed={2}
      width={width}
      height={70}
      viewBox={`0 0 ${width} 70`}
      backgroundColor={colors.card.secondary}
      foregroundColor={colors.skeleton}
    >
      <Circle cx="35" cy="35" r="35" />
      <Rect x="75" y="6" rx="3" ry="3" width="250" height="10" /> 
      <Rect x="75" y="27" rx="3" ry="3" width="100" height="6" /> 
    </ContentLoader>
  )
}