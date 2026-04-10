import Web3 from "web3";
import RCMarket from "../../contracts/RCMarket.json";

const RPC_URL = "https://rpc.sintrop.com";

export function getRCMarketContract() {
  const provider = new Web3(new Web3.providers.HttpProvider(RPC_URL));
  return new provider.eth.Contract(RCMarket.abi, RCMarket.address);
}

export interface Offer {
  id: number;
  seller: string;
  amountRC: string;
  unitPrice: string;
  paymentMethod: string;
  description: string;
  active: boolean;
  createdAt: number;
  buyer: string;
  completedAt: number;
}

interface RCMarketContractProps {
  rpc: string;
}

export async function getOffersCount({ rpc }: RCMarketContractProps): Promise<number> {
  const provider = new Web3(new Web3.providers.HttpProvider(rpc));
  const contract = new provider.eth.Contract(RCMarket.abi, RCMarket.address);
  
  const count = await contract.methods.getOffersCount().call() as number;
  return Number(count);
}

export async function getOffer({ rpc, offerId }: { rpc: string; offerId: number }): Promise<Offer> {
  const provider = new Web3(new Web3.providers.HttpProvider(rpc));
  const contract = new provider.eth.Contract(RCMarket.abi, RCMarket.address);
  
  const offer = await contract.methods.getOffer(offerId).call() as any;
  
  return {
    id: Number(offer.id),
    seller: offer.seller,
    amountRC: offer.amountRC,
    unitPrice: offer.unitPrice,
    paymentMethod: offer.paymentMethod,
    description: offer.description,
    active: offer.active,
    createdAt: Number(offer.createdAt),
    buyer: offer.buyer,
    completedAt: Number(offer.completedAt),
  };
}

export async function getSellerOfferIds({ rpc, seller }: { rpc: string; seller: string }): Promise<number[]> {
  const provider = new Web3(new Web3.providers.HttpProvider(rpc));
  const contract = new provider.eth.Contract(RCMarket.abi, RCMarket.address);
  
  const ids = await contract.methods.getSellerOfferIds(seller).call() as string[];
  return ids.map(id => Number(id));
}

export async function getSellerSalesCount({ rpc, seller }: { rpc: string; seller: string }): Promise<number> {
  const provider = new Web3(new Web3.providers.HttpProvider(rpc));
  const contract = new provider.eth.Contract(RCMarket.abi, RCMarket.address);
  
  const count = await contract.methods.getSellerSalesCount(seller).call() as number;
  return Number(count);
}