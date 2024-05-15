import { InjectedConnector } from "@web3-react/injected-connector";
import { WalletConnectConnector } from "connectors/wallet-connect-connector/WalletConnectConnector";
import { EthereumProviderOptions } from "@walletconnect/ethereum-provider/dist/types/EthereumProvider";
import { JsonRpcProvider, Web3Provider } from "@into-the-fathom/providers";

export const APOTHEM_RPC = "https://erpc.apothem.network/";
export const XDC_RPC = "https://rpc.ankr.com/xdc/";
export const SEPOLIA_RPC = "https://ethereum-sepolia-rpc.publicnode.com/";

let CHAIN_IDS = [51, 11155111];

let DEFAULT_RPC: any = {
  51: APOTHEM_RPC,
};

let supportedChainIds = [51, 11155111];

let rpc: any = {
  51: APOTHEM_RPC,
  11155111: SEPOLIA_RPC,
};

let NETWORK_LABELS: { [n: number]: string } = {
  51: "Apothem",
  11155111: "Sepolia",
};

if (process.env.REACT_APP_ENV === "prod") {
  CHAIN_IDS = [50];

  DEFAULT_RPC = {
    50: XDC_RPC,
  };

  supportedChainIds = [50];

  rpc = {
    50: XDC_RPC,
  };

  NETWORK_LABELS = {
    50: "XDC",
  };
}

export declare enum ChainId {
  XDC = 50,
  AXDC = 51,
  SEPOLIA = 11155111,
}

export type DefaultProvider = Web3Provider | JsonRpcProvider;

export const EXPLORERS = {
  51: "https://explorer.apothem.network/",
  50: "https://xdc.blocksscan.io/",
  11155111: "https://sepolia.etherscan.io/",
};

export const XDC_NETWORK_SETTINGS = {
  50: {
    chainName: "XDC",
    chainId: `0x${(50).toString(16)}`,
    nativeCurrency: { name: "XDC", decimals: 18, symbol: "XDC" },
    rpcUrls: [XDC_RPC],
    blockExplorerUrls: ["https://explorer.xinfin.network"],
  },
  51: {
    chainName: "Apothem",
    chainId: `0x${(51).toString(16)}`,
    nativeCurrency: { name: "Apothem", decimals: 18, symbol: "TXDC" },
    rpcUrls: [APOTHEM_RPC],
  },
  11155111: {
    chainName: "Sepolia",
    chainId: `0x${(11155111).toString(16)}`,
    nativeCurrency: { name: "SepoliaETH", decimals: 18, symbol: "ETH" },
    rpcUrls: [SEPOLIA_RPC],
  },
};

export const injected = new InjectedConnector({ supportedChainIds });

export const WalletConnect = new WalletConnectConnector({
  chains: supportedChainIds,
  rpcMap: rpc,
  showQrModal: true,
  projectId: "5da328ee81006c5aa59662d6cadfd5fe",
  methods: [
    "eth_sendTransaction",
    "eth_signTransaction",
    "eth_sign",
    "personal_sign",
    "eth_signTypedData",
  ],
  optionalMethods: ["eth_estimateGas"],
  qrModalOptions: {
    themeVariables: {
      "--wcm-z-index": "10000",
    },
  },
} as unknown as EthereumProviderOptions);

export { CHAIN_IDS, DEFAULT_RPC, supportedChainIds, NETWORK_LABELS };
