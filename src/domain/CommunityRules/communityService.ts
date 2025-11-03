import { bigNumberToFloat } from "@utils";
import { communityContract } from "./communityContract";
import { DelationProps, InvitationProps } from "./types";
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

interface GetDelationsProps {
  rpc: string;
  address: string;
}
async function getDelations({ rpc, address }: GetDelationsProps): Promise<DelationProps[]> {
  const response = await communityContract.getUserDelations({ rpc, address });
  return response.map(communityAdapter.parseDelation);
}

interface GetUserTypesCountProps {
  rpc: string;
  userType: number;
}
async function getUserTypesCount({ rpc, userType }: GetUserTypesCountProps): Promise<number> {
  const response = await communityContract.userTypesCount({ rpc, userType });
  return bigNumberToFloat(response);
}

async function getUsersCount({ rpc }: { rpc: string; }): Promise<number> {
  const response = await communityContract.usersCount({ rpc });
  return bigNumberToFloat(response);
}

export const communityService = {
  getUser,
  getInvitation,
  getDelations,
  getUserTypesCount,
  getUsersCount
}