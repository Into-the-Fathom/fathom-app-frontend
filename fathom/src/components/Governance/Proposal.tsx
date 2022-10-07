import { Constants } from "../../helpers/Constants";
import {
  Button,
  Typography,
  Container,
  Grid,
  Box,
  ButtonGroup,
} from "@mui/material";
import { useEffect, useCallback } from "react";
import { observer } from "mobx-react";
import LinearProgress, {
  LinearProgressProps,
} from "@mui/material/LinearProgress";
import { useStores } from "stores";
import useMetaMask from "hooks/metamask";
import { useParams } from "react-router-dom";
import { AppPaper } from "components/AppComponents/AppPaper/AppPaper";

const ProposalView = observer(() => {
  const { account, chainId } = useMetaMask()!;

  const { _proposalId } = useParams();
  const proposeStore = useStores().proposalStore;

  const toStatus = (_num: string) => {
    return Constants.Status[parseInt(_num)];
  };

  function LinearProgressWithLabel(
    props: LinearProgressProps & { value: number }
  ) {
    return (
      <Box sx={{ display: "flex", alignItems: "center" }}>
        <Box sx={{ width: "100%", mr: 1 }}>
          <LinearProgress variant="determinate" {...props} />
        </Box>
        <Box sx={{ minWidth: 35 }}>
          <Typography variant="body2" color="text.secondary">{`${Math.round(
            props.value
          )}%`}</Typography>
        </Box>
      </Box>
    );
  }

  function splitIfTitle_title(_string: string) {
    if (_string) {
      if (_string.includes("---------------")) {
        return _string.split("----------------")[0];
      } else {
        return "";
      }
    } else {
      return "";
    }
  }

  function splitIfTitle(_string: string) {
    if (_string) {
      if (_string.includes("---------------")) {
        return _string.split("----------------")[1];
      } else {
        return _string;
      }
    } else {
      return "";
    }
  }

  useEffect(() => {
    if (chainId) {
      setTimeout(() => {
        proposeStore.fetchProposals(account);
        if (typeof _proposalId === "string") {
          proposeStore.fetchProposal(_proposalId, account);
          proposeStore.fetchProposalState(_proposalId, account);
          proposeStore.fetchProposalVotes(_proposalId, account);
        }
      });
    } else {
      proposeStore.setProposals([]);
    }
  }, [_proposalId, account, chainId, proposeStore]);

  const handleFor = useCallback(async () => {
    try {
      if (typeof _proposalId === "string") {
        await proposeStore.castVote(_proposalId, account, "1", chainId);
      }
    } catch (err) {
      console.log(err);
    }
  }, [_proposalId, proposeStore, account, chainId]);

  const handleAgainst = useCallback(async () => {
    try {
      if (typeof _proposalId === "string") {
        await proposeStore.castVote(_proposalId, account, "0", chainId);
      }
    } catch (err) {
      console.log(err);
    }
  }, [_proposalId, proposeStore, account, chainId]);

  const handleAbstain = useCallback(async () => {
    try {
      if (typeof _proposalId === "string") {
        await proposeStore.castVote(_proposalId, account, "2", chainId);
      }
    } catch (err) {
      console.log(err);
    }
  }, [_proposalId, proposeStore, account, chainId]);

  return (
    <>
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Grid container spacing={5}>
          <Grid item xs={8} md={8} lg={9}>
            <AppPaper sx={{ p: 2, display: "flex", flexDirection: "column" }}>
              {proposeStore.fetchedProposals.length === 0 ? (
                <>
                  <Typography component="h2" color="primary" gutterBottom>
                    ... Searching for Proposal:{" "}
                  </Typography>
                  <Typography gutterBottom>{_proposalId}</Typography>
                </>
              ) : (
                <>
                  <Typography component="h2" color="primary" gutterBottom>
                    Proposal Id:
                  </Typography>
                  <Typography gutterBottom>{_proposalId}</Typography>
                  <Typography component="h2" color="primary" gutterBottom>
                    Title:
                  </Typography>

                  <Typography gutterBottom>
                    {splitIfTitle_title(
                      proposeStore.fetchedProposal.description
                    )}
                    {/* {proposeStore.fetchedProposal.description}  */}
                  </Typography>
                  <Typography component="h2" color="primary" gutterBottom>
                    Description:
                  </Typography>

                  <Typography gutterBottom>
                    {splitIfTitle(proposeStore.fetchedProposal.description)}
                    {/* {proposeStore.fetchedProposal.description}  */}
                  </Typography>
                </>
              )}
            </AppPaper>
          </Grid>

          <Grid item xs={3} md={3} lg={3}>
            <AppPaper sx={{ p: 2, display: "flex", flexDirection: "column" }}>
              <Box sx={{ width: "100%" }}>
                <Typography gutterBottom>For:</Typography>
                <LinearProgressWithLabel
                  variant="determinate"
                  value={
                    (100 * proposeStore.fetchedVotes.forVotes) /
                      proposeStore.fetchedTotalVotes || 0
                  }
                />

                <Typography gutterBottom>Against:</Typography>
                <LinearProgressWithLabel
                  variant="determinate"
                  value={
                    (100 * proposeStore.fetchedVotes.againstVotes) /
                      proposeStore.fetchedTotalVotes || 0
                  }
                />

                <Typography gutterBottom>Abstains:</Typography>
                <LinearProgressWithLabel
                  variant="determinate"
                  value={
                    (100 * proposeStore.fetchedVotes.abstainVotes) /
                      proposeStore.fetchedTotalVotes || 0
                  }
                />
              </Box>
              <Typography component="h2" color="primary" gutterBottom>
                Proposal Status:
              </Typography>
              <Typography gutterBottom>
                {toStatus(proposeStore.fetchedProposalState)}
              </Typography>

              {proposeStore.fetchedProposalState !== "1" ? (
                <>
                  <Typography variant="h6">Voting closed</Typography>
                  <ButtonGroup
                    variant="outlined"
                    aria-label="outlined button group"
                  >
                    <Button onClick={handleFor} disabled={true}>
                      {" "}
                      For{" "}
                    </Button>
                    <Button onClick={handleAgainst} disabled={true}>
                      Against
                    </Button>
                    <Button onClick={handleAbstain} disabled={true}>
                      Abstain
                    </Button>
                  </ButtonGroup>
                </>
              ) : (
                <>
                  <Typography variant="h6">Cast Vote:</Typography>
                  <ButtonGroup
                    variant="outlined"
                    aria-label="outlined button group"
                  >
                    <Button onClick={handleFor}> For </Button>
                    <Button onClick={handleAgainst}>Against</Button>
                    <Button onClick={handleAbstain}>Abstain</Button>
                  </ButtonGroup>
                </>
              )}
            </AppPaper>
          </Grid>
        </Grid>
      </Container>
    </>
  );
});

export default ProposalView;
