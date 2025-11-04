import { View } from "react-native";

import { Supporter } from "./Supporter";
import { Regenerator } from "./Regenerator";

interface Props {
  type: 'supporter' | 'regenerator'
  address: string;
}

export function Certificate({ address, type }: Props) {
  if (type === 'supporter') {
    return (
      <Supporter address={address} />
    )
  }

  if (type === 'regenerator') {
    return (
      <Regenerator address={address} />
    )
  }

  return <View />
}
