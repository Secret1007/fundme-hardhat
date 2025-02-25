const { ethers } = require("hardhat")
const { assert, expect } = require("chai")
const helpers = require("@nomicfoundation/hardhat-network-helpers")

const { developmentChains } = require("../../helper-hardhat-config")


developmentChains.includes(network.name) ? describe.skip : describe("test fundMe contract", async function () {
  let firstAccount
  let fundMe
  beforeEach(async function () {
    await deployments.fixture(["all"])
    firstAccount = (await getNamedAccounts()).firstAccount
    const fundMeDeployment = await deployments.get("FundMe")
    fundMe = await ethers.getContractAt("FundMe", fundMeDeployment.address)

  })

  // test fund and getFund successfully
  it("fund and getFund successfully",
    async function () {
      // make sure target reached
      await fundMe.fund({ value: ethers.parseEther("0.5") }) // 3000 * 0.5 = 1500
      // make sure window closed
      await new Promise(resolve => setTimeout(resolve, 181 * 1000))
      // make sure we can get receipt 
      const getFundTx = await fundMe.getFund()
      const getFundReceipt = await getFundTx.wait()
      expect(getFundReceipt)
        .to.be.emit(fundMe, "FundWithdrawByOwner")
        .withArgs(ethers.parseEther("0.5"))
    }
  )
})

