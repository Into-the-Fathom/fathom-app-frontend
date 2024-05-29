import { test as base, chromium, type BrowserContext } from "@playwright/test";
// @ts-ignore
import { initialSetup } from "@synthetixio/synpress/commands/metamask";
// @ts-ignore
import { prepareMetamask } from "@synthetixio/synpress/helpers";
// @ts-ignore
import { setExpectInstance } from "@synthetixio/synpress/commands/playwright";
// @ts-ignore
import { resetState } from "@synthetixio/synpress/commands/synpress";
import dotenv from "dotenv";
import FxdPage from "../pages/fxd.page";
import VaultPage from "../pages/vault.page";
import DexPage from "../pages/dex.page";
import LendingPage from "../pages/lending.page";
import DaoPage from "../pages/dao.page";
import {
  APOTHEM_RPC,
  SEPOLIA_RPC,
  XDC_RPC,
} from "../../src/connectors/networks";
dotenv.config();

let networkName: string;
let rpcUrl: string;
let chainId: string;
let symbol: string;
let blockExplorer: string;

switch (process.env.CHAIN) {
  case "xdc_mainnet":
    networkName = "XDC";
    rpcUrl = XDC_RPC;
    chainId = "50";
    symbol = "XDC";
    blockExplorer = "https://explorer.xinfin.network/";
    break;
  case "apothem":
    networkName = "XDC Test";
    rpcUrl = APOTHEM_RPC;
    chainId = "51";
    symbol = "TXDC";
    blockExplorer = "https://apothem.blocksscan.io/";
    break;
  case "sepolia":
    networkName = "sepolia";
    rpcUrl = SEPOLIA_RPC;
    chainId = "11155111";
    symbol = "ETH";
    blockExplorer = "https://sepolia.etherscan.io/";
    break;
  default:
    networkName = "XDC Test";
    rpcUrl = APOTHEM_RPC;
    chainId = "51";
    symbol = "TXDC";
    blockExplorer = "https://apothem.blocksscan.io/";
}
interface pagesAndContext {
  context: BrowserContext;
  fxdPage: FxdPage;
  vaultPage: VaultPage;
  dexPage: DexPage;
  lendingPage: LendingPage;
  daoPage: DaoPage;
}

export const test = base.extend<pagesAndContext>({
  // eslint-disable-next-line no-empty-pattern
  context: async ({}, use) => {
    // required for synpress as it shares same expect instance as playwright
    await setExpectInstance(expect);
    // download metamask
    const metamaskPath: string = await prepareMetamask(
      process.env.METAMASK_VERSION != null || "10.25.0"
    );
    // prepare browser args
    const browserArgs = [
      `--disable-extensions-except=${metamaskPath}`,
      `--load-extension=${metamaskPath}`,
      "--remote-debugging-port=9222",
    ];
    if (process.env.CI != null) {
      browserArgs.push("--disable-gpu");
    }
    if (process.env.HEADLESS_MODE === "true") {
      browserArgs.push("--headless=new");
    }
    // launch browser
    const context = await chromium.launchPersistentContext("", {
      headless: false,
      args: browserArgs,
    });
    // wait for metamask
    await context.pages()[0].waitForTimeout(3000);
    // setup metamask
    await initialSetup(chromium, {
      secretWordsOrPrivateKey: process.env.METAMASK_SETUP_PRIVATE_KEY,
      network: {
        name: networkName,
        rpcUrl,
        chainId,
        symbol,
        blockExplorer,
      },
      password: process.env.METAMASK_SETUP_PASSWORD,
      enableAdvancedSettings: true,
      enableExperimentalSettings: false,
    });
    await use(context);
    await context.close();
    await resetState();
  },
  fxdPage: async ({ page }, use) => {
    await use(new FxdPage(page));
  },
  vaultPage: async ({ page }, use) => {
    await use(new VaultPage(page));
  },
  dexPage: async ({ page }, use) => {
    await use(new DexPage(page));
  },
  lendingPage: async ({ page }, use) => {
    await use(new LendingPage(page));
  },
  daoPage: async ({ page }, use) => {
    await use(new DaoPage(page));
  },
});

export const expect = test.expect;
