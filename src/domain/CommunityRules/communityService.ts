import { bigNumberToFloat } from "@utils";
import { communityContract } from "./communityContract";
import { InvitationProps } from "./types";
import { communityAdapter } from "./communityAdapter";

interface GetUserProps {
  rpc: string;
  address: string;
}
async function getUser({ rpc, address }: GetUserProps): Promise<number> {
  const response = await communityContract.getUser({ rpc, address });
  return bigNumberToFloat(response);
}

interface GetInvitationProps {
  rpc: string;
  address: string;
}
async function getInvitation({ rpc, address }: GetInvitationProps): Promise<InvitationProps> {
  const response = await communityContract.getInvitation({ rpc, address });
  return communityAdapter.parseInvitation(response);
}

export const communityService = {
  getUser,
  getInvitation
}