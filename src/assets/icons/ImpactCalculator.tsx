import { Image } from 'react-native';

import { IconSvgProps } from '@components'

//@ts-ignore
import image from './impact-calculator.png';

export function ImpactCalculatorIcon({ size = 20 }: IconSvgProps) {
  return <Image source={image} style={{ width: size, height: size }} resizeMode='contain' />
}
