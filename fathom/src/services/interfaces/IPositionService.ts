import BigNumber from "bignumber.js";
import ICollatralPool from "../../stores/interfaces/ICollatralPool";
import IOpenPosition from "../../stores/interfaces/IOpenPosition";
import ActiveWeb3Transactions from "../../stores/transaction.store";

export default interface IPositionService{
    openPosition(address:string,pool:ICollatralPool,collatral:number,fathomToken:number, transactionStore:ActiveWeb3Transactions): Promise<void>;
    createProxyWallet(address:string): Promise<string>;
    proxyWalletExist(address:string): Promise<string>;
    getPositionsForAddress(address:string): Promise<IOpenPosition[]>;
    getPositionsWithSafetyBuffer(address:string): Promise<IOpenPosition[]>;
    closePosition(positionId: string,pool:ICollatralPool,address:string, lockedCollatral:BigNumber, transactionStore:ActiveWeb3Transactions): Promise<void>;
    approve(address:string,pool:ICollatralPool,transactionStore:ActiveWeb3Transactions): Promise<void>;
    approvalStatus(address:string,pool:ICollatralPool,collatral:number,transactionStore:ActiveWeb3Transactions): Promise<Boolean>;
    approveStablecoin(address:string,transactionStore:ActiveWeb3Transactions): Promise<void>;
    approvalStatusStablecoin(address:string): Promise<Boolean>;
    partialyClosePosition(
        position: IOpenPosition,
        pool: ICollatralPool, 
        address: string, 
        debt: number, 
        collateralValue: number, 
        transactionStore: ActiveWeb3Transactions
    ): Promise<void>;
    
}