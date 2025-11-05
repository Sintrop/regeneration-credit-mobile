import Web3 from "web3";

async function blockNumber({ rpc }: { rpc: string }): Promise<bigint> {
  const provider = new Web3(new Web3.providers.HttpProvider(rpc));
  const response = await provider.eth.getBlockNumber()

  return response;
}

export const chainContract = {
  blockNumber
}