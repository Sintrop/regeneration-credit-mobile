import { SupporterRules } from "@contracts";
import { useSDK } from "@metamask/sdk-react";
import { Alert } from "react-native";
import Web3 from "web3";

interface AddSupporterProps {
  name: string;
  description: string;
  profilePhoto: string;
}
interface ReturnUseAddSupporter {
  hash: string;
  addSupporter: (data: AddSupporterProps) => void;
}
export function useAddSupporter(): ReturnUseAddSupporter {
  const { provider: ethereum } = useSDK();

  async function handleAddSupporter(data: AddSupporterProps) {
    if (!ethereum) {
      Alert.alert('Error', 'provider is undefined');
      return;
    }

    const web3 = new Web3(ethereum as any);
    const accounts = await web3.eth.getAccounts();
    const contract = new web3.eth.Contract(SupporterRules.abi, SupporterRules.address);

    try {
      const response = await ethereum.request({
        method: 'eth_sendTransaction',
        params: [{
          from: accounts[0],
          to: SupporterRules.address,
          data: contract.methods.addSupporter(data.name, data.description, data.profilePhoto).encodeABI(),
        }],
      });
      console.log(response)
    } catch (e) {
      console.log(e)
    }
  }

  return {
    hash: '',
    addSupporter: handleAddSupporter
  }
}
