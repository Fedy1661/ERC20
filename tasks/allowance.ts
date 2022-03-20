import { task } from "hardhat/config";
import { Token } from "../typechain";
import { Allowance } from "./interfaces";

task("allowance", "Get from allowances")
  .addParam("contract", "Contract address")
  .addParam("owner", "Owner address")
  .addParam("spender", "Value")
  .setAction(async (taskArgs: Allowance, hre) => {
    const { contract, owner, spender } = taskArgs;
    const Token = await hre.ethers.getContractFactory("Token");
    const token: Token = await Token.attach(contract);

    const call = await token.allowance(owner, spender);
    console.log(call.toString());
  });