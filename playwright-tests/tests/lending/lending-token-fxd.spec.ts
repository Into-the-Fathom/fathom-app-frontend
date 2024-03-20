import { test, expect } from "../../fixtures/pomSynpressFixture";
import { LendingAssets, WalletConnectOptions } from "../../types";
import dotenv from "dotenv";
dotenv.config();

test.describe("Fathom App Test Suite: Lending - FXD Token Tests", () => {
  test.beforeEach(async ({ lendingPage }) => {
    await lendingPage.navigate();
    await lendingPage.connectWallet(WalletConnectOptions.Metamask);
    await lendingPage.validateConnectedWalletAddress();
    await lendingPage.repayAllBorrowedAssetsFullyIfAny();
    await lendingPage.withdrawAllSuppliedAssetsFullyIfAny();
  });

  test("Supply FXD Token when no FXD is supplied is successful", async ({
    lendingPage,
  }) => {
    const assetName = LendingAssets.FXD;
    const supplyAmount = 1.43;
    const assetNativeAmountBefore =
      await lendingPage.getSuppliedAssetNativeAmount({
        assetName,
      });
    await lendingPage.supplyAsset({
      assetName,
      amount: supplyAmount,
    });
    const assetNativeAmountAfter =
      await lendingPage.getSuppliedAssetNativeAmount({
        assetName,
      });
    expect(assetNativeAmountAfter).toEqual(
      assetNativeAmountBefore + supplyAmount
    );
  });

  test("Supply FXD Token when FXD is already supplied is successful", async ({
    lendingPage,
  }) => {
    const assetName = LendingAssets.FXD;
    const supplyAmountFirst = 1.832;
    const supplyAmountSecond = 2;
    // Supply token first
    await lendingPage.supplyAsset({
      assetName,
      amount: supplyAmountFirst,
    });
    const assetNativeAmountBefore =
      await lendingPage.getSuppliedAssetNativeAmount({
        assetName,
      });
    // Supply token when token is already supplied
    await lendingPage.supplyAsset({
      assetName,
      amount: supplyAmountSecond,
      isSupplied: true,
    });
    const assetNativeAmountAfter =
      await lendingPage.getSuppliedAssetNativeAmount({
        assetName,
      });
    expect(assetNativeAmountAfter).toEqual(
      assetNativeAmountBefore + supplyAmountSecond
    );
  });

  test("Borrow FXD Token with variable APY rate is successful", async ({
    lendingPage,
  }) => {
    const assetName = LendingAssets.FXD;
    const supplyAmount = 10;
    const borrowAmount = 1;
    // Supply token first
    await lendingPage.supplyAsset({
      assetName,
      amount: supplyAmount,
    });
    // Borrow token
    const assetNativeAmountBorrowedBefore =
      await lendingPage.getBorrowedAssetNativeAmount({
        assetName,
      });
    await lendingPage.borrowAsset({
      assetName,
      amount: borrowAmount,
      isStable: false,
    });
    const assetNativeAmountBorrowedAfter =
      await lendingPage.getBorrowedAssetNativeAmount({
        assetName,
      });
    expect(assetNativeAmountBorrowedAfter).toEqual(
      assetNativeAmountBorrowedBefore + borrowAmount
    );
  });

  test("Borrow FXD Token with stable APY rate is successful", async ({
    lendingPage,
  }) => {
    const assetNameOne = LendingAssets.FXD;
    const assetNameTwo = LendingAssets.CGO;
    const supplyAmountFXD = 10;
    const supplyAmountCGO = 10;
    const borrowAmount = supplyAmountFXD + 1;
    // Supply tokens first
    await lendingPage.supplyAsset({
      assetName: assetNameOne,
      amount: supplyAmountFXD,
    });
    await lendingPage.supplyAsset({
      assetName: assetNameTwo,
      amount: supplyAmountCGO,
    });
    // Borrow token
    const assetNativeAmountBorrowedBefore =
      await lendingPage.getBorrowedAssetNativeAmount({
        assetName: assetNameOne,
      });
    await lendingPage.borrowAsset({
      assetName: assetNameOne,
      amount: borrowAmount,
      isStable: true,
    });
    const assetNativeAmountBorrowedAfter =
      await lendingPage.getBorrowedAssetNativeAmount({
        assetName: assetNameOne,
      });
    expect(assetNativeAmountBorrowedAfter).toEqual(
      assetNativeAmountBorrowedBefore + borrowAmount
    );
  });

  test("Toggling FXD token APY type to variable and stable is successful", async ({
    lendingPage,
  }) => {
    const assetNameOne = LendingAssets.FXD;
    const assetNameTwo = LendingAssets.CGO;
    const supplyAmountFXD = 10;
    const supplyAmountCGO = 10;
    const borrowAmount = 11;
    // Supply tokens first
    await lendingPage.supplyAsset({
      assetName: assetNameOne,
      amount: supplyAmountFXD,
    });
    await lendingPage.supplyAsset({
      assetName: assetNameTwo,
      amount: supplyAmountCGO,
    });
    // Borrow token
    await lendingPage.borrowAsset({
      assetName: assetNameOne,
      amount: borrowAmount,
      isStable: false,
    });
    // Toggle Apy to stable and validate
    await lendingPage.toggleApyTypeAndValidate({
      assetName: assetNameOne,
    });
    // Toggle Apy to variable and validate
    await lendingPage.toggleApyTypeAndValidate({
      assetName: assetNameOne,
    });
  });

  test("Repay FXD with regular FXD partially is successfull", async ({
    lendingPage,
  }) => {
    const assetName = LendingAssets.FXD;
    const supplyAmount = 10;
    const borrowAmount = 1;
    const repayAmount = 0.5;
    // Supply token first
    await lendingPage.supplyAsset({
      assetName,
      amount: supplyAmount,
    });
    // Borrow token
    await lendingPage.borrowAsset({
      assetName,
      amount: borrowAmount,
      isStable: false,
    });
    // Repay token partially
    const assetNativeAmountBorrowedBefore =
      await lendingPage.getBorrowedAssetNativeAmount({
        assetName,
      });
    await lendingPage.repayAsset({
      assetName,
      amount: repayAmount,
    });
    const assetNativeAmountBorrowedAfter =
      await lendingPage.getBorrowedAssetNativeAmount({
        assetName,
      });
    expect(assetNativeAmountBorrowedAfter).toEqual(
      assetNativeAmountBorrowedBefore - repayAmount
    );
  });

  test("Repay FXD fully with fmFXD is successful", async ({ lendingPage }) => {
    // Supply token first
    const assetName = LendingAssets.FXD;
    const supplyAmount = 10;
    const borrowAmount = 1;
    await lendingPage.supplyAsset({
      assetName,
      amount: supplyAmount,
    });
    // Borrow token
    await lendingPage.borrowAsset({
      assetName,
      amount: borrowAmount,
      isStable: false,
    });
    // Repay token fully
    await lendingPage.repayAsset({
      assetName,
      isMax: true,
      isFm: true,
    });
    await expect(lendingPage.paragraphBorrowEmpty).toBeVisible({
      timeout: 10000,
    });
  });

  test("Withdraw FXD partially is successful", async ({ lendingPage }) => {
    // Supply token first
    const assetName = LendingAssets.FXD;
    const supplyAmount = 10;
    const withdrawAmount = 4.5;
    await lendingPage.supplyAsset({
      assetName,
      amount: supplyAmount,
    });
    // Withdraw token partially
    const assetNativeAmountSuppliedBefore =
      await lendingPage.getSuppliedAssetNativeAmount({
        assetName,
      });
    await lendingPage.withdrawAsset({
      assetName,
      amount: withdrawAmount,
    });
    const assetNativeAmountSuppliedAfter =
      await lendingPage.getSuppliedAssetNativeAmount({
        assetName,
      });
    expect(assetNativeAmountSuppliedAfter).toEqual(
      assetNativeAmountSuppliedBefore - withdrawAmount
    );
  });

  test("Withdraw FXD fully is successful", async ({ lendingPage }) => {
    const assetName = LendingAssets.FXD;
    const supplyAmount = 10;
    // Supply token first
    await lendingPage.supplyAsset({
      assetName,
      amount: supplyAmount,
    });
    // Withdraw token fully
    await lendingPage.withdrawAsset({
      assetName,
      isMax: true,
    });
    await expect(lendingPage.paragraphSupplyEmpty).toBeVisible({
      timeout: 10000,
    });
  });

  test("Toggling FXD collateral to enabled / disabled is successful", async ({
    lendingPage,
  }) => {
    const assetName = LendingAssets.FXD;
    const supplyAmount = 6;
    // Supply token first, collateral enabled by default
    await lendingPage.supplyAsset({
      assetName,
      amount: supplyAmount,
    });
    await expect(
      lendingPage.getDashboardSuppliedAssetCollateralSwitchLocator({
        assetName,
      })
    ).toBeChecked();
    // Disable collateral
    await lendingPage.toggleAssetCollateral({ assetName });
    await expect(
      lendingPage.getDashboardSuppliedAssetCollateralSwitchLocator({
        assetName,
      })
    ).not.toBeChecked();
    // Enable collateral
    await lendingPage.toggleAssetCollateral({ assetName });
    await expect(
      lendingPage.getDashboardSuppliedAssetCollateralSwitchLocator({
        assetName,
      })
    ).toBeChecked();
  });
});
