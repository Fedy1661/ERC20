import { task } from "hardhat/config";
import { Token } from "../typechain";

interface balanceOf {
  contract: string;
  owner: string;
}

task("balanceOf", "Get user's balance")
  .addParam("contract", "Contract address")
  .addParam("owner", "Owner address")
  .setAction(async (taskArgs: balanceOf, hre) => {
    const { contract, owner } = taskArgs;
    const Token = await hre.ethers.getContractFactory("Token");
    const token: Token = await Token.attach(contract);

    const call = await token.balanceOf(owner);

    console.log(call.toString())
  });