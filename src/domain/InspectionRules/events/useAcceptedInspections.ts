/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react'
import Web3, { EventLog } from 'web3'
import { bigNumberToFloat } from '@utils'
import { useSettingsContext } from '@hooks'
import { InspectionRules } from '@contracts'
import { InspectionAcceptedProps } from '../types'

interface ReturnUseAcceptedInspections {
  isLoading: boolean
  acceptedInspections: InspectionAcceptedProps[];
  refetch: () => void;
}
export function useAcceptedInspections(): ReturnUseAcceptedInspections {
  const [acceptedInspections, setAcceptedInspections] = useState<InspectionAcceptedProps[]>([])
  const { rpc } = useSettingsContext()

  useEffect(() => {
    setAcceptedInspections([]);
    handleGetEvents()
  }, [])

  async function handleGetEvents(): Promise<void> {
    const response = await getPastEvents({
      rpcUrl: rpc,
    })

    const newArray: InspectionAcceptedProps[] = []

    for (let i = 0; i < response.length; i++) {
      const event = response[i]
      const values = event?.returnValues
      newArray.push({
        inspectionId: bigNumberToFloat(values?.inspectionId as string),
        blockNumber: bigNumberToFloat(event?.blockNumber as string),
        inspectorAddress: values?.inspectorAddress as string,
        acceptedAt: bigNumberToFloat(values?.acceptedAt as string)
      })
    }

    setAcceptedInspections(newArray)
  }

  function refetch() {
    setAcceptedInspections([]);
    handleGetEvents();
  }

  return {
    isLoading: false,
    acceptedInspections,
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
  const events = await contract.getPastEvents('InspectionAccepted', {
    fromBlock: 1400000,
    toBlock: 'latest',
  })
  return events as EventLog[]
}
