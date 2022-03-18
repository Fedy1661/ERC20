import { task } from "hardhat/config";
import { Token } from "../typechain";

interface transferFrom {
  contract: string;
  from: string;
  to: string;
  value: number;
}

task("transferFrom", "TransferFrom")
  .addParam("contract", "Contract address")
  .addParam("from", "From address")
  .addParam("to", "To address")
  .addParam("value", "Value")
  .setAction(async (taskArgs: transferFrom, hre) => {
    const { contract, from, to, value } = taskArgs;
    const Token = await hre.ethers.getContractFactory("Token");
    const token: Token = await Token.attach(contract);

    const tx = await token.transferFrom(from, to, value);
    await tx.wait();
  });