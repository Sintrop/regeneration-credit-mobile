/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react'
import Web3, { EventLog } from 'web3'
import { bigNumberToFloat } from '@utils'
import { useSettingsContext } from '@hooks'
import { ResearcherRules } from '@contracts'
import { ResearchPublishedProps } from '../types'

interface ReturnUseResearchsPublished {
  isLoading: boolean
  researchs: ResearchPublishedProps[]
}
export function useResearchsPublished(): ReturnUseResearchsPublished {
  const [researchs, setResearchs] = useState<ResearchPublishedProps[]>([])
  const { rpc } = useSettingsContext()

  useEffect(() => {
    setResearchs([])
    handleGetEvents()
  }, [])

  async function handleGetEvents(): Promise<void> {
    const response = await getPastEvents({
      rpcUrl: rpc,
    })

    const newArray: ResearchPublishedProps[] = []

    for (let i = 0; i < response.length; i++) {
      const event = response[i]
      const values = event?.returnValues
      newArray.push({
        researcher: values.researcher as string,
        publishedAt: bigNumberToFloat(event.blockNumber as string),
        researchId: bigNumberToFloat(values.researchId as string),
      })
    }

    setResearchs(newArray)
  }

  return {
    isLoading: false,
    researchs
  }
}

interface GetPastEventsProps {
  rpcUrl: string
}
async function getPastEvents({
  rpcUrl
}: GetPastEventsProps): Promise<EventLog[]> {
  const web3 = new Web3(rpcUrl)
  const contractAbi = ResearcherRules.abi;
  const contractAddress = ResearcherRules.address;

  const contract = new web3.eth.Contract(contractAbi, contractAddress)

  //@ts-ignore
  const events = await contract.getPastEvents('ResearchPublished', {
    fromBlock: 0,
    toBlock: 'latest'
  })
  return events as EventLog[]
}
