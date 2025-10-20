import { useState } from "react";
import { View } from "react-native";

import { BaseRegistrationProps } from "./UserRegistration";
import { Invitation } from "../Invitation";
import { Text } from "@components";

export function Inspector({}: BaseRegistrationProps) {
  const [invitationIsOk, setInvitationIsOk] = useState<boolean>(false);

  return (
    <View>
      <Invitation userType={2} invitationIsOk={setInvitationIsOk} />
      <Text>is ok:{invitationIsOk?.toString()}</Text>
    </View>
  )
}
