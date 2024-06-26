import { type Page, type Locator, expect } from "@playwright/test";
import BasePage from "./base.page";
import { extractNumericValue } from "../utils/helpers";
import {
  GraphOperationName,
  ValidateVaultDataParams,
  VaultAction,
  VaultDepositData,
  VaultDetailsTabs,
  WalletConnectOptions,
} from "../types";
// @ts-ignore
import * as metamask from "@synthetixio/synpress/commands/metamask";
import { graphAPIEndpoints } from "../fixtures/api.data";

export default class VaultPage extends BasePage {
  readonly path: string;
  readonly dialogListItemManageModal: Locator;
  readonly dialogListItemDepositModal: Locator;
  readonly spanDepositedValueAfterManageVaultDialog: Locator;
  readonly spanPoolShareValueAfterManageVaultDialog: Locator;
  readonly spanShareTokensValueAfterManageVaultDialog: Locator;
  readonly spanDepositedValueBeforeManageVaultDialog: Locator;
  readonly spanPoolShareValueBeforeManageVaultDialog: Locator;
  readonly spanShareTokensValueBeforeManageVaultDialog: Locator;
  readonly inputDepositAmountListItemManageModal: Locator;
  readonly inputReceiveSharesTokenListItemManageModal: Locator;
  readonly inputWithdrawAmountListItemManageModal: Locator;
  readonly inputBurnSharesTokenListItemManageModal: Locator;
  readonly inputDepositAmountListItemDepositModal: Locator;
  readonly inputReceiveSharesTokenListItemDepositModal: Locator;
  readonly btnMaxDepositInputListItemManageModal: Locator;
  readonly btnMaxWithdrawInputListItemManageModal: Locator;
  readonly btnMaxDepositInputListItemDepositModal: Locator;
  readonly btnConfirmDepositListItemManageModal: Locator;
  readonly btnConfirmWithdrawListItemManageModal: Locator;
  readonly btnConfirmDepositListItemDepositModal: Locator;
  readonly btnDepositNavItemListItemManageModal: Locator;
  readonly btnWithdrawNavItemListItemManageModal: Locator;
  readonly progressBar: Locator;
  readonly divDialogModalPositionOpenedSuccessfully: Locator;
  readonly btnCloseModal: Locator;
  readonly doneIconModal: Locator;
  readonly headingFourModal: Locator;
  readonly spanBodyOneModal: Locator;
  readonly spanBodyTwoModal: Locator;
  readonly btnApproveListItemDepositModal: Locator;
  readonly btnConnectWallet: Locator;
  readonly vaultContractAddressDetailAbout: Locator;
  readonly balanceValueVaultDetails: Locator;
  readonly btnDepositNavItemDetailManageModal: Locator;
  readonly btnWithdrawNavItemDetailManageModal: Locator;
  readonly inputDepositAmountDetailManageModal: Locator;
  readonly inputReceiveSharesTokenDetailManageModal: Locator;
  readonly inputWithdrawAmountDetailManageModal: Locator;
  readonly inputBurnSharesTokenDetailManageModal: Locator;
  readonly btnDepositDetailManageModal: Locator;
  readonly btnResetDetailManageModal: Locator;
  readonly btnWithdrawDetailManageModal: Locator;
  readonly btnMaxDepositInputDetailManageModal: Locator;
  readonly btnMaxWithdrawInputDetailManageModal: Locator;

  constructor(page: Page) {
    super(page);
    this.path = "/#/vaults";

    // Locators
    this.dialogListItemManageModal = this.page
      .getByTestId("vault-listItemManageModal")
      .locator('//div[@role="dialog"]');
    this.dialogListItemDepositModal = this.page
      .getByTestId("vault-listItemDepositModal")
      .locator('//div[@role="dialog"]');
    this.spanDepositedValueAfterManageVaultDialog = this.page.locator(
      '//span[contains(text(), "Deposited")]//ancestor::li/div[2]/span'
    );
    this.spanPoolShareValueAfterManageVaultDialog = this.page.locator(
      '//span[contains(text(), "Pool share")]//ancestor::li/div[2]/span'
    );
    this.spanShareTokensValueAfterManageVaultDialog = this.page.locator(
      '//span[contains(text(), "Share tokens")]//ancestor::li/div[2]/span'
    );
    this.spanDepositedValueBeforeManageVaultDialog = this.page.locator(
      '//span[contains(text(), "Deposited")]//ancestor::li/div[2]'
    );
    this.spanPoolShareValueBeforeManageVaultDialog = this.page.locator(
      '//span[contains(text(), "Pool share")]//ancestor::li/div[2]'
    );
    this.spanShareTokensValueBeforeManageVaultDialog = this.page.locator(
      '//span[contains(text(), "Share tokens")]//ancestor::li/div[2]'
    );
    this.inputDepositAmountListItemManageModal = this.page
      .getByTestId("vault-listItemManageModal-depositInputWrapper")
      .locator("input");
    this.inputReceiveSharesTokenListItemManageModal = this.page
      .getByTestId("vault-listItemManageModal-receiveSharesInputWrapper")
      .locator("input");
    this.inputWithdrawAmountListItemManageModal = this.page
      .getByTestId("vault-listItemManageModal-withdrawInputWrapper")
      .locator("input");
    this.inputBurnSharesTokenListItemManageModal = this.page
      .getByTestId("vault-listItemManageModal-burnSharesInputWrapper")
      .locator("input");
    this.inputDepositAmountListItemDepositModal = this.page
      .getByTestId("vault-listItemDepositModal-depositInputWrapper")
      .locator("input");
    this.inputReceiveSharesTokenListItemDepositModal = this.page
      .getByTestId("vault-listItemDepositModal-receiveSharesInputWrapper")
      .locator("input");
    this.btnMaxDepositInputListItemManageModal = this.page.getByTestId(
      "vault-listItemManageModal-depositInput-maxButton"
    );
    this.btnMaxWithdrawInputListItemManageModal = this.page.getByTestId(
      "vault-listItemManageModal-withdrawInput-maxButton"
    );
    this.btnMaxDepositInputListItemDepositModal = this.page.getByTestId(
      "vault-listItemDepositModal-depositInput-maxButton"
    );
    this.btnConfirmDepositListItemManageModal = this.page.getByTestId(
      "vault-listItemManageModal-depositButton"
    );
    this.btnConfirmWithdrawListItemManageModal = this.page.getByTestId(
      "vault-listItemManageModal-withdrawButton"
    );
    this.btnConfirmDepositListItemDepositModal = this.page.getByTestId(
      "vault-listItemDepositModal-depositButton"
    );

    this.progressBar = this.page.locator('[role="progressbar"]');
    this.btnCloseModal = this.page.locator('button[aria-label="close"]');
    this.doneIconModal = this.page.locator('[data-testid="DoneIcon"]');
    this.headingFourModal = this.page.locator('div[role="dialog"] h1');
    this.spanBodyOneModal = this.page.locator(
      'div[role="dialog"] p[class*="MuiTypography-description"]'
    );
    this.spanBodyTwoModal = this.page.locator(
      'div[role="dialog"] span[class*="MuiTypography-body2"]'
    );
    this.divDialogModalPositionOpenedSuccessfully = this.page.locator(
      '//h4[text()="All done!"]/parent::div'
    );
    this.btnDepositNavItemListItemManageModal = this.page.getByTestId(
      "vault-listItemManageModal-depositNavItem"
    );
    this.btnWithdrawNavItemListItemManageModal = this.page.getByTestId(
      "vault-listItemManageModal-withdrawNavItem"
    );
    this.btnApproveListItemDepositModal = this.page.getByTestId(
      "vault-listItemDepositModal-approveButton"
    );
    this.btnConnectWallet = this.page.locator(
      "//button[text()='Connect Wallet']"
    );
    this.vaultContractAddressDetailAbout = this.page.locator(
      "//div[text()='Vault contract address:']//a"
    );
    this.balanceValueVaultDetails = this.page.getByTestId(
      "vault-detailsPositionStats-balanceValue"
    );
    this.btnDepositNavItemDetailManageModal = this.page.getByTestId(
      "vault-detailManageModal-depositNavItem"
    );
    this.btnWithdrawNavItemDetailManageModal = this.page.getByTestId(
      "vault-detailManageModal-withdrawNavItem"
    );
    this.inputDepositAmountDetailManageModal = this.page
      .getByTestId("vault-detailManageModal-depositInputWrapper")
      .locator("input");
    this.inputReceiveSharesTokenDetailManageModal = this.page
      .getByTestId("vault-detailManageModal-receiveSharesInputWrapper")
      .locator("input");
    this.inputWithdrawAmountDetailManageModal = this.page
      .getByTestId("vault-detailManageModal-withdrawInputWrapper")
      .locator("input");
    this.inputBurnSharesTokenDetailManageModal = this.page
      .getByTestId("vault-detailManageModal-burnSharesInputWrapper")
      .locator("input");
    this.btnResetDetailManageModal = this.page.getByTestId(
      "vault-detailManageModal-resetButton"
    );
    this.btnDepositDetailManageModal = this.page.getByTestId(
      "vault-detailManageModal-depositButton"
    );
    this.btnWithdrawDetailManageModal = this.page.getByTestId(
      "vault-detailManageModal-withdrawButton"
    );
    this.btnMaxDepositInputDetailManageModal = this.page.getByTestId(
      "vault-detailManageModal-depositInput-maxButton"
    );
    this.btnMaxWithdrawInputDetailManageModal = this.page.getByTestId(
      "vault-detailManageModal-withdrawInput-maxButton"
    );
  }

  async navigate(): Promise<void> {
    await super.navigate(this.path);
  }

  getVaultRowLocatorById(id: string): Locator {
    return this.page.locator(`[data-testid="vaultRow-${id}"]`);
  }

  getVaultRowDetailsLocatorById(id: string): Locator {
    return this.page.locator(`[data-testid="vaultRowDetails-${id}"]`);
  }

  getDepositButtonRowLocatorById(id: string): Locator {
    return this.page.locator(`[data-testid="vaultRow-${id}-depositButton"]`);
  }

  getManageVaultButtonRowLocatorById(id: string): Locator {
    return this.page.locator(
      `[data-testid="vaultRowDetails-${id}-managePositionButton"]`
    );
  }

  async getTvlVaultRowValue(id: string): Promise<number | null> {
    const tvlValue = await this.page
      .locator(`[data-testid="vaultRow-${id}-tvlValueCell"] > div`)
      .textContent();
    if (tvlValue !== null) {
      return extractNumericValue(tvlValue);
    } else {
      return null;
    }
  }

  async getAvailableVaultRowValue(id: string): Promise<number | null> {
    const availableValue = await this.page
      .locator(`[data-testid="vaultRow-${id}-availableValueCell"] > div`)
      .textContent();
    if (availableValue !== null) {
      return extractNumericValue(availableValue);
    } else {
      return null;
    }
  }

  async getStakedVaultRowValue(id: string): Promise<number | null> {
    const stakedValue = await this.page
      .locator(
        `[data-testid="vaultRow-${id}-stakedValueCell"] div[class*="value"]`
      )
      .textContent();
    if (stakedValue !== null) {
      return extractNumericValue(stakedValue);
    } else {
      return null;
    }
  }

  async getEarnedVaultRowValue(id: string): Promise<number | null> {
    const earnedValue = await this.page
      .locator(`[data-testid="vaultRow-${id}-earnedValueCell"] > div`)
      .textContent();
    if (earnedValue !== null) {
      return extractNumericValue(earnedValue);
    } else {
      return null;
    }
  }

  async getPooledVaultRowDetailsValue(id: string): Promise<number | null> {
    const pooledValue = await this.page
      .locator(
        `[data-testid="vaultRowDetails-${id}-itemPositionInfo-earningDetails-pooledValue"]`
      )
      .textContent();
    if (pooledValue !== null) {
      return extractNumericValue(pooledValue);
    } else {
      return null;
    }
  }

  async getYourShareVaultRowDetailsValue(id: string): Promise<number | null> {
    const yourShareValue = await this.page
      .locator(
        `[data-testid="vaultRowDetails-${id}-itemPositionInfo-earningDetails-yourShareValue"]`
      )
      .textContent();
    if (yourShareValue !== null) {
      return extractNumericValue(yourShareValue);
    } else {
      return null;
    }
  }

  async getShareTokenVaultRowDetailsValue(id: string): Promise<number | null> {
    const shareTokenValue = await this.page
      .locator(
        `[data-testid="vaultRowDetails-${id}-itemPositionInfo-earningDetails-shareTokenValue"]`
      )
      .textContent();
    if (shareTokenValue !== null) {
      return extractNumericValue(shareTokenValue);
    } else {
      return null;
    }
  }

  getExtendDetailsButtonVaultRow(id: string): Locator {
    return this.page.locator(`[data-testid="vaultRow-${id}-extendButton"]`);
  }

  getHideDetailsButtonVaultRow(id: string): Locator {
    return this.page.locator(`[data-testid="vaultRow-${id}-hideButton"]`);
  }

  async enterDepositAmountDialogManageModal(amount: number): Promise<void> {
    await this.page.waitForTimeout(1000);
    await this.inputDepositAmountListItemManageModal.clear();
    await this.inputDepositAmountListItemManageModal.fill(amount.toString());
  }

  async enterWithdrawAmountDialogManageModal(amount: number): Promise<void> {
    await this.page.waitForTimeout(1000);
    await this.inputWithdrawAmountListItemManageModal.clear();
    await this.inputWithdrawAmountListItemManageModal.fill(amount.toString());
  }

  async confirmDepositDialogManageModal(): Promise<void> {
    await this.btnConfirmDepositListItemManageModal.click();
    await expect.soft(this.progressBar).toBeVisible();
    await this.page.waitForTimeout(1000);
    await expect(this.divAlert).toBeHidden({ timeout: 100 });
    await metamask.confirmTransaction();
  }

  async enterDepositAmountDialogDepositModal(amount: number): Promise<void> {
    await this.page.waitForTimeout(1000);
    await this.inputDepositAmountListItemDepositModal.clear();
    await this.inputDepositAmountListItemDepositModal.fill(amount.toString());
  }

  async confirmDepositDialogDepositModal(): Promise<void> {
    await this.btnConfirmDepositListItemDepositModal.click();
    await expect.soft(this.progressBar).toBeVisible();
    await this.page.waitForTimeout(1000);
    await expect(this.divAlert).toBeHidden({ timeout: 100 });
    await metamask.confirmTransaction();
  }

  async confirmWithdrawDialogManageModal(): Promise<void> {
    await this.btnConfirmWithdrawListItemManageModal.click();
    await expect.soft(this.progressBar).toBeVisible();
    await this.page.waitForTimeout(1000);
    await expect(this.divAlert).toBeHidden({ timeout: 100 });
    await metamask.confirmTransaction();
  }

  async validateManagePositionDialogNotVisible(): Promise<void> {
    await expect.soft(this.dialogListItemManageModal).not.toBeVisible({
      timeout: 20000,
    });
  }

  async validateDepositSuccessfulModal({
    shareTokenName,
  }: {
    shareTokenName: string;
  }): Promise<void> {
    await expect.soft(this.doneIconModal).toBeVisible();
    await expect.soft(this.headingFourModal).toBeVisible();
    await expect.soft(this.headingFourModal).toHaveText("All done!");
    await expect.soft(this.spanBodyOneModal).toBeVisible();
    await expect
      .soft(this.spanBodyOneModal)
      .toHaveText("Deposit was successful!");
    await expect.soft(this.spanBodyTwoModal).toBeVisible();
    await expect
      .soft(this.spanBodyTwoModal)
      .toHaveText(`Add ${shareTokenName} to wallet to track your balance.`);
  }

  async closeDepositSuccessfuldModal(): Promise<void> {
    await this.btnCloseModal.click();
    await expect(
      this.divDialogModalPositionOpenedSuccessfully
    ).not.toBeVisible();
  }

  getVaultDetailsTabLocator(id: string, tabName: VaultDetailsTabs): Locator {
    return this.getVaultRowDetailsLocatorById(id).locator(
      `//button[text()="${tabName}"]`
    );
  }

  async openVaultDetails(id: string): Promise<void> {
    await expect(this.getVaultRowLocatorById(id)).toBeVisible();
    await this.page.getByTestId(`vaultRow-${id}-tokenTitle`).click();
  }

  async getContractAddressDetailAbout(): Promise<string> {
    const addressValue =
      (await this.vaultContractAddressDetailAbout.textContent()) as string;
    return addressValue;
  }

  async manageVaultDialogDeposit({
    id,
    shareTokenName,
    depositAmount,
  }: {
    id: string;
    shareTokenName: string;
    depositAmount: number;
  }): Promise<VaultDepositData> {
    await this.getManageVaultButtonRowLocatorById(id).click();
    await expect(this.dialogListItemManageModal).toBeVisible();
    await this.btnDepositNavItemListItemManageModal.click();
    await this.enterDepositAmountDialogManageModal(depositAmount);
    await this.page.waitForTimeout(2000);
    const depositedValueBeforeText =
      await this.spanDepositedValueBeforeManageVaultDialog.textContent();
    const poolShareValueBeforeText =
      await this.spanPoolShareValueBeforeManageVaultDialog.textContent();
    const shareTokensValueBeforeText =
      await this.spanShareTokensValueBeforeManageVaultDialog.textContent();
    const depositedValueAfterText =
      await this.spanDepositedValueAfterManageVaultDialog.textContent();
    const poolShareValueAfterText =
      await this.spanPoolShareValueAfterManageVaultDialog.textContent();
    const shareTokensValueAfterText =
      await this.spanShareTokensValueAfterManageVaultDialog.textContent();
    let depositedValueBefore: number | null;
    let poolShareValueBefore: number | null;
    let shareTokensValueBefore: number | null;
    let depositedValueAfter: number | null;
    let poolShareValueAfter: number | null;
    let shareTokensValueAfter: number | null;
    if (
      depositedValueBeforeText !== null &&
      poolShareValueBeforeText !== null &&
      shareTokensValueBeforeText !== null &&
      depositedValueAfterText !== null &&
      poolShareValueAfterText !== null &&
      shareTokensValueAfterText !== null
    ) {
      depositedValueBefore = extractNumericValue(depositedValueBeforeText);
      poolShareValueBefore = extractNumericValue(poolShareValueBeforeText);
      shareTokensValueBefore = extractNumericValue(shareTokensValueBeforeText);
      depositedValueAfter = extractNumericValue(depositedValueAfterText);
      poolShareValueAfter = extractNumericValue(poolShareValueAfterText);
      shareTokensValueAfter = extractNumericValue(shareTokensValueAfterText);
    } else {
      depositedValueBefore = null;
      expect(depositedValueBefore).not.toBeNull();
      poolShareValueBefore = null;
      expect(poolShareValueBefore).not.toBeNull();
      shareTokensValueBefore = null;
      expect(shareTokensValueBefore).not.toBeNull();
      depositedValueAfter = null;
      expect(depositedValueAfter).not.toBeNull();
      poolShareValueAfter = null;
      expect(poolShareValueAfter).not.toBeNull();
      shareTokensValueAfter = null;
      expect(shareTokensValueAfter).not.toBeNull();
    }
    const vaultDepositDataExpected: VaultDepositData = {
      stakedAmountDialogBefore: depositedValueBefore,
      poolShareDialogBefore: poolShareValueBefore,
      shareTokensDialogBefore: shareTokensValueBefore,
      stakedAmountDialogAfter: depositedValueAfter,
      poolShareDialogAfter: poolShareValueAfter,
      shareTokensDialogAfter: shareTokensValueAfter,
    };
    await this.confirmDepositDialogManageModal();
    await Promise.all([
      this.validateAlertMessage({
        status: "pending",
        title: "New Deposit Pending.",
        body: "Click on transaction to view on Block Explorer.",
      }),
      this.waitForGraphRequestByOperationName(
        graphAPIEndpoints.vaultsSubgraph,
        GraphOperationName.Vaults
      ),
      this.waitForGraphRequestByOperationName(
        graphAPIEndpoints.vaultsSubgraph,
        GraphOperationName.AccountVaultPositions
      ),
    ]);
    await this.validateManagePositionDialogNotVisible();
    await this.validateDepositSuccessfulModal({ shareTokenName });
    await this.closeDepositSuccessfuldModal();
    await this.page.waitForLoadState("load");
    await this.page.waitForTimeout(2000);
    return vaultDepositDataExpected;
  }

  async validateVaultDataListItemPage({
    id,
    action,
    amountChanged,
    stakedAmountDialogBefore,
    stakedAmountDialogAfter,
  }: ValidateVaultDataParams): Promise<void> {
    const stakedAmountRowActual = await this.getStakedVaultRowValue(id);
    if (action === VaultAction.Deposit) {
      expect
        .soft(Math.round((stakedAmountDialogAfter as number) * 100) / 100)
        .toEqual(
          Math.round((Number(stakedAmountDialogBefore) + amountChanged) * 100) /
            100
        );
      expect
        .soft(stakedAmountRowActual)
        .toBeGreaterThanOrEqual(
          Number((Number(stakedAmountDialogBefore) + amountChanged).toFixed(2))
        );
    } else if (action === VaultAction.Withdraw) {
      expect
        .soft(Math.round((stakedAmountDialogAfter as number) * 100) / 100)
        .toEqual(
          Math.round((Number(stakedAmountDialogBefore) - amountChanged) * 100) /
            100
        );
      expect
        .soft(stakedAmountRowActual)
        .toBeGreaterThanOrEqual(
          Number((Number(stakedAmountDialogBefore) - amountChanged).toFixed(2))
        );
    }
  }

  async validateVaultDataDetailManagePage({
    id,
    stakedAmountDialogAfter,
    poolShareDialogAfter,
    shareTokensDialogAfter,
  }: ValidateVaultDataParams): Promise<void> {
    await expect(
      this.page.getByTestId("KeyboardArrowRightRoundedIcon")
    ).toBeVisible();
    expect.soft(await this.getContractAddressDetailAbout()).toEqual(id);
    await this.page.waitForTimeout(2000);
    const depositedValueDetailPageBeforeText =
      await this.spanDepositedValueBeforeManageVaultDialog.textContent();
    const depositedValueDetailPageAfterText =
      await this.spanDepositedValueAfterManageVaultDialog.textContent();
    const poolShareValueDetailPageBeforeText =
      await this.spanPoolShareValueBeforeManageVaultDialog.textContent();
    const poolShareValueDetailPageAfterText =
      await this.spanPoolShareValueAfterManageVaultDialog.textContent();
    const shareTokensValueDetailPageBeforeText =
      await this.spanShareTokensValueBeforeManageVaultDialog.textContent();
    const shareTokensValueDetailPageAfterText =
      await this.spanShareTokensValueAfterManageVaultDialog.textContent();
    let depositedValueDetailPageBefore: number | null;
    let poolShareValueDetailPageBefore: number | null;
    let shareTokensValueDetailPageBefore: number | null;
    let depositedValueDetailPageAfter: number | null;
    let poolShareValueDetailPageAfter: number | null;
    let shareTokensValueDetailPageAfter: number | null;
    if (
      depositedValueDetailPageBeforeText !== null &&
      poolShareValueDetailPageBeforeText !== null &&
      shareTokensValueDetailPageBeforeText !== null &&
      depositedValueDetailPageAfterText !== null &&
      poolShareValueDetailPageAfterText !== null &&
      shareTokensValueDetailPageAfterText !== null
    ) {
      depositedValueDetailPageBefore = extractNumericValue(
        depositedValueDetailPageBeforeText
      );
      poolShareValueDetailPageBefore = extractNumericValue(
        poolShareValueDetailPageBeforeText
      );
      shareTokensValueDetailPageBefore = extractNumericValue(
        shareTokensValueDetailPageBeforeText
      );
      depositedValueDetailPageAfter = extractNumericValue(
        depositedValueDetailPageAfterText
      );
      poolShareValueDetailPageAfter = extractNumericValue(
        poolShareValueDetailPageAfterText
      );
      shareTokensValueDetailPageAfter = extractNumericValue(
        shareTokensValueDetailPageAfterText
      );
    } else {
      depositedValueDetailPageBefore = null;
      expect(depositedValueDetailPageBefore).not.toBeNull();
      poolShareValueDetailPageBefore = null;
      expect(poolShareValueDetailPageBefore).not.toBeNull();
      shareTokensValueDetailPageBefore = null;
      expect(shareTokensValueDetailPageBefore).not.toBeNull();
      depositedValueDetailPageAfter = null;
      expect(depositedValueDetailPageAfter).not.toBeNull();
      poolShareValueDetailPageAfter = null;
      expect(poolShareValueDetailPageAfter).not.toBeNull();
      shareTokensValueDetailPageAfter = null;
      expect(shareTokensValueDetailPageAfter).not.toBeNull();
    }
    expect
      .soft(Math.round((depositedValueDetailPageBefore as number) * 100) / 100)
      .toBeGreaterThanOrEqual(
        Math.round((stakedAmountDialogAfter as number) * 100) / 100
      );
    expect
      .soft(Math.round((depositedValueDetailPageAfter as number) * 100) / 100)
      .toBeGreaterThanOrEqual(
        Math.round((stakedAmountDialogAfter as number) * 100) / 100
      );
    expect
      .soft(Math.round((poolShareValueDetailPageBefore as number) * 100) / 100)
      .toEqual(Math.round((poolShareDialogAfter as number) * 100) / 100);
    expect
      .soft(Math.round((poolShareValueDetailPageAfter as number) * 100) / 100)
      .toEqual(Math.round((poolShareDialogAfter as number) * 100) / 100);
    expect
      .soft(
        Math.round((shareTokensValueDetailPageBefore as number) * 100) / 100
      )
      .toBeGreaterThanOrEqual(
        Math.round((shareTokensDialogAfter as number) * 100) / 100
      );
    expect
      .soft(Math.round((shareTokensValueDetailPageAfter as number) * 100) / 100)
      .toBeGreaterThanOrEqual(
        Math.round((shareTokensDialogAfter as number) * 100) / 100
      );
    const balanceValueText = await this.balanceValueVaultDetails.textContent();
    const balanceValue = extractNumericValue(balanceValueText as string);
    expect
      .soft(balanceValue)
      .toEqual(Number((stakedAmountDialogAfter as number).toFixed(2)));
    await expect.soft(this.btnDepositNavItemDetailManageModal).toBeVisible();
    await expect.soft(this.btnDepositNavItemDetailManageModal).toBeEnabled();
    await expect.soft(this.btnWithdrawNavItemDetailManageModal).toBeVisible();
    await expect.soft(this.btnWithdrawNavItemDetailManageModal).toBeEnabled();
    await expect.soft(this.inputDepositAmountDetailManageModal).toBeVisible();
    await expect.soft(this.inputDepositAmountDetailManageModal).toHaveValue("");
    await expect
      .soft(this.inputDepositAmountDetailManageModal)
      .toHaveAttribute("placeholder", "0");
    await expect.soft(this.btnMaxDepositInputDetailManageModal).toBeVisible();
    await expect.soft(this.btnMaxDepositInputDetailManageModal).toBeEnabled();
    await expect
      .soft(this.inputReceiveSharesTokenDetailManageModal)
      .toBeVisible();
    await expect
      .soft(this.inputReceiveSharesTokenDetailManageModal)
      .toBeDisabled();
    await expect
      .soft(this.inputReceiveSharesTokenDetailManageModal)
      .toHaveValue("");
    await expect
      .soft(this.inputReceiveSharesTokenDetailManageModal)
      .toHaveAttribute("placeholder", "0");
    await expect.soft(this.btnDepositDetailManageModal).toBeVisible();
    await expect.soft(this.btnDepositDetailManageModal).toBeEnabled();
    await expect.soft(this.btnResetDetailManageModal).toBeVisible();
    await expect.soft(this.btnResetDetailManageModal).toBeEnabled();
    await this.btnWithdrawNavItemDetailManageModal.click();
    await expect.soft(this.inputWithdrawAmountDetailManageModal).toBeVisible();
    await expect
      .soft(this.inputWithdrawAmountDetailManageModal)
      .toHaveValue("");
    await expect
      .soft(this.inputWithdrawAmountDetailManageModal)
      .toHaveAttribute("placeholder", "0");
    await expect.soft(this.btnMaxWithdrawInputDetailManageModal).toBeVisible();
    await expect.soft(this.btnMaxWithdrawInputDetailManageModal).toBeEnabled();
    await expect.soft(this.inputBurnSharesTokenDetailManageModal).toBeVisible();
    await expect
      .soft(this.inputBurnSharesTokenDetailManageModal)
      .toBeDisabled();
    await expect
      .soft(this.inputBurnSharesTokenDetailManageModal)
      .toHaveValue("");
    await expect
      .soft(this.inputBurnSharesTokenDetailManageModal)
      .toHaveAttribute("placeholder", "0");
    await expect.soft(this.btnWithdrawDetailManageModal).toBeVisible();
    await expect.soft(this.btnWithdrawDetailManageModal).toBeEnabled();
    await expect.soft(this.btnResetDetailManageModal).toBeVisible();
    await expect.soft(this.btnResetDetailManageModal).toBeEnabled();
  }

  async manageVaultWithdrawPartially({
    id,
    withdrawAmount,
  }: {
    id: string;
    withdrawAmount: number;
  }): Promise<VaultDepositData> {
    await this.getManageVaultButtonRowLocatorById(id).click();
    await expect(this.dialogListItemManageModal).toBeVisible();
    await this.btnWithdrawNavItemListItemManageModal.click();
    await this.enterWithdrawAmountDialogManageModal(withdrawAmount);
    await this.page.waitForTimeout(2000);
    const depositedValueBeforeText =
      await this.spanDepositedValueBeforeManageVaultDialog.textContent();
    const poolShareValueBeforeText =
      await this.spanPoolShareValueBeforeManageVaultDialog.textContent();
    const shareTokensValueBeforeText =
      await this.spanShareTokensValueBeforeManageVaultDialog.textContent();
    const depositedValueAfterText =
      await this.spanDepositedValueAfterManageVaultDialog.textContent();
    const poolShareValueAfterText =
      await this.spanPoolShareValueAfterManageVaultDialog.textContent();
    const shareTokensValueAfterText =
      await this.spanShareTokensValueAfterManageVaultDialog.textContent();
    let depositedValueBefore: number | null;
    let poolShareValueBefore: number | null;
    let shareTokensValueBefore: number | null;
    let depositedValueAfter: number | null;
    let poolShareValueAfter: number | null;
    let shareTokensValueAfter: number | null;
    if (
      depositedValueBeforeText !== null &&
      poolShareValueBeforeText !== null &&
      shareTokensValueBeforeText !== null &&
      depositedValueAfterText !== null &&
      poolShareValueAfterText !== null &&
      shareTokensValueAfterText !== null
    ) {
      depositedValueBefore = extractNumericValue(depositedValueBeforeText);
      poolShareValueBefore = extractNumericValue(poolShareValueBeforeText);
      shareTokensValueBefore = extractNumericValue(shareTokensValueBeforeText);
      depositedValueAfter = extractNumericValue(depositedValueAfterText);
      poolShareValueAfter = extractNumericValue(poolShareValueAfterText);
      shareTokensValueAfter = extractNumericValue(shareTokensValueAfterText);
    } else {
      depositedValueBefore = null;
      expect(depositedValueBefore).not.toBeNull();
      poolShareValueBefore = null;
      expect(poolShareValueBefore).not.toBeNull();
      shareTokensValueBefore = null;
      expect(shareTokensValueBefore).not.toBeNull();
      depositedValueAfter = null;
      expect(depositedValueAfter).not.toBeNull();
      poolShareValueAfter = null;
      expect(poolShareValueAfter).not.toBeNull();
      shareTokensValueAfter = null;
      expect(shareTokensValueAfter).not.toBeNull();
    }
    const vaultDepositDataExpected: VaultDepositData = {
      stakedAmountDialogBefore: depositedValueBefore,
      poolShareDialogBefore: poolShareValueBefore,
      shareTokensDialogBefore: shareTokensValueBefore,
      stakedAmountDialogAfter: depositedValueAfter,
      poolShareDialogAfter: poolShareValueAfter,
      shareTokensDialogAfter: shareTokensValueAfter,
    };
    await this.confirmWithdrawDialogManageModal();
    await Promise.all([
      this.validateAlertMessage({
        status: "pending",
        title: "Withdraw Pending.",
        body: "Click on transaction to view on Block Explorer.",
      }),
      this.validateAlertMessage({
        status: "success",
        title: "Withdraw was successful!",
      }),
      this.waitForGraphRequestByOperationName(
        graphAPIEndpoints.vaultsSubgraph,
        GraphOperationName.Vaults
      ),
      this.waitForGraphRequestByOperationName(
        graphAPIEndpoints.vaultsSubgraph,
        GraphOperationName.AccountVaultPositions
      ),
    ]);
    await this.page.waitForLoadState("load");
    await this.page.waitForTimeout(2000);
    return vaultDepositDataExpected;
  }

  async manageVaultWithdrawFully({ id }: { id: string }): Promise<void> {
    await this.getManageVaultButtonRowLocatorById(id).click();
    await expect(this.dialogListItemManageModal).toBeVisible();
    await this.btnWithdrawNavItemListItemManageModal.click();
    await this.page.waitForTimeout(5000);
    await this.btnMaxWithdrawInputListItemManageModal.click();
    await this.page.waitForTimeout(2000);
    const depositedValueAfterText =
      await this.spanDepositedValueAfterManageVaultDialog.textContent();
    const poolShareValueAfterText =
      await this.spanPoolShareValueAfterManageVaultDialog.textContent();
    const shareTokensValueAfterText =
      await this.spanShareTokensValueAfterManageVaultDialog.textContent();
    let depositedValueAfter: number | null;
    let poolShareValueAfter: number | null;
    let shareTokensValueAfter: number | null;
    if (
      depositedValueAfterText !== null &&
      poolShareValueAfterText !== null &&
      shareTokensValueAfterText !== null
    ) {
      depositedValueAfter = extractNumericValue(depositedValueAfterText);
      poolShareValueAfter = extractNumericValue(poolShareValueAfterText);
      shareTokensValueAfter = extractNumericValue(shareTokensValueAfterText);
    } else {
      depositedValueAfter = null;
      poolShareValueAfter = null;
      shareTokensValueAfter = null;
    }
    expect.soft(depositedValueAfter).toEqual(0);
    expect.soft(poolShareValueAfter).toEqual(0);
    expect.soft(shareTokensValueAfter).toEqual(0);
    await this.confirmWithdrawDialogManageModal();
    await Promise.all([
      this.validateAlertMessage({
        status: "pending",
        title: "Withdraw Pending.",
        body: "Click on transaction to view on Block Explorer.",
      }),
      this.validateAlertMessage({
        status: "success",
        title: "Withdraw was successful!",
      }),
      this.waitForGraphRequestByOperationName(
        graphAPIEndpoints.vaultsSubgraph,
        GraphOperationName.Vaults
      ),
      this.waitForGraphRequestByOperationName(
        graphAPIEndpoints.vaultsSubgraph,
        GraphOperationName.AccountVaultPositions
      ),
    ]);
    await this.page.waitForLoadState("load");
    await this.page.waitForTimeout(2000);
  }

  async approveTokensMaxUintListItemDepositModal() {
    await expect(this.dialogListItemDepositModal).toBeVisible();
    if (await this.btnApproveListItemDepositModal.isVisible()) {
      await this.btnApproveListItemDepositModal.click();
      await expect.soft(this.progressBar).toBeVisible();
      await this.page.waitForTimeout(1000);
      await expect(this.divAlert).toBeHidden({ timeout: 100 });
      await metamask.confirmPermissionToSpend();
      await this.validateAlertMessage({
        status: "success",
        title: "Token approval was successful!",
      });
    }
  }

  async depositFirstTime({
    id,
    shareTokenName,
    depositAmount,
  }: {
    id: string;
    shareTokenName: string;
    depositAmount: number;
  }): Promise<VaultDepositData> {
    await expect
      .soft(this.getDepositButtonRowLocatorById(id))
      .toHaveText("Deposit");
    await expect
      .soft(this.getVaultDetailsTabLocator(id, VaultDetailsTabs.YourPosition))
      .not.toBeVisible();
    await this.getDepositButtonRowLocatorById(id).click();
    await expect(this.dialogListItemDepositModal).toBeVisible();
    await this.page.waitForTimeout(2000);
    await this.enterDepositAmountDialogDepositModal(depositAmount);
    await this.page.waitForTimeout(2000);
    await this.approveTokensMaxUintListItemDepositModal();
    await this.page.waitForTimeout(2000);
    const depositedValueBeforeText =
      await this.spanDepositedValueBeforeManageVaultDialog.textContent();
    const poolShareValueBeforeText =
      await this.spanPoolShareValueBeforeManageVaultDialog.textContent();
    const shareTokensValueBeforeText =
      await this.spanShareTokensValueBeforeManageVaultDialog.textContent();
    const depositedValueAfterText =
      await this.spanDepositedValueAfterManageVaultDialog.textContent();
    const poolShareValueAfterText =
      await this.spanPoolShareValueAfterManageVaultDialog.textContent();
    const shareTokensValueAfterText =
      await this.spanShareTokensValueAfterManageVaultDialog.textContent();
    let depositedValueBefore: number | null;
    let poolShareValueBefore: number | null;
    let shareTokensValueBefore: number | null;
    let depositedValueAfter: number | null;
    let poolShareValueAfter: number | null;
    let shareTokensValueAfter: number | null;
    if (
      depositedValueBeforeText !== null &&
      poolShareValueBeforeText !== null &&
      shareTokensValueBeforeText !== null &&
      depositedValueAfterText !== null &&
      poolShareValueAfterText !== null &&
      shareTokensValueAfterText !== null
    ) {
      depositedValueBefore = extractNumericValue(depositedValueBeforeText);
      poolShareValueBefore = extractNumericValue(poolShareValueBeforeText);
      shareTokensValueBefore = extractNumericValue(shareTokensValueBeforeText);
      depositedValueAfter = extractNumericValue(depositedValueAfterText);
      poolShareValueAfter = extractNumericValue(poolShareValueAfterText);
      shareTokensValueAfter = extractNumericValue(shareTokensValueAfterText);
    } else {
      depositedValueBefore = null;
      expect(depositedValueBefore).not.toBeNull();
      poolShareValueBefore = null;
      expect(poolShareValueBefore).not.toBeNull();
      shareTokensValueBefore = null;
      expect(shareTokensValueBefore).not.toBeNull();
      depositedValueAfter = null;
      expect(depositedValueAfter).not.toBeNull();
      poolShareValueAfter = null;
      expect(poolShareValueAfter).not.toBeNull();
      shareTokensValueAfter = null;
      expect(shareTokensValueAfter).not.toBeNull();
    }
    const vaultDepositDataExpected: VaultDepositData = {
      stakedAmountDialogBefore: depositedValueBefore,
      poolShareDialogBefore: poolShareValueBefore,
      shareTokensDialogBefore: shareTokensValueBefore,
      stakedAmountDialogAfter: depositedValueAfter,
      poolShareDialogAfter: poolShareValueAfter,
      shareTokensDialogAfter: shareTokensValueAfter,
    };
    await this.confirmDepositDialogDepositModal();
    await Promise.all([
      this.validateAlertMessage({
        status: "pending",
        title: "New Deposit Pending.",
        body: "Click on transaction to view on Block Explorer.",
      }),
      this.waitForGraphRequestByOperationName(
        graphAPIEndpoints.vaultsSubgraph,
        GraphOperationName.Vaults
      ),
      this.waitForGraphRequestByOperationName(
        graphAPIEndpoints.vaultsSubgraph,
        GraphOperationName.AccountVaultPositions
      ),
    ]);
    await this.validateManagePositionDialogNotVisible();
    await this.validateDepositSuccessfulModal({ shareTokenName });
    await this.closeDepositSuccessfuldModal();
    await this.page.waitForLoadState("load");
    await this.page.waitForTimeout(2000);
    return vaultDepositDataExpected;
  }

  async connectWalletVault(
    wallet: WalletConnectOptions,
    options?: { allAccounts: boolean }
  ): Promise<void> {
    await this.btnConnectWallet.click();
    await this.page.getByText(wallet).click();
    if (options) {
      await metamask.acceptAccess(options);
    } else {
      await metamask.acceptAccess();
    }
  }
}
