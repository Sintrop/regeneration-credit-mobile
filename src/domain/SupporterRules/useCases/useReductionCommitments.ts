import { useState, useEffect } from "react";
import Web3 from "web3";

import { SupporterRules, ResearcherRules } from "@contracts";
import { rcImpactContract } from "@domain/RegenerationCreditImpact/rcImpactContract";

const RPC_URL = 'https://rpc.sintrop.com';

export function useReductionCommitments(address?: string) {
  const [commitments, setCommitments] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log('[useReductionCommitments] address:', address);
    
    if (!address) {
      setCommitments([]);
      setIsLoading(false);
      return;
    }

    const web3 = new Web3(RPC_URL);
    const supporterContract = new web3.eth.Contract(SupporterRules.abi as any, SupporterRules.address);
    const researcherContract = new web3.eth.Contract(ResearcherRules.abi as any, ResearcherRules.address);

    async function fetchCommitments() {
      try {
        console.log('[useReductionCommitments] Calling getReductionCommitments for:', address);
        
        // Step 1: Get commitment IDs from SupporterRules
        const result: any = await supporterContract.methods.getReductionCommitments(address).call();
        
        console.log('[useReductionCommitments] Raw result:', result);
        
        // Handle different return types
        let idArray: number[] = [];
        if (Array.isArray(result)) {
          idArray = result.map((id: any) => Number(id)).filter((id: number) => !isNaN(id) && id > 0);
        } else if (result && typeof result === 'object') {
          // If result has a nested array
          const values = Object.values(result).filter((v: any) => typeof v === 'number');
          idArray = values.map((v: any) => Number(v)).filter((id: number) => !isNaN(id) && id > 0);
        }
        
        console.log('[useReductionCommitments] Commitment IDs:', idArray);
        setCommitments(idArray);
      } catch (err: any) {
        console.error('[useReductionCommitments] Error:', err.message || err);
        setError(err.message || 'Unknown error');
        setCommitments([]);
      } finally {
        setIsLoading(false);
      }
    }

    fetchCommitments();
  }, [address]);

  console.log('[useReductionCommitments] Returning:', { commitments, isLoading, error });

  return { commitments, isLoading, error };
}

export function useCalculatorItemById(itemId: number, supporterAddress?: string) {
  const [item, setItem] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!itemId || itemId <= 0) {
      setItem(null);
      setIsLoading(false);
      return;
    }

    const web3 = new Web3(RPC_URL);
    const researcherContract = new web3.eth.Contract(ResearcherRules.abi as any, ResearcherRules.address);
    const supporterContract = new web3.eth.Contract(SupporterRules.abi as any, SupporterRules.address);

    async function fetchItem() {
      try {
        // Convert to uint64
        const itemIdBN = BigInt(itemId);
        
        // Fetch calculator item details
        const result: any = await researcherContract.methods.calculatorItems(itemIdBN).call();
        console.log('[useGetCalculatorItem] Raw result:', result);
        
        let tokensCompensated = 0;
        let totalImpact = 0;
        let carbonPerToken = 0;
        
        // If supporter address provided, fetch tokens compensated for this item
        if (supporterAddress) {
          try {
            const tokensResult: any = await supporterContract.methods.calculatorItemCertificates(supporterAddress, itemIdBN).call();
            tokensCompensated = Number(tokensResult) / 1e18; // Convert from wei
            
            // Fetch carbon impact per token (98.295g CO2 per token)
            const carbonResult: any = await rcImpactContract.carbonPerToken({ rpc: RPC_URL });
            carbonPerToken = Number(carbonResult) / 1e18; // Convert from wei
            
            // Calculate total impact: tokens * carbon per token
            totalImpact = tokensCompensated * carbonPerToken;
            
            console.log('[useGetCalculatorItem] Tokens compensated:', tokensCompensated);
            console.log('[useGetCalculatorItem] Carbon per token:', carbonPerToken);
            console.log('[useGetCalculatorItem] Total impact:', totalImpact);
          } catch (err) {
            console.error('[useGetCalculatorItem] Error fetching tokens:', err);
          }
        }
        
        if (result && result.id && Number(result.id) > 0) {
          setItem({
            id: Number(result.id),
            item: result.item,
            unit: result.unit,
            carbonImpact: result.carbonImpact,
            tokensCompensated,
            totalImpact,
          });
        } else {
          setItem(null);
        }
      } catch (err) {
        console.error('[useGetCalculatorItem] Error:', err);
        setItem(null);
      } finally {
        setIsLoading(false);
      }
    }

    fetchItem();
  }, [itemId, supporterAddress]);

  return { item, isLoading };
}