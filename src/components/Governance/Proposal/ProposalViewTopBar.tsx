import { FC } from "react";
import { styled } from "@mui/material/styles";
import { Breadcrumbs, Chip, IconButton } from "@mui/material";
import ButtonGroup from "@mui/material/ButtonGroup";
import { BaseFlexBox } from "components/Base/Boxes/StyledBoxes";
import { useNavigate } from "react-router-dom";

import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import OpenInNewRoundedIcon from "@mui/icons-material/OpenInNewRounded";
import StarOutlineRoundedIcon from "@mui/icons-material/StarOutlineRounded";
import useProposalContext from "context/proposal";
import useSharedContext from "../../../context/shared";

const StyledBreadcrumb = styled(Chip)(() => {
  return {
    fontFamily: "Inter",
    backgroundColor: "transparent",
    fontSize: "14px",
    fontWeight: 600,
    lineHeight: "20px",
    color: "#fff",
    cursor: "pointer",
    "&.disabled": {
      color: "#6D86B2",
      cursor: "default",
    },
    "&:active": {
      backgroundColor: "transparent",
    },
    "&:hover": {
      backgroundColor: "transparent",
    },
    span: {
      padding: 0,
    },
  };
}) as typeof Chip;

export enum ProposalViewTopBarVariant {
  Proposal = "Proposal",
  DraftProposal = "DraftProposal",
}

const ProposalViewTopBar: FC<{ variant?: ProposalViewTopBarVariant }> = ({
  variant = ProposalViewTopBarVariant.Proposal,
}) => {
  const navigate = useNavigate();
  const { fetchedProposal } = useProposalContext();
  const { isMobile } = useSharedContext();

  return (
    <BaseFlexBox sx={{ marginBottom: "25px" }}>
      <Breadcrumbs
        separator={<NavigateNextIcon fontSize="small" />}
        aria-label="breadcrumb"
        sx={{ color: "#6D86B2" }}
      >
        {variant === ProposalViewTopBarVariant.Proposal ? (
          <StyledBreadcrumb
            label="Proposals"
            onClick={() => navigate("/dao/governance")}
          />
        ) : (
          <StyledBreadcrumb
            label="Drafts"
            onClick={() => navigate("/dao/governance/drafts")}
          />
        )}
        {variant === ProposalViewTopBarVariant.Proposal ? (
          <StyledBreadcrumb
            label={`Proposal #${
              isMobile
                ? fetchedProposal.proposalId?.substring(0, 4) +
                  " ... " +
                  fetchedProposal.proposalId?.slice(-4)
                : fetchedProposal?.proposalId
            }`}
            className="disabled"
          />
        ) : (
          <StyledBreadcrumb label={"Overview"} className="disabled" />
        )}
      </Breadcrumbs>
      {variant === ProposalViewTopBarVariant.Proposal && (
        <ButtonGroup>
          <IconButton>
            <StarOutlineRoundedIcon sx={{ color: "#6D86B2", width: "22px" }} />
          </IconButton>
          <IconButton>
            <OpenInNewRoundedIcon sx={{ color: "#6D86B2", width: "18px" }} />
          </IconButton>
        </ButtonGroup>
      )}
    </BaseFlexBox>
  );
};

export default ProposalViewTopBar;