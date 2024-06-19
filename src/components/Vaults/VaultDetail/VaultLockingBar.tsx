import dayjs from "dayjs";
import {
  Box,
  Step,
  StepContent,
  StepIconProps,
  StepLabel,
  Stepper,
  styled,
  Typography,
} from "@mui/material";
import useSharedContext from "context/shared";
import useVaultContext from "context/vault";
import { VaultPaper } from "components/AppComponents/AppPaper/AppPaper";
import { AppFlexBox } from "components/AppComponents/AppBox/AppBox";
import { ButtonPrimary } from "components/AppComponents/AppButton/AppButton";
import { CustomSkeleton } from "components/AppComponents/AppSkeleton/AppSkeleton";

import LockAquaSrc from "assets/svg/lock-aqua.svg";
import StepperItemIcon from "assets/svg/icons/stepper-item-icon.svg";
import StepperItemIconActive from "assets/svg/icons/stepper-item-icon-active.svg";

const SummaryWrapper = styled(AppFlexBox)`
  justify-content: flex-start;
  align-items: center;
  gap: 4px;
`;

const CustomPaper = styled(Box)`
  width: 100%;
  border-radius: 12px;
  background: #1e2f4d;
  padding: 16px;

  &.withdraw-btn {
    width: fit-content;
    padding: 24px;

    button {
      height: 48px;
      width: 274px;
      font-size: 17px;
      padding: 8px 16px;
    }
  }
`;

const AppStepper = styled(Stepper)`
  & .MuiStepConnector-root {
    margin-left: 8px;
  }
  & .MuiStepConnector-line {
    border-color: #3d5580;
    border-left-width: 2px;
    min-height: 12px;
  }
`;

const AppStep = styled(Step)`
  position: relative;
  & .MuiStepLabel-root {
    padding: 2px 0;
  }
  & .MuiStepLabel-label {
    color: #b7c8e5;
    font-size: 13px;
    font-weight: 600;
    line-height: 16px;
    letter-spacing: 0.5px;

    &.Mui-completed {
      color: #b7c8e5;
      font-weight: 600;
    }
  }

  & .MuiStepContent-root {
    color: #f5953d;
    font-size: 14px;
    font-weight: 600;
    line-height: 20px;
    border: none;
    padding: 0;
    margin: 0;
  }
`;

const StepLabelOptionalValue = styled("div")`
  position: absolute;
  right: 0;
  top: 1px;
  height: 20px;
  color: #43fff1;
  font-size: 14px;
  font-weight: 600;
  line-height: 20px;
  border: none;
  padding: 0;
  margin: 0;
`;

const QontoStepIconRoot = styled("div")<{ ownerState: { active?: boolean } }>(
  ({ theme, ownerState }) => ({
    color: theme.palette.mode === "dark" ? theme.palette.grey[700] : "#eaeaf0",
    display: "flex",
    height: 22,
    alignItems: "center",
    ...(ownerState.active && {
      color: "#784af4",
    }),
  })
);

const QontoStepIcon = (props: StepIconProps) => {
  const { active, completed, className } = props;

  return (
    <QontoStepIconRoot ownerState={{ active }} className={className}>
      {completed ? (
        <img
          src={StepperItemIconActive}
          alt={"step-active"}
          width={18}
          height={18}
        />
      ) : (
        <img src={StepperItemIcon} alt={"step"} width={18} height={18} />
      )}
    </QontoStepIconRoot>
  );
};

const VaultLockingBar = () => {
  const { isMobile } = useSharedContext();
  const { tfVaultDepositEndDate, tfVaultLockEndDate, activeTfPeriod } =
    useVaultContext();

  const steps = [
    {
      label: "Deposit Time",
      date:
        tfVaultDepositEndDate === null
          ? tfVaultDepositEndDate
          : new Date(Number(tfVaultDepositEndDate) * 1000),
    },
    {
      label: "Lock Time",
      date:
        tfVaultLockEndDate === null
          ? tfVaultLockEndDate
          : new Date(Number(tfVaultLockEndDate) * 1000),
    },
  ];
  return (
    <VaultPaper sx={{ marginBottom: isMobile ? "20px" : "24px" }}>
      <SummaryWrapper>
        <img src={LockAquaSrc} alt={"locked-active"} width={24} height={24} />
        <Typography variant="h3" sx={{ fontSize: isMobile ? "14px" : "16px" }}>
          Locking Period
        </Typography>
      </SummaryWrapper>
      <AppFlexBox mt="12px">
        <CustomPaper>
          <AppStepper activeStep={activeTfPeriod} orientation="vertical">
            {steps.map((step, index) => (
              <AppStep key={step.label}>
                <AppFlexBox>
                  <StepLabel
                    StepIconComponent={QontoStepIcon}
                    optional={
                      index < activeTfPeriod ? (
                        <StepLabelOptionalValue>
                          Completed
                        </StepLabelOptionalValue>
                      ) : null
                    }
                  >
                    {step.label}
                  </StepLabel>
                  <StepContent>
                    {step.date === null ? (
                      <CustomSkeleton
                        animation={"wave"}
                        variant={"rounded"}
                        width={100}
                        height={20}
                      />
                    ) : (
                      dayjs(step.date).format("DD.MM.YYYY HH:mm:ss")
                    )}
                  </StepContent>
                </AppFlexBox>
              </AppStep>
            ))}
          </AppStepper>
        </CustomPaper>
        <CustomPaper className="withdraw-btn">
          <ButtonPrimary
            type="button"
            disabled={activeTfPeriod !== steps.length}
          >
            Withdraw
          </ButtonPrimary>
        </CustomPaper>
      </AppFlexBox>
    </VaultPaper>
  );
};

export default VaultLockingBar;