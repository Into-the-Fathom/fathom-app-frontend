import { CustomMarket } from "./marketsConfig";

export interface IconSymbolInterface {
  underlyingAsset: string;
  symbol: string;
  name: string;
}

interface IconMapInterface {
  iconSymbol: string;
  name?: string;
  symbol?: string;
}

export function fetchIconSymbolAndName({
  symbol,
  name,
  underlyingAsset,
}: IconSymbolInterface) {
  const currentMarket = localStorage.getItem("selectedMarket");
  const underlyingAssetMap: Record<string, IconMapInterface> = {
    "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee": {
      name: "XDC",
      symbol: "XDC",
      iconSymbol: "XDC",
    },
  };

  const lowerUnderlyingAsset = underlyingAsset.toLowerCase();
  if (
    lowerUnderlyingAsset in underlyingAssetMap &&
    (currentMarket === CustomMarket.proto_apothem_v3 ||
      currentMarket === CustomMarket.proto_mainnet_v3)
  ) {
    return {
      symbol,
      ...underlyingAssetMap[lowerUnderlyingAsset],
    };
  }

  return {
    iconSymbol: symbol,
    name,
    symbol,
  };
}
