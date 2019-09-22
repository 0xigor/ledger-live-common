// @flow
import { reflect as bitcoinReflect } from "../families/bitcoin/types";
import type { CoreStatics as CoreStatics_bitcoin } from "../families/bitcoin/types";
import type { CoreAccountSpecifics as CoreAccountSpecifics_bitcoin } from "../families/bitcoin/types";
import type { CoreOperationSpecifics as CoreOperationSpecifics_bitcoin } from "../families/bitcoin/types";
import type { CoreCurrencySpecifics as CoreCurrencySpecifics_bitcoin } from "../families/bitcoin/types";
import type { Transaction as bitcoinTransaction } from "../families/bitcoin/types";
import type { TransactionRaw as bitcoinTransactionRaw } from "../families/bitcoin/types";
import type { NetworkInfo as bitcoinNetworkInfo } from "../families/bitcoin/types";
import type { NetworkInfoRaw as bitcoinNetworkInfoRaw } from "../families/bitcoin/types";
import { reflect as ethereumReflect } from "../families/ethereum/types";
import type { CoreStatics as CoreStatics_ethereum } from "../families/ethereum/types";
import type { CoreAccountSpecifics as CoreAccountSpecifics_ethereum } from "../families/ethereum/types";
import type { CoreOperationSpecifics as CoreOperationSpecifics_ethereum } from "../families/ethereum/types";
import type { CoreCurrencySpecifics as CoreCurrencySpecifics_ethereum } from "../families/ethereum/types";
import type { Transaction as ethereumTransaction } from "../families/ethereum/types";
import type { TransactionRaw as ethereumTransactionRaw } from "../families/ethereum/types";
import type { NetworkInfo as ethereumNetworkInfo } from "../families/ethereum/types";
import type { NetworkInfoRaw as ethereumNetworkInfoRaw } from "../families/ethereum/types";
import { reflect as rippleReflect } from "../families/ripple/types";
import type { CoreStatics as CoreStatics_ripple } from "../families/ripple/types";
import type { CoreAccountSpecifics as CoreAccountSpecifics_ripple } from "../families/ripple/types";
import type { CoreOperationSpecifics as CoreOperationSpecifics_ripple } from "../families/ripple/types";
import type { CoreCurrencySpecifics as CoreCurrencySpecifics_ripple } from "../families/ripple/types";
import type { Transaction as rippleTransaction } from "../families/ripple/types";
import type { TransactionRaw as rippleTransactionRaw } from "../families/ripple/types";
import type { NetworkInfo as rippleNetworkInfo } from "../families/ripple/types";
import type { NetworkInfoRaw as rippleNetworkInfoRaw } from "../families/ripple/types";
import { reflect as tezosReflect } from "../families/tezos/types";
import type { CoreStatics as CoreStatics_tezos } from "../families/tezos/types";
import type { CoreAccountSpecifics as CoreAccountSpecifics_tezos } from "../families/tezos/types";
import type { CoreOperationSpecifics as CoreOperationSpecifics_tezos } from "../families/tezos/types";
import type { CoreCurrencySpecifics as CoreCurrencySpecifics_tezos } from "../families/tezos/types";
import type { Transaction as tezosTransaction } from "../families/tezos/types";
import type { TransactionRaw as tezosTransactionRaw } from "../families/tezos/types";
import type { NetworkInfo as tezosNetworkInfo } from "../families/tezos/types";
import type { NetworkInfoRaw as tezosNetworkInfoRaw } from "../families/tezos/types";
import { reflect as tronReflect } from "../families/tron/types";
import type { CoreStatics as CoreStatics_tron } from "../families/tron/types";
import type { CoreAccountSpecifics as CoreAccountSpecifics_tron } from "../families/tron/types";
import type { CoreOperationSpecifics as CoreOperationSpecifics_tron } from "../families/tron/types";
import type { CoreCurrencySpecifics as CoreCurrencySpecifics_tron } from "../families/tron/types";
import type { Transaction as tronTransaction } from "../families/tron/types";
import type { TransactionRaw as tronTransactionRaw } from "../families/tron/types";
import type { NetworkInfo as tronNetworkInfo } from "../families/tron/types";
import type { NetworkInfoRaw as tronNetworkInfoRaw } from "../families/tron/types";

export type SpecificStatics = {}
& CoreStatics_bitcoin
& CoreStatics_ethereum
& CoreStatics_ripple
& CoreStatics_tezos
& CoreStatics_tron
export type CoreAccountSpecifics = {}
& CoreAccountSpecifics_bitcoin
& CoreAccountSpecifics_ethereum
& CoreAccountSpecifics_ripple
& CoreAccountSpecifics_tezos
& CoreAccountSpecifics_tron
export type CoreOperationSpecifics = {}
& CoreOperationSpecifics_bitcoin
& CoreOperationSpecifics_ethereum
& CoreOperationSpecifics_ripple
& CoreOperationSpecifics_tezos
& CoreOperationSpecifics_tron
export type CoreCurrencySpecifics = {}
& CoreCurrencySpecifics_bitcoin
& CoreCurrencySpecifics_ethereum
& CoreCurrencySpecifics_ripple
& CoreCurrencySpecifics_tezos
& CoreCurrencySpecifics_tron
export type Transaction =
  | bitcoinTransaction
  | ethereumTransaction
  | rippleTransaction
  | tezosTransaction
  | tronTransaction
export type TransactionRaw =
  | bitcoinTransactionRaw
  | ethereumTransactionRaw
  | rippleTransactionRaw
  | tezosTransactionRaw
  | tronTransactionRaw
export type NetworkInfo =
  | bitcoinNetworkInfo
  | ethereumNetworkInfo
  | rippleNetworkInfo
  | tezosNetworkInfo
  | tronNetworkInfo
export type NetworkInfoRaw =
  | bitcoinNetworkInfoRaw
  | ethereumNetworkInfoRaw
  | rippleNetworkInfoRaw
  | tezosNetworkInfoRaw
  | tronNetworkInfoRaw
export const reflectSpecifics = (declare: *) => [
  bitcoinReflect(declare),
  ethereumReflect(declare),
  rippleReflect(declare),
  tezosReflect(declare),
  tronReflect(declare),
];
