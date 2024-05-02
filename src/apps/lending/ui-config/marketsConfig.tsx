import { ChainId } from "@into-the-fathom/lending-contract-helpers";
import {
  FathomLendingApothem,
  FathomLendingXdc,
} from "@into-the-fathom/fathom-lending-address-book";
import { ReactNode } from "react";

export type MarketDataType = {
  v3?: boolean;
  marketTitle: string;
  // the network the market operates on
  chainId: ChainId | number;
  enabledFeatures?: {
    faucet?: boolean;
    incentives?: boolean;
    permissions?: boolean;
    addressBlocked?: boolean;
    stableBorrowRate?: boolean;
  };
  isFork?: boolean;
  permissionComponent?: ReactNode;
  disableCharts?: boolean;
  subgraphUrl?: string;
  addresses: {
    LENDING_POOL_ADDRESS_PROVIDER: string;
    LENDING_POOL: string;
    WETH_GATEWAY?: string;
    FAUCET?: string;
    PERMISSION_MANAGER?: string;
    WALLET_BALANCE_PROVIDER: string;
    UI_POOL_DATA_PROVIDER: string;
    COLLECTOR?: string;
    UI_INCENTIVE_DATA_PROVIDER?: string;
  };
  /**
   * https://www.hal.xyz/ has integrated lending for healtfactor warning notification
   * the integration doesn't follow lending market naming & only supports a subset of markets.
   * When a halIntegration is specified a link to hal will be displayed on the ui.
   */
  halIntegration?: {
    URL: string;
    marketName: string;
  };
};

export enum CustomMarket {
  // v3 test networks, all v3.0.1
  proto_apothem_v3 = "proto_apothem_v3",
  // v3 mainnets
  proto_mainnet_v3 = "proto_mainnet_v3",
}

export const marketsData: {
  [key in keyof typeof CustomMarket]: MarketDataType;
} = {
  [CustomMarket.proto_apothem_v3]: {
    marketTitle: "XDC Apothem",
    v3: true,
    chainId: FathomLendingApothem.CHAIN_ID,
    enabledFeatures: {
      faucet: true,
      incentives: true,
      addressBlocked: false,
      stableBorrowRate: false,
    },
    subgraphUrl: `${process.env.REACT_APP_API_URL}/subgraphs/name/lending-subgraph`,
    addresses: {
      LENDING_POOL_ADDRESS_PROVIDER:
        FathomLendingApothem.POOL_ADDRESSES_PROVIDER,
      LENDING_POOL: FathomLendingApothem.POOL,
      WETH_GATEWAY: FathomLendingApothem.WETH_GATEWAY,
      WALLET_BALANCE_PROVIDER: FathomLendingApothem.WALLET_BALANCE_PROVIDER,
      UI_POOL_DATA_PROVIDER: FathomLendingApothem.UI_POOL_DATA_PROVIDER,
      COLLECTOR: FathomLendingApothem.COLLECTOR,
      FAUCET: FathomLendingApothem.FAUCET,
      UI_INCENTIVE_DATA_PROVIDER:
        FathomLendingApothem.UI_INCENTIVE_DATA_PROVIDER,
    },
  },
  [CustomMarket.proto_mainnet_v3]: {
    marketTitle: "XDC",
    v3: true,
    chainId: FathomLendingXdc.CHAIN_ID,
    enabledFeatures: {
      faucet: false,
      incentives: false,
      addressBlocked: false,
      stableBorrowRate: false,
    },
    subgraphUrl: `${process.env.REACT_APP_API_URL}/subgraphs/name/lending-subgraph`,
    addresses: {
      LENDING_POOL_ADDRESS_PROVIDER: FathomLendingXdc.POOL_ADDRESSES_PROVIDER,
      LENDING_POOL: FathomLendingXdc.POOL,
      WETH_GATEWAY: FathomLendingXdc.WETH_GATEWAY,
      WALLET_BALANCE_PROVIDER: FathomLendingXdc.WALLET_BALANCE_PROVIDER,
      UI_POOL_DATA_PROVIDER: FathomLendingXdc.UI_POOL_DATA_PROVIDER,
      COLLECTOR: FathomLendingXdc.COLLECTOR,
      UI_INCENTIVE_DATA_PROVIDER: FathomLendingXdc.UI_INCENTIVE_DATA_PROVIDER,
    },
  },
} as const;
