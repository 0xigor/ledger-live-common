// @flow
import { BigNumber } from "bignumber.js";
import { NotEnoughBalance, InvalidAddress, FeeTooHigh } from "@ledgerhq/errors";
import type { Transaction } from "../types";
import type { AccountBridge, CurrencyBridge } from "../../../types";
import { getFeeItems } from "../../../api/FeesBitcoin";
import { inferDeprecatedMethods } from "../../../bridge/deprecationUtils";
import {
  scanAccountsOnDevice,
  signAndBroadcast,
  startSync,
  isInvalidRecipient
} from "../../../bridge/mockHelpers";

const defaultGetFees = (a, t: *) => (t.feePerByte || BigNumber(0)).times(250);

const createTransaction = (): Transaction => ({
  family: "bitcoin",
  amount: BigNumber(0),
  recipient: "",
  feePerByte: BigNumber(10),
  networkInfo: null,
  useAllAmount: false
});

const updateTransaction = (t, patch) => ({ ...t, ...patch });

const getTransactionStatus = (account, t) => {
  const errors = {};
  const warnings = {};
  const useAllAmount = !!t.useAllAmount;

  const estimatedFees = defaultGetFees(account, t);

  const totalSpent = useAllAmount
    ? account.balance
    : BigNumber(t.amount).plus(estimatedFees);

  const amount = useAllAmount
    ? account.balance.minus(estimatedFees)
    : BigNumber(t.amount);

  if (amount.gt(0) && estimatedFees.times(10).gt(amount)) {
    warnings.feeTooHigh = new FeeTooHigh();
  }

  // Fill up transaction errors...
  if (totalSpent.gt(account.balance)) {
    errors.amount = new NotEnoughBalance();
  }

  // Fill up recipient errors...
  if (isInvalidRecipient(t.recipient)) {
    errors.recipient = new InvalidAddress("");
  }

  return Promise.resolve({
    errors,
    warnings,
    estimatedFees,
    amount,
    totalSpent,
    useAllAmount
  });
};

const prepareTransaction = async (a, t) => {
  // TODO it needs to set the fee if not in t as well
  if (!t.networkInfo) {
    const feeItems = await getFeeItems(a.currency);
    return {
      ...t,
      networkInfo: {
        family: "bitcoin",
        feeItems
      }
    };
  }
  return t;
};

const getCapabilities = () => ({
  canSync: true,
  canSend: true
});

const accountBridge: AccountBridge<Transaction> = {
  createTransaction,
  updateTransaction,
  getTransactionStatus,
  prepareTransaction,
  startSync,
  signAndBroadcast,
  getCapabilities,
  ...inferDeprecatedMethods({
    name: "BitcoinMockBridge",
    createTransaction,
    getTransactionStatus,
    prepareTransaction
  })
};

const currencyBridge: CurrencyBridge = {
  scanAccountsOnDevice
};

export default { currencyBridge, accountBridge };
