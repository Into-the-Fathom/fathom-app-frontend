import React, { FC } from "react";
import { Link } from "react-router-dom";
import {
  Box,
  FormControlLabel,
  Switch,
  DialogContent,
  Grid,
  Stack,
  Icon,
  FormGroup,
  Typography,
  CircularProgress,
} from "@mui/material";
import { Controller } from "react-hook-form";
import { AppDialog } from "components/AppComponents/AppDialog/AppDialog";
import { AppDialogTitle } from "components/AppComponents/AppDialog/AppDialogTitle";
import {
  AppFormLabel,
  AppTextField,
} from "components/AppComponents/AppForm/AppForm";
import { getTokenLogoURL } from "utils/tokenLogo";
import { styled } from "@mui/material/styles";
import useCreateProposal from "hooks/useCreateProposal";

import MuiInfoIcon from "@mui/icons-material/Info";
import {
  ButtonPrimary,
  ButtonSecondary,
} from "components/AppComponents/AppButton/AppButton";

import requiredSrc from "assets/svg/required.svg";

const ProposeLabel = styled(AppFormLabel)`
  float: none;
  width: 100%;
  font-size: 11px;
  line-height: 18px;
  color: #7d91b5;
  height: 26px;
  display: inline-flex;
  align-items: end;
  padding: 0;
`;

const CurrencyBox = styled(Box)`
  font-size: 14px;
  line-height: 20px;
`;

const BalanceBox = styled(Box)`
  font-weight: bold;
  font-size: 20px;
  line-height: 24px;
`;

const WarningBox = styled(Box)`
  background: #452508;
  border: 1px solid #5c310a;
  border-radius: 8px;
  padding: 8px 16px;
  gap: 8px;
  display: flex;
  flex-direction: row;
  align-items: center;

  margin: 10px 0 20px;

  p {
    color: #f7b06e;
    font-size: 14px;
  }
`;

const ProposeButtonPrimary = styled(ButtonPrimary)`
  height: 48px;
  font-size: 17px;
`;

const ProposeButtonSecondary = styled(ButtonSecondary)`
  height: 48px;
  font-size: 17px;
  color: #fff;
  border: 1px solid #324567;
`;

const Required = () => (
  <Icon sx={{ width: "20px", height: "26px" }}>
    <img alt="staking-icon" src={requiredSrc} />
  </Icon>
);

const OptionalBox = styled(Box)`
  font-weight: bold;
  font-size: 12px;
  line-height: 16px;
  text-transform: none;
  color: #9fadc6;
  margin-left: 5px;
`;

const GridContainer = styled(Grid)`
  padding: 0 8px;
  ${({ theme }) => theme.breakpoints.down("sm")} {
    padding: 0;
  }
`;

const Optional = () => <OptionalBox>(Optional)</OptionalBox>;

const InfoIcon: FC<{ sx?: Record<string, any> }> = ({ sx }) => (
  <MuiInfoIcon
    sx={{ width: "11px", height: "11px", marginRight: "5px", ...sx }}
  />
);

const MINIMUM_V_BALANCE = 1000;

export type ProposeProps = {
  onClose: () => void;
};

const Propose: FC<ProposeProps> = ({ onClose }) => {
  const {
    isMobile,
    isLoading,
    withAction,
    handleSubmit,
    control,
    onSubmit,
    vBalance,
    saveForLater,
    validateAddressesArray,
    formatNumber,
  } = useCreateProposal(onClose);

  return (
    <AppDialog
      aria-labelledby="customized-dialog-title"
      open={true}
      fullWidth
      maxWidth="md"
      color="primary"
      sx={{ "& .MuiPaper-root": { width: "700px" } }}
    >
      <AppDialogTitle id="customized-dialog-title" onClose={onClose}>
        New Proposal
      </AppDialogTitle>
      <DialogContent sx={{ marginTop: "20px" }}>
        <GridContainer container gap={2}>
          <Grid item xs={12}>
            <ProposeLabel>Wallet balance</ProposeLabel>
            <Stack
              direction="row"
              justifyContent="start"
              alignItems="end"
              spacing={1}
            >
              <img src={getTokenLogoURL("FTHM")} alt="vFTHM-Token" width={28} />
              <BalanceBox component="span">
                {formatNumber((vBalance as number) / 10 ** 18)}
              </BalanceBox>
              <CurrencyBox component="span">vFHTM</CurrencyBox>
            </Stack>
          </Grid>
          <Box
            component="form"
            onSubmit={handleSubmit(onSubmit)}
            noValidate
            autoComplete="off"
          >
            <Grid item xs={12}>
              <Grid container spacing={1}>
                <Grid item xs={12}>
                  <Controller
                    control={control}
                    name="descriptionTitle"
                    rules={{ required: true }}
                    render={({
                      field: { onChange, value },
                      fieldState: { error },
                    }) => (
                      <FormGroup>
                        <ProposeLabel>
                          Title <Required />
                        </ProposeLabel>
                        <AppTextField
                          error={!!error}
                          id="outlined-textarea"
                          multiline
                          rows={1}
                          placeholder={"Ex: More stream staking rewards"}
                          value={value}
                          onChange={onChange}
                          helperText={error ? "Field Title is required" : ""}
                        />
                      </FormGroup>
                    )}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Controller
                    control={control}
                    name="description"
                    rules={{ required: true }}
                    render={({
                      field: { onChange, value },
                      fieldState: { error },
                    }) => (
                      <FormGroup>
                        <ProposeLabel>
                          Description <Required />
                        </ProposeLabel>
                        <AppTextField
                          error={!!error}
                          id="outlined-textarea"
                          multiline
                          rows={2}
                          placeholder={
                            "Ex: Describe how you propose new way in details..."
                          }
                          value={value}
                          onChange={onChange}
                          helperText={error && "Field Description is required"}
                        />
                      </FormGroup>
                    )}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Controller
                    control={control}
                    name="link"
                    rules={{ required: false }}
                    render={({
                      field: { onChange, value },
                      fieldState: { error },
                    }) => (
                      <FormGroup>
                        <ProposeLabel>
                          Discussion / Detail / Forum link <Optional />
                        </ProposeLabel>
                        <AppTextField
                          error={!!error}
                          id="outlined-textarea"
                          multiline
                          rows={1}
                          placeholder={"Ex: Discord / Twitter / Medium ..."}
                          value={value}
                          onChange={onChange}
                          helperText={
                            <Stack
                              direction={"row"}
                              alignItems={"center"}
                              component={"span"}
                            >
                              <InfoIcon />
                              Forum discussion will be auto-created if this is
                              left empty
                            </Stack>
                          }
                        />
                      </FormGroup>
                    )}
                  />
                </Grid>
                <Grid item xs={12}>
                  <FormGroup sx={{ margin: "10px 0 0" }}>
                    <Controller
                      control={control}
                      name="withAction"
                      render={({
                        field: { onChange, value },
                        fieldState: { error },
                      }) => (
                        <FormControlLabel
                          control={
                            <Switch onChange={onChange} checked={!!value} />
                          }
                          label="Actionable Proposal"
                        />
                      )}
                    />
                  </FormGroup>
                </Grid>
                {withAction && (
                  <>
                    <Grid item xs={12}>
                      <Controller
                        control={control}
                        name="targets"
                        rules={{
                          required: true,
                          validate: validateAddressesArray,
                        }}
                        render={({
                          field: { onChange, value },
                          fieldState: { error },
                        }) => (
                          <FormGroup>
                            <ProposeLabel>Target addresses</ProposeLabel>
                            <AppTextField
                              error={!!error}
                              placeholder={"Ex: ..."}
                              id="outlined-multiline-flexible"
                              multiline
                              value={value}
                              maxRows={1}
                              helperText={
                                error && error.type === "required" ? (
                                  "Field Target addresses is required"
                                ) : error && error.type === "validate" ? (
                                  error.message
                                ) : (
                                  <Stack
                                    direction={"row"}
                                    alignItems={"center"}
                                  >
                                    <InfoIcon />
                                    Once this proposal is accepted, it will
                                    automatically call for this smart contract
                                    to execute.
                                  </Stack>
                                )
                              }
                              onChange={onChange}
                            />
                          </FormGroup>
                        )}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <Controller
                        control={control}
                        name="callData"
                        rules={{ required: true }}
                        render={({
                          field: { onChange, value },
                          fieldState: { error },
                        }) => (
                          <FormGroup>
                            <ProposeLabel>Calldata</ProposeLabel>
                            <AppTextField
                              placeholder={"Ex: ..."}
                              error={!!error}
                              id="outlined-multiline-static"
                              multiline
                              value={value}
                              maxRows={1}
                              helperText={
                                error ? "Field Calldata is required" : ""
                              }
                              onChange={onChange}
                            />
                          </FormGroup>
                        )}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <Controller
                        control={control}
                        name="inputValues"
                        rules={{ required: true }}
                        render={({
                          field: { onChange, value },
                          fieldState: { error },
                        }) => (
                          <FormGroup sx={{ marginBottom: "15px" }}>
                            <ProposeLabel>Values</ProposeLabel>
                            <AppTextField
                              error={!!error}
                              placeholder={"Ex: ..."}
                              id="outlined-textarea2"
                              multiline
                              value={value}
                              maxRows={1}
                              helperText={
                                error ? "Field Values is required" : ""
                              }
                              onChange={onChange}
                            />
                          </FormGroup>
                        )}
                      />
                    </Grid>
                  </>
                )}
              </Grid>
              {vBalance !== null &&
              (vBalance as number) / 10 ** 18 < MINIMUM_V_BALANCE ? (
                <WarningBox>
                  <InfoIcon
                    sx={{ width: "16px", color: "#F5953D", height: "16px" }}
                  />
                  <Typography>
                    You have less than {MINIMUM_V_BALANCE} vFTHM, and you can
                    not create a new proposal. So please, stake your FTHM tokens
                    in <Link to={"/dao/staking"}>Staking</Link> to get voting
                    power and awesome rewards.
                  </Typography>
                </WarningBox>
              ) : (
                <WarningBox>
                  <InfoIcon
                    sx={{ width: "16px", color: "#F5953D", height: "16px" }}
                  />
                  <Typography>
                    To create a proposal, you need to have 1000 vFTHM. <br />
                    Now you have {vBalance! / 10 ** 18} vFTHM
                  </Typography>
                </WarningBox>
              )}
            </Grid>
            <Grid item xs={12}>
              <Grid container spacing={1}>
                {isMobile && (
                  <Grid item xs={12}>
                    <ProposeButtonPrimary type="submit" sx={{ width: "100%" }}>
                      Submit proposal
                    </ProposeButtonPrimary>
                  </Grid>
                )}
                <Grid item xs={12} sm={4}>
                  <ProposeButtonSecondary
                    type="button"
                    sx={{ width: "100%" }}
                    onClick={saveForLater}
                  >
                    Save for later
                  </ProposeButtonSecondary>
                </Grid>
                {!isMobile && (
                  <Grid item sm={8}>
                    <ProposeButtonPrimary type="submit" sx={{ width: "100%" }}>
                      {isLoading ? (
                        <CircularProgress size={30} />
                      ) : (
                        "Submit proposal"
                      )}
                    </ProposeButtonPrimary>
                  </Grid>
                )}
              </Grid>
            </Grid>
          </Box>
        </GridContainer>
      </DialogContent>
    </AppDialog>
  );
};

export default Propose;
