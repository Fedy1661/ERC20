import { task } from "hardhat/config";
import { Token } from "../typechain";
import { Approve } from "./interfaces";

task("approve", "Give access")
  .addParam("contract", "Contract address")
  .addParam("spender", "Spender address")
  .addParam("value", "Value")
  .setAction(async (taskArgs: Approve, hre) => {
    const { contract, spender, value } = taskArgs;

    const Token = await hre.ethers.getContractFactory("Token");
    const token: Token = await Token.attach(contract);

    const tx = await token.approve(spender, value);
    await tx.wait();
  });