import { task } from "hardhat/config";
import { Token } from "../typechain";
import { TransferFrom } from "./interfaces";

task("transferFrom", "TransferFrom")
  .addParam("contract", "Contract address")
  .addParam("from", "From address")
  .addParam("to", "To address")
  .addParam("value", "Value")
  .setAction(async (taskArgs: TransferFrom, hre) => {
    const { contract, from, to, value } = taskArgs;
    const Token = await hre.ethers.getContractFactory("Token");
    const token: Token = await Token.attach(contract);

    const tx = await token.transferFrom(from, to, value);
    await tx.wait();
  });