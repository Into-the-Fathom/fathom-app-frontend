import { SmartContractFactory } from "../config/SmartContractFactory";
import ICollatralPool from "../stores/interfaces/ICollatralPool";
import IPoolService from "./interfaces/IPoolService";
import BigNumber from "bignumber.js";
import { Constants } from "../helpers/Constants";
import { Web3Utils } from "../helpers/Web3Utils";

export default class PoolService implements IPoolService {
  chainId: number = Number(process.env.REACT_APP_ENV) || 1337;
  //Ideally this should be dynamic
  getPools(): ICollatralPool[] {
    let pools: ICollatralPool[] = [];
    //0x5758444300000000000000000000000000000000000000000000000000000000
    pools.push(
      {
        id: "0x5758444300000000000000000000000000000000000000000000000000000000",
        name: "WXDC",
        collatralContractAddress: SmartContractFactory.WXDC(this.chainId).address,
        CollateralTokenAdapterAddress:
          SmartContractFactory.WXDCCollateralTokenAdapter(this.chainId).address,
        availableFathom: "",
        borrowedFathom: "",
      },
      {
        id: "0x555344542d535441424c45000000000000000000000000000000000000000000",
        name: "USDT",
        collatralContractAddress: SmartContractFactory.USDT(this.chainId).address,
        CollateralTokenAdapterAddress:
          SmartContractFactory.USDTCollateralTokenAdapter(this.chainId).address,
        availableFathom: "",
        borrowedFathom: "",
      }
    );

    return pools;
  }

  async fetchPools(): Promise<ICollatralPool[]> {
    console.log("fetching Pools...");
    let pools: ICollatralPool[] = [];
    try {
      let contract = Web3Utils.getContractInstance(
        SmartContractFactory.PoolConfig(this.chainId)
      );
      for (const pool of this.getPools()) {
        let response = await contract.methods
          .getCollateralPoolInfo(pool.id)
          .call();
        let debtShare = new BigNumber(response[1]).div(Constants.WeiPerWad);
        let debtCeiling = new BigNumber(response[2]).div(Constants.WeiPerRad);
        pool.availableFathom = debtCeiling.minus(debtShare).toFormat(0);
        pool.borrowedFathom = debtShare.toFormat(0);
        pools.push(pool);
      }

      console.log(`Pool details ${JSON.stringify(pools)} `);
      return pools;
    } catch (exception) {
      console.log(
        `Error fetching pool information: ${JSON.stringify(exception)}`
      );
    } finally {
      return pools;
    }
  }

  setChainId(chainId: number) {
    this.chainId = chainId;
  }
}
