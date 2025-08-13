import { View } from "react-native";
import { useGetRegenerator } from "@domain";
import { HeaderProfile } from "../HeaderProfile/HeaderProfile";

interface Props {
  address: string
}
export function Regenerator({ address }: Props) {
  const { regenerator, isLoading, isError } = useGetRegenerator({ address })

  if (isLoading) return <View/>

  if (!regenerator || isError) return <View />

  return (
    <View>
      <HeaderProfile
        address={address}
        name={regenerator?.name}
        photoHash={regenerator?.proofPhoto}
        userType={1}
      />
    </View>
  )
}