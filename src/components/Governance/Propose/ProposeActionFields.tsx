import { FC } from "react";
import { Controller } from "react-hook-form";
import {
  CardContent,
  Card,
  CardHeader,
  FormGroup,
  Grid,
  Stack,
  styled,
} from "@mui/material";
import { ButtonSecondary } from "components/AppComponents/AppButton/AppButton";

import { ProposeLabel, InfoIcon } from "components/Governance/Propose";
import useCreateProposalActionField from "hooks/Governance/useCreateProposalActionField";
import { BaseTextField } from "components/Base/Form/StyledForm";

type ProposeActionFieldsProps = {
  index: number;
  removeAction: (index: number) => void;
};

const ProposeActionFieldTitle = styled(CardHeader)`
  padding-bottom: 0;
`;

const ProposeActionFieldsCard = styled(Card)`
  width: 100%;
  margin-bottom: 10px !important;
  background: transparent;
  border-radius: 8px;
  border: 1px solid #566e99;
`;

const RemoveActionButton = styled(ButtonSecondary)`
  height: 30px;
  padding: 8px 10px;
  margin-top: 5px;
  margin-right: 7px;
`;

const ProposeActionFields: FC<ProposeActionFieldsProps> = ({
  index,
  removeAction,
}) => {
  const { validateAddress, control } = useCreateProposalActionField(index);

  return (
    <ProposeActionFieldsCard>
      <ProposeActionFieldTitle
        title={`Action ${index + 1}`}
        action={
          index > 0 ? (
            <RemoveActionButton onClick={() => removeAction(index)}>
              Remove Action
            </RemoveActionButton>
          ) : null
        }
      />
      <CardContent>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Controller
              control={control}
              name={`actions.${index}.target`}
              rules={{
                required: true,
                validate: validateAddress,
              }}
              render={({
                field: { onChange, value },
                fieldState: { error },
              }) => (
                <FormGroup>
                  <ProposeLabel>Target address</ProposeLabel>
                  <BaseTextField
                    error={!!error}
                    placeholder={"Ex: ..."}
                    id="outlined-multiline-flexible"
                    multiline
                    value={value}
                    maxRows={1}
                    helperText={
                      error && error.type === "required" ? (
                        "Field Target address is required"
                      ) : error && error.type === "validate" ? (
                        error.message
                      ) : (
                        <Stack
                          direction={"row"}
                          alignItems={"center"}
                          component={"span"}
                        >
                          <InfoIcon />
                          Once this proposal is accepted, it will automatically
                          call for this smart contract to execute.
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
              name={`actions.${index}.functionSignature`}
              rules={{ required: true }}
              render={({
                field: { onChange, value },
                fieldState: { error },
              }) => (
                <FormGroup>
                  <ProposeLabel>Function Signature</ProposeLabel>
                  <BaseTextField
                    error={!!error}
                    placeholder={"Ex: name(uint256,bool)"}
                    id="outlined-textarea2"
                    multiline
                    value={value}
                    maxRows={1}
                    helperText={
                      error
                        ? "Field Function Signature is required"
                        : "Describe function signature. Example: name(uint256,bool)"
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
              name={`actions.${index}.functionArguments`}
              render={({
                field: { onChange, value },
                fieldState: { error },
              }) => (
                <FormGroup>
                  <ProposeLabel>Function Arguments</ProposeLabel>
                  <BaseTextField
                    error={!!error}
                    placeholder={"Ex: 100, true, some text"}
                    id="outlined-textarea2"
                    multiline
                    value={value}
                    maxRows={1}
                    helperText={
                      "Describe each argument with a comma. Example: 100, true, some text"
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
              name={`actions.${index}.value`}
              render={({
                field: { onChange, value },
                fieldState: { error },
              }) => (
                <FormGroup>
                  <ProposeLabel>Value</ProposeLabel>
                  <BaseTextField
                    error={!!error}
                    placeholder={"Ex: ..."}
                    id="outlined-textarea2"
                    multiline
                    value={value}
                    maxRows={1}
                    helperText={
                      "Fill amount of token which will send in transaction."
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
              name={`actions.${index}.callData`}
              rules={{ required: true }}
              render={({
                field: { onChange, value },
                fieldState: { error },
              }) => (
                <FormGroup>
                  <ProposeLabel>Calldata</ProposeLabel>
                  <BaseTextField
                    multiline
                    placeholder={"Ex: ..."}
                    error={!!error}
                    id="outlined-multiline-static"
                    value={value}
                    maxRows={3}
                    helperText={error ? "Field Calldata is required" : ""}
                    onChange={onChange}
                  />
                </FormGroup>
              )}
            />
          </Grid>
        </Grid>
      </CardContent>
    </ProposeActionFieldsCard>
  );
};

export default ProposeActionFields;
