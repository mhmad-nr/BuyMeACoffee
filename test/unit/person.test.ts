
import { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/signers"
import { assert, expect } from "chai"
import { deployments, ethers, getNamedAccounts } from "hardhat"
import { Person } from "../../typechain-types"
describe("Person", () => {
    let person: Person
    let deployer: HardhatEthersSigner
    let first: HardhatEthersSigner
    let second: HardhatEthersSigner
    const _NAME = "NAME"
    const _MASSAGE = "MASSAGE"
    const enoughValue = ethers.parseEther("1")
    const notEnoughValue = ethers.parseUnits("0.1", "gwei")

    beforeEach(async () => {
        deployer = (await ethers.getSigners())[0]
        first = (await ethers.getSigners())[1]
        second = (await ethers.getSigners())[2]

        const account = await ethers.getContractFactory("Person")
        person = await account.deploy(deployer.address) as any
    });
    describe("constructor", () => {
        it("sets the owner addresse correctly", async () => {
            const response = await person.getOwner()
            assert.equal(response, deployer.address)
        })
    })
    describe("buyACoffee", () => {

        it("Fails if Value less than one Gwei ", async () => {
            await expect(person.buyACoffee(_NAME, _MASSAGE, {
                value: notEnoughValue
            })).to.be.revertedWithCustomError(person, "Person__ValueMustBeMoreThanOneGwei")
        })
        it("Should emit MemoEvent", async function () {

            await expect(person.buyACoffee(_NAME, _MASSAGE, { value: enoughValue }))
                .to.emit(person, "MemoEvent")
        });

    })
    describe("withdraw", () => {

        it("Fails if the balance of the contract equal to zero", async () => {
            await expect(person.withdraw())
                .to.be.revertedWithCustomError(person, "Person__BalanceIsZero")
        })
    })
})