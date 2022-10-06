import { useCallback } from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { useStores } from "../../stores";
import { observer } from "mobx-react";
import useMetaMask from "../../hooks/metamask";
import Paper from "@mui/material/Paper";
import { Typography } from "@mui/material";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import { FormGroup, FormControlLabel, Checkbox } from "@mui/material";
import { Constants } from "../../helpers/Constants";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import * as React from "react";

const ProposeListView = observer(() => {
  const proposeStore = useStores().proposalStore;
  const { account, chainId } = useMetaMask()!;

  const { handleSubmit, watch, control, reset } = useForm({
    defaultValues: {
      withAction: false,
      descriptionTitle: "",
      description: "",
      inputValues: "",
      calldata: "",
      targets: "",
    },
  });

  const withAction = watch("withAction");

  useEffect(() => {
    if (chainId) {
      setTimeout(() => {
        proposeStore.getVeBalance(account, chainId);
      });
    }
  }, [account, chainId, proposeStore]);

  const onSubmit = useCallback(
    async (values: Record<string, any>) => {
      try {
        if (!chainId) return;

        const {
          descriptionTitle,
          description,
          inputValues,
          calldata,
          targets,
          withAction,
        } = values;
        const combinedText =
          descriptionTitle + "    ----------------    " + description;

        if (withAction) {
          const valuesArray = inputValues.trim().split(",").map(Number);
          const calldataArray = calldata.trim().split(",");
          const targetsArray = targets.trim().split(",");

          await proposeStore.createProposal(
            targetsArray,
            valuesArray,
            calldataArray,
            combinedText,
            account
          );
        } else {
          await proposeStore.createProposal(
            [Constants.ZERO_ADDRESS],
            [0],
            [Constants.ZERO_ADDRESS],
            combinedText,
            account
          );
        }
        reset();
      } catch (err) {
        console.log(err);
      }
    },
    [reset, account, chainId, proposeStore]
  );

  return (
    <>
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Grid container spacing={3}>
          <Grid item xs={8} md={8} lg={9}>
            <Paper
              sx={{
                p: 2,
                display: "flex",
                flexDirection: "column",
              }}
            >
              <Typography
                component="h2"
                variant="h6"
                color="primary"
                gutterBottom
              >
                Create Proposal
              </Typography>
              <Typography gutterBottom>
                Your ve token balance is:{" "}
                {(proposeStore.veBalance / 10 ** 18).toFixed(2)} veFTHM
              </Typography>
              <Box
                component="form"
                onSubmit={handleSubmit(onSubmit)}
                sx={{
                  "& .MuiTextField-root": { my: 1, width: "95%" },
                }}
                noValidate
                autoComplete="off"
              >
                <FormGroup>
                  <Controller
                    control={control}
                    name="withAction"
                    render={({
                      field: { onChange, value },
                      fieldState: { error },
                    }) => (
                      <FormControlLabel
                        control={
                          <Checkbox onChange={onChange} checked={!!value} />
                        }
                        label="Create proposal with action"
                      />
                    )}
                  />
                </FormGroup>

                <Controller
                  control={control}
                  name="descriptionTitle"
                  rules={{ required: true }}
                  render={({
                    field: { onChange, value },
                    fieldState: { error },
                  }) => (
                    <TextField
                      error={!!error}
                      id="outlined-textarea"
                      label="Title"
                      multiline
                      rows={1}
                      value={value}
                      onChange={onChange}
                      helperText={error ? "Field Title is required" : ""}
                    />
                  )}
                />
                <Controller
                  control={control}
                  name="description"
                  rules={{ required: true }}
                  render={({
                    field: { onChange, value },
                    fieldState: { error },
                  }) => (
                    <TextField
                      error={!!error}
                      id="outlined-textarea"
                      label="Description"
                      multiline
                      rows={4}
                      value={value}
                      onChange={onChange}
                      helperText={error ? "Field Description is required" : ""}
                    />
                  )}
                />
                {withAction ? (
                  <>
                    <Controller
                      control={control}
                      name="targets"
                      render={({
                        field: { onChange, value },
                        fieldState: { error },
                      }) => (
                        <TextField
                          error={!!error}
                          id="outlined-multiline-flexible"
                          label="Target addresses array"
                          multiline
                          value={value}
                          maxRows={1}
                          onChange={onChange}
                        />
                      )}
                    />

                    <Controller
                      control={control}
                      name="inputValues"
                      render={({
                        field: { onChange, value },
                        fieldState: { error },
                      }) => (
                        <TextField
                          error={!!error}
                          id="outlined-textarea2"
                          label="Values array"
                          multiline
                          value={value}
                          maxRows={1}
                          onChange={onChange}
                        />
                      )}
                    />

                    <Controller
                      control={control}
                      name="calldata"
                      render={({
                        field: { onChange, value },
                        fieldState: { error },
                      }) => (
                        <TextField
                          error={!!error}
                          id="outlined-multiline-static"
                          label="Calldatas array"
                          multiline
                          value={value}
                          maxRows={1}
                          onChange={onChange}
                        />
                      )}
                    />
                  </>
                ) : (
                  ""
                )}
                {proposeStore.veBalance / 10 ** 18 < 1000 ? (
                  <>
                    <Button
                      variant="outlined"
                      type="submit"
                      disabled={true}
                      sx={{ my: 4 }}
                    >
                      Create Proposal
                    </Button>
                    <Box component="span" sx={{ display: "inline-block", mx: 2 }}>
                      A balance of at least 1000 veFTHM is required to create a proposal.
                    </Box>
                  </>
                ) : (
                  <>
                    <Button variant="outlined" type="submit" sx={{ my: 3 }}>
                      Create Proposal
                    </Button>
                  </>
                )}
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </>
  );
});

export default ProposeListView;
