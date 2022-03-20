import { task } from "hardhat/config";
import { Token } from "../typechain";

interface BalanceOf {
  contract: string;
  owner: string;
}

task("balanceOf", "Get user's balance")
  .addParam("contract", "Contract address")
  .addParam("owner", "Owner address")
  .setAction(async (taskArgs: BalanceOf, hre) => {
    const { contract, owner } = taskArgs;
    const Token = await hre.ethers.getContractFactory("Token");
    const token: Token = await Token.attach(contract);

    const call = await token.balanceOf(owner);

    console.log(call.toString())
  });