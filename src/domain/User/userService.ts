import { activistService, BasicUserProps, contributorService, developerService, inspectorService, regeneratorService, researcherService, supporterService } from "@domain";

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

  if (userType === 3) {
    const response = await researcherService.getResearcher({ rpc, address })
    basicData = {
      address,
      name: response.name,
      photo: response.proofPhoto
    }
  }

  if (userType === 4) {
    const response = await developerService.getDeveloper({ rpc, address })
    basicData = {
      address,
      name: response.name,
      photo: response.proofPhoto
    }
  }

  if (userType === 5) {
    const response = await contributorService.getContributor({ rpc, address })
    basicData = {
      address,
      name: response.name,
      photo: response.proofPhoto
    }
  }

  if (userType === 6) {
    const response = await activistService.getActivist({ rpc, address })
    basicData = {
      address,
      name: response.name,
      photo: response.proofPhoto
    }
  }

  if (userType === 7) {
    const response = await supporterService.getSupporter({ rpc, address })
    basicData = {
      address,
      name: response.name,
      photo: response.profilePhoto
    }
  }

  return basicData
}

export const userService = {
  getBasicData
}