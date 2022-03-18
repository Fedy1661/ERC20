import { task } from "hardhat/config";
import { Token } from "../typechain";

interface allowance {
  contract: string,
  owner: string,
  spender: string
}

task("allowance", "Get from allowances")
  .addParam("contract", "Contract address")
  .addParam("owner", "Owner address")
  .addParam("spender", "Value")
  .setAction(async (taskArgs: allowance, hre) => {
    const { contract, owner, spender } = taskArgs;
    const Token = await hre.ethers.getContractFactory("Token");
    const token: Token = await Token.attach(contract);

    const call = await token.allowance(owner, spender);
    console.log(call.toString());
  });