import { useState, useEffect, useMemo, useRef } from "react";
import styled from "styled-components";

import Row, { RowFixed } from "apps/charts/components/Row";
import TokenLogo from "apps/charts/components/TokenLogo";
import { Search as SearchIcon, X } from "react-feather";
import { BasicLink } from "apps/charts/components/Link";

import { useAllTokenData, useTokenData } from "apps/charts/contexts/TokenData";
import { useAllPairData, usePairData } from "apps/charts/contexts/PairData";
import DoubleTokenLogo from "apps/charts/components/DoubleLogo";
import { useMedia } from "react-use";
import {
  useAllPairsInUniswap,
  useAllTokensInUniswap,
} from "apps/charts/contexts/GlobalData";
import { TOKEN_BLACKLIST, PAIR_BLACKLIST } from "apps/charts/constants";

import { client } from "apollo/client";
import { PAIR_SEARCH, TOKEN_SEARCH } from "apps/charts/apollo/queries";
import FormattedName from "apps/charts/components/FormattedName";
import { TYPE } from "apps/charts/Theme";
import { useListedTokens } from "apps/charts/contexts/Application";

const Container = styled.div`
  height: 48px;
  z-index: 30;
  position: relative;

  @media screen and (max-width: 600px) {
    width: 100%;
  }

  @media screen and (min-width: 600px) {
    width: 60%;
  }
`;

const Wrapper = styled.div<{ open?: boolean; small: boolean }>`
  display: flex;
  position: relative;
  flex-direction: row;
  align-items: center;
  justify-content: flex-end;
  border-radius: 12px;
  background: transparent;
  border-bottom-right-radius: ${({ open }) => (open ? "0px" : "12px")};
  border-bottom-left-radius: ${({ open }) => (open ? "0px" : "12px")};
  z-index: 9999;
  width: 100%;
  min-width: 300px;
  box-sizing: border-box;
  box-shadow: ${({ open, small }) =>
    !open && !small
      ? "0px 24px 32px rgba(0, 0, 0, 0.04), 0px 16px 24px rgba(0, 0, 0, 0.04), 0px 4px 8px rgba(0, 0, 0, 0.04), 0px 0px 1px rgba(0, 0, 0, 0.04) "
      : "none"};
  @media screen and (max-width: 500px) {
    background: ${({ theme }) => theme.bg6};
    box-shadow: ${({ open }) =>
      !open
        ? "0px 24px 32px rgba(0, 0, 0, 0.04), 0px 16px 24px rgba(0, 0, 0, 0.04), 0px 4px 8px rgba(0, 0, 0, 0.04), 0px 0px 1px rgba(0, 0, 0, 0.04) "
        : "none"};
  }
`;
const Input = styled.input<{ large: boolean }>`
  position: relative;
  display: flex;
  align-items: center;
  white-space: nowrap;
  outline: none;
  width: 100%;
  color: ${({ theme }) => theme.white};
  border: 1px solid ${({ theme }) => theme.borderBG};
  font-size: ${({ large }) => (large ? "20px" : "14px")};
  border-radius: 8px;
  padding: 10px 10px 10px 28px;
  background-color: #061023;

  ::placeholder {
    color: ${({ theme }) => theme.placeholderColor};
    font-size: 16px;
  }

  @media screen and (max-width: 640px) {
    ::placeholder {
      font-size: 1rem;
    }
  }
`;

const SearchIconLarge = styled(SearchIcon)`
  height: 20px;
  width: 20px;
  margin-right: 0.5rem;
  position: absolute;
  left: 6px;
  pointer-events: none;
  color: ${({ theme }) => theme.borderBG};
  z-index: 1;
`;

const CloseIcon = styled(X)`
  height: 20px;
  width: 20px;
  margin-right: 0.5rem;
  position: absolute;
  left: 6px;
  color: ${({ theme }) => theme.borderBG};
  z-index: 1;
  :hover {
    cursor: pointer;
  }
`;

const Menu = styled.div<{ hide?: boolean }>`
  flex-direction: column;
  z-index: 9999;
  width: 100%;
  top: 50px;
  max-height: 540px;
  overflow: auto;
  left: 0;
  padding-bottom: 20px;
  background: linear-gradient(180deg, #000817 7.88%, #0d1725 113.25%);
  border-bottom-right-radius: 12px;
  border-bottom-left-radius: 12px;
  box-shadow: 0 0 1px rgba(0, 0, 0, 0.04), 0 4px 8px rgba(0, 0, 0, 0.04),
    0 16px 24px rgba(0, 0, 0, 0.04), 0 24px 32px rgba(0, 0, 0, 0.04);
  display: ${({ hide }) => (hide ? "none" : "flex")};
`;

const MenuItem = styled(Row)`
  padding: 1rem;
  font-size: 0.85rem;
  & > * {
    margin-right: 6px;
  }
  :hover {
    cursor: pointer;
    background-color: ${({ theme }) => theme.bg2};
  }
`;

const Heading = styled(Row)<{ hide?: boolean }>`
  padding: 1rem;
  display: ${({ hide = false }) => hide && "none"};
`;

const Gray = styled.span`
  color: #888d9b;
`;

const Blue = styled.span`
  color: #43fff6;
  :hover {
    cursor: pointer;
  }
`;

export const Search = ({ small = false }) => {
  let allTokens = useAllTokensInUniswap();
  const allTokenData = useAllTokenData();

  let allPairs = useAllPairsInUniswap() as any[];
  const allPairData = useAllPairData();
  const listedTokens = useListedTokens();

  const [showMenu, toggleMenu] = useState(false);
  const [value, setValue] = useState("");
  const [, toggleShadow] = useState(false);
  const [, toggleBottomShadow] = useState(false);

  // fetch new data on tokens and pairs if needed
  useTokenData(value);
  usePairData(value);

  const below700 = useMedia("(max-width: 700px)");
  const below470 = useMedia("(max-width: 470px)");
  const below410 = useMedia("(max-width: 410px)");

  useEffect(() => {
    if (value !== "") {
      toggleMenu(true);
    } else {
      toggleMenu(false);
    }
  }, [value]);

  const [searchedTokens, setSearchedTokens] = useState<any[]>([]);
  const [searchedPairs, setSearchedPairs] = useState<any[]>([]);

  useEffect(() => {
    async function fetchData() {
      try {
        if (value?.length > 0) {
          const tokens = await client.query({
            query: TOKEN_SEARCH,
            variables: {
              value: value ? value.toUpperCase() : "",
              id: value,
            },
          });

          const pairs = await client.query({
            query: PAIR_SEARCH,
            variables: {
              tokens: tokens.data.asSymbol?.map((t: { id: any }) => t.id),
              id: value,
            },
          });

          setSearchedPairs(
            pairs.data.as0.concat(pairs.data.as1).concat(pairs.data.asAddress)
          );
          const foundTokens = tokens.data.asSymbol
            .concat(tokens.data.asAddress)
            .concat(tokens.data.asName);
          setSearchedTokens(foundTokens);
        }
      } catch (e) {
        console.log(e);
      }
    }
    fetchData();
  }, [value]);

  function escapeRegExp(string: string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); // $& means the whole matched string
  }

  // add the searched tokens to the list if not found yet
  allTokens = allTokens.concat(
    searchedTokens.filter((searchedToken: any) => {
      let included = false;
      allTokens.map((token: any) => {
        if (token.id === searchedToken.id) {
          included = true;
        }
        return true;
      });
      return !included;
    })
  );

  const uniqueTokens: any[] = [];
  const found = {} as any;
  allTokens &&
    allTokens.map((token: any) => {
      if (!found[token.id]) {
        found[token.id] = true;
        uniqueTokens.push(token);
      }
      return true;
    });

  allPairs = allPairs.concat(
    searchedPairs.filter((searchedPair) => {
      let included = false;
      allPairs.map((pair) => {
        if (pair.id === searchedPair.id) {
          included = true;
        }
        return true;
      });
      return !included;
    })
  );

  const uniquePairs: any[] = [];
  const pairsFound = {} as any;
  allPairs &&
    allPairs.map((pair) => {
      if (!pairsFound[pair.id]) {
        pairsFound[pair.id] = true;
        uniquePairs.push(pair);
      }
      return true;
    });

  const filteredTokenList = useMemo(() => {
    return uniqueTokens
      ? uniqueTokens
          .sort((a, b) => {
            const tokenA = allTokenData[a.id];
            const tokenB = allTokenData[b.id];
            if (tokenA?.oneDayVolumeUSD && tokenB?.oneDayVolumeUSD) {
              return tokenA.oneDayVolumeUSD > tokenB.oneDayVolumeUSD ? -1 : 1;
            }
            if (tokenA?.oneDayVolumeUSD && !tokenB?.oneDayVolumeUSD) {
              return -1;
            }
            if (!tokenA?.oneDayVolumeUSD && tokenB?.oneDayVolumeUSD) {
              return tokenA?.totalLiquidity > tokenB?.totalLiquidity ? -1 : 1;
            }
            return 1;
          })
          .filter((token) => {
            if (TOKEN_BLACKLIST.includes(token.id)) {
              return false;
            }
            if (!listedTokens?.includes(token.id)) {
              return false;
            }
            const regexMatches = Object.keys(token).map((tokenEntryKey) => {
              const isAddress = value.slice(0, 2) === "0x";
              if (tokenEntryKey === "id" && isAddress) {
                return token[tokenEntryKey].match(
                  new RegExp(escapeRegExp(value), "i")
                );
              }
              if (tokenEntryKey === "symbol" && !isAddress) {
                return token[tokenEntryKey].match(
                  new RegExp(escapeRegExp(value), "i")
                );
              }
              if (tokenEntryKey === "name" && !isAddress) {
                return token[tokenEntryKey].match(
                  new RegExp(escapeRegExp(value), "i")
                );
              }
              return false;
            });
            return regexMatches.some((m) => m);
          })
      : [];
  }, [allTokenData, uniqueTokens, value, listedTokens]);

  const filteredPairList = useMemo(() => {
    return uniquePairs
      ? uniquePairs
          .sort((a, b) => {
            const pairA = allPairData[a.id];
            const pairB = allPairData[b.id];
            if (pairA?.trackedReserveETH && pairB?.trackedReserveETH) {
              return parseFloat(pairA.trackedReserveETH) >
                parseFloat(pairB.trackedReserveETH)
                ? -1
                : 1;
            }
            if (pairA?.trackedReserveETH && !pairB?.trackedReserveETH) {
              return -1;
            }
            if (!pairA?.trackedReserveETH && pairB?.trackedReserveETH) {
              return 1;
            }
            return 0;
          })
          .filter((pair) => {
            if (PAIR_BLACKLIST.includes(pair.id)) {
              return false;
            }
            if (
              !(
                listedTokens?.includes(pair.token0.id) &&
                listedTokens?.includes(pair.token1.id)
              )
            ) {
              return false;
            }
            if (value && value.includes(" ")) {
              const pairA = value.split(" ")[0]?.toUpperCase();
              const pairB = value.split(" ")[1]?.toUpperCase();
              return (
                (pair.token0.symbol.includes(pairA) ||
                  pair.token0.symbol.includes(pairB)) &&
                (pair.token1.symbol.includes(pairA) ||
                  pair.token1.symbol.includes(pairB))
              );
            }
            if (value && value.includes("-")) {
              const pairA = value.split("-")[0]?.toUpperCase();
              const pairB = value.split("-")[1]?.toUpperCase();
              return (
                (pair.token0.symbol.includes(pairA) ||
                  pair.token0.symbol.includes(pairB)) &&
                (pair.token1.symbol.includes(pairA) ||
                  pair.token1.symbol.includes(pairB))
              );
            }
            const regexMatches = Object.keys(pair).map((field) => {
              const isAddress = value.slice(0, 2) === "0x";
              if (field === "id" && isAddress) {
                return pair[field].match(new RegExp(escapeRegExp(value), "i"));
              }
              if (field === "token0") {
                return (
                  pair[field].symbol.match(
                    new RegExp(escapeRegExp(value), "i")
                  ) ||
                  pair[field].name.match(new RegExp(escapeRegExp(value), "i"))
                );
              }
              if (field === "token1") {
                return (
                  pair[field].symbol.match(
                    new RegExp(escapeRegExp(value), "i")
                  ) ||
                  pair[field].name.match(new RegExp(escapeRegExp(value), "i"))
                );
              }
              return false;
            });
            return regexMatches.some((m) => m);
          })
      : [];
  }, [allPairData, uniquePairs, value, listedTokens]);

  useEffect(() => {
    if (Object.keys(filteredTokenList).length > 2) {
      toggleShadow(true);
    } else {
      toggleShadow(false);
    }
  }, [filteredTokenList]);

  useEffect(() => {
    if (Object.keys(filteredPairList).length > 2) {
      toggleBottomShadow(true);
    } else {
      toggleBottomShadow(false);
    }
  }, [filteredPairList]);

  const [tokensShown, setTokensShown] = useState(3);
  const [pairsShown, setPairsShown] = useState(3);

  function onDismiss() {
    setPairsShown(3);
    setTokensShown(3);
    toggleMenu(false);
    setValue("");
  }

  // refs to detect clicks outside modal
  const wrapperRef = useRef<HTMLInputElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const handleClick = (e: MouseEvent) => {
    if (
      !(menuRef.current && menuRef.current.contains(e.target as HTMLElement)) &&
      !(
        wrapperRef.current &&
        wrapperRef.current?.contains(e.target as HTMLElement)
      )
    ) {
      setPairsShown(3);
      setTokensShown(3);
      toggleMenu(false);
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleClick);
    return () => {
      document.removeEventListener("click", handleClick);
    };
  });

  return (
    <Container>
      <Wrapper open={showMenu} small={small}>
        {!showMenu ? (
          <SearchIconLarge />
        ) : (
          <CloseIcon color={"#fff"} onClick={() => toggleMenu(false)} />
        )}
        <Input
          large={!small}
          type={"text"}
          ref={wrapperRef}
          placeholder={
            small
              ? ""
              : below410
              ? "Search..."
              : below470
              ? "Search Fathom DEX..."
              : below700
              ? "Search pairs and tokens..."
              : "Search Fathom DEX pairs and tokens..."
          }
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
          }}
          onFocus={() => {
            if (!showMenu) {
              toggleMenu(true);
            }
          }}
        />
      </Wrapper>
      <Menu hide={!showMenu} ref={menuRef}>
        <Heading>
          <Gray>Pairs</Gray>
        </Heading>
        <div>
          {filteredPairList && Object.keys(filteredPairList).length === 0 && (
            <MenuItem>
              <TYPE.body>No results</TYPE.body>
            </MenuItem>
          )}
          {filteredPairList &&
            filteredPairList.slice(0, pairsShown).map((pair) => {
              return (
                <BasicLink
                  to={"/charts/pair/" + pair.id}
                  key={pair.id}
                  onClick={onDismiss}
                >
                  <MenuItem>
                    <DoubleTokenLogo
                      a0={pair?.token0?.id}
                      a1={pair?.token1?.id}
                      margin={true}
                    />
                    <TYPE.body style={{ marginLeft: "10px" }}>
                      {pair.token0.symbol + "-" + pair.token1.symbol} Pair
                    </TYPE.body>
                  </MenuItem>
                </BasicLink>
              );
            })}
          <Heading
            hide={
              !(
                Object.keys(filteredPairList).length > 3 &&
                Object.keys(filteredPairList).length >= pairsShown
              )
            }
          >
            <Blue
              onClick={() => {
                setPairsShown(pairsShown + 5);
              }}
            >
              See more...
            </Blue>
          </Heading>
        </div>
        <Heading>
          <Gray>Tokens</Gray>
        </Heading>
        <div>
          {Object.keys(filteredTokenList).length === 0 && (
            <MenuItem>
              <TYPE.body>No results</TYPE.body>
            </MenuItem>
          )}
          {filteredTokenList.slice(0, tokensShown).map((token) => {
            return (
              <BasicLink
                to={"/charts/token/" + token.id}
                key={token.id}
                onClick={onDismiss}
              >
                <MenuItem>
                  <RowFixed>
                    <TokenLogo
                      address={token.id}
                      style={{ marginRight: "10px" }}
                    />
                    <FormattedName
                      text={token.name}
                      maxCharacters={20}
                      style={{ marginRight: "6px" }}
                    />
                    (<FormattedName text={token.symbol} maxCharacters={6} />)
                  </RowFixed>
                </MenuItem>
              </BasicLink>
            );
          })}

          <Heading
            hide={
              !(
                Object.keys(filteredTokenList).length > 3 &&
                Object.keys(filteredTokenList).length >= tokensShown
              )
            }
          >
            <Blue
              onClick={() => {
                setTokensShown(tokensShown + 5);
              }}
            >
              See more...
            </Blue>
          </Heading>
        </div>
      </Menu>
    </Container>
  );
};

export default Search;