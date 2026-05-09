import { activistService, BasicUserProps, contributorService, developerService, inspectorService, regeneratorService, researcherService, supporterService, rcService } from "@domain";

interface GetBasicDataProps {
  rpc: string;
  userType: number;
  address: string;
}
async function getBasicData({ address, rpc, userType }: GetBasicDataProps): Promise<BasicUserProps> {
  let basicData: BasicUserProps = {
    address,
    name: "",
    photo: "",
    poolLevel: 0,
    extraInfo: undefined,
    extraInfoValue: 0
  }

  if (userType === 1) {
    const response = await regeneratorService.getRegenerator({ rpc, address })
    basicData = {
      address,
      name: response.name,
      photo: response.proofPhoto,
      poolLevel: response.pool.currentEra,
      extraInfo: 'Regeneration Score',
      extraInfoValue: response.regenerationScore?.score || 0
    }
  }

  if (userType === 2) {
    const response = await inspectorService.getInspector({ rpc, address })
    basicData = {
      address,
      name: response.name,
      photo: response.proofPhoto,
      poolLevel: response.pool.currentEra,
      extraInfo: 'Level',
      extraInfoValue: response.pool?.level || 0
    }
  }

  if (userType === 3) {
    const response = await researcherService.getResearcher({ rpc, address })
    basicData = {
      address,
      name: response.name,
      photo: response.proofPhoto,
      poolLevel: response.pool.currentEra,
      extraInfo: 'Level',
      extraInfoValue: response.pool?.level || 0
    }
  }

  if (userType === 4) {
    const response = await developerService.getDeveloper({ rpc, address })
    basicData = {
      address,
      name: response.name,
      photo: response.proofPhoto,
      poolLevel: response.pool.currentEra,
      extraInfo: 'Level',
      extraInfoValue: response.pool?.level || 0
    }
  }

  if (userType === 5) {
    const response = await contributorService.getContributor({ rpc, address })
    basicData = {
      address,
      name: response.name,
      photo: response.proofPhoto,
      poolLevel: response.pool.currentEra,
      extraInfo: 'Level',
      extraInfoValue: response.pool?.level || 0
    }
  }

  if (userType === 6) {
    const response = await activistService.getActivist({ rpc, address })
    basicData = {
      address,
      name: response.name,
      photo: response.proofPhoto,
      poolLevel: response.pool.currentEra,
      extraInfo: 'Level',
      extraInfoValue: response.pool?.level || 0
    }
  }

  if (userType === 7) {
    const response = await supporterService.getSupporter({ rpc, address })
    
    // Get certificated tokens for supporter
    let certificatedTokens = 0;
    try {
      const certResponse = await rcService.getCertificatedTokens({ address, rpc });
      certificatedTokens = certResponse || 0;
    } catch (err) {
      console.error('[UserService] Error fetching certificated tokens:', err);
    }
    
    basicData = {
      address,
      name: response.name,
      photo: response.profilePhoto,
      poolLevel: 0,
      extraInfo: 'Tokens Compensados',
      extraInfoValue: certificatedTokens
    }
  }

  return basicData
}

export const userService = {
  getBasicData
}