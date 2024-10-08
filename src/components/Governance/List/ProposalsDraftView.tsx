import { Table, TableBody, TableHead } from "@mui/material";
import {
  BaseTableCell,
  BaseTableContainer,
  BaseTableHeaderRow,
} from "components/Base/Table/StyledTable";
import ProposalsDraftListItem from "components/Governance/List/ProposalsDraftListItem";
import { FC } from "react";
import useSharedContext from "context/shared";

const ProposalsDraftView: FC<{ draftProposals: any[] }> = ({
  draftProposals,
}) => {
  const { isMobile } = useSharedContext();
  return (
    <BaseTableContainer>
      <Table aria-label="pools table">
        <TableHead>
          <BaseTableHeaderRow>
            <BaseTableCell width={isMobile ? "65%" : "80%"}>
              Proposals
            </BaseTableCell>
            <BaseTableCell width={isMobile ? "35%" : "20%"}>
              Created
            </BaseTableCell>
          </BaseTableHeaderRow>
        </TableHead>

        <TableBody>
          {draftProposals.map((proposal) => (
            <ProposalsDraftListItem proposal={proposal} key={proposal.id} />
          ))}
        </TableBody>
      </Table>
    </BaseTableContainer>
  );
};

export default ProposalsDraftView;
