import { FC, ReactNode } from "react";
import { Box, Grid, styled } from "@mui/material";
import BasePopover from "components/Base/Popover/BasePopover";

const PositionStatItem = styled(Grid)`
  & > .MuiBox-root {
    border-radius: 12px;
    border: 1px solid #2c4066;
    background: #132340;
    padding: 12px 24px;
  }
  ${({ theme }) => theme.breakpoints.down("sm")} {
    height: auto !important;
    margin: 0 !important;
    & > .MuiBox-root {
      border: none;
      background: #1e2f4c;
      padding: 12px 16px;
    }
  }
`;

const PositionStatItemTitle = styled(Box)`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  gap: 8px;
  color: #6d86b2;
  font-size: 13px;
  font-weight: 600;
  line-height: 16px;
  letter-spacing: 0.13px;
  text-transform: uppercase;
  margin-bottom: 4px;
  ${({ theme }) => theme.breakpoints.down("sm")} {
    font-size: 12px;
    line-height: 16px;
    letter-spacing: 0.48px;
    text-transform: capitalize;
    margin-bottom: 0;
  }
`;

const PositionStatItemValue = styled(Box)`
  color: #fff;
  font-size: 20px;
  font-weight: 600;
  line-height: 36px;
  word-wrap: break-word;
  ${({ theme }) => theme.breakpoints.down("sm")} {
    font-size: 14px;
    line-height: 20px;
    letter-spacing: 0.14px;
  }
`;

interface PageStatsItemProps {
  title: string;
  helpText?: string | null;
  value: ReactNode;
  xs?: number;
  sm?: number;
  md?: number;
  testId?: string;
}

const BasePageStatsItem: FC<PageStatsItemProps> = ({
  title,
  helpText = null,
  value,
  xs = 12,
  sm = 12,
  md = 4,
  testId = "",
}) => {
  return (
    <PositionStatItem
      item
      xs={xs}
      sm={sm}
      md={md}
      className={"page-stats-item"}
    >
      <Box>
        <PositionStatItemTitle data-testid={testId}>
          {title}
          {helpText && (
            <BasePopover
              id={title.toLowerCase()}
              text={
                "The total amount of FXD has been issued through borrowing from protocol and is currently in circulation."
              }
              iconSize={"16px"}
            />
          )}
        </PositionStatItemTitle>
        <PositionStatItemValue>{value}</PositionStatItemValue>
      </Box>
    </PositionStatItem>
  );
};

export default BasePageStatsItem;
