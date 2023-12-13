import React, { useEffect, useState } from "react";
import "feather-icons";

import { TYPE } from "Theme";
import { useAllPairData } from "contexts/PairData";
import PairList from "components/PairList";
import { PageWrapper, FullWrapper } from "components";
import { RowBetween, AutoRow } from "components/Row";
import Search from "components/Search";
import { useMedia } from "react-use";
import QuestionHelper from "components/QuestionHelper";
import CheckBox from "components/Checkbox";

function AllPairsPage() {
  const allPairs = useAllPairData();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const below800 = useMedia("(max-width: 800px)");

  const [useTracked, setUseTracked] = useState(true);

  return (
    <PageWrapper>
      <FullWrapper>
        <RowBetween>
          <TYPE.largeHeader>Top Pairs</TYPE.largeHeader>
          {!below800 && <Search small={true} />}
        </RowBetween>
        <AutoRow gap="4px">
          <CheckBox
            checked={useTracked}
            setChecked={() => setUseTracked(!useTracked)}
            text={"Hide untracked pairs"}
          />
          <QuestionHelper text="USD amounts may be inaccurate in low liquidity pairs or pairs without XDC or stablecoins." />
        </AutoRow>
        <PairList
          pairs={allPairs}
          disbaleLinks={true}
          maxItems={50}
          useTracked={useTracked}
          color={"#fff"}
        />
      </FullWrapper>
    </PageWrapper>
  );
}

export default AllPairsPage;
