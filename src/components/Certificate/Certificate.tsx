import { View } from "react-native";
import { Supporter } from "./Supporter";

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

  return <View />
}
