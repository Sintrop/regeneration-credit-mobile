/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react'
import Web3, { EventLog } from 'web3'
import { bigNumberToFloat } from '@utils'
import { useSettingsContext } from '@hooks'
import { SupporterRules } from '@contracts'
import { ICommitment } from '../types'

interface ReturnUseDeclaredCommitment {
  isLoading: boolean
  commitments: ICommitment[]
  refetch: () => void;
}
export function useDeclaredCommitment(): ReturnUseDeclaredCommitment {
  const [commitments, setCommitments] = useState<ICommitment[]>([])
  const { rpc } = useSettingsContext()

  useEffect(() => {
    setCommitments([])
    handleGetEvents()
  }, [])

  async function handleGetEvents(): Promise<void> {
    const response = await getPastEvents({
      rpcUrl: rpc,
    })

    const newArray: ICommitment[] = []

    for (let i = 0; i < response.length; i++) {
      const event = response[i]
      const values = event?.returnValues
      newArray.push({
        address: values.supporterAddress as string,
        blockNumber: bigNumberToFloat(event.blockNumber as string),
        calculatorItemId: bigNumberToFloat(values.calculatorItemId as string),
      })
    }

    setCommitments(newArray)
  }

  function refetch() {
    setCommitments([]);
    handleGetEvents();
  }

  return {
    isLoading: false,
    commitments,
    refetch
  }
}

interface GetPastEventsProps {
  rpcUrl: string
}
async function getPastEvents({
  rpcUrl
}: GetPastEventsProps): Promise<EventLog[]> {
  const web3 = new Web3(rpcUrl)
  const contractAbi = SupporterRules.abi;
  const contractAddress = SupporterRules.address;

  const contract = new web3.eth.Contract(contractAbi, contractAddress)

  //@ts-ignore
  const events = await contract.getPastEvents('ReductionCommitmentDeclared', {
    fromBlock: 1400000,
    toBlock: 'latest'
  })
  return events as EventLog[]
}
