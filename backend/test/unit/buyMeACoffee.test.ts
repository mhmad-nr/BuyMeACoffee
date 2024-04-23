import { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/signers";
import { assert, expect } from "chai";
import { deployments, ethers, getNamedAccounts } from "hardhat";
import { BuyMeACoffee } from "../../typechain-types";
describe("BuyMeACoffee", () => {
  let buyMeACoffee: BuyMeACoffee;
  let deployer: string;
  let address: HardhatEthersSigner[];

  let NOT_SIGNED_ADDRESS: HardhatEthersSigner;

  const ENOUGH_ETH = ethers.parseEther("1");
  const NOT_ENOUGH_ETH = ethers.parseEther("0");

  const NAME = "NAME";
  const MESSAGE = "MESSAGE";

  beforeEach(async () => {
    address = await ethers.getSigners();
    NOT_SIGNED_ADDRESS = address[1];
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
      await buyMeACoffee.singUp();
      await expect(buyMeACoffee.singUp()).to.be.revertedWithCustomError(
        buyMeACoffee,
        "BuyMeACoffe__SignedUpBefore"
      );
    });
    it("must emite an event after sing up su", async () => {
      await expect(buyMeACoffee.singUp()).to.emit(buyMeACoffee, "SingUpEvent");
    });
  });

  describe("buyACoffee", () => {
    it("must reverted with 'BuyMeACoffe__NotSignedUpBefore' when to address is not signed up before", async () => {
      await expect(
        buyMeACoffee.buyACoffee(NAME, MESSAGE, NOT_SIGNED_ADDRESS.address, {
          value: ENOUGH_ETH,
        })
      ).to.be.revertedWithCustomError(
        buyMeACoffee,
        "BuyMeACoffe__NotSignedUpBefore"
      );
    });

    it("must reverted with 'BuyMeACoffe__SenderShouldBeAnotherAddress' when to address is equal to msg.sender", async () => {
      await buyMeACoffee.singUp();

      await expect(
        buyMeACoffee.buyACoffee(NAME, MESSAGE, deployer, {
          value: ENOUGH_ETH,
        })
      ).to.be.revertedWithCustomError(
        buyMeACoffee,
        "BuyMeACoffe__SenderShouldBeAnotherAddress"
      );
    });

    it("must reverted with 'BuyMeACoffe__ValueMustBeMoreThanOneGwei' if value is less than minimum", async () => {
      await buyMeACoffee.singUp();

      await expect(
        buyMeACoffee
          .connect(NOT_SIGNED_ADDRESS)
          .buyACoffee(NAME, MESSAGE, deployer, {
            value: NOT_ENOUGH_ETH,
          })
      ).to.be.revertedWithCustomError(
        buyMeACoffee,
        "BuyMeACoffe__ValueMustBeMoreThanOneGwei"
      );
    });

    it("must emit 'MemoEvent' after coffee bought successfully", async () => {
      await buyMeACoffee.singUp();

      await expect(
        buyMeACoffee
          .connect(NOT_SIGNED_ADDRESS)
          .buyACoffee(NAME, MESSAGE, deployer, {
            value: ENOUGH_ETH,
          })
      ).to.emit(buyMeACoffee, "MemoEvent");
    });
  });
  describe("withdraw", () => {
    it("must reverted with 'BuyMeACoffe__NotSignedUpBefore' if 'msg.sender' not sign up before", async () => {
      await expect(buyMeACoffee.withdraw()).to.be.revertedWithCustomError(
        buyMeACoffee,
        "BuyMeACoffe__NotSignedUpBefore"
      );
    });
    it("must reverted with 'BuyMeACoffe__BalanceIsZero' if balace of 'msg.sender' equal to zero", async () => {
      await buyMeACoffee.singUp();

      await expect(buyMeACoffee.withdraw()).to.be.revertedWithCustomError(
        buyMeACoffee,
        "BuyMeACoffe__BalanceIsZero"
      );
    });
  });

  describe("getUser", () => {
    it("should return zero address if address is not sign up before", async () => {
      const address = await buyMeACoffee.getUser(deployer);
      expect(address).to.be.equal(ethers.ZeroAddress);
    });
    it("should return user address if address is sign up before", async () => {
      await buyMeACoffee.singUp();

      const address = await buyMeACoffee.getUser(deployer);
      expect(address).to.be.equal(deployer);
    });
  });

  describe("getBalance", () => {
    it("must reverted with 'BuyMeACoffe__NotSignedUpBefore' if 'msg.sender' not sign up before", async () => {
      await expect(buyMeACoffee.getBalance()).to.be.revertedWithCustomError(
        buyMeACoffee,
        "BuyMeACoffe__NotSignedUpBefore"
      );
    });
    it("must return balance of the address", async () => {
      await buyMeACoffee.singUp();

      await buyMeACoffee
        .connect(NOT_SIGNED_ADDRESS)
        .buyACoffee(NAME, MESSAGE, deployer, { value: ENOUGH_ETH });

      expect(await buyMeACoffee.getBalance()).to.be.equal(ENOUGH_ETH);
    });
  });
  describe("getLastMemo", () => {
    it("must return last memo", async () => {
      await buyMeACoffee.singUp();

      const tx = await buyMeACoffee
        .connect(NOT_SIGNED_ADDRESS)
        .buyACoffee(NAME, MESSAGE, deployer, { value: ENOUGH_ETH });

      const txReceipt = await ethers.provider.getTransactionReceipt(tx.hash);

      // Get the block timestamp
      if (!txReceipt) return;
      const block = await ethers.provider.getBlock(txReceipt.blockNumber);

      if (!block) return;

      const res = await buyMeACoffee.getLastMemo();
      const expectedMemo = [
        NOT_SIGNED_ADDRESS.address,
        BigInt(block.timestamp),
        ENOUGH_ETH,
        NAME,
        MESSAGE,
      ];

      expect(res).to.deep.equal(expectedMemo);
    });
  });
});
