import { ethers, network } from "hardhat";
import chai, { expect } from "chai";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { Token } from "../../typechain";
import { BigNumber } from "ethers";

chai.use(require("chai-bignumber")());

describe("Token", function() {
  let contract: Token;
  let owner: SignerWithAddress;
  let addr1: SignerWithAddress;
  let clean: string;

  const initValue = 10;

  before(async () => {
    const Contract = await ethers.getContractFactory("Token");
    contract = await Contract.deploy();
    [owner, addr1] = await ethers.getSigners();
    await contract.deployed();

    clean = await network.provider.send("evm_snapshot");
  });

  afterEach(async () => {
    await network.provider.send("evm_revert", [clean]);
    clean = await network.provider.send("evm_snapshot");
  });

  describe("name", () => {
    it("should return name", async () => {
      const name = await contract.name();
      expect(name).to.be.a("string");
    });
    it("should not spend gas", async () => {
      const tx = await contract.name();
      expect(tx).does.not.have.a.property("gasPrice");
    });
  });
  describe("symbol", () => {
    it("should return symbol", async () => {
      const symbol = await contract.symbol();
      expect(symbol).to.be.a("string");
    });
    it("should not spend gas", async () => {
      const tx = await contract.symbol();
      expect(tx).does.not.have.a.property("gasPrice");
    });
  });
  describe("decimals", () => {
    it("should return decimals", async () => {
      const decimals = await contract.decimals();
      expect(decimals).to.be.a("number");
    });
    it("should not spend gas", async () => {
      const tx = await contract.decimals();
      expect(tx).does.not.have.a.property("gasPrice");
    });
  });
  describe("totalSupply", () => {
    it("should return totalSupply", async () => {
      const totalSupply = await contract.totalSupply();
      expect(totalSupply).to.be.instanceof(BigNumber);
    });
    it("should not spend gas", async () => {
      const tx = await contract.totalSupply();
      expect(tx).does.not.have.a.property("gasPrice");
    });
  });
  describe("balanceOf", () => {
    it("should return 0 to unknown user", async () => {
      const balance = await contract.balanceOf(addr1.address);
      expect(balance).to.be.equal(0);
    });
    it("should return valid balance", async () => {
      const balance = await contract.balanceOf(owner.address);
      const totalSupply = await contract.totalSupply();
      expect(balance).to.be.equal(totalSupply);
    });
    it("should not spend gas", async () => {
      const tx = await contract.balanceOf(owner.address);
      expect(tx).does.not.have.a.property("gasPrice");
    });
  });
  describe("transfer", () => {
    it("should be an error when value equals 0", async () => {
      const tx = contract.transfer(addr1.address, 0);
      const reason = "Value should be positive";
      await expect(tx).to.be.revertedWith(reason);
    });
    it("should be an error when sending to yourself", async () => {
      const tx = contract.connect(owner).transfer(owner.address, initValue);
      const reason = "You cannot transfer to yourself";
      await expect(tx).to.be.revertedWith(reason);
    });
    it("should be an error when not enough tokens", async () => {
      const tx = contract.connect(addr1).transfer(owner.address, initValue);
      const reason = "Not enough tokens";
      await expect(tx).to.be.revertedWith(reason);
    });
    it("should increase balance", async () => {
      await contract.connect(owner).transfer(addr1.address, initValue);
      const balance = await contract.balanceOf(addr1.address);
      expect(balance).to.be.equal(initValue);
    });
    it("should decrease balance", async () => {
      const startBalance = await contract.balanceOf(owner.address);
      await contract.connect(owner).transfer(addr1.address, initValue);
      const endBalance = await contract.balanceOf(owner.address);
      expect(startBalance).to.be.eq(endBalance.add(initValue));
    });
    it("should emit event", async () => {
      const tx = contract.connect(owner).transfer(addr1.address, initValue);
      await expect(tx).to.be.emit(contract, "Transfer");
    });
    it("should spend gas", async () => {
      const tx = await contract.connect(owner).transfer(
        addr1.address, initValue
      );
      expect(tx).have.a.property("gasPrice");
    });
  });
  describe("transferFrom", () => {
    it("should be an error when value equals 0", async () => {
      const tx = contract.transfer(addr1.address, 0);
      const reason = "Value should be positive";
      await expect(tx).to.be.revertedWith(reason);
    });
    it("should throw error if the owner balance doesn't have enough tokens",
      async () => {
        await contract.connect(addr1).approve(owner.address, initValue);
        const tx = contract.connect(owner).transferFrom(
          addr1.address, owner.address, initValue
        );
        const reason = "Not enough tokens";
        await expect(tx).to.be.revertedWith(reason);
      });
    it("should throw error if user exceeded the balance", async () => {
      const tx = contract.connect(addr1).transferFrom(
        owner.address, addr1.address, initValue
      );
      const reason = "You can't transfer so tokens from this user";
      await expect(tx).to.be.revertedWith(reason);
    });
    it("should increase balance", async () => {
      await contract.connect(owner).approve(addr1.address, initValue);
      await contract.connect(addr1).transferFrom(
        owner.address, addr1.address, initValue
      );
      const balance = await contract.balanceOf(addr1.address);
      expect(balance).to.be.equal(initValue);
    });
    it("should decrease balance", async () => {
      const startBalance = await contract.balanceOf(owner.address);
      await contract.connect(owner).approve(addr1.address, initValue);
      await contract.connect(addr1).transferFrom(
        owner.address, addr1.address, initValue
      );
      const endBalance = await contract.balanceOf(owner.address);
      expect(startBalance).to.be.eq(endBalance.add(initValue));
    });
    it("should decrease allowance balance", async () => {
      const difference = initValue - 1;
      await contract.connect(owner).approve(addr1.address, initValue);
      await contract.connect(addr1).transferFrom(
        owner.address, addr1.address, difference
      );
      const allowance = await contract.allowance(owner.address, addr1.address);
      expect(allowance).to.be.equal(initValue - difference);
    });
    it("should emit event", async () => {
      await contract.connect(owner).approve(addr1.address, initValue);
      const tx = contract.connect(addr1).transferFrom(
        owner.address, addr1.address, initValue
      );
      await expect(tx).to.be.emit(contract, "Transfer");
    });
    it("should spend gas", async () => {
      await contract.connect(owner).approve(addr1.address, initValue);
      const tx = await contract.connect(addr1).transferFrom(
        owner.address, addr1.address, initValue
      );
      expect(tx).have.a.property("gasPrice");
    });
  });
  describe("approve", () => {
    it("should throw error if the value equals 0", async () => {
      const tx = contract.approve(addr1.address, 0);
      const reason = "Value should be positive";
      await expect(tx).to.be.revertedWith(reason);
    });
    it("should increase allowance balance", async () => {
      await contract.connect(owner).approve(addr1.address, initValue);
      const allowance = await contract.allowance(owner.address, addr1.address);
      expect(allowance).to.be.equal(initValue);
    });
    it("should emit event", async () => {
      const tx = contract.connect(owner).approve(addr1.address, initValue);
      await expect(tx).to.be.emit(contract, "Approval");
    });
    it("should spend gas", async () => {
      const tx = await contract.connect(owner).approve(addr1.address, initValue);
      expect(tx).have.a.property("gasPrice");
    });
  });
  describe("burn", () => {
    it("should call only the owner", async () => {
      const tx = contract.burn(addr1.address, initValue);
      const reason = "You should be an owner";
      await expect(tx).to.not.be.revertedWith(reason);
    });
    it("should throw error if user is not an owner", async () => {
      const tx = contract.connect(addr1).burn(addr1.address, initValue);
      const reason = "You should be an owner";
      await expect(tx).to.be.revertedWith(reason);
    });
    it("should throw error if amount equals 0", async () => {
      const tx = contract.burn(owner.address, 0);
      const reason = "Amount should be positive";
      await expect(tx).to.be.revertedWith(reason);
    });
    it("should decrease balance of the user", async () => {
      const startBalance = await contract.balanceOf(owner.address);
      await contract.burn(owner.address, initValue);
      const endBalance = await contract.balanceOf(owner.address);

      expect(startBalance).to.be.equal(endBalance.add(initValue));
    });
    it("should decrease totalSupply", async () => {
      const startTotalSupply = await contract.totalSupply();
      await contract.burn(owner.address, initValue);
      const endTotalSupply = await contract.totalSupply();

      expect(startTotalSupply).to.be.equal(endTotalSupply.add(initValue));
    });
    it("should emit event", async () => {
      const tx = contract.connect(owner).burn(owner.address, initValue);
      await expect(tx).to.be.emit(contract, "Transfer");
    });
    it("should spend gas", async () => {
      const tx = await contract.burn(owner.address, initValue);
      expect(tx).have.a.property("gasPrice");
    });
  });
  describe("mint", () => {
    it("should call only the owner", async () => {
      const tx = contract.mint(addr1.address, initValue);
      const reason = "You should be an owner";
      await expect(tx).to.not.be.revertedWith(reason);
    });
    it("should throw error if user is not an owner", async () => {
      const tx = contract.connect(addr1).mint(addr1.address, initValue);
      const reason = "You should be an owner";
      await expect(tx).to.be.revertedWith(reason);
    });
    it("should throw error if amount equals 0", async () => {
      const tx = contract.mint(owner.address, 0);
      const reason = "Amount should be positive";
      await expect(tx).to.be.revertedWith(reason);
    });
    it("should increase balance of the user", async () => {
      const startBalance = await contract.balanceOf(addr1.address);
      await contract.mint(addr1.address, initValue);
      const endBalance = await contract.balanceOf(addr1.address);

      expect(startBalance).to.be.eq(endBalance.sub(initValue));
    });
    it("should increase totalSupply", async () => {
      const startTotalSupply = await contract.totalSupply();
      await contract.mint(addr1.address, initValue);
      const endTotalSupply = await contract.totalSupply();

      expect(startTotalSupply).to.be.eq(endTotalSupply.sub(initValue));
    });
    it("should emit event", async () => {
      const tx = contract.connect(owner).mint(addr1.address, initValue);
      await expect(tx).to.be.emit(contract, "Transfer");
    });
    it("should spend gas", async () => {
      const tx = await contract.mint(owner.address, initValue);
      expect(tx).have.a.property("gasPrice");
    });
  });
});
