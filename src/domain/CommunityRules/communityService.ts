import { bigNumberToFloat } from "@utils";
import { communityContract } from "./communityContract";

interface GetUserProps {
  rpc: string;
  address: string;
}
async function getUser({ rpc, address }: GetUserProps): Promise<number> {
  const response = await communityContract.getUser({ rpc, address });
  return bigNumberToFloat(response);
}

export const communityService = {
  getUser
}