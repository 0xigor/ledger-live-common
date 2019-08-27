// @flow
import { BigNumber } from "bignumber.js";
import type { Account, Transaction, AccountBridge } from "../types";

export async function getTransactionStatus(
  bridge: AccountBridge<*>,
  account: Account,
  transaction: Transaction
): Promise<{
  showFeeWarning: boolean,
  estimatedFees: BigNumber,
  amount: BigNumber,
  totalSpent: BigNumber,
  useAllAmount: boolean,
  maxAmount: ?BigNumber
}> {
  console.warn(
    "live-common/lib/transaction: deprecated! use bridge.getTransactionStatus"
  );

  const totalSpent = await bridge.getTotalSpent(account, transaction);
  const amount = bridge.getTransactionAmount(account, transaction);
  const useAllAmount = bridge.getTransactionExtra(
    account,
    transaction,
    "useAllAmount"
  );

  let maxAmount;
  if (useAllAmount) maxAmount = await bridge.getMaxAmount(account, transaction);

  const estimatedFees = totalSpent.minus(maxAmount || amount);

  const showFeeWarning =
    (amount &&
      amount.gt(0) &&
      totalSpent
        .minus(amount)
        .times(10)
        .gt(amount)) ||
    (maxAmount &&
      maxAmount.gt(0) &&
      totalSpent
        .minus(maxAmount)
        .times(10)
        .gt(maxAmount)) ||
    false;

  return {
    showFeeWarning,
    totalSpent,
    amount,
    estimatedFees,
    useAllAmount,
    maxAmount
  };
}
