import {
  Button,
  List,
  ListItem,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { useRootStore } from "apps/lending/store/root";
import { NAV_BAR } from "apps/lending/utils/mixPanelEvents";

import { Link } from "apps/lending/components/primitives/Link";
import { useProtocolDataContext } from "apps/lending/hooks/useProtocolDataContext";
import { navigation } from "apps/lending/ui-config/menu-items";

interface NavItemsProps {
  setOpen?: (value: boolean) => void;
}

export const NavItems = ({ setOpen }: NavItemsProps) => {
  const { currentMarketData } = useProtocolDataContext();

  const { breakpoints } = useTheme();
  const md = useMediaQuery(breakpoints.down("md"));
  const trackEvent = useRootStore((store) => store.trackEvent);
  const handleClick = (title: string, isMd: boolean) => {
    if (isMd && setOpen) {
      trackEvent(NAV_BAR.MAIN_MENU, { nav_link: title });
      setOpen(false);
    } else {
      trackEvent(NAV_BAR.MAIN_MENU, { nav_link: title });
    }
  };
  return (
    <List
      sx={{
        display: "flex",
        alignItems: { xs: "flex-start", md: "center" },
        flexDirection: { xs: "column", md: "row" },
      }}
      disablePadding
    >
      {navigation
        .filter((item) => !item.isVisible || item.isVisible(currentMarketData))
        .map((item, index) => (
          <ListItem
            sx={{
              width: { xs: "100%", md: "unset" },
              mr: { xs: 0, md: 2 },
            }}
            data-cy={item.dataCy}
            disablePadding
            key={index}
          >
            {md ? (
              <Typography
                component={Link}
                href={item.link}
                variant="h2"
                color="#F1F1F3"
                sx={{ width: "100%", p: 4 }}
                onClick={() => handleClick(item.title, true)}
              >
                {item.title}
              </Typography>
            ) : (
              <Button
                component={Link}
                onClick={() => handleClick(item.title, false)}
                href={item.link}
                sx={{
                  color: "#F1F1F3",
                  p: "6px 8px",
                  position: "relative",
                  ".active&:after, &:hover&:after": {
                    transform: "scaleX(1)",
                    transformOrigin: "bottom left",
                  },
                  "&:after": {
                    content: "''",
                    position: "absolute",
                    width: "100%",
                    transform: "scaleX(0)",
                    height: "2px",
                    bottom: "-6px",
                    left: "0",
                    background: "#00fff6",
                    transformOrigin: "bottom right",
                    transition: "transform 0.25s ease-out",
                  },
                }}
              >
                {item.title}
              </Button>
            )}
          </ListItem>
        ))}
    </List>
  );
};
