import { ethers } from "hardhat";
import chai, { expect } from "chai";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { Token } from "../../typechain";
import { BigNumber } from "ethers";

chai.use(require('chai-bignumber')());

describe("Token", function() {
  let contract: Token;
  let owner: SignerWithAddress;
  let addr1: SignerWithAddress;

  beforeEach(async () => {
    const Contract = await ethers.getContractFactory("Token");
    contract = await Contract.deploy();
    [owner, addr1] = await ethers.getSigners();
    await contract.deployed();
  });

  describe("name", () => {
    it("should return name", async () => {
      expect(await contract.name()).to.be.a("string");
    });
    it("should not spend gas", async () => {
      const previousBalance = await addr1.getBalance();
      await contract.connect(addr1).name();

      expect(await addr1.getBalance()).to.be.equal(previousBalance);
    });
  });
  describe("symbol", () => {
    it("should return symbol", async () => {
      expect(await contract.symbol()).to.be.a("string");
    });
    it("should not spend gas", async () => {
      const previousBalance = await addr1.getBalance();
      await contract.connect(addr1).symbol();

      expect(await addr1.getBalance()).to.be.equal(previousBalance);
    });
  });
  describe("decimals", () => {
    it("should return decimals", async () => {
      const call = await contract.decimals();
      expect(call).to.be.a("number");
    });
    it("should not spend gas", async () => {
      const previousBalance = await addr1.getBalance();
      await contract.connect(addr1).decimals();

      expect(await addr1.getBalance()).to.be.equal(previousBalance);
    });
  });
  describe("totalSupply", () => {
    it("should return totalSupply", async () => {
      const call = await contract.totalSupply();
      expect(call).to.be.instanceof(BigNumber);
    });
    it("should not spend gas", async () => {
      const previousBalance = await addr1.getBalance();
      await contract.connect(addr1).totalSupply();

      expect(await addr1.getBalance()).to.be.equal(previousBalance);
    });
  });
  describe("balanceOf", () => {
    it("should return 0 to unknown user", async () => {
      const call = await contract.balanceOf(addr1.address);
      expect(call).to.be.equal(0);
    });
    it("should return valid balance", async () => {
      const call = await contract.balanceOf(owner.address);
      const totalSupply = await contract.totalSupply();
      expect(call).to.be.equal(totalSupply);
    });
    it("should increase balance after transfer", async () => {
      await contract.connect(owner).transfer(addr1.address, 1);
      const call = await contract.balanceOf(addr1.address);
      expect(call).to.be.equal(1);
    });
    it("should decrease balance after transfer", async () => {
      await contract.connect(owner).transfer(addr1.address, 1);
      await contract.connect(addr1).transfer(owner.address, 1);
      const call = await contract.balanceOf(addr1.address);
      expect(call).to.be.equal(0);
    });
    it("should not spend gas", async () => {
      const previousBalance = await addr1.getBalance();
      await contract.connect(addr1).balanceOf(owner.address);

      expect(await addr1.getBalance()).to.be.equal(previousBalance);
    });
  });
  describe("transfer", () => {
    it("should be an error when value equals 0", async () => {
      const tx = contract.transfer(addr1.address, 0);
      await expect(tx).to.be.revertedWith("Value should be positive");
    });
    it("should be an error when not enough tokens", async () => {
      const tx = contract.connect(addr1).transfer(owner.address, 1);
      await expect(tx).to.be.revertedWith("You do not have enough tokens");
    });
    it("should be an error when sending to yourself", async () => {
      const tx = contract.connect(owner).transfer(addr1.address, 1);
      await expect(tx).to.be.emit(contract, "Transfer");
    });
    it("should increase and decrease balance", async () => {
      await contract.connect(owner).transfer(addr1.address, 1);
      const tx = contract.connect(addr1).transfer(owner.address, 1);
      await expect(tx).not.to.be.reverted;
    });
    it("should emit event", async () => {
      const tx = contract.connect(owner).transfer(addr1.address, 1);
      await expect(tx).to.be.emit(contract, "Transfer");
    });
    it("should spend gas", async () => {
      const tx = await contract.connect(owner).transfer(addr1.address, 1);
      expect(tx).have.a.property('gasPrice')
        .be.gt(0)
    });

  });
  describe("transferFrom", () => {
    it("should throw error if the owner balance doesn't have enough tokens",
      async () => {
        await contract.connect(addr1).approve(owner.address, 1000);
        const tx = contract.connect(owner).transferFrom(
          addr1.address, owner.address, 100
        )
        await expect(tx).to.be.revertedWith('Owner has not enough tokens')
      });
    it("should throw error if user exceeded the balance", async () => {
      const tx = contract.connect(addr1).transferFrom(
        owner.address, addr1.address, 100
      )
      const reason = 'You can\'t transfer so tokens from this user';
      await expect(tx).to.be.revertedWith(reason)
    });
    it("should increase balance", async () => {
      await contract.connect(owner).approve(addr1.address, 10)
      await contract.connect(addr1).transferFrom(
        owner.address, addr1.address, 10
      )
      const call = await contract.balanceOf(addr1.address)
      expect(call).to.be.equal(10)
    });
    it("should decrease balance", async () => {
      const previousBalance = await contract.balanceOf(owner.address)
      await contract.connect(owner).approve(addr1.address, 10)
      await contract.connect(addr1).transferFrom(
        owner.address, addr1.address, 10
      )
      const call: BigNumber = await contract.balanceOf(owner.address)
      expect(call.toNumber()).to.be.equal(previousBalance.toNumber() - 10)
    });
    it("should decrease allowance balance", async () => {
      await contract.connect(owner).approve(addr1.address, 10)
      await contract.connect(addr1).transferFrom(
        owner.address, addr1.address, 9
      )
      const call = await contract.allowance(owner.address, addr1.address)
      expect(call).to.be.equal(1)
    });
    it("should emit event", async () => {
      await contract.connect(owner).approve(addr1.address, 10)
      const tx = contract.connect(addr1).transferFrom(
        owner.address, addr1.address, 10
      )
      await expect(tx).to.be.emit(contract, "Transfer");
    });
    it("should spend gas", async () => {
      await contract.connect(owner).approve(addr1.address, 10)
      const tx = await contract.connect(addr1).transferFrom(
        owner.address, addr1.address, 10
      )
      expect(tx).have.a.property('gasPrice')
        .be.gt(0)
    });
  });
  describe("approve", () => {
    it("should throw error if the value equals 0", async () => {
      const tx = contract.approve(addr1.address, 0)
      await expect(tx).to.be.revertedWith('Value should be positive')
    });
    it("should increase allowance balance", async () => {
      await contract.connect(owner).approve(addr1.address, 100)
      const call = await contract.allowance(owner.address, addr1.address);
      expect(call).to.be.equal(100)
    });
    it("should emit event", async () => {
      const tx = contract.connect(owner).approve(addr1.address, 10)
      await expect(tx).to.be.emit(contract, "Approval");
    });
    it("should spend gas", async () => {
      const tx = await contract.connect(owner).approve(addr1.address, 10)
      expect(tx).have.a.property('gasPrice')
        .be.gt(0)
    });
  });
  describe("burn", () => {
    it("should call only the owner", async () => {
      const tx = contract.burn(addr1.address, 100)
      await expect(tx).to.not.be.revertedWith('You should be an owner')
    });
    it("should throw error if user is not an owner", async () => {
      const tx = contract.connect(addr1).burn(addr1.address, 100)
      await expect(tx).to.be.revertedWith('You should be an owner')
    });
    it("should throw error if amount equals 0", async () => {
      const tx = contract.burn(owner.address, 0)
      await expect(tx).to.be.revertedWith('Amount should be positive')
    });
    it("should decrease balance of the user", async () => {
      const before = await contract.balanceOf(owner.address)
      await contract.burn(owner.address, 10)
      const after = await contract.balanceOf(owner.address)

      expect(before).to.be.equal(after.add(10))
    });
    it("should decrease totalSupply", async () => {
      const before = await contract.totalSupply()
      await contract.burn(owner.address, 100)
      const after = await contract.totalSupply()

      expect(before).to.be.equal(after.add(100))
    });
    it("should spend gas", async () => {
      const tx = await contract.burn(owner.address, 100)
      expect(tx).have.a.property('gasPrice')
        .be.gt(0)
    });
  });
  describe("mint", () => {
    it("should call only the owner", async () => {
      const tx = contract.mint(addr1.address, 100)
      await expect(tx).to.not.be.revertedWith('You should be an owner')
    });
    it("should throw error if user is not an owner", async () => {
      const tx = contract.connect(addr1).mint(addr1.address, 100)
      await expect(tx).to.be.revertedWith('You should be an owner')
    });
    it("should throw error if amount equals 0", async () => {
      const tx = contract.mint(owner.address, 0)
      await expect(tx).to.be.revertedWith('Amount should be positive')
    });
    it("should increase balance of the user", async () => {
      const before = await contract.balanceOf(addr1.address)
      await contract.mint(addr1.address, 10)
      const after = await contract.balanceOf(addr1.address)

      expect(before < after).to.be.true
    });
    it("should increase totalSupply", async () => {
      const before = await contract.totalSupply()
      await contract.mint(addr1.address, 100)
      const after = await contract.totalSupply()

      expect(before < after).to.be.true
    });
    it("should spend gas", async () => {
      const tx = await contract.mint(owner.address, 100)
      expect(tx).have.a.property('gasPrice')
        .be.gt(0)
    });

  });
});
