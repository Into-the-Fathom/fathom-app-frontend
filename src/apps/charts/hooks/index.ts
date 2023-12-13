import { useState, useCallback, useEffect, useRef } from "react";
import { shade } from "polished";
import Vibrant from "node-vibrant";
import { hex } from "wcag-contrast";
import { isAddress } from "apps/charts/utils";
import copy from "copy-to-clipboard";

export function useColor(tokenAddress: any, token: string) {
  const [color, setColor] = useState("#2172E5");
  if (tokenAddress) {
    const path = `https://raw.githubusercontent.com/Into-the-Fathom/assets/master/blockchains/xinfin/${isAddress(
      tokenAddress
    )}/logo.png`;
    if (path) {
      Vibrant.from(path).getPalette((err, palette) => {
        if (palette && palette.Vibrant) {
          let detectedHex = palette.Vibrant.hex;
          let AAscore = hex(detectedHex, "#FFF");
          while (AAscore < 3) {
            detectedHex = shade(0.005, detectedHex);
            AAscore = hex(detectedHex, "#FFF");
          }
          if (token === "DAI") {
            setColor("#FAAB14");
          } else {
            setColor(detectedHex);
          }
        }
      });
    }
  }
  return color;
}

export function useCopyClipboard(timeout = 500) {
  const [isCopied, setIsCopied] = useState<boolean>(false);

  const staticCopy = useCallback((text: string) => {
    const didCopy = copy(text);
    setIsCopied(didCopy);
  }, []);

  useEffect(() => {
    let hide: ReturnType<typeof setTimeout>;
    if (isCopied) {
      hide = setTimeout(() => {
        setIsCopied(false);
      }, timeout);
    }

    return () => {
      hide && clearTimeout(hide);
    };
  }, [isCopied, setIsCopied, timeout]);

  return [isCopied, staticCopy];
}

export const useOutsideClick = (
  ref: { current: { contains: (arg0: any) => any } },
  ref2: { current: { contains: (arg0: any) => any } },
  callback: (arg0: boolean) => void
) => {
  const handleClick = (e: { target: any }) => {
    if (ref.current && ref.current && !ref2.current) {
      callback(true);
    } else if (
      ref.current &&
      !ref.current.contains(e.target) &&
      ref2.current &&
      !ref2.current.contains(e.target)
    ) {
      callback(true);
    } else {
      callback(false);
    }
  };
  useEffect(() => {
    document.addEventListener("click", handleClick);
    return () => {
      document.removeEventListener("click", handleClick);
    };
  });
};

export default function useInterval(
  callback: () => void,
  delay: null | number
) {
  const savedCallback = useRef<() => void>();

  // Remember the latest callback.
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  // Set up the interval.
  useEffect(() => {
    function tick() {
      const current = savedCallback.current;
      current && current();
    }

    if (delay !== null) {
      tick();
      const id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
    return;
  }, [delay]);
}
