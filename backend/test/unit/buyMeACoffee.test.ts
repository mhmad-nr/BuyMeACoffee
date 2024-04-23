import { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/signers";
import { assert, expect } from "chai";
import { deployments, ethers, getNamedAccounts } from "hardhat";
import { BuyMeACoffee } from "../../typechain-types";
describe("BuyMeACoffee", () => {
  let buyMeACoffee: BuyMeACoffee;
  let deployer: string;
  let address: HardhatEthersSigner[];
  beforeEach(async () => {
    address = await ethers.getSigners();
    deployer = (await getNamedAccounts()).deployer;

    await deployments.fixture(["all"]);
    const myContract = await deployments.get("BuyMeACoffee");

    buyMeACoffee = await (ethers as any).getContractAt(
      myContract.abi,
      myContract.address
    );
  });
  describe("SingUp", () => {
    it("must reverted because signer is signed up before", async () => {
      await buyMeACoffee.SingUp();
      await expect(buyMeACoffee.SingUp()).to.be.revertedWithCustomError(
        buyMeACoffee,
        "BuyMeACoffe__SignedUpBefore"
      );
    });
  });
  describe("SearchAccount", () => {
    it("deployer has not signed before", async () => {
      const res = await buyMeACoffee.SearchAccount(deployer);
      assert.equal(res, ethers.ZeroAddress);
    });
    it("deployer has signed before", async () => {
      await buyMeACoffee.SingUp();
      const res = await buyMeACoffee.SearchAccount(deployer);
      expect(ethers.isAddress(res)).to.be.true;
    });
  });
});
