/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react'
import Web3, { EventLog } from 'web3'
import { bigNumberToFloat } from '@utils'
import { useSettingsContext } from '@hooks'
import { SupporterRules } from '@contracts'
import { OffsetProps } from '../types'

interface ReturnUseOffsets {
  isLoading: boolean
  offsets: OffsetProps[]
}
export function useOffsets(): ReturnUseOffsets {
  const [offsets, setOffsets] = useState<OffsetProps[]>([])
  const { rpc } = useSettingsContext()

  useEffect(() => {
    setOffsets([])
    handleGetEvents()
  }, [])

  async function handleGetEvents(): Promise<void> {
    const response = await getPastEvents({
      rpcUrl: rpc,
    })

    const newArray: OffsetProps[] = []

    for (let i = 0; i < response.length; i++) {
      const event = response[i]
      const values = event?.returnValues
      newArray.push({
        address: values.supporterAddress as string,
        amountBurned: bigNumberToFloat(values.amountBurned as string),
        blockNumber: bigNumberToFloat(event.blockNumber as string),
        calculatorItemId: bigNumberToFloat(values.calculatorItemId as string),
        message: values.message as string,
        offsetId: bigNumberToFloat(values.offsetId as string)
      })
    }

    setOffsets(newArray)
  }

  return {
    isLoading: false,
    offsets
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
  const events = await contract.getPastEvents('OffsetMade', {
    fromBlock: 0,
    toBlock: 'latest'
  })
  console.log(events)
  return events as EventLog[]
}
