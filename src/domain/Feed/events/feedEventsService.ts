import { InvitationRules, RCMarket, RegenerationCredit, RegeneratorRules, SupporterRules } from "@contracts";

import { fetchEvents, toNumber } from "./fetchEvents";
import { InvitationEvent, MarketOfferEvent, RegeneratorEnteredPoolEvent, TreeFundingEvent } from "./types";

const WEI = 10 ** 18;

interface TransactionLog {
  transactionHash?: string;
}

/** Certifications not emitted in the same transaction as an OffsetMade log. */
export function excludeOffsetBurns<T extends TransactionLog>(certified: T[], offsets: TransactionLog[]): T[] {
  const offsetTransactions = new Set(offsets.map(event => event.transactionHash));
  return certified.filter(event => !offsetTransactions.has(event.transactionHash));
}

/** InvitationRules.UserInvited: one per successful invite transaction. */
async function getInvitations(rpc: string): Promise<InvitationEvent[]> {
  const events = await fetchEvents(rpc, InvitationRules, "UserInvited");
  return events.map(event => ({
    inviter: String(event.returnValues.inviter),
    invited: String(event.returnValues.invited),
    invitedType: toNumber(event.returnValues.invitedType),
    blockNumber: toNumber(event.returnValues.blockNumber ?? event.blockNumber),
    logIndex: toNumber(event.logIndex),
  }));
}

/**
 * RegenerationCredit.TokensCertified that did not come from SupporterRules.offset:
 * direct burns made through "fund tree planting". Offsets burn through the same
 * function, so they are told apart by the OffsetMade log in the same transaction.
 */
async function getTreeFundings(rpc: string): Promise<TreeFundingEvent[]> {
  const [certified, offsets] = await Promise.all([
    fetchEvents(rpc, RegenerationCredit, "TokensCertified"),
    fetchEvents(rpc, SupporterRules, "OffsetMade"),
  ]);
  return excludeOffsetBurns(certified, offsets)
    .map(event => ({
      account: String(event.returnValues.account),
      amount: toNumber(event.returnValues.amount) / WEI,
      certifiedTotal: toNumber(event.returnValues.newAccountCertifiedTotal) / WEI,
      blockNumber: toNumber(event.blockNumber),
      logIndex: toNumber(event.logIndex),
    }));
}

/** RegeneratorRules.RegeneratorEnteredPool: emitted when a regenerator reaches the minimum inspections and starts earning. */
async function getRegeneratorsEnteredPool(rpc: string): Promise<RegeneratorEnteredPoolEvent[]> {
  const events = await fetchEvents(rpc, RegeneratorRules, "RegeneratorEnteredPool");
  return events.map(event => ({
    address: String(event.returnValues.regeneratorAddress),
    blockNumber: toNumber(event.returnValues.blockNumber ?? event.blockNumber),
    logIndex: toNumber(event.logIndex),
  }));
}

/** RCMarket.OfferCreated. */
async function getMarketOffers(rpc: string): Promise<MarketOfferEvent[]> {
  const events = await fetchEvents(rpc, RCMarket, "OfferCreated");
  return events.map(event => ({
    offerId: toNumber(event.returnValues.offerId),
    seller: String(event.returnValues.seller),
    amountRC: toNumber(event.returnValues.amountRC),
    unitPrice: String(event.returnValues.unitPrice),
    blockNumber: toNumber(event.blockNumber),
    logIndex: toNumber(event.logIndex),
  }));
}

export const feedEventsService = {
  getInvitations,
  getTreeFundings,
  getRegeneratorsEnteredPool,
  getMarketOffers,
};

