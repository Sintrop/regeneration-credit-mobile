import { 
  FileIcon, 
  ChevronLeftIcon, 
  MyTokensIcon, 
  ImpactCalculatorIcon, 
  CopyIcon,
  HideIcon,
  ShowIcon,
  ArrowDown,
  ArrowUpIcon,
  ArrowRightIcon,
  RcIcon,
  SinIcon,
  RcStatsIcon,
  CommunityIcon
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
  impactCalculator: ImpactCalculatorIcon,
  copy: CopyIcon,
  hide: HideIcon,
  show: ShowIcon,
  arrowDown: ArrowDown,
  arrowUp: ArrowUpIcon,
  arrowRight: ArrowRightIcon,
  rc: RcIcon,
  sin: SinIcon,
  rcStats: RcStatsIcon,
  community: CommunityIcon
}
export type IconsName = keyof typeof icons;
