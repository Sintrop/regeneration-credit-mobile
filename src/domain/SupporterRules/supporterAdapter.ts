import { bigNumberToFloat } from "@utils";
import { OffsetContractProps, OffsetProps, SupporterContractProps, SupporterProps } from "./types";

function parseSupporter(data: SupporterContractProps): SupporterProps {
  return {
    id: bigNumberToFloat(data?.id),
    address: data?.supporterWallet,
    createdAt: bigNumberToFloat(data?.createdAt),
    description: data?.description,
    name: data?.name,
    offsetsCount: bigNumberToFloat(data?.offsetsCount),
    profilePhoto: data?.profilePhoto,
    reductionItemsCount: bigNumberToFloat(data?.reductionItemsCount)
  }
}

function parseOffsetContract(data: OffsetContractProps): OffsetProps {
  return {
    address: data?.supporterAddress,
    amountBurned: bigNumberToFloat(data?.amountBurn),
    blockNumber: bigNumberToFloat(data?.createdAt),
    calculatorItemId: bigNumberToFloat(data?.calculatorItemId),
    message: data?.message,
    offsetId: 0
  }
}

export const supporterAdapter = {
  parseSupporter,
  parseOffsetContract
}
