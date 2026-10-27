export interface InvitationEvent {
  inviter: string;
  invited: string;
  invitedType: number;
  blockNumber: number;
  logIndex: number;
}

export interface TreeFundingEvent {
  account: string;
  amount: number;
  certifiedTotal: number;
  blockNumber: number;
  logIndex: number;
}

export interface RegeneratorEnteredPoolEvent {
  address: string;
  blockNumber: number;
  logIndex: number;
}

export interface MarketOfferEvent {
  offerId: number;
  seller: string;
  amountRC: number;
  unitPrice: string;
  blockNumber: number;
  logIndex: number;
}
