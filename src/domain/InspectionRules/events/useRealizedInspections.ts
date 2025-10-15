/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react'
import Web3, { EventLog } from 'web3'
import { bigNumberToFloat } from '@utils'
import { useSettingsContext } from '@hooks'
import { InspectionRules } from '@contracts'
import { InspectionRealizedProps } from '../types'

interface ReturnUseRealizedInspecitions {
  isLoading: boolean
  realizedInspections: InspectionRealizedProps[]
}
export function useRealizedInspections(): ReturnUseRealizedInspecitions {
  const [realizedInspections, setRealizedInspections] = useState<InspectionRealizedProps[]>([])
  const { rpc } = useSettingsContext()

  useEffect(() => {
    setRealizedInspections([])
    handleGetEvents()
  }, [])

  async function handleGetEvents(): Promise<void> {
    const response = await getPastEvents({
      rpcUrl: rpc,
    })

    const newArray: InspectionRealizedProps[] = []

    for (let i = 0; i < response.length; i++) {
      const event = response[i]
      const values = event?.returnValues
      newArray.push({
        regeneratorAddress: values?.regeneratorAddress as string,
        inspectionId: bigNumberToFloat(values?.inspectionId as string),
        blockNumber: bigNumberToFloat(event?.blockNumber as string),
        biodiversityResult: bigNumberToFloat(values?.biodiversityResult as string),
        inspectorAddress: values?.inspectorAddress as string,
        inspectedAt: bigNumberToFloat(values?.inspectedAt as string),
        regenerationScore: bigNumberToFloat(values?.regenerationScore as string),
        treesResult: bigNumberToFloat(values?.treesResult as string),
      })
    }

    setRealizedInspections(newArray)
  }

  return {
    isLoading: false,
    realizedInspections
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
  const events = await contract.getPastEvents('InspectionRealized', {
    fromBlock: 0,
    toBlock: 'latest',
  })
  return events as EventLog[]
}
