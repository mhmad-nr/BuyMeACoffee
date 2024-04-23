export type memo = {
  id: string;
  to: string;
  from: string;
  timestamp: number;
  message: string;
  name: string;
  blockTimestamp: string;
  blockNumber: string;
  amount: string;
};
export enum ContractError {
  SenderShouldBeAnotherAddress = "BuyMeACoffe__SenderShouldBeAnotherAddress",
  SignedUpBefore = "BuyMeACoffe__SignedUpBefore",
  NotSignedUpBefore = "BuyMeACoffe__NotSignedUpBefore",
  BalanceIsZero = "BuyMeACoffe__BalanceIsZero",
  OnlyOwner = "BuyMeACoffe__OnlyOwner",
  ValueMustBeMoreThanOneGwei = "BuyMeACoffe__ValueMustBeMoreThanOneGwei",
  TransferFaild = "BuyMeACoffe__TransferFaild",
}
