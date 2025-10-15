import { bigNumberToFloat } from "@utils";
import { DelationContractProps, DelationProps, InvitationContractProps, InvitationProps } from "./types";

function parseInvitation(data: InvitationContractProps): InvitationProps {
  return {
    createdAt: bigNumberToFloat(data.createdAtBlock),
    invited: data.invited,
    inviter: data.inviter,
    userType: bigNumberToFloat(data.userType)
  }
}

function parseDelation(data: DelationContractProps): DelationProps {
  return {
    id: bigNumberToFloat(data.id),
    createdAt: 0,
    informer: data.informer,
    reported: data.reported,
    testimony: data.testimony,
    title: data.title
  }
}

export const communityAdapter = {
  parseInvitation,
  parseDelation
}