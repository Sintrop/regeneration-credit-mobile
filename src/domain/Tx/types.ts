export interface TxProps {
  type: 'RECEIVE' | 'TRANSFER'
  coin: 'RC' | 'SIN';
  value: number;
  from: string;
  to: string;
  hash: string;
  blockNumber: number;
  kind?: "receive" | "send" | "poolWithdraw" | "burn";
  poolType?: number;
}

export interface TransferEventProps {
  from: string;
  to: string;
  value: string;
}

export interface TransferProps {
  from: string;
  to: string;
  value: number;
}