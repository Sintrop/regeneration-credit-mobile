import { Image } from 'react-native';

import { IconSvgProps } from '@components'

//@ts-ignore
import image from './community.png';

export function CommunityIcon({ size = 20 }: IconSvgProps) {
  return <Image source={image} style={{ width: size, height: size }} resizeMode='contain' />
}
