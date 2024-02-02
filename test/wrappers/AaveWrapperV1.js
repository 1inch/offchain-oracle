const { loadFixture } = require('@nomicfoundation/hardhat-network-helpers');
const { expect, ether, deployContract } = require('@1inch/solidity-utils');
const { tokens } = require('../helpers.js');

describe('AaveWrapperV1', function () {
    async function initContracts () {
        const aaveWrapper = await deployContract('AaveWrapperV1');
        await aaveWrapper.addMarkets([tokens.DAI, tokens.EEE]);
        return { aaveWrapper };
    }

    it('DAI -> aDAI', async function () {
        const { aaveWrapper } = await loadFixture(initContracts);
        const response = await aaveWrapper.wrap(tokens.DAI);
        expect(response.rate).to.equal(ether('1'));
        expect(response.wrappedToken).to.equal(tokens.aDAIV1);
    });

    it('aDAI -> DAI', async function () {
        const { aaveWrapper } = await loadFixture(initContracts);
        const response = await aaveWrapper.wrap(tokens.aDAIV1);
        expect(response.rate).to.equal(ether('1'));
        expect(response.wrappedToken).to.equal(tokens.DAI);
    });

    it('ETH -> aETH', async function () {
        const { aaveWrapper } = await loadFixture(initContracts);
        const response = await aaveWrapper.wrap(tokens.ETH);
        expect(response.rate).to.equal(ether('1'));
        expect(response.wrappedToken).to.equal(tokens.aETHV1);
    });

    it('aETH -> ETH', async function () {
        const { aaveWrapper } = await loadFixture(initContracts);
        const response = await aaveWrapper.wrap(tokens.aETHV1);
        expect(response.rate).to.equal(ether('1'));
        expect(response.wrappedToken).to.equal(tokens.ETH);
    });
});
