const hre = require("hardhat");

async function main() {
  const to = process.env.TO || process.argv[2];
  const ethAmount = process.env.AMOUNT || process.argv[3] || "20";

  if (!to) {
    throw new Error("Usage: TO=<walletAddress> AMOUNT=<ethAmount> hardhat run scripts/fund.js --network localhost");
  }

  const [deployer] = await hre.ethers.getSigners();

  const tx = await deployer.sendTransaction({
    to,
    value: hre.ethers.parseEther(ethAmount)
  });
  await tx.wait();

  console.log(`Funded ${to} with ${ethAmount} ETH`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
