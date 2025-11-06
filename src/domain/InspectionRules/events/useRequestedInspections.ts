/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react'
import Web3, { EventLog } from 'web3'
import { bigNumberToFloat } from '@utils'
import { useSettingsContext } from '@hooks'
import { InspectionRules } from '@contracts'
import { RequestedInspectionProps } from '../types'

interface ReturnUseRequestedInspections {
  isLoading: boolean
  requestedInspections: RequestedInspectionProps[];
  refetch: () => void;
}
export function useRequestedInspections(): ReturnUseRequestedInspections {
  const [requestedInspections, setRequestedInspections] = useState<RequestedInspectionProps[]>([])
  const { rpc } = useSettingsContext()

  useEffect(() => {
    setRequestedInspections([]);
    handleGetEvents()
  }, [])

  async function handleGetEvents(): Promise<void> {
    const response = await getPastEvents({
      rpcUrl: rpc,
    })

    const newArray: RequestedInspectionProps[] = []

    for (let i = 0; i < response.length; i++) {
      const event = response[i]
      const values = event?.returnValues
      newArray.push({
        regeneratorAddress: values?.regeneratorAddress as string,
        inspectionId: bigNumberToFloat(values?.inspectionId as string),
        blockNumber: bigNumberToFloat(event?.blockNumber as string),
      })
    }

    setRequestedInspections(newArray)
  }

  function refetch() {
    setRequestedInspections([]);
    handleGetEvents();
  }

  return {
    isLoading: false,
    requestedInspections,
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
  const contractAbi = InspectionRules.abi;
  const contractAddress = InspectionRules.address;

  const contract = new web3.eth.Contract(contractAbi, contractAddress)

  //@ts-ignore
  const events = await contract.getPastEvents('InspectionRequested', {
    fromBlock: 1400000,
    toBlock: 'latest',
  })
  return events as EventLog[]
}
