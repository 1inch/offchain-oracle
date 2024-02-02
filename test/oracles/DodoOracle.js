const { loadFixture } = require('@nomicfoundation/hardhat-network-helpers');
const { expect, deployContract } = require('@1inch/solidity-utils');
const {
    tokens,
    deployParams: { Dodo, UniswapV3 },
    testRate,
} = require('../helpers.js');

describe('DodoOracle', function () {
    async function initContracts () {
        const dodoOracle = await deployContract('DodoOracle', [Dodo.dodoZoo]);
        const uniswapV3Oracle = await deployContract('UniswapV3LikeOracle', [UniswapV3.factory, UniswapV3.initcodeHash, UniswapV3.fees]);
        return { dodoOracle, uniswapV3Oracle };
    }

    it('should revert with amount of pools error', async function () {
        const { dodoOracle } = await loadFixture(initContracts);
        await expect(
            testRate(tokens.USDT, tokens['1INCH'], tokens.NONE, dodoOracle),
        ).to.be.revertedWithCustomError(dodoOracle, 'PoolNotFound');
    });

    it('WETH -> USDC', async function () {
        const { dodoOracle, uniswapV3Oracle } = await loadFixture(initContracts);
        await testRate(tokens.WETH, tokens.USDC, tokens.NONE, dodoOracle, uniswapV3Oracle);
    });

    it('USDC -> WETH', async function () {
        const { dodoOracle, uniswapV3Oracle } = await loadFixture(initContracts);
        await testRate(tokens.USDC, tokens.WETH, tokens.NONE, dodoOracle, uniswapV3Oracle);
    });

    it('WETH -> USDC -> WBTC', async function () {
        const { dodoOracle, uniswapV3Oracle } = await loadFixture(initContracts);
        await testRate(tokens.WETH, tokens.WBTC, tokens.USDC, dodoOracle, uniswapV3Oracle);
    });

    it('WBTC -> USDC -> WETH', async function () {
        const { dodoOracle, uniswapV3Oracle } = await loadFixture(initContracts);
        await testRate(tokens.WBTC, tokens.WETH, tokens.USDC, dodoOracle, uniswapV3Oracle);
    });
});
