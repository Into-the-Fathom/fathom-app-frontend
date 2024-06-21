import { ReactElement } from "react";
import { styled, Typography } from "@mui/material";
import { VaultType } from "fathom-sdk";

const vaultTitle: { [key: string]: string } = {};
const vaultDescription: { [key: string]: ReactElement } = {};

export const DescriptionList = styled("ul")`
  padding-inline-start: 20px;
`;

export const VaultAboutTitle = styled(Typography)`
  font-size: 16px;
  font-weight: 600;
  line-height: 24px;
  color: #fff;
  margin-bottom: 12px;

  ${({ theme }) => theme.breakpoints.down("sm")} {
    font-size: 14px;
  }
`;

export const getDefaultVaultTitle = (
  vaultType: VaultType = VaultType.INCENTIVE,
  index = 1,
  asset = "FXD"
) => {
  switch (vaultType) {
    case VaultType.DEFI:
      return `DeFi vault (${asset}) #${index}`;
    case VaultType.TRADEFI:
      return `TradeFi vault (${asset}) #${index}`;
    case VaultType.INCENTIVE:
      return `Incentive vault (${asset}) #${index}`;
    default:
      return `Incentive (${asset}) #${index}`;
  }
};

export const getDefaultVaultDescription = (
  vaultType: VaultType = VaultType.INCENTIVE
): ReactElement => {
  switch (vaultType) {
    case VaultType.DEFI:
      return (
        <>
          This vault functions as a pool of funds with an automated management
          of various DeFi product strategies. Users can deposit FXD into this
          vault, which distributes funds between strategies such as yield
          farming, lending, borrowing, etc. In return, the user receives a vault
          share token. Note that this token is not 1:1 equivalent with FXD
          deposited. The FXD vault only charges performance fees as a percentage
          of the strategies manager's fees. Strategies managers can set
          individual management fees, but only for gain. Note that the vault
          smart contracts have been carefully audited. Nevertheless, as always
          in DeFi, users are exposed to smart contract risk. The vault smart
          contracts themselves are non-custodial. Fathom is not responsible for
          the security of strategies created by a 3-rd party or in partnership
          with a 3-rd party.
        </>
      );
    case VaultType.TRADEFI:
      return (
        <>
          This vault functions as a pool of funds with an automated management
          of various TradeFi product strategies. Users can deposit FXD into this
          vault, which distributes funds between strategies such as
          commodity-backed cash alterfiative. In return, the user receives a
          vault share token. Note that this token is not 1:1 equivalent with FXD
          deposited. The FXD vault only charges performance fees as a percentage
          of the strategies manager's fees. Strategies managers can set
          individual management fees, but only for gain. Note that the vault
          smart contracts have been carefully audited. Nevertheless, as always
          in DeFi, users are exposed to smart contract risk. The vault smart
          contracts themselves are non-custodial. Fathom is not responsible for
          the security of strategies created by a 3-rd party or in partnership
          with a 3-rd party.
        </>
      );
    case VaultType.INCENTIVE:
      return (
        <>
          This vault functions as a pool of funds with an automated management
          of various incentive strategies. Users can deposit FXD into this
          vault, which distributes funds between strategies created to
          incentivize users to participate in the Fathom protocol. In return,
          the user receives a vault share token. Note that this token is not 1:1
          equivalent with FXD deposited. The FXD vault only charges performance
          fees as a percentage of the strategies manager's fees. Strategies
          managers can set individual management fees, but only for gain. Note
          that the vault smart contracts have been carefully audited.
          Nevertheless, as always in DeFi, users are exposed to smart contract
          risk. The vault smart contracts themselves are non-custodial. Fathom
          is not responsible for the security of strategies created by a 3-rd
          party or in partnership with a 3-rd party.
        </>
      );
    default:
      return (
        <>
          This vault functions as a pool of funds with an automated management
          of various incentive strategies. Users can deposit FXD into this
          vault, which distributes funds between strategies created to
          incentivize users to participate in the Fathom protocol. In return,
          the user receives a vault share token. Note that this token is not 1:1
          equivalent with FXD deposited. The FXD vault only charges performance
          fees as a percentage of the strategies manager's fees. Strategies
          managers can set individual management fees, but only for gain. Note
          that the vault smart contracts have been carefully audited.
          Nevertheless, as always in DeFi, users are exposed to smart contract
          risk. The vault smart contracts themselves are non-custodial. Fathom
          is not responsible for the security of strategies created by a 3-rd
          party or in partnership with a 3-rd party.
        </>
      );
  }
};

vaultDescription["0x50d150069a0fce09e6ded55a75aec67d2be79037".toLowerCase()] = (
  <>
    <VaultAboutTitle>
      Gold World ETF Vault: Bridging Traditional Assets and Decentralized
      Finance
    </VaultAboutTitle>
    <p>
      Welcome to the Gold World ETF Vault, a pioneering real-world asset (RWA)
      investment platform that seamlessly integrates the stability of
      traditional asset investments with the innovation of decentralized
      finance. This vault offers a unique opportunity for users to diversify
      their portfolios by investing in precious commodities like gold,
      delivering both security and profitability.
    </p>
    <b>Key Features:</b>
    <DescriptionList>
      <li>
        Direct Investment in RWAs: Users can directly invest their funds into a
        curated selection of real-world assets, primarily gold, known for its
        enduring value and stability.
      </li>
      <li>
        Automated Returns Distribution: Leveraging advanced algorithms, the
        vault redistributes generated interest back to the users, ensuring a
        passive income stream.
      </li>
      <li>
        High Transparency and Security: Each investment is meticulously recorded
        and audited, with a clear tracking mechanism that ensures full
        transparency and security of the assets.
      </li>
      <li>
        Performance-Based Fee Structure: No management fees are charged. A
        performance fee is only applied when profits are realized, aligning our
        interests with those of our investors.
      </li>
      <li>
        Risk Mitigation: While investments in RWAs reduce exposure to volatile
        digital assets, they still carry risks. Our platform uses stringent risk
        assessment protocols to mitigate these, ensuring your investments are as
        safe as possible.
      </li>
    </DescriptionList>
    <p>
      By participating in the Gold World ETF Vault, investors gain access to a
      traditionally exclusive market through a decentralized platform, enjoying
      the benefits of both worlds without the typical barriers to entry. Invest
      with confidence and watch your digital and traditional assets grow
      together.
    </p>
  </>
);

vaultTitle["0x50d150069a0fce09e6ded55a75aec67d2be79037".toLowerCase()] =
  "Gold World ETF";
vaultTitle["0xbf4adcc0a8f2c7e29f934314ce60cf5de38bfe8f".toLowerCase()] =
  "Trade Fintech Vault";

export { vaultTitle, vaultDescription };
