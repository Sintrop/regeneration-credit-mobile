/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react'
import Web3, { EventLog } from 'web3'
import { bigNumberToFloat } from '@utils'
import { useSettingsContext } from '@hooks'
import { ContributorRules } from '@contracts'
import { ContributionAddedProps } from '../types'

interface ReturnUseContributionAdded {
  isLoading: boolean;
  contributions: ContributionAddedProps[];
  refetch: () => void;
}
export function useContributionAdded(): ReturnUseContributionAdded {
  const [contributions, setContributions] = useState<ContributionAddedProps[]>([])
  const { rpc } = useSettingsContext()

  useEffect(() => {
    setContributions([])
    handleGetEvents()
  }, [])

  async function handleGetEvents(): Promise<void> {
    const response = await getPastEvents({
      rpcUrl: rpc,
    })

    const newArray: ContributionAddedProps[] = []

    for (let i = 0; i < response.length; i++) {
      const event = response[i]
      const values = event?.returnValues
      newArray.push({
        address: values.contributorAddress as string,
        blockNumber: bigNumberToFloat(event.blockNumber as string),
        id: bigNumberToFloat(values.id as string),
        description: values.description as string
      })
    }

    setContributions(newArray)
  }

  function refetch() {
    setContributions([]);
    handleGetEvents();
  }

  return {
    isLoading: false,
    contributions,
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
  const contractAbi = ContributorRules.abi;
  const contractAddress = ContributorRules.address;

  const contract = new web3.eth.Contract(contractAbi, contractAddress)

  //@ts-ignore
  const events = await contract.getPastEvents('ContributionAdded', {
    fromBlock: 0,
    toBlock: 'latest'
  })
  return events as EventLog[]
}
