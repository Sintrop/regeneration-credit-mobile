import { BasicUserProps, inspectorService, regeneratorService } from "@domain";

interface GetBasicDataProps {
  rpc: string;
  userType: number;
  address: string;
}
async function getBasicData({ address, rpc, userType }: GetBasicDataProps): Promise<BasicUserProps> {
  let basicData: BasicUserProps = {
    address,
    name: "",
    photo: ""
  }

  if (userType === 1) {
    const response = await regeneratorService.getRegenerator({ rpc, address })
    basicData = {
      address,
      name: response.name,
      photo: response.proofPhoto
    }
  }

  if (userType === 2) {
    const response = await inspectorService.getInspector({ rpc, address })
    basicData = {
      address,
      name: response.name,
      photo: response.proofPhoto
    }
  }

  return basicData
}
export const userService = {
  getBasicData
}