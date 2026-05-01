const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();

  const reward = hre.ethers.parseUnits("10", 18);
  const target = (1n << 248n);

  const MineableToken = await hre.ethers.getContractFactory("MineableToken");
  const mineable = await MineableToken.deploy(reward, target);
  await mineable.waitForDeployment();

  const SwapToken = await hre.ethers.getContractFactory("SwapToken");
  const swapToken = await SwapToken.deploy(hre.ethers.parseUnits("1000000", 18));
  await swapToken.waitForDeployment();

  const LocalSwap = await hre.ethers.getContractFactory("LocalSwap");
  const swap = await LocalSwap.deploy(await mineable.getAddress(), await swapToken.getAddress(), 2);
  await swap.waitForDeployment();

  const seedAmount = hre.ethers.parseUnits("500000", 18);
  await (await swapToken.approve(await swap.getAddress(), seedAmount)).wait();
  await (await swap.seed(seedAmount)).wait();

  const output = {
    network: "localhost",
    deployer: deployer.address,
    mineableToken: await mineable.getAddress(),
    swapToken: await swapToken.getAddress(),
    swap: await swap.getAddress(),
    rewardPerMine: reward.toString(),
    initialTarget: target.toString()
  };

  console.log(output);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
