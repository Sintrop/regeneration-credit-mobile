/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react'
import Web3, { EventLog } from 'web3'
import { bigNumberToFloat } from '@utils'
import { useSettingsContext } from '@hooks'
import { DeveloperRules } from '@contracts'
import { ReportAdded } from '../types'

interface ReturnUseReportAdded {
  isLoading: boolean
  reports: ReportAdded[]
}
export function useReportAdded(): ReturnUseReportAdded {
  const [reports, setReports] = useState<ReportAdded[]>([])
  const { rpc } = useSettingsContext()

  useEffect(() => {
    setReports([])
    handleGetEvents()
  }, [])

  async function handleGetEvents(): Promise<void> {
    const response = await getPastEvents({
      rpcUrl: rpc,
    })

    const newArray: ReportAdded[] = []

    for (let i = 0; i < response.length; i++) {
      const event = response[i]
      const values = event?.returnValues
      newArray.push({
        address: values.developerAddress as string,
        createdAt: bigNumberToFloat(event.blockNumber as string),
        id: bigNumberToFloat(values.id as string),
        description: values.description as string,
      })
    }

    setReports(newArray)
  }

  return {
    isLoading: false,
    reports
  }
}

interface GetPastEventsProps {
  rpcUrl: string
}
async function getPastEvents({
  rpcUrl
}: GetPastEventsProps): Promise<EventLog[]> {
  const web3 = new Web3(rpcUrl)
  const contractAbi = DeveloperRules.abi;
  const contractAddress = DeveloperRules.address;

  const contract = new web3.eth.Contract(contractAbi, contractAddress)

  //@ts-ignore
  const events = await contract.getPastEvents('ReportAdded', {
    fromBlock: 0,
    toBlock: 'latest'
  })
  return events as EventLog[]
}
