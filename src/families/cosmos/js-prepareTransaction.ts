import { Account } from "../../types";
import { Transaction } from "./types";
import BigNumber from "bignumber.js";
import { simulate } from "./api/Cosmos";
import { encodePubkey } from "@cosmjs/proto-signing";
import { getEnv } from "../../env";
import { buildTransaction, postBuildTransaction } from "./js-buildTransaction";
import { getMaxEstimatedBalance } from "./logic";
import { CacheRes, makeLRUCache } from "../../cache";

export const calculateFees: CacheRes<
  Array<{
    account: Account;
    transaction: Transaction;
  }>,
  {
    estimatedFees: BigNumber;
    estimatedGas: BigNumber;
  }
> = makeLRUCache(
  async ({
    account,
    transaction,
  }): Promise<{
    estimatedFees: BigNumber;
    estimatedGas: BigNumber;
  }> => {
    return await getEstimatedFees(account, transaction);
  },
  ({ account, transaction }) =>
    `${account.id}_${account.currency.id}_${transaction.amount.toString()}_${
      transaction.recipient
    }_${String(transaction.useAllAmount)}_${transaction.mode}_${
      transaction.validators
        ? transaction.validators.map((v) => v.address).join("-")
        : ""
    }_${transaction.memo ? transaction.memo.toString() : ""}_${
      transaction.cosmosSourceValidator ? transaction.cosmosSourceValidator : ""
    }`
);

const getEstimatedFees = async (
  account: Account,
  transaction: Transaction
): Promise<any> => {
  let gasQty = new BigNumber(250000);
  const gasPrice = new BigNumber(getEnv("COSMOS_GAS_PRICE"));

  const unsignedPayload = await buildTransaction(account, transaction);

  // be sure payload is complete
  if (unsignedPayload) {
    const pubkey = encodePubkey({
      type: "tendermint/PubKeySecp256k1",
      value: Buffer.from(account.seedIdentifier, "hex").toString("base64"),
    });

    const tx_bytes = await postBuildTransaction(
      account,
      transaction,
      pubkey,
      unsignedPayload,
      new Uint8Array(Buffer.from(account.seedIdentifier, "hex"))
    );

    const gasUsed = await simulate(tx_bytes);

    if (gasUsed.gt(0)) {
      gasQty = gasUsed
        // Don't known what is going on,
        // Ledger Live Desktop return half of what it should,
        // Ledger Live Common CLI do the math correctly.
        // Use coeff 2 as trick..
        // .multipliedBy(new BigNumber(getEnv("COSMOS_GAS_AMPLIFIER")))
        .multipliedBy(new BigNumber(getEnv("COSMOS_GAS_AMPLIFIER") * 2))
        .integerValue();
    }
  }

  const estimatedGas = gasQty;

  const estimatedFees = gasPrice.multipliedBy(gasQty).integerValue();

  return { estimatedFees, estimatedGas };
};

export const prepareTransaction = async (
  account: Account,
  transaction: Transaction
): Promise<Transaction> => {
  let memo = transaction.memo;
  let amount = transaction.amount;

  if (transaction.mode !== "send" && !transaction.memo) {
    memo = "Ledger Live";
  }

  const { estimatedFees, estimatedGas } = await calculateFees({
    account,
    transaction: {
      ...transaction,
      amount: transaction.useAllAmount
        ? account.spendableBalance.minus(new BigNumber(2500))
        : amount,
      memo,
    },
  });

  if (transaction.useAllAmount) {
    amount = getMaxEstimatedBalance(account, estimatedFees);
  }

  if (
    transaction.memo !== memo ||
    !estimatedFees.eq(transaction.fees || new BigNumber(0)) ||
    !estimatedGas.eq(transaction.gas || new BigNumber(0)) ||
    !amount.eq(transaction.amount)
  ) {
    return {
      ...transaction,
      memo,
      fees: estimatedFees,
      gas: estimatedGas,
      amount,
    };
  }

  return transaction;
};

export default prepareTransaction;
