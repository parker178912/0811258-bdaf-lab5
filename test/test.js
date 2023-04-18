// SPDX-License-Identifier: MIT
const { expect } = require('chai');
const { ethers } = require("hardhat");
describe('Token', function () {
    let Token;
    let token;
    let owner;
    let addr1;
    let addr2;

    beforeEach(async function () {
    Token = await ethers.getContractFactory('Token');
    [owner, addr1, addr2] = await ethers.getSigners();
    token = await Token.connect(owner).deploy('MyToken', 'MTK');
    await token.deployed();
    });

    it('Should set the correct name and symbol', async function () {
        expect(await token.name()).to.equal('MyToken');
        expect(await token.symbol()).to.equal('MTK');
    });

    it('Should set the initial total supply to 0', async function () {
      expect(await token.totalSupply()).to.equal(0);
    });

    it('Should revert when a non-owner tries to mint', async function () {
      await expect(
        token.connect(addr1).mint(100)
      ).to.be.revertedWith('Ownable: caller is not the owner');
    });

    it('Should increase the total supply by the specified amount when owner mints', async function () {
      await token.connect(owner).mint(100);
      expect(await token.totalSupply()).to.equal(100000000000000000000n);
    });

    it('Should increase the balance of the owner by the specified amount when owner mints', async function () {
      await token.connect(owner).mint(100);
      await token.connect(owner).burn(50);
      expect(await token.balanceOf(owner.address)).to.equal(50000000000000000000n);
    });

    it('Should revert when a non-owner tries to burn', async function () {
        await expect(
        token.connect(addr1).burn(50)
        ).to.be.revertedWith('Ownable: caller is not the owner');
    });

});
