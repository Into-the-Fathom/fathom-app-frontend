import { FC, Fragment, useCallback, useMemo } from "react";
import ReactGA from "react-ga4";
import { useDispatch } from "react-redux";
import { diffTokenLists, TokenList } from "@uniswap/token-lists";
import { styled, Typography } from "@mui/material";

import { AppDispatch } from "apps/dex/state";
import { useRemovePopup } from "apps/dex/state/application/hooks";
import { acceptListUpdate } from "apps/dex/state/lists/actions";
import { TYPE } from "apps/dex/theme";
import listVersionLabel from "apps/dex/utils/listVersionLabel";
import { ButtonSecondary } from "apps/dex/components/Button";
import { AutoColumn } from "apps/dex/components/Column";
import { AutoRow } from "apps/dex/components/Row";

export const ChangesList = styled("ul")`
  max-height: 400px;
  overflow: auto;
`;

type ListUpdatePopupProps = {
  popKey: string;
  listUrl: string;
  oldList: TokenList;
  newList: TokenList;
  auto: boolean;
};

const ListUpdatePopup: FC<ListUpdatePopupProps> = ({
  popKey,
  listUrl,
  oldList,
  newList,
  auto,
}) => {
  const removePopup = useRemovePopup();
  const removeThisPopup = useCallback(
    () => removePopup(popKey),
    [popKey, removePopup]
  );
  const dispatch = useDispatch<AppDispatch>();

  const handleAcceptUpdate = useCallback(() => {
    if (auto) return;
    ReactGA.event({
      category: "Lists",
      action: "Update List from Popup",
      label: listUrl,
    });
    dispatch(acceptListUpdate(listUrl));
    removeThisPopup();
  }, [auto, dispatch, listUrl, removeThisPopup]);

  const {
    added: tokensAdded,
    changed: tokensChanged,
    removed: tokensRemoved,
  } = useMemo(() => {
    return diffTokenLists(oldList.tokens, newList.tokens);
  }, [newList.tokens, oldList.tokens]);
  const numTokensChanged = useMemo(
    () =>
      Object.keys(tokensChanged).reduce(
        (memo, chainId: any) =>
          memo + Object.keys(tokensChanged[chainId]).length,
        0
      ),
    [tokensChanged]
  );

  return (
    <AutoRow>
      <AutoColumn style={{ flex: "1" }} gap="8px">
        {auto ? (
          <TYPE.body fontWeight={500}>
            The token list &quot;{oldList.name}&quot; has been updated to{" "}
            <strong>{listVersionLabel(newList.version)}</strong>.
          </TYPE.body>
        ) : (
          <>
            <div>
              <Typography>
                An update is available for the token list &quot;{oldList.name}
                &quot; ({listVersionLabel(oldList.version)} to{" "}
                {listVersionLabel(newList.version)}).
              </Typography>
              <ChangesList>
                {tokensAdded.length > 0 ? (
                  <li>
                    {tokensAdded.map((token, i) => (
                      <Fragment key={`${token.chainId}-${token.address}`}>
                        <strong title={token.address}>{token.symbol}</strong>
                        {i === tokensAdded.length - 1 ? null : ", "}
                      </Fragment>
                    ))}{" "}
                    added
                  </li>
                ) : null}
                {tokensRemoved.length > 0 ? (
                  <li>
                    {tokensRemoved.map((token, i) => (
                      <Fragment key={`${token.chainId}-${token.address}`}>
                        <strong title={token.address}>{token.symbol}</strong>
                        {i === tokensRemoved.length - 1 ? null : ", "}
                      </Fragment>
                    ))}{" "}
                    removed
                  </li>
                ) : null}
                {numTokensChanged > 0 ? (
                  <li>{numTokensChanged} tokens updated</li>
                ) : null}
              </ChangesList>
            </div>
            <AutoRow>
              <div style={{ flexGrow: 1, marginRight: 12 }}>
                <ButtonSecondary onClick={handleAcceptUpdate}>
                  Accept update
                </ButtonSecondary>
              </div>
              <div style={{ flexGrow: 1 }}>
                <ButtonSecondary onClick={removeThisPopup}>
                  Dismiss
                </ButtonSecondary>
              </div>
            </AutoRow>
          </>
        )}
      </AutoColumn>
    </AutoRow>
  );
};

export default ListUpdatePopup;
