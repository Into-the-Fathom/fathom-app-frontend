import { useMemo } from "react";
import contenthashToUri from "apps/dex/utils/contenthashToUri";
import { parseENSAddress } from "apps/dex/utils/parseENSAddress";
import uriToHttp from "apps/dex/utils/uriToHttp";
import useENSContentHash from "apps/dex/hooks/useENSContentHash";

export default function useHttpLocations(uri: string | undefined): string[] {
  const ens = useMemo(() => (uri ? parseENSAddress(uri) : undefined), [uri]);
  const resolvedContentHash = useENSContentHash(ens?.ensName);
  return useMemo(() => {
    if (ens) {
      return resolvedContentHash.contenthash
        ? uriToHttp(contenthashToUri(resolvedContentHash.contenthash))
        : [];
    } else {
      return uri ? uriToHttp(uri) : [];
    }
  }, [ens, resolvedContentHash.contenthash, uri]);
}
