import { useEffect, useState } from 'react'
import Web3, { EventLog } from 'web3'

import { bigNumberToFloat } from '@utils'
import { useSettingsContext } from '@hooks'
import { RegenerationCredit } from '@contracts'
import { TxProps } from '../types'


interface ReturnUseTransfer {
  isLoading: boolean;
  txs: TxProps[];
}
export function useTransfers({ address }: { address: string; }): ReturnUseTransfer {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [txs, setTxs] = useState<TxProps[]>([])
  const { rpc } = useSettingsContext()

  useEffect(() => {
    setTxs([])
    handleGetEvents()
  }, [])

  async function handleGetEvents(): Promise<void> {
    setIsLoading(true);
    const from = await getFromEvents({
      rpcUrl: rpc,
      address
    });

    const to = await getToEvents({
      rpcUrl: rpc,
      address
    });
    const newArray: TxProps[] = []

    for (let i = 0; i < from.length; i++) {
      const event = from[i]
      const values = event?.returnValues
      newArray.push({
        coin: 'RC',
        type: 'TRANSFER',
        blockNumber: bigNumberToFloat(event?.blockNumber as string),
        hash: event?.transactionHash ?? '',
        from: values?.from as string,
        to: values?.to as string,
        value: bigNumberToFloat(values?.value as string)
      })
    }
    for (let i = 0; i < to.length; i++) {
      const event = to[i]
      const values = event?.returnValues
      newArray.push({
        coin: 'RC',
        type: 'RECEIVE',
        blockNumber: bigNumberToFloat(event?.blockNumber as string),
        hash: event?.transactionHash ?? '',
        from: values?.from as string,
        to: values?.to as string,
        value: bigNumberToFloat(values?.value as string)
      })
    }

    const sortedList = newArray.sort((a, b) => b.blockNumber - a.blockNumber)
    setTxs(sortedList);
    setIsLoading(false);
  }

  return {
    isLoading,
    txs
  }
}

interface GetPastEventsProps {
  rpcUrl: string;
  address: string;
}
async function getFromEvents({
  rpcUrl,
  address
}: GetPastEventsProps): Promise<EventLog[]> {
  const web3 = new Web3(rpcUrl)
  const contractAbi = RegenerationCredit.abi;
  const contractAddress = RegenerationCredit.address;

  const contract = new web3.eth.Contract(contractAbi, contractAddress)

  //@ts-ignore
  const events = await contract.getPastEvents('Transfer', {
    filter: { from: address },
    fromBlock: 1400000,
    toBlock: 'latest',
  })
  return events as EventLog[]
}

async function getToEvents({
  rpcUrl,
  address
}: GetPastEventsProps): Promise<EventLog[]> {
  const web3 = new Web3(rpcUrl)
  const contractAbi = RegenerationCredit.abi;
  const contractAddress = RegenerationCredit.address;

  const contract = new web3.eth.Contract(contractAbi, contractAddress)

  //@ts-ignore
  const events = await contract.getPastEvents('Transfer', {
    filter: { to: address },
    fromBlock: 1400000,
    toBlock: 'latest',
  })
  return events as EventLog[]
}
