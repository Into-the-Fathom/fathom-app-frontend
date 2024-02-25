import Link from "@mui/material/Link";
import Typography from "@mui/material/Typography";
import { styled } from "@mui/material/styles";
import { Box, Divider } from "@mui/material";

const Footer = styled(Typography)`
  display: flex;
  align-items: start;
  justify-content: center;
  gap: 4px;
  padding-bottom: 10px;
`;

const TokensWrapper = styled("div")`
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-bottom: 10px;
  line-height: 18px;
  a {
    color: rgba(255, 255, 255, 0.7);
    :hover {
      text-decoration: underline;
    }
  }
`;

export const FooterDivider = styled(Divider)`
  border: 1px solid #9fadc6;
`;

const Copyright = function Copyright(props: any) {
  return (
    <Box>
      <TokensWrapper>
        <a
          href={
            "https://xdc.blocksscan.io/tokens/xdc49d3f7543335cf38fa10889ccff10207e22110b5#tokenTransfers"
          }
          target={"_blank"}
          rel="noreferrer"
        >
          FXD
        </a>
        <FooterDivider orientation="vertical" flexItem />
        <a
          href={
            "https://xdc.blocksscan.io/tokens/xdc3279dbefabf3c6ac29d7ff24a6c46645f3f4403c#tokenTransfers"
          }
          target={"_blank"}
          rel="noreferrer"
        >
          FTHM
        </a>
      </TokensWrapper>
      <Footer color="text.secondary" {...props}>
        {"Copyright©"}
        <Link color="inherit" href="https://fathom.fi/">
          Fathom App
        </Link>
        {new Date().getFullYear()}.
      </Footer>
    </Box>
  );
};

export default Copyright;
