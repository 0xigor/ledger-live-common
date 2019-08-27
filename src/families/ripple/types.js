// @flow

import type { BigNumber } from "bignumber.js";
import type { Unit } from "../../types";
import type {
  TransactionCommon,
  TransactionCommonRaw
} from "../../types/transaction";
import type { CoreAmount, CoreBigInt, Spec } from "../../libcore/types";

declare class CoreRippleLikeAddress {
  toBase58(): Promise<string>;
}

declare class CoreRippleLikeTransaction {
  getHash(): Promise<string>;
  getFees(): Promise<CoreAmount>;
  getReceiver(): Promise<CoreRippleLikeAddress>;
  getSender(): Promise<CoreRippleLikeAddress>;
  serialize(): Promise<string>;
  setSignature(string, string): Promise<void>;
  setDERSignature(string): Promise<void>;
}

declare class CoreRippleLikeOperation {
  getTransaction(): Promise<CoreRippleLikeTransaction>;
}

declare class CoreRippleLikeTransactionBuilder {
  wipeToAddress(address: string): Promise<void>;
  sendToAddress(amount: CoreAmount, recipient: string): Promise<void>;
  setFees(fees: CoreAmount): Promise<void>;
  build(): Promise<CoreRippleLikeTransaction>;
}

declare class CoreRippleLikeAccount {
  buildTransaction(): Promise<CoreRippleLikeTransactionBuilder>;
  broadcastRawTransaction(signed: string): Promise<string>;
  getFees(): Promise<CoreAmount>;
  getBaseReserve(): Promise<CoreAmount>;
}

export type CoreStatics = {
  RippleLikeOperation: Class<CoreRippleLikeOperation>,
  RippleLikeAddress: Class<CoreRippleLikeAddress>,
  RippleLikeTransaction: Class<CoreRippleLikeTransaction>,
  RippleLikeAccount: Class<CoreRippleLikeAccount>,
  RippleLikeTransactionBuilder: Class<CoreRippleLikeTransactionBuilder>,
  RippleLikeTransaction: Class<CoreRippleLikeTransaction>
};

export type {
  CoreRippleLikeAccount,
  CoreRippleLikeAddress,
  CoreRippleLikeOperation,
  CoreRippleLikeTransaction,
  CoreRippleLikeTransactionBuilder
};

export type CoreAccountSpecifics = {
  asRippleLikeAccount(): Promise<CoreRippleLikeAccount>
};

export type CoreOperationSpecifics = {
  asRippleLikeOperation(): Promise<CoreRippleLikeOperation>
};

export type CoreCurrencySpecifics = {};

export type Transaction = {|
  ...TransactionCommon,
  family: "ripple",
  fee: ?BigNumber,
  networkInfo: ?{ serverFee: BigNumber },
  tag: ?number,
  feeCustomUnit: ?Unit
|};

export type TransactionRaw = {|
  ...TransactionCommonRaw,
  family: "ripple",
  fee: ?string,
  networkInfo: ?{ serverFee: string },
  tag: ?number,
  feeCustomUnit: ?Unit
|};

export const reflect = (declare: (string, Spec) => void) => {
  declare("RippleLikeAddress", {
    methods: {
      toBase58: {}
    }
  });

  declare("RippleLikeOperation", {
    methods: {
      getTransaction: {
        returns: "RippleLikeTransaction"
      }
    }
  });

  declare("RippleLikeTransaction", {
    methods: {
      getHash: {},
      getFees: { returns: "Amount" },
      getReceiver: { returns: "RippleLikeAddress" },
      getSender: { returns: "RippleLikeAddress" },
      serialize: { returns: "hex" },
      setSignature: {
        params: ["hex", "hex"]
      },
      setDERSignature: {
        params: ["hex"]
      }
    }
  });

  declare("RippleLikeTransactionBuilder", {
    methods: {
      wipeToAddress: {},
      sendToAddress: {
        params: ["Amount"]
      },
      setFees: {
        params: ["Amount"]
      },
      build: {
        returns: "RippleLikeTransaction"
      }
    }
  });

  declare("RippleLikeAccount", {
    methods: {
      buildTransaction: {
        returns: "RippleLikeTransactionBuilder"
      },
      broadcastRawTransaction: {
        params: ["hex"]
      },
      getFees: {
        returns: "Amount"
      },
      getBaseReserve: {
        returns: "Amount"
      }
    }
  });
};
