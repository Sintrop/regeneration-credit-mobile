import { useSDK } from "@metamask/sdk-react";
import Toast from "react-native-toast-message";

import { 
  RegeneratorRules, 
  InspectorRules, 
  ResearcherRules, 
  DeveloperRules, 
  ContributorRules, 
  ActivistRules 
} from "@contracts";
import { useTxContext } from "@hooks";

const contractMap: Record<number, { abi: any, address: string }> = {
  1: RegeneratorRules,
  2: InspectorRules,
  3: ResearcherRules,
  4: DeveloperRules,
  5: ContributorRules,
  6: ActivistRules
};

interface WithdrawProps {
  userType: number;
}

interface ReturnUseWithdraw {
  withdraw: (data: WithdrawProps) => void;
}

export function useWithdraw(): ReturnUseWithdraw {
  const { sendTransaction } = useTxContext();
  const { provider: ethereum } = useSDK();

  async function handleWithdraw(data: WithdrawProps) {
    if (!ethereum) {
      Toast.show({
        type: 'error',
        text1: 'Provider is undefined'
      });
      return;
    }

    const contract = contractMap[data.userType];

    if (!contract) {
      Toast.show({
        type: 'error',
        text1: 'Contract not found for user type'
      });
      return;
    }

    sendTransaction({
      interactWithContract: true,
      contractAbi: contract.abi,
      contractAddress: contract.address,
      methodName: 'withdraw',
      params: []
    });
  }

  return {
    withdraw: handleWithdraw
  };
}
