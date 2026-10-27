import Web3, { EventLog } from "web3";

interface ContractRef {
  abi: any;
  address: string;
}

/** All past logs of one event since genesis. */
export async function fetchEvents(rpc: string, contract: ContractRef, eventName: string): Promise<EventLog[]> {
  const web3 = new Web3(rpc);
  const instance = new web3.eth.Contract(contract.abi, contract.address);
  //@ts-ignore
  const events = await instance.getPastEvents(eventName, { fromBlock: 0, toBlock: "latest" });
  return events as EventLog[];
}

export function toNumber(value: unknown): number {
  return Number(String(value ?? 0).replace("n", ""));
}

/** Unique numeric id for a log: block, feed type and position in the block. */
export function eventFeedId(blockNumber: number, typeCode: number, logIndex: unknown): number {
  return blockNumber * 10000 + typeCode * 1000 + (toNumber(logIndex) % 1000);
}
