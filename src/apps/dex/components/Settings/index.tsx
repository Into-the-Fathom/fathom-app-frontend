import { useRef, useState } from "react";
import { Box, styled, Typography } from "@mui/material";
import ReactGA from "react-ga4";

import { useOnClickOutside } from "apps/dex/hooks/useOnClickOutside";
import { ApplicationModal } from "apps/dex/state/application/actions";
import {
  useModalOpen,
  useToggleSettingsMenu,
} from "apps/dex/state/application/hooks";
import {
  useExpertModeManager,
  useUserTransactionTTL,
  useUserSlippageTolerance,
  useUserSingleHopOnly,
} from "apps/dex/state/user/hooks";
import { TYPE } from "apps/dex/theme";
import { ButtonError } from "apps/dex/components/Button";
import { AutoColumn } from "apps/dex/components/Column";
import Modal from "apps/dex/components/Modal";
import QuestionHelper from "apps/dex/components/QuestionHelper";
import { RowBetween, RowFixed } from "apps/dex/components/Row";
import Toggle from "apps/dex/components/Toggle";
import TransactionSettings from "apps/dex/components/TransactionSettings";

import CloseIcon from "@mui/icons-material/Close";
import settingsSrc from "apps/dex/assets/svg/settings.svg";

const StyledMenuIcon = styled(Box)`
  height: 32px;
  width: 32px;
  background: rgba(99, 121, 161, 0.2);
  border-radius: 8px;
  display: flex;
  justify-content: center;
  align-items: center;

  :hover {
    opacity: 0.7;
  }
`;

const StyledCloseIcon = styled(CloseIcon)`
  height: 20px;
  width: 20px;
  :hover {
    cursor: pointer;
  }

  > * {
    stroke: #ffffff;
  }
`;

const StyledMenuButton = styled("button")`
  position: relative;
  width: 100%;
  border: none;
  background-color: transparent;
  margin: 0;
  height: 35px;
  padding: 3px 8px;
  border-radius: 8px;

  :hover,
  :focus {
    cursor: pointer;
    outline: none;
    background: transparent;
  }

  svg {
    margin-top: 2px;
  }
`;
const EmojiWrapper = styled(Box)`
  position: absolute;
  bottom: -6px;
  right: 0;
  font-size: 14px;
`;

const StyledMenu = styled(Box)`
  margin-left: 0.5rem;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  border: none;
  text-align: left;
`;

const MenuFlyout = styled(Box)`
  min-width: 320px;
  background-color: #061023;
  box-shadow: 0 0 1px rgba(0, 0, 0, 0.01), 0 4px 8px rgba(0, 0, 0, 0.04),
    0 16px 24px rgba(0, 0, 0, 0.04), 0 24px 32px rgba(0, 0, 0, 0.01);
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  font-size: 1rem;
  position: absolute;
  top: 3rem;
  right: 0;
  z-index: 100;

  ${({ theme }) => theme.breakpoints.down("md")} {
    min-width: 18.125rem;
  }
`;

const Break = styled(Box)`
  width: 100%;
  height: 1px;
  background-color: #565a69;
`;

const ModalContentWrapper = styled(Box)`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem 0;
  background-color: #061023;
  border-radius: 20px;
`;

const SettingsTab = () => {
  const node = useRef<HTMLDivElement>();
  const open = useModalOpen(ApplicationModal.SETTINGS);
  const toggle = useToggleSettingsMenu();

  const [userSlippageTolerance, setUserslippageTolerance] =
    useUserSlippageTolerance();

  const [ttl, setTtl] = useUserTransactionTTL();

  const [expertMode, toggleExpertMode] = useExpertModeManager();

  const [singleHopOnly, setSingleHopOnly] = useUserSingleHopOnly();

  // show confirmation view before turning on
  const [showConfirmation, setShowConfirmation] = useState(false);

  useOnClickOutside(node, open ? toggle : undefined);

  return (
    <StyledMenu ref={node as any}>
      <Modal
        isOpen={showConfirmation}
        onDismiss={() => setShowConfirmation(false)}
        maxHeight={100}
      >
        <ModalContentWrapper>
          <AutoColumn gap="lg">
            <RowBetween style={{ padding: "0 2rem" }}>
              <div />
              <Typography fontWeight={500} fontSize={20}>
                Are you sure?
              </Typography>
              <StyledCloseIcon onClick={() => setShowConfirmation(false)} />
            </RowBetween>
            <Break />
            <AutoColumn gap="lg" style={{ padding: "0 2rem" }}>
              <Typography fontWeight={500} fontSize={20}>
                Expert mode turns off the confirm transaction prompt and allows
                high slippage trades that often result in bad rates and lost
                funds.
              </Typography>
              <Typography fontWeight={600} fontSize={20}>
                ONLY USE THIS MODE IF YOU KNOW WHAT YOU ARE DOING.
              </Typography>
              <ButtonError
                error={true}
                onClick={() => {
                  if (
                    window.prompt(
                      `Please type the word "confirm" to enable expert mode.`
                    ) === "confirm"
                  ) {
                    toggleExpertMode();
                    setShowConfirmation(false);
                  }
                }}
                sx={{ padding: "12px" }}
              >
                <Typography
                  fontSize={20}
                  fontWeight={500}
                  id="confirm-expert-mode"
                >
                  Turn On Expert Mode
                </Typography>
              </ButtonError>
            </AutoColumn>
          </AutoColumn>
        </ModalContentWrapper>
      </Modal>
      <StyledMenuButton onClick={toggle} id="open-settings-dialog-button">
        <StyledMenuIcon>
          <img src={settingsSrc} alt={""} />
        </StyledMenuIcon>
        {expertMode ? (
          <EmojiWrapper>
            <span role="img" aria-label="wizard-icon">
              🧙
            </span>
          </EmojiWrapper>
        ) : null}
      </StyledMenuButton>
      {open && (
        <MenuFlyout>
          <AutoColumn gap="md" style={{ padding: "1rem" }}>
            <Typography fontWeight={600} fontSize={14}>
              Transaction Settings
            </Typography>
            <TransactionSettings
              rawSlippage={userSlippageTolerance}
              setRawSlippage={setUserslippageTolerance}
              deadline={ttl}
              setDeadline={setTtl}
            />
            <Typography fontWeight={600} fontSize={14}>
              Interface Settings
            </Typography>
            <RowBetween>
              <RowFixed>
                <TYPE.black fontWeight={400} fontSize={14} color="#4F658C">
                  Toggle Expert Mode
                </TYPE.black>
                <QuestionHelper text="Bypasses confirmation modals and allows high slippage trades. Use at your own risk." />
              </RowFixed>
              <Toggle
                id="toggle-expert-mode-button"
                isActive={expertMode}
                toggle={
                  expertMode
                    ? () => {
                        toggleExpertMode();
                        setShowConfirmation(false);
                      }
                    : () => {
                        toggle();
                        setShowConfirmation(true);
                      }
                }
              />
            </RowBetween>
            <RowBetween>
              <RowFixed>
                <TYPE.black fontWeight={400} fontSize={14} color="#4F658C">
                  Disable Multihops
                </TYPE.black>
                <QuestionHelper text="Restricts swaps to direct pairs only." />
              </RowFixed>
              <Toggle
                id="toggle-disable-multihop-button"
                isActive={singleHopOnly}
                toggle={() => {
                  ReactGA.event({
                    category: "Routing",
                    action: singleHopOnly
                      ? "disable single hop"
                      : "enable single hop",
                  });
                  setSingleHopOnly(!singleHopOnly);
                }}
              />
            </RowBetween>
          </AutoColumn>
        </MenuFlyout>
      )}
    </StyledMenu>
  );
};

export default SettingsTab;
