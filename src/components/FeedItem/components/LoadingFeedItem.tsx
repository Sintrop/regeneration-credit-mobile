import ContentLoader, {Rect, Circle} from 'react-content-loader/native';
import { useWindowDimensions } from 'react-native';

export function LoadingFeedItem() {
  const { width } = useWindowDimensions();

  return (
    <ContentLoader
      speed={2}
      width={width - 40}
      height={270}
      viewBox={`0 0 ${width - 40} 270`}
      backgroundColor="#012939"
      foregroundColor="#ecebeb"
    >
      <Circle cx="25" cy="25" r="25" />
      <Rect x="64" y="27" rx="3" ry="3" width="100" height="6" /> 
      <Rect x="63" y="6" rx="3" ry="3" width="250" height="10" /> 

      <Rect x="5" y="65" rx="3" ry="3" width={width - 30} height="200" /> 
    </ContentLoader>
  )
}