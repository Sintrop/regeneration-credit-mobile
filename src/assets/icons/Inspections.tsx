import { Image } from 'react-native';

import { IconSvgProps } from '@components'

//@ts-ignore
import image from './inspections.png';

export function InspectionsIcon({ size = 20 }: IconSvgProps) {
  return <Image source={image} style={{ width: size, height: size }} resizeMode='contain' />
}
