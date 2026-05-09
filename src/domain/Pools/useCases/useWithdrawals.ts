/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react'
import Web3, { EventLog } from 'web3'
import { bigNumberToFloat } from '@utils'
import { useSettingsContext } from '@hooks'
import { RegeneratorPool, InspectorPool, ResearcherPool, DeveloperPool, ContributorPool, ActivistPool } from '@contracts'

interface PoolWithdrawalProps {
  user: string;
  era: number;
  amount: number;
  blockNumber: number;
  poolType: number;
}

interface ReturnUseWithdrawals {
  isLoading: boolean
  withdrawals: PoolWithdrawalProps[]
  refetch: () => void;
}

const poolContracts = [
  { contract: RegeneratorPool, type: 1 },
  { contract: InspectorPool, type: 2 },
  { contract: ResearcherPool, type: 3 },
  { contract: DeveloperPool, type: 4 },
  { contract: ContributorPool, type: 5 },
  { contract: ActivistPool, type: 6 },
];

export function useWithdrawals(): ReturnUseWithdrawals {
  const [withdrawals, setWithdrawals] = useState<PoolWithdrawalProps[]>([])
  const { rpc } = useSettingsContext()

  useEffect(() => {
    setWithdrawals([])
    handleGetEvents()
  }, [])

  async function handleGetEvents(): Promise<void> {
    const allWithdrawals: PoolWithdrawalProps[] = []

    for (const pool of poolContracts) {
      try {
        const events = await getPastEvents({
          rpcUrl: rpc,
          contractAbi: pool.contract.abi,
          contractAddress: pool.contract.address,
        })

        for (const event of events) {
          const values = event.returnValues
          allWithdrawals.push({
            user: values.user as string,
            era: bigNumberToFloat(values.era as string),
            amount: bigNumberToFloat(values.amount as string),
            blockNumber: bigNumberToFloat(event.blockNumber as string),
            poolType: pool.type
          })
        }
      } catch (err) {
        console.error(`[useWithdrawals] Error fetching from pool type ${pool.type}:`, err)
      }
    }

    setWithdrawals(allWithdrawals)
  }

  function refetch() {
    setWithdrawals([]);
    handleGetEvents();
  }

  return {
    isLoading: false,
    withdrawals,
    refetch
  }
}

interface GetPastEventsProps {
  rpcUrl: string;
  contractAbi: any;
  contractAddress: string;
}
async function getPastEvents({
  rpcUrl,
  contractAbi,
  contractAddress
}: GetPastEventsProps): Promise<EventLog[]> {
  const web3 = new Web3(rpcUrl)
  const contract = new web3.eth.Contract(contractAbi, contractAddress)

  // Buscar eventos desde o bloco 0 (ou um bloco razoável)
  // O bloco atual é ~2700000, então começar de 1400000 deve cobrir a maioria
  // @ts-ignore
  const events = await contract.getPastEvents('TokensWithdrawn', {
    fromBlock: 1400000,
    toBlock: 'latest'
  })
  return events as EventLog[]
}
