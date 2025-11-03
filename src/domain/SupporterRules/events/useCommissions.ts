/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react';
import Web3, { EventLog } from 'web3';

import { bigNumberToFloat } from '@utils';
import { useSettingsContext } from '@hooks';
import { SupporterRules } from '@contracts';
import { TxProps } from '@domain';

interface ReturnUseCommissions {
  isLoading: boolean;
  commissions: TxProps[];
}
export function useCommissions({ address }: { address: string; }): ReturnUseCommissions {
  const [commissions, setCommissions] = useState<TxProps[]>([])
  const { rpc } = useSettingsContext()

  useEffect(() => {
    setCommissions([])
    handleGetEvents()
  }, [])

  async function handleGetEvents(): Promise<void> {
    const response = await getPastEvents({
      rpcUrl: rpc,
      address
    })

    const newArray: TxProps[] = []

    for (let i = 0; i < response.length; i++) {
      const event = response[i]
      const values = event?.returnValues
      newArray.push({
        coin: 'RC',
        type: 'RECEIVE',
        blockNumber: bigNumberToFloat(event?.blockNumber as string),
        hash: event?.transactionHash ?? '',
        from: values?.supporter as string,
        to: values?.inviter as string,
        value: bigNumberToFloat(values?.amount as string)
      })
    }

    setCommissions(newArray)
  }

  return {
    isLoading: false,
    commissions
  }
}

interface GetPastEventsProps {
  rpcUrl: string;
  address: string;
}
async function getPastEvents({
  rpcUrl,
  address
}: GetPastEventsProps): Promise<EventLog[]> {
  const web3 = new Web3(rpcUrl)
  const contractAbi = SupporterRules.abi;
  const contractAddress = SupporterRules.address;

  const contract = new web3.eth.Contract(contractAbi, contractAddress)

  //@ts-ignore
  const events = await contract.getPastEvents('CommissionsPaid', {
    filter: { inviter: address },
    fromBlock: 1400000,
    toBlock: 'latest'
  })
  return events as EventLog[]
}
