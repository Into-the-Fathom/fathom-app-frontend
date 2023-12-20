import "feather-icons";
import styled from "styled-components";
import { Text } from "rebass";
import { AlertTriangle } from "react-feather";
import { RowBetween, RowFixed } from "apps/charts/components/Row";
import { ButtonDark } from "apps/charts/components/ButtonStyled";
import { AutoColumn } from "apps/charts/components/Column";
import { Hover } from "apps/charts/components";
import Link from "apps/charts/components/Link";
import { useMedia } from "react-use";
import { FC } from "react";

const WarningWrapper = styled.div<{ show: boolean }>`
  border-radius: 20px;
  border: 1px solid #f82d3a;
  background: rgba(248, 45, 58, 0.05);
  padding: 1rem;
  color: #f82d3a;
  display: ${({ show }) => !show && "none"};
  margin: 0 2rem 2rem 2rem;
  position: relative;

  @media screen and (max-width: 800px) {
    width: 80% !important;
    margin-left: 5%;
  }
`;

const StyledWarningIcon = styled(AlertTriangle)`
  min-height: 20px;
  min-width: 20px;
  stroke: red;
`;

const Warning: FC<{
  type: any;
  show: any;
  setShow: any;
  address: any;
}> = (props) => {
  const { type, show, setShow, address } = props;
  const below800 = useMedia("(max-width: 800px)");

  const textContent = below800 ? (
    <div>
      <Text fontWeight={500} lineHeight={"145.23%"} mt={"10px"}>
        Anyone can create and name any ERC20 token on Ethereum, including
        creating fake versions of existing tokens and tokens that claim to
        represent projects that do not have a token.
      </Text>
      <Text fontWeight={500} lineHeight={"145.23%"} mt={"10px"}>
        Similar to fathom-etherscan, this site automatically tracks analytics
        for all ERC20 tokens independent of token integrity. Please do your own
        research before interacting with any ERC20 token.
      </Text>
    </div>
  ) : (
    <Text fontWeight={500} lineHeight={"145.23%"} mt={"10px"}>
      Anyone can create and name any ERC20 token on Ethereum, including creating
      fake versions of existing tokens and tokens that claim to represent
      projects that do not have a token. Similar to fathom-etherscan, this site
      automatically tracks analytics for all ERC20 tokens independent of token
      integrity. Please do your own research before interacting with any ERC20
      token.
    </Text>
  );

  return (
    <WarningWrapper show={show}>
      <AutoColumn gap="4px">
        <RowFixed>
          <StyledWarningIcon />
          <Text fontWeight={600} lineHeight={"145.23%"} ml={"10px"}>
            Token Safety Alert
          </Text>
        </RowFixed>
        {textContent}
        {below800 ? (
          <div>
            <Hover style={{ marginTop: "10px" }}>
              <Link
                fontWeight={500}
                lineHeight={"145.23%"}
                color={"#2172E5"}
                href={
                  "https://xdc.blocksscan.io/address/" +
                  address.replace(/^.{2}/g, "xdc")
                }
                target="_blank"
              >
                View {type === "token" ? "token" : "pair"} contract on
                BlocksScan
              </Link>
            </Hover>
            <RowBetween style={{ marginTop: "20px" }}>
              <div />
              <ButtonDark
                color={"#f82d3a"}
                style={{ minWidth: "140px" }}
                onClick={() => setShow(false)}
              >
                I understand
              </ButtonDark>
            </RowBetween>
          </div>
        ) : (
          <RowBetween style={{ marginTop: "10px" }}>
            <Hover>
              <Link
                fontWeight={500}
                lineHeight={"145.23%"}
                color={"#2172E5"}
                href={
                  "https://xdc.blocksscan.io/address/" +
                  address.replace(/^.{2}/g, "xdc")
                }
                target="_blank"
              >
                View {type === "token" ? "token" : "pair"} contract on
                BlocksScan
              </Link>
            </Hover>
            <ButtonDark
              color={"#f82d3a"}
              style={{ minWidth: "140px" }}
              onClick={() => setShow(false)}
            >
              I understand
            </ButtonDark>
          </RowBetween>
        )}
      </AutoColumn>
    </WarningWrapper>
  );
};

export default Warning;
