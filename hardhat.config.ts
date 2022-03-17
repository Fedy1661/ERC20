import * as dotenv from "dotenv";

import { HardhatUserConfig, task } from "hardhat/config";
import "@nomiclabs/hardhat-etherscan";
import "@nomiclabs/hardhat-waffle";
import "@typechain/hardhat";
import "hardhat-gas-reporter";
import "hardhat-contract-sizer";
import "solidity-coverage";
import { Token } from "./typechain";

dotenv.config();

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
interface approve {
  contract: string
  spender: string
  value: number
}
task("approve", "Prints the list of accounts", async (taskArgs: approve, hre) => {
  const {contract, spender, value} = taskArgs;

  const Token = await hre.ethers.getContractFactory("Token");
  const token: Token = await Token.attach(contract);

  const tx = await token.approve(spender, value)
  await tx.wait()
})
  .addParam('contract', "Contract address")
  .addParam('spender', 'Spender address')
  .addParam('value', 'Value');
interface allowance {
  contract: string,
  owner: string,
  spender: string
}
task("allowance", "Prints the list of accounts", async (taskArgs: allowance, hre) => {
  const {contract, owner, spender} = taskArgs;

  const Token = await hre.ethers.getContractFactory("Token");
  const token: Token = await Token.attach(contract);

  console.log(await token.allowance(owner, spender));
})
  .addParam('contract', "Contract address")
  .addParam('owner', 'Spender address')
  .addParam('spender', 'Value');

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

const config: HardhatUserConfig = {
  solidity: "0.8.4",
  networks: {
    rinkeby: {
      url: process.env.RINKEBY_URL || "",
      accounts:
        process.env.PRIVATE_KEY !== undefined ? [process.env.PRIVATE_KEY] : [],
    },
  },
  gasReporter: {
    enabled: process.env.REPORT_GAS !== undefined,
    currency: "USD",
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY,
  },
};

export default config;
