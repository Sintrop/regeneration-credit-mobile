export interface SupporterContractProps {
  id: string;
  supporterWallet: string;
  name: string;
  description: string;
  profilePhoto: string;
  offsetsCount: string;
  reductionItemsCount: string;
  createdAt: string;
}

export interface SupporterProps {
  id: number;
  address: string;
  name: string;
  description: string;
  profilePhoto: string;
  offsetsCount: number;
  reductionItemsCount: number;
  createdAt: number;
}

export interface OffsetContractProps {
  supporterAddress: string;
  createdAt: string;
  amountBurn: string;
  calculatorItemId: string;
  message: string;
}

export interface OffsetEventProps {
  supporterAddress: string;
  offsetId: string;
  amountBurned: string;
  calculatorItemId: string;
  blockNumber: string;
  message: string;
}

export interface OffsetProps {
  address: string;
  offsetId: number;
  amountBurned: number;
  calculatorItemId: number;
  blockNumber: number;
  message: string;
}