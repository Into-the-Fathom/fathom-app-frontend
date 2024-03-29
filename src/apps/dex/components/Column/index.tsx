import { Box, styled } from "@mui/material";

const Column = styled(Box)`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
`;
export const ColumnCenter = styled(Column)`
  align-items: center;
  width: 100%;
`;

export const AutoColumn = styled(Box)<{
  gap?: "sm" | "md" | "lg" | string;
  justify?:
    | "stretch"
    | "center"
    | "start"
    | "end"
    | "flex-start"
    | "flex-end"
    | "space-between";
}>`
  display: grid;
  grid-auto-rows: auto;
  grid-row-gap: ${({ gap }) =>
    (gap === "sm" && "8px") ||
    (gap === "md" && "12px") ||
    (gap === "lg" && "24px") ||
    gap};
  justify-items: ${({ justify }) => justify && justify};
`;

export default Column;
