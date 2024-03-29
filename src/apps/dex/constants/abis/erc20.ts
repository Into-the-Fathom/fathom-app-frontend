import { utils } from "fathom-ethers";
import ERC20_ABI from "./erc20.json";
import ERC20_BYTES32_ABI from "./erc20_bytes32.json";

const ERC20_INTERFACE = new utils.Interface(ERC20_ABI);

export default ERC20_INTERFACE;
export { ERC20_ABI, ERC20_BYTES32_ABI };
