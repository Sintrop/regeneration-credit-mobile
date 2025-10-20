import { 
  FileIcon, 
  ChevronLeftIcon, 
  MyTokensIcon, 
  ImpactCalculatorIcon 
} from "@icons";

export interface IconSvgProps {
  color?: string;
  size?: number;
}

interface Props {
  name: IconsName;
  color?: string;
  size?: number;
}
export function Icon({ name, color, size }: Props) {
  const IconComponent = icons[name];

  return (
    <IconComponent size={size} color={color} />
  )
}

const icons = {
  file: FileIcon,
  chevronLeft: ChevronLeftIcon,
  tokens: MyTokensIcon,
  impactCalculator: ImpactCalculatorIcon
}
export type IconsName = keyof typeof icons;
