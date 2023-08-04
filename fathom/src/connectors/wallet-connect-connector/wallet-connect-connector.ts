import WalletConnectProvider from '@walletconnect/ethereum-provider'
import { IWCEthRpcConnectionOptions } from '@walletconnect/types'
import { AbstractConnector } from '@web3-react/abstract-connector'
import { ConnectorUpdate } from '@web3-react/types'

export const URI_AVAILABLE = 'URI_AVAILABLE'

export interface WalletConnectConnectorArguments extends IWCEthRpcConnectionOptions {
  supportedChainIds?: number[]
}

export class UserRejectedRequestError extends Error {
  public constructor() {
    super()
    this.name = this.constructor.name
    this.message = 'The user rejected the request.'
  }
}

function getSupportedChains({ supportedChainIds, rpc }: WalletConnectConnectorArguments): number[] | undefined {
  if (supportedChainIds) {
    return supportedChainIds
  }

  return rpc ? Object.keys(rpc).map(k => Number(k)) : undefined
}

export class WalletConnectConnector extends AbstractConnector {
  public walletConnectProvider?: WalletConnectProvider
  private readonly config: WalletConnectConnectorArguments

  constructor(config: WalletConnectConnectorArguments) {
    super({ supportedChainIds: getSupportedChains(config) })
    this.config = config

    this.handleChainChanged = this.handleChainChanged.bind(this)
    this.handleAccountsChanged = this.handleAccountsChanged.bind(this)
    this.handleDisconnect = this.handleDisconnect.bind(this)
  }

  private handleChainChanged(chainId: number | string): void {
    this.emitUpdate({ chainId })
  }

  private handleAccountsChanged(accounts: string[]): void {
    this.emitUpdate({ account: accounts[0] })
  }

  private handleDisconnect(): void {
    // we have to do this because of a @walletconnect/web3-provider bug
    if (this.walletConnectProvider) {
      this.walletConnectProvider.removeListener('chainChanged', this.handleChainChanged)
      this.walletConnectProvider.removeListener('accountsChanged', this.handleAccountsChanged)
      this.walletConnectProvider = undefined
    }
    this.emitDeactivate()
  }

  public async activate(): Promise<ConnectorUpdate> {
    // @ts-ignore
    this.walletConnectProvider = await WalletConnectProvider.init(this.config) as WalletConnectProvider

    // ensure that the uri is going to be available, and emit an event if there's a new uri
    // @ts-ignore
    if (!this.walletConnectProvider.connected) {
      // @ts-ignore
      await this.walletConnectProvider.enable();
      // @ts-ignore
      this.emit(URI_AVAILABLE, this.walletConnectProvider.signer.uri)
    }

    let account: string
    account = await new Promise<string>((resolve, reject) => {
      const userReject = () => {
        // Erase the provider manually
        this.walletConnectProvider = undefined
        reject(new UserRejectedRequestError())
      }

      // Workaround to bubble up the error when user reject the connection
      // @ts-ignore
      this.walletConnectProvider.on('disconnect', () => {
        // Check provider has not been enabled to prevent this event callback from being called in the future
        if (!account) {
          userReject()
        }
      })


      this.walletConnectProvider!.enable()
        .then((accounts: string[]) => resolve(accounts[0]))
        .catch((error: Error): void => {
          console.log(error)
          // TODO ideally this would be a better check
          if (error.message === 'User closed modal') {
            userReject()
            return
          }
          reject(error)
        })
    }).catch(err => {
      throw err
    })

    this.walletConnectProvider.on('disconnect', this.handleDisconnect)
    this.walletConnectProvider.on('chainChanged', this.handleChainChanged)
    this.walletConnectProvider.on('accountsChanged', this.handleAccountsChanged)

    return { provider: this.walletConnectProvider, account }
  }

  public async getProvider(): Promise<any> {
    return this.walletConnectProvider
  }

  public async getChainId(): Promise<number | string> {
    return Promise.resolve(this.walletConnectProvider!.chainId)
  }

  public async getAccount(): Promise<null | string> {
    return Promise.resolve(this.walletConnectProvider!.accounts).then((accounts: string[]): string => accounts[0])
  }

  public deactivate() {
    if (this.walletConnectProvider) {
      this.walletConnectProvider.removeListener('disconnect', this.handleDisconnect)
      this.walletConnectProvider.removeListener('chainChanged', this.handleChainChanged)
      this.walletConnectProvider.removeListener('accountsChanged', this.handleAccountsChanged)
      this.walletConnectProvider.disconnect()
    }
  }

  public async close() {
    this.emitDeactivate()
  }
}