import { createTheme, ThemeProvider } from "@mui/material/styles";
import { deepmerge } from "@mui/utils";
import { FC, ReactNode, useMemo } from "react";

import { getDesignTokens, getThemedComponents } from "apps/lending/utils/theme";

/**
 * Main Layout component which wrapps around the whole app
 * @param param0
 * @returns
 */
export const AppGlobalStyles: FC<{ children: ReactNode }> = ({ children }) => {
  const theme = useMemo(() => {
    const themeCreate = createTheme(getDesignTokens());
    return deepmerge(themeCreate, getThemedComponents(themeCreate));
  }, []);

  return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
};
