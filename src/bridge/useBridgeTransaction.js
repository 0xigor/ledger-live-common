// @flow

import { BigNumber } from "bignumber.js";
import { useEffect, useReducer, useCallback } from "react";
import type {
  Transaction,
  TransactionStatus,
  Account,
  AccountLike
} from "../types";
import { getAccountBridge } from ".";
import { getMainAccount } from "../account";

export type State = {
  account: ?AccountLike,
  parentAccount: ?Account,
  transaction: ?Transaction,
  status: TransactionStatus,
  statusOnTransaction: ?Transaction,
  errorAccount: ?Error,
  errorStatus: ?Error
};

export type Result = {
  transaction: ?Transaction,
  setTransaction: Transaction => void,
  account: ?AccountLike,
  parentAccount: ?Account,
  setAccount: (AccountLike, ?Account) => void,
  status: TransactionStatus,
  bridgeError: ?Error,
  bridgePending: boolean
};

const initial: State = {
  account: null,
  parentAccount: null,
  transaction: null,
  status: {
    errors: {},
    warnings: {},
    estimatedFees: BigNumber(0),
    amount: BigNumber(0),
    totalSpent: BigNumber(0)
  },
  statusOnTransaction: null,
  errorAccount: null,
  errorStatus: null
};

const reducer = (s, a) => {
  switch (a.type) {
    case "setAccount":
      const { account, parentAccount } = a;
      try {
        const mainAccount = getMainAccount(account, parentAccount);
        const bridge = getAccountBridge(account, parentAccount);
        const subAccountId = account.type !== "Account" && account.id;
        let t = bridge.createTransaction(mainAccount);
        if (subAccountId) {
          t = { ...t, subAccountId };
        }
        return {
          ...initial,
          account,
          parentAccount,
          transaction: t
        };
      } catch (e) {
        return {
          ...initial,
          account,
          parentAccount,
          errorAccount: e
        };
      }

    case "setTransaction":
      if (s.transaction === a.transaction) return s;
      return { ...s, transaction: a.transaction };

    case "onStatus":
      // if (a.transaction === s.transaction && !s.errorStatus) {
      //   return s;
      // }
      return {
        ...s,
        errorStatus: null,
        transaction: a.transaction,
        status: a.status,
        statusOnTransaction: a.transaction
      };

    case "onStatusError":
      if (a.error === s.errorStatus) return s;
      return {
        ...s,
        errorStatus: a.error
      };

    default:
      return s;
  }
};

export default (): Result => {
  const [
    {
      account,
      parentAccount,
      transaction,
      status,
      statusOnTransaction,
      errorAccount,
      errorStatus
    },
    dispatch
  ] = useReducer(reducer, initial);

  const setAccount = useCallback(
    (account, parentAccount) =>
      dispatch({ type: "setAccount", account, parentAccount }),
    [dispatch]
  );

  const setTransaction = useCallback(
    transaction => dispatch({ type: "setTransaction", transaction }),
    [dispatch]
  );

  const mainAccount = account ? getMainAccount(account, parentAccount) : null;

  // when transaction changes, prepare the transaction
  useEffect(() => {
    let ignore = false;
    if (mainAccount && transaction) {
      Promise.resolve()
        .then(() => getAccountBridge(mainAccount, null))
        .then(async bridge => {
          const preparedTransaction = await bridge.prepareTransaction(
            mainAccount,
            transaction
          );
          const status = await bridge.getTransactionStatus(
            mainAccount,
            preparedTransaction
          );

          return {
            preparedTransaction,
            status
          };
        })
        .then(
          ({ preparedTransaction, status }) => {
            if (ignore) return;
            dispatch({
              type: "onStatus",
              status,
              transaction: preparedTransaction
            });
          },
          e => {
            if (ignore) return;
            dispatch({ type: "onStatusError", error: e });
          }
        );
    }
    return () => {
      ignore = true;
    };
  }, [transaction, mainAccount, dispatch]);

  return {
    transaction,
    setTransaction,
    status,
    account,
    parentAccount,
    setAccount,
    bridgeError: errorAccount || errorStatus,
    bridgePending: transaction !== statusOnTransaction
  };
};
