import { useState } from "react";

import { usePolling } from "apps/lending/hooks/usePolling";

export interface AddressAllowedResult {
  isAllowed: boolean;
}

const TWO_MINUTES = 2 * 60 * 1000;

export const useAddressAllowed = (address: string): AddressAllowedResult => {
  const [isAllowed, setIsAllowed] = useState(false);

  const screeningUrl = `${process.env.NEXT_PUBLIC_API_BASEURL}/addresses/status`;
  const queryParams = `?address=${address}`;

  const getIsAddressAllowed = async () => {
    if (screeningUrl && address) {
      const response = await fetch(screeningUrl + queryParams);
      if (response.ok) {
        const data: { addressAllowed: boolean } = await response.json();
        setIsAllowed(data.addressAllowed);
      }
    } else {
      setIsAllowed(true);
    }
  };

  usePolling(getIsAddressAllowed, TWO_MINUTES, false, [address]);

  return {
    isAllowed,
  };
};
