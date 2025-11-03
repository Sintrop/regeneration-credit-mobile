import { useEffect, useState } from 'react'
import Web3, { EventLog } from 'web3'

import { bigNumberToFloat } from '@utils'
import { useSettingsContext } from '@hooks'
import { CommunityRules } from '@contracts'

import { UserRegisteredProps } from '../types'

interface ReturnUseUserRegistered {
  isLoading: boolean;
  usersRegistered: UserRegisteredProps[];
  refetch: () => void;
}
export function useUserRegistered(): ReturnUseUserRegistered {
  const [usersRegistered, setUsersRegistered] = useState<UserRegisteredProps[]>([])
  const { rpc } = useSettingsContext()

  useEffect(() => {
    setUsersRegistered([])
    handleGetEvents()
  }, [])

  async function handleGetEvents(): Promise<void> {
    const response = await getPastEvents({
      rpcUrl: rpc,
    })

    const newArray: UserRegisteredProps[] = []

    for (let i = 0; i < response.length; i++) {
      const event = response[i]
      const values = event?.returnValues
      newArray.push({
        address: values?.addr as string,
        userType: bigNumberToFloat(values?.userType as string),
        blockNumber: bigNumberToFloat(event?.blockNumber as string),
        id: parseInt(event.id ?? '0')
      })
    }

    setUsersRegistered(newArray)
  }

  function refetch() {
    setUsersRegistered([]);
    handleGetEvents();
  }

  return {
    isLoading: false,
    usersRegistered,
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
  const contractAbi = CommunityRules.abi;
  const contractAddress = CommunityRules.address;

  const contract = new web3.eth.Contract(contractAbi, contractAddress)

  //@ts-ignore
  const events = await contract.getPastEvents('UserRegistered', {
    fromBlock: 0,
    toBlock: 'latest',
  })
  return events as EventLog[]
}
