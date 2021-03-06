import { task } from "hardhat/config";
import { Token } from "../typechain";
import { Transfer } from "./interfaces";

task("transfer", "Transfer tokens to the user")
  .addParam("contract", "Contract address")
  .addParam("to", "To address")
  .addParam("value", "Value")
  .setAction(async (taskArgs: Transfer, hre) => {
    const { contract, to, value } = taskArgs;

    const Token = await hre.ethers.getContractFactory("Token");
    const token: Token = await Token.attach(contract);

    const tx = await token.transfer(to, value);
    await tx.wait();
  });