import React from "react";
import {
    Box,
    Divider,
    Grid,
    ListItemText
} from "@mui/material";
import {
    AppList,
    AppListItem
} from "components/AppComponents/AppList/AppList";

const DepositVaultInfo = () => {

    return (
        <Grid item xs={12} sm={6} pr={2.5}>
            <AppList>
                <AppListItem
                    alignItems="flex-start"
                    secondaryAction={
                        <>
                            0 FXD{" "}
                            <Box component="span" sx={{ color: "#29C20A" }}>
                                → 14 USDT
                            </Box>
                        </>
                    }
                >
                    <ListItemText primary="USDT Deposited" />
                </AppListItem>
                <AppListItem
                    alignItems="flex-start"
                    secondaryAction={
                        <>
                            0 %{" "}
                            <Box component="span" sx={{ color: "#29C20A" }}>
                                → 72.88 %
                            </Box>
                        </>
                    }
                >
                    <ListItemText primary="Pool share" />
                </AppListItem>
                <AppListItem
                    alignItems="flex-start"
                    secondaryAction={
                        <>
                            0 FXD{" "}
                            <Box component="span" sx={{ color: "#29C20A" }}>
                                → 15 fmUSDT
                            </Box>
                        </>
                    }
                >
                    <ListItemText primary="Share tokens" />
                </AppListItem>
                <Divider />
                <AppListItem
                    alignItems="flex-start"
                    secondaryAction="1%"
                >
                    <ListItemText primary="Deposit/Withdrawal fee" />
                </AppListItem>
                <AppListItem
                    alignItems="flex-start"
                    secondaryAction="1%"
                >
                    <ListItemText primary="Management fee" />
                </AppListItem>
                <AppListItem
                    alignItems="flex-start"
                    secondaryAction="1%"
                >
                    <ListItemText primary="Performance fee" />
                </AppListItem>
                <Divider />
                <AppListItem
                    alignItems="flex-start"
                    secondaryAction="0%"
                >
                    <ListItemText primary="Estimated APR" />
                </AppListItem>
                <AppListItem
                    alignItems="flex-start"
                    secondaryAction="0%"
                >
                    <ListItemText primary="Historical APR" />
                </AppListItem>
            </AppList>
        </Grid>
    );
};

export default DepositVaultInfo;
