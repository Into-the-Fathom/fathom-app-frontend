import { Box, BoxProps, Skeleton } from "@mui/material";
import { FC, ReactNode } from "react";
import useSharedContext from "context/shared";

interface ListItemProps extends BoxProps {
  children: ReactNode;
  minHeight?: number;
  px?: number;
  button?: boolean;
}

interface ListColumnProps {
  children?: ReactNode;
  maxWidth?: number;
  minWidth?: number;
  isRow?: boolean;
  align?: "left" | "center" | "right";
  overFlow?: "hidden" | "visible";
  flex?: string | number;
  p?: string | number;
}

export const ListColumn: FC<ListColumnProps> = ({
  isRow,
  children,
  minWidth,
  maxWidth,
  align = "center",
  overFlow = "visible",
  flex = 1,
  p = 0.5,
}) => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: isRow ? "row" : "column",
        alignItems: isRow
          ? "center"
          : align === "left"
          ? "flex-start"
          : align === "right"
          ? "flex-end"
          : align,
        justifyContent: isRow ? "flex-start" : "flex-end",
        flex,
        minWidth: minWidth || "60px",
        maxWidth,
        overflow: overFlow,
        padding: p,
      }}
    >
      {children}
    </Box>
  );
};

export const ListItem: FC<ListItemProps> = ({
  children,
  minHeight = 71,
  px = 2,
  button,
  ...rest
}) => {
  return (
    <Box
      {...rest}
      sx={{
        display: "flex",
        alignItems: "center",
        minHeight,
        px,
        "&:not(:last-child)": {
          borderBottom: "1px solid",
          borderColor: "divider",
        },
        ...(button ? { "&:hover": { bgcolor: "action.hover" } } : {}),
        ...rest.sx,
      }}
    >
      {children}
    </Box>
  );
};

const PostionListActivityRowItem = () => {
  const { isMobile } = useSharedContext();

  return (
    <ListItem px={isMobile ? 0 : 3} minHeight={68}>
      <ListColumn isRow maxWidth={230}>
        <Skeleton
          variant="rounded"
          animation={"wave"}
          width={isMobile ? 80 : 200}
          height={28}
        />
      </ListColumn>
      <ListColumn maxWidth={50}></ListColumn>

      <ListColumn isRow align="center">
        <Box sx={{ pl: 2.5, display: "flex", gap: 1, alignItems: "center" }}>
          {!isMobile && (
            <Skeleton
              variant="rounded"
              animation={"wave"}
              width={140}
              height={28}
            />
          )}
          <Skeleton
            variant="rounded"
            animation={"wave"}
            width={isMobile ? 80 : 140}
            height={28}
          />
        </Box>
      </ListColumn>

      <ListColumn align="right">
        <Box sx={{ display: "flex", gap: 1 }}>
          <Skeleton
            variant="rounded"
            animation={"wave"}
            width={isMobile ? 40 : 120}
            height={28}
          />
        </Box>
      </ListColumn>
    </ListItem>
  );
};

export const PositionActivityListLoader = () => {
  return (
    <>
      <ListItem px={0} minHeight={68}>
        <ListColumn align="left">
          <Skeleton
            variant="rounded"
            animation={"wave"}
            width={140}
            height={28}
            sx={{ transform: "translateY(8px)" }}
          />
        </ListColumn>
      </ListItem>
      <PostionListActivityRowItem />
      <PostionListActivityRowItem />
      <PostionListActivityRowItem />
    </>
  );
};
