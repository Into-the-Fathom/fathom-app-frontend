import { RootStore } from ".";
import IProposalService from "services/interfaces/IProposalService";
import IVoteCounts from "stores/interfaces/IVoteCounts";
import { makeAutoObservable } from "mobx";

export default class ProposalStore {
  fetchedVotes: IVoteCounts;

  fetchedTotalVotes: number = 0.000000001;

  weight: number = 0;
  service: IProposalService;
  rootStore: RootStore;

  constructor(rootStore: RootStore, service: IProposalService) {
    makeAutoObservable(this);
    this.service = service;
    this.fetchedVotes = {} as IVoteCounts;

    this.rootStore = rootStore;
  }

  showErrorMessage(msg: string) {
    this.rootStore.alertStore.setShowErrorAlert(
      true,
      msg
    );
  }

  async createProposal(
    targets: string[],
    values: number[],
    callData: string[],
    description: string,
    account: string
  ) {
    try {
      await this.service.createProposal(
        targets,
        values,
        callData,
        description,
        account,
        this.rootStore.transactionStore
      );
    } catch (e: any) {
      this.showErrorMessage(e.message);
      throw e;
    }
  }

  async executeProposal(
    targets: string[],
    values: number[],
    callData: string[],
    description: string,
    account: string
  ) {
    try {
      await this.service.executeProposal(
        targets,
        values,
        callData,
        description,
        account,
        this.rootStore.transactionStore
      );
    } catch (e: any) {
      this.showErrorMessage(e.message);
    }
  }


  async castVote(
    proposalId: string,
    account: string,
    support: string,
  ) {
    try {
      await this.service.castVote(
        proposalId,
        account,
        support,
        this.rootStore.transactionStore,
      );

      await Promise.all([
        this.fetchProposalState(proposalId, account),
        this.fetchProposalVotes(proposalId, account)
      ])
    } catch (e: any) {
      this.showErrorMessage(e.message);
    }
  }

  async hasVoted(proposalId: string, account: string): Promise<boolean | undefined> {
    try {
      return await this.service.hasVoted(proposalId, account)
    } catch (e: any) {
      this.showErrorMessage(e.message);
    }
  }

  async getVBalance(account: string) {
    try {
      return await this.service.getVeBalance(account);
    } catch (e: any) {
      this.showErrorMessage(e.message);
    }
  }

  async fetchProposalState(
    proposal: string,
    account: string,
  ) {
    try {
      return await this.service.viewProposalState(
        proposal,
        account,
      );
    } catch (e: any) {
      this.showErrorMessage(e.message);
    }
  }

  async fetchProposalVotes(
    proposal: string,
    account: string,
  ) {
    try {
      const fetchedVotes = await this.service.viewVoteCounts(
        proposal,
        account,
      );
      this.setProposalVotes(fetchedVotes);
    } catch (e: any) {
      this.showErrorMessage(e.message);
    }
  }

  setProposalVotes(_proposalVotes: IVoteCounts) {
    _proposalVotes.abstainVotes = _proposalVotes.abstainVotes / 10 ** 18;
    _proposalVotes.againstVotes = _proposalVotes.againstVotes / 10 ** 18;
    _proposalVotes.forVotes = _proposalVotes.forVotes / 10 ** 18;

    this.fetchedTotalVotes =
      _proposalVotes.abstainVotes +
      _proposalVotes.againstVotes +
      _proposalVotes.forVotes;
    this.fetchedVotes = _proposalVotes;
  }

  setWeight(_weight: number) {
    this.weight = _weight;
  }
}