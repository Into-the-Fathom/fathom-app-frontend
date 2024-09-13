export const findDraftProposal = (_proposalId: string) => {
  const drafts = localStorage.getItem("draftProposals") || "[]";
  return (
    JSON.parse(drafts).find((proposal: any) => proposal.id === _proposalId) ||
    {}
  );
};

export const saveDraftProposal = (values: any) => {
  const draftProposals = localStorage.getItem("draftProposals")
    ? JSON.parse(localStorage.getItem("draftProposals") as string)
    : [];

  if (values.id) {
    const updatedDraftProposals = draftProposals.map((proposal: any) =>
      proposal.id?.toLowerCase() === values.id?.toLowerCase()
        ? values
        : proposal
    );

    localStorage.setItem(
      "draftProposals",
      JSON.stringify(updatedDraftProposals)
    );
  } else {
    localStorage.setItem(
      "draftProposals",
      JSON.stringify([...draftProposals, values])
    );
  }
};

export const deleteDraftProposal = (_proposalId: string) => {
  const draftProposals = localStorage.getItem("draftProposals")
    ? JSON.parse(localStorage.getItem("draftProposals") as string)
    : [];

  const updatedDraftProposals = draftProposals.filter(
    (proposal: any) => proposal.id?.toLowerCase() !== _proposalId?.toLowerCase()
  );

  localStorage.setItem("draftProposals", JSON.stringify(updatedDraftProposals));
};