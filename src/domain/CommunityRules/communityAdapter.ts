import { bigNumberToFloat } from "@utils";
import { InvitationContractProps, InvitationProps } from "./types";

function parseInvitation(data: InvitationContractProps): InvitationProps {
  return {
    createdAt: bigNumberToFloat(data.createdAtBlock),
    invited: data.invited,
    inviter: data.inviter,
    userType: bigNumberToFloat(data.userType)
  }
}

export const communityAdapter = {
  parseInvitation
}