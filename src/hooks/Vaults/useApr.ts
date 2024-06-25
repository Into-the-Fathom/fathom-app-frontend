import { formatNumber } from "utils/format";
import { IVault } from "fathom-sdk";
import BigNumber from "bignumber.js";

const EDUCATION_STRATEGY_ID = "0x3c8e9896933b374e638f9a5c309535409129aaa2";

const ApyConfig = {
  ["0xbf4adcc0a8f2c7e29f934314ce60cf5de38bfe8f".toLowerCase()]: 10,
  ["0x2D8A913F47B905C71F0A3d387de863F3a1Cc8d78".toLowerCase()]: 10,
  ["0xA6272625f8fCd6FC3b53A167E471b7D55095a40b".toLowerCase()]: 10,
  ["0xfa6ed4d32110e1c27c9d8c2930e217746cb8acab".toLowerCase()]: 10,
  ["0xb8e027e707da68c98919686d5edf9adbf2746ed9".toLowerCase()]: 10,
  ["0x8134c61A86775CF688d3d321E5cd32787c4c7f88".toLowerCase()]: 10,
} as const;

const useApr = (vault: IVault) => {
  if (vault.id === EDUCATION_STRATEGY_ID) {
    return formatNumber(
      (394200 /
        BigNumber(vault.balanceTokens)
          .dividedBy(10 ** 18)
          .toNumber()) *
        100
    );
  }

  if (ApyConfig[vault.id]) {
    return formatNumber(ApyConfig[vault.id]);
  }

  return formatNumber(Number(vault.apr));
};

const useAprNumber = (vault: IVault) => {
  if (vault.id === EDUCATION_STRATEGY_ID) {
    return (
      (394200 /
        BigNumber(vault.balanceTokens)
          .dividedBy(10 ** 18)
          .toNumber()) *
      100
    );
  }

  if (ApyConfig[vault.id]) {
    return ApyConfig[vault.id];
  }

  return Number(vault.apr);
};

const getApr = (currentDept: string, vaultId: string, apr: string) => {
  if (vaultId === EDUCATION_STRATEGY_ID) {
    return BigNumber(394200)
      .dividedBy(BigNumber(currentDept).dividedBy(10 ** 18))
      .multipliedBy(100)
      .toString();
  }

  if (ApyConfig[vaultId]) {
    return ApyConfig[vaultId].toString();
  }

  return apr;
};

export { useApr, useAprNumber, getApr };
