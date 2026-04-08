import { Image } from 'react-native';

//@ts-ignore
import image from './pools.png';
import { IconSvgProps } from '@components';

export function PoolsIcon({ size = 20 }: IconSvgProps) {
  return <Image source={image} style={{ width: size, height: size }} resizeMode='contain' />
}
