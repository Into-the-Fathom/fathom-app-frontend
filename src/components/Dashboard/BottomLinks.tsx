import { FC } from "react";
import { styled } from "@mui/material/styles";
import { Box } from "@mui/material";

const LinksWrapper = styled(Box)`
  display: flex;
  flex-direction: column;
  gap: 7px;
  padding-left: 14px;
  position: absolute;
  bottom: 25px;

  a {
    font-size: 0.825rem;
    font-weight: 500;
    color: ${({ theme }) => theme.palette.text.primary};
    opacity: 0.8;
    display: flex;
    justify-content: start;

    &:hover {
      opacity: 1;
    }
  }
`;

const BottomLinks: FC = () => {
  return (
    <LinksWrapper>
      <a href={"https://fathom.fi/"} rel="noreferrer" target={"_blank"}>
        Fathom.fi
      </a>
      <a
        href={
          "https://gist.github.com/BaldyAsh/3676a18b003758057f634c9af2cfe49a"
        }
        rel="noreferrer"
        target={"_blank"}
      >
        Docs
      </a>
      <a href={"https://t.me/fathom_fi"} rel="noreferrer" target={"_blank"}>
        Telegram
      </a>
      <a
        href={"https://twitter.com/Fathom_fi"}
        rel="noreferrer"
        target={"_blank"}
      >
        Twitter
      </a>
      <a
        href={"https://www.linkedin.com/company/fathom-protocol/"}
        rel="noreferrer"
        target={"_blank"}
      >
        LinkedIn
      </a>
      <a
        href={
          "https://gist.github.com/BaldyAsh/47a33c5e8005c05315cc8dfc9baa4c0e"
        }
        rel="noreferrer"
        target={"_blank"}
      >
        Privacy Policy
      </a>
      <a
        href={
          "https://gist.github.com/BaldyAsh/9e1efbfd87fa87fd67091b5d45c481b3"
        }
        rel="noreferrer"
        target={"_blank"}
      >
        Terms of Service
      </a>
      <a
        href={
          "https://xdc.blocksscan.io/tokens/xdc49d3f7543335cf38fa10889ccff10207e22110b5#tokenTransfers"
        }
        target={"_blank"}
        rel="noreferrer"
      >
        FXD
      </a>
      <a
        href={
          "https://xdc.blocksscan.io/tokens/xdc3279dbefabf3c6ac29d7ff24a6c46645f3f4403c#tokenTransfers"
        }
        target={"_blank"}
        rel="noreferrer"
      >
        FTHM
      </a>
    </LinksWrapper>
  );
};

export default BottomLinks;
