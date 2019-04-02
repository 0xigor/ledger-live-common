// @flow
/* eslint-disable no-bitwise */

import type Transport from "@ledgerhq/hw-transport";
import getFirmwareInfo from "./getFirmwareInfo";
import type { DeviceInfo } from "../types/manager";
import { getEnv } from "../env";

const PROVIDERS: { [_: string]: number } = {
  "": 1,
  das: 2,
  club: 3,
  test: 4,
  ee: 5
};

const ManagerAllowedFlag = 0x08;
const PinValidatedFlag = 0x80;

export default async (transport: Transport<*>): Promise<DeviceInfo> => {
  const res = await getFirmwareInfo(transport);
  const { seVersion } = res;
  const { targetId, mcuVersion, flags } = res;
  const parsedVersion =
    seVersion.match(
      /([0-9]+.[0-9])+(.[0-9]+)?((?!-osu)-([a-zA-Z0-9]+))?(-osu)?/
    ) || [];
  const isOSU = typeof parsedVersion[5] !== "undefined";
  const tag = parsedVersion[4] || "";
  const providerId = getEnv("FORCE_PROVIDER") || PROVIDERS[tag] || 1;
  const isBootloader = (targetId & 0xf0000000) !== 0x30000000;
  const majMin = parsedVersion[1];
  const patch = parsedVersion[2] || ".0";
  const fullVersion = `${majMin}${patch}${tag ? `-${tag}` : ""}`;
  const flag = flags.length > 0 ? flags[0] : 0;
  const managerAllowed = !!(flag & ManagerAllowedFlag);
  const pinValidated = !!(flag & PinValidatedFlag);
  return {
    targetId,
    seVersion: majMin + patch,
    rawVersion: majMin,
    isOSU,
    mcuVersion,
    isBootloader,
    providerId,
    flags,
    managerAllowed,
    pinValidated,
    fullVersion
  };
};
