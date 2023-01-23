import { Constants } from "helpers/Constants";
import { Web3Utils } from "helpers/Web3Utils";
import { Strings } from "helpers/Strings";

import { SmartContractFactory } from "config/SmartContractFactory";
import IPositionService from "services/interfaces/IPositionService";

import ICollateralPool from "stores/interfaces/ICollateralPool";
import ActiveWeb3Transactions from "stores/transaction.store";
import {
  TransactionStatus,
  TransactionType,
} from "stores/interfaces/ITransaction";

import { toWei } from "web3-utils";
import Xdc3 from "xdc3";
import AlertStore from "stores/alert.stores";
import { TransactionReceipt } from "web3-eth";
import { getEstimateGas } from "utils/getEstimateGas";

export default class PositionService implements IPositionService {
  chainId = Constants.DEFAULT_CHAIN_ID;
  alertStore: AlertStore;
  transactionStore: ActiveWeb3Transactions;

  constructor(
    alertStore: AlertStore,
    transactionStore: ActiveWeb3Transactions
  ) {
    this.alertStore = alertStore;
    this.transactionStore = transactionStore;
  }

  async openPosition(
    address: string,
    pool: ICollateralPool,
    collateral: number,
    fathomToken: number,
    library: Xdc3
  ): Promise<TransactionReceipt | undefined> {
    try {
      let proxyWalletAddress = await this.proxyWalletExist(address, library);

      if (proxyWalletAddress === Constants.ZERO_ADDRESS) {
        proxyWalletAddress = await this.createProxyWallet(address, library);
      }

      const wallet = Web3Utils.getContractInstanceFrom(
        SmartContractFactory.proxyWallet.abi,
        proxyWalletAddress,
        library
      );

      const encodedResult = library.eth.abi.encodeParameters(
        ["address"],
        [address]
      );

      const jsonInterface = SmartContractFactory.FathomStablecoinProxyAction(
        this.chainId
      ).abi.filter((abi) => abi.name === "openLockTokenAndDraw")[0];

      const openPositionCall = library.eth.abi.encodeFunctionCall(
        jsonInterface,
        [
          SmartContractFactory.PositionManager(this.chainId).address,
          SmartContractFactory.StabilityFeeCollector(this.chainId).address,
          pool.tokenAdapterAddress,
          SmartContractFactory.StablecoinAdapter(this.chainId).address,
          pool.id,
          toWei(collateral.toString(), "ether"),
          toWei(fathomToken.toString(), "ether"),
          "1",
          encodedResult,
        ]
      );

      const options = { from: address, gas: 0 };
      const gas = await getEstimateGas(
        wallet,
        "execute2",
        [
          SmartContractFactory.FathomStablecoinProxyActions(this.chainId)
            .address,
          openPositionCall,
        ],
        options
      );
      options.gas = gas;

      const receipt = await wallet.methods
        .execute2(
          SmartContractFactory.FathomStablecoinProxyActions(this.chainId)
            .address,
          openPositionCall
        )
        .send(options)
        .on("transactionHash", (hash: any) => {
          this.transactionStore.addTransaction({
            hash: hash,
            type: TransactionType.OpenPosition,
            active: false,
            status: TransactionStatus.None,
            title: `Opening Position Pending`,
            message: Strings.CheckOnBlockExplorer,
          });
        });

      this.alertStore.setShowSuccessAlert(
        true,
        "New position opened successfully!"
      );

      return receipt;
    } catch (error: any) {
      this.alertStore.setShowErrorAlert(true, error.message);
      throw error;
    }
  }

  async createProxyWallet(address: string, library: Xdc3): Promise<string> {
    try {
      const proxyWalletRegistry = Web3Utils.getContractInstance(
        SmartContractFactory.ProxyWalletRegistry(this.chainId),
        library
      );

      await proxyWalletRegistry.methods.build(address).send({ from: address });

      const proxyWallet = await proxyWalletRegistry.methods
        .proxies(address)
        .call();

      return proxyWallet;
    } catch (error: any) {
      this.alertStore.setShowErrorAlert(true, error.message);
      throw error;
    }
  }

  proxyWalletExist(address: string, library: Xdc3): Promise<string> {
    const proxyWalletRegistry = Web3Utils.getContractInstance(
      SmartContractFactory.ProxyWalletRegistry(this.chainId),
      library
    );

    return proxyWalletRegistry.methods.proxies(address).call();
  }

  async closePosition(
    positionId: string,
    pool: ICollateralPool,
    address: string,
    collateral: number,
    library: Xdc3
  ): Promise<TransactionReceipt | undefined> {
    try {
      const proxyWalletAddress = await this.proxyWalletExist(address, library);

      const wallet = Web3Utils.getContractInstanceFrom(
        SmartContractFactory.proxyWallet.abi,
        proxyWalletAddress,
        library
      );

      const encodedResult = library.eth.abi.encodeParameters(
        ["address"],
        [address]
      );

      const jsonInterface = SmartContractFactory.FathomStablecoinProxyAction(
        this.chainId
      ).abi.filter((abi) => abi.name === "wipeAllAndUnlockToken")[0];

      const wipeAllAndUnlockTokenCall = library.eth.abi.encodeFunctionCall(
        jsonInterface,
        [
          SmartContractFactory.PositionManager(this.chainId).address,
          pool.tokenAdapterAddress,
          SmartContractFactory.StablecoinAdapter(this.chainId).address,
          positionId,
          toWei(collateral.toString(), "ether"),
          encodedResult,
        ]
      );

      const options = { from: address, gas: 0 };
      const gas = await getEstimateGas(
        wallet,
        "execute2",
        [
          SmartContractFactory.FathomStablecoinProxyActions(this.chainId)
            .address,
          wipeAllAndUnlockTokenCall,
        ],
        options
      );
      options.gas = gas;

      const receipt = await wallet.methods
        .execute2(
          SmartContractFactory.FathomStablecoinProxyActions(this.chainId)
            .address,
          wipeAllAndUnlockTokenCall
        )
        .send(options)
        .on("transactionHash", (hash: any) => {
          this.transactionStore.addTransaction({
            hash: hash,
            type: TransactionType.ClosePosition,
            active: false,
            status: TransactionStatus.None,
            title: "Close Position Pending.",
            message: Strings.CheckOnBlockExplorer,
          });
        });

      this.alertStore.setShowSuccessAlert(
        true,
        "Position closed successfully!"
      );

      return receipt;
    } catch (error: any) {
      this.alertStore.setShowErrorAlert(true, error.message);
      throw error;
    }
  }

  async partiallyClosePosition(
    positionId: string,
    pool: ICollateralPool,
    address: string,
    stableCoin: number,
    collateral: number,
    library: Xdc3
  ): Promise<TransactionReceipt | undefined> {
    try {
      const proxyWalletAddress = await this.proxyWalletExist(address, library);

      const wallet = Web3Utils.getContractInstanceFrom(
        SmartContractFactory.proxyWallet.abi,
        proxyWalletAddress,
        library
      );

      const encodedResult = library.eth.abi.encodeParameters(
        ["address"],
        [address]
      );

      const jsonInterface = SmartContractFactory.FathomStablecoinProxyAction(
        this.chainId
      ).abi.filter((abi) => abi.name === "wipeAndUnlockToken")[0];

      const wipeAndUnlockTokenCall = library.eth.abi.encodeFunctionCall(
        jsonInterface,
        [
          SmartContractFactory.PositionManager(this.chainId).address,
          pool.tokenAdapterAddress,
          SmartContractFactory.StablecoinAdapter(this.chainId).address,
          positionId,
          toWei(collateral.toString(), "ether"),
          toWei(stableCoin.toString(), "ether"),
          encodedResult,
        ]
      );

      const options = { from: address, gas: 0 };
      const gas = await getEstimateGas(
        wallet,
        "execute2",
        [
          SmartContractFactory.FathomStablecoinProxyActions(this.chainId)
            .address,
          wipeAndUnlockTokenCall,
        ],
        options
      );
      options.gas = gas;

      const receipt = await wallet.methods
        .execute2(
          SmartContractFactory.FathomStablecoinProxyActions(this.chainId)
            .address,
          wipeAndUnlockTokenCall
        )
        .send({ from: address })
        .on("transactionHash", (hash: any) => {
          this.transactionStore.addTransaction({
            hash: hash,
            type: TransactionType.ClosePosition,
            active: false,
            status: TransactionStatus.None,
            title: "Close Position Pending.",
            message: Strings.CheckOnBlockExplorer,
          });
        });

      this.alertStore.setShowSuccessAlert(
        true,
        "Position closed successfully!"
      );

      return receipt;
    } catch (error: any) {
      this.alertStore.setShowErrorAlert(true, error.message);
      throw error;
    }
  }

  async approve(
    address: string,
    tokenAddress: string,
    library: Xdc3
  ): Promise<TransactionReceipt | undefined> {
    try {
      let proxyWalletAddress = await this.proxyWalletExist(address, library);

      if (proxyWalletAddress === Constants.ZERO_ADDRESS) {
        proxyWalletAddress = await this.createProxyWallet(address, library);
      }

      const BEP20 = Web3Utils.getContractInstance(
        SmartContractFactory.BEP20(tokenAddress),
        library
      );

      const options = { from: address, gas: 0 };
      const gas = await getEstimateGas(
        BEP20,
        "approve",
        [proxyWalletAddress, Constants.MAX_UINT256],
        options
      );
      options.gas = gas;

      const receipt = await BEP20.methods
        .approve(proxyWalletAddress, Constants.MAX_UINT256)
        .send(options)
        .on("transactionHash", (hash: any) => {
          this.transactionStore.addTransaction({
            hash: hash,
            type: TransactionType.Approve,
            active: false,
            status: TransactionStatus.None,
            title: `Approval Pending`,
            message: Strings.CheckOnBlockExplorer,
          });
        });

      this.alertStore.setShowSuccessAlert(
        true,
        "Approval was successful!"
      );

      return receipt;
    } catch (error: any) {
      this.alertStore.setShowErrorAlert(true, error.message);
      throw error;
    }
  }

  async approvalStatus(
    address: string,
    tokenAddress: string,
    collateral: number,
    library: Xdc3
  ): Promise<boolean> {
    collateral = collateral || 0;

    const proxyWalletAddress = await this.proxyWalletExist(address, library);

    if (proxyWalletAddress === Constants.ZERO_ADDRESS) {
      return false;
    }

    const BEP20 = Web3Utils.getContractInstance(
      SmartContractFactory.BEP20(tokenAddress),
      library
    );

    const allowance = await BEP20.methods
      .allowance(address, proxyWalletAddress)
      .call();

    return (
      Number(allowance) > Number(Constants.WeiPerWad.multipliedBy(collateral))
    );
  }

  async approveStableCoin(
    address: string,
    library: Xdc3
  ): Promise<TransactionReceipt | undefined> {
    try {
      let proxyWalletAddress = await this.proxyWalletExist(address, library);

      if (proxyWalletAddress === Constants.ZERO_ADDRESS) {
        proxyWalletAddress = await this.createProxyWallet(address, library);
      }

      const fathomStableCoin = Web3Utils.getContractInstance(
        SmartContractFactory.FathomStableCoin(this.chainId),
        library
      );

      const options = { from: address, gas: 0 };
      const gas = await getEstimateGas(
        fathomStableCoin,
        "approve",
        [proxyWalletAddress, Constants.MAX_UINT256],
        options
      );
      options.gas = gas;

      const receipt = fathomStableCoin.methods
        .approve(proxyWalletAddress, Constants.MAX_UINT256)
        .send(options)
        .on("transactionHash", (hash: any) => {
          this.transactionStore.addTransaction({
            hash: hash,
            type: TransactionType.Approve,
            active: false,
            status: TransactionStatus.None,
            title: `Approval Pending`,
            message: Strings.CheckOnBlockExplorer,
          });
        });

      this.alertStore.setShowSuccessAlert(
        true,
        "Token approval was successful!"
      );

      return receipt;
    } catch (error: any) {
      this.alertStore.setShowErrorAlert(true, error.message);
      throw error;
    }
  }

  balanceStableCoin(address: string, library: Xdc3): Promise<number> {
    const fathomStableCoin = Web3Utils.getContractInstance(
      SmartContractFactory.FathomStableCoin(this.chainId),
      library
    );

    return fathomStableCoin.methods.balanceOf(address).call();
  }

  async approvalStatusStableCoin(
    address: string,
    library: Xdc3
  ): Promise<boolean> {
    const proxyWalletAddress = await this.proxyWalletExist(address, library);

    if (proxyWalletAddress === Constants.ZERO_ADDRESS) {
      return false;
    }

    const fathomStableCoin = Web3Utils.getContractInstance(
      SmartContractFactory.FathomStableCoin(this.chainId),
      library
    );

    const allowance = await fathomStableCoin.methods
      .allowance(address, proxyWalletAddress)
      .call();

    return Number(allowance) > 10000000000000000;
  }

  setChainId(chainId: number) {
    this.chainId = chainId;
  }
}
