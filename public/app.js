const CONTRACTS = {
  mineableToken: "0x5FbDB2315678afecb367f032d93F642f64180aa3",
  swapToken: "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512",
  swap: "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0"
};

const mineableAbi = [
  "function challenge() view returns (bytes32)",
  "function target() view returns (uint256)",
  "function mine(uint256 nonce) returns (bool)",
  "function balanceOf(address owner) view returns (uint256)"
];

const swapTokenAbi = [
  "function balanceOf(address owner) view returns (uint256)"
];

const swapAbi = [
  "function swap(uint256 amountIn)",
  "function rate() view returns (uint256)"
];

let provider;
let signer;
let account;
let mineable;
let swapToken;
let swap;
const HARDHAT_CHAIN_ID_HEX = "0x7a69";

const logEl = document.getElementById("log");
const accountEl = document.getElementById("account");
const balancesEl = document.getElementById("balances");

function log(text) {
  logEl.textContent += `${text}\n`;
}

async function ensureHardhatNetwork() {
  const chainId = await window.ethereum.request({ method: "eth_chainId" });
  if (chainId === HARDHAT_CHAIN_ID_HEX) return;

  try {
    await window.ethereum.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: HARDHAT_CHAIN_ID_HEX }]
    });
  } catch (switchErr) {
    if (switchErr && switchErr.code === 4902) {
      await window.ethereum.request({
        method: "wallet_addEthereumChain",
        params: [
          {
            chainId: HARDHAT_CHAIN_ID_HEX,
            chainName: "Hardhat Local",
            nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
            rpcUrls: ["http://127.0.0.1:8545"]
          }
        ]
      });
    } else {
      throw switchErr;
    }
  }
}

async function refreshBalances() {
  const mnt = await mineable.balanceOf(account);
  const swp = await swapToken.balanceOf(account);
  balancesEl.textContent = `MNT: ${ethers.formatUnits(mnt, 18)} | SWP: ${ethers.formatUnits(swp, 18)}`;
}

async function findValidNonce(challenge, minerAddress, target) {
  let nonce = 0n;
  while (true) {
    const digest = ethers.sha256(
      ethers.solidityPacked(["bytes32", "address", "uint256"], [challenge, minerAddress, nonce])
    );

    if (BigInt(digest) < target) {
      return nonce;
    }

    nonce += 1n;
    if (nonce % 20000n === 0n) {
      log(`Mining... nonce=${nonce}`);
      await new Promise((r) => setTimeout(r, 0));
    }
  }
}

document.getElementById("connect").onclick = async () => {
  try {
    if (!window.ethereum) {
      alert("MetaMask kerak");
      return;
    }

    await ensureHardhatNetwork();
    provider = new ethers.BrowserProvider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    signer = await provider.getSigner();
    account = await signer.getAddress();

    mineable = new ethers.Contract(CONTRACTS.mineableToken, mineableAbi, signer);
    swapToken = new ethers.Contract(CONTRACTS.swapToken, swapTokenAbi, signer);
    swap = new ethers.Contract(CONTRACTS.swap, swapAbi, signer);

    accountEl.textContent = account;
    await refreshBalances();
    log(`Wallet connected: ${account}`);
  } catch (err) {
    log(`Connect error: ${err?.shortMessage || err?.message || err}`);
  }
};

document.getElementById("mine").onclick = async () => {
  try {
    if (!mineable) {
      log("Avval Connect Wallet bosing.");
      return;
    }

    await ensureHardhatNetwork();
    const challenge = await mineable.challenge();
    const target = await mineable.getFunction("target")();
    log("Nonce qidirilmoqda...");

    const nonce = await findValidNonce(challenge, account, target);
    log(`Topildi: nonce=${nonce}`);

    const tx = await mineable.mine(nonce);
    log(`MetaMask confirm kutilmoqda... tx=${tx.hash}`);
    await tx.wait();
    log(`Mining success. tx=${tx.hash}`);
    await refreshBalances();
  } catch (err) {
    log(`Mining error: ${err?.shortMessage || err?.message || err}`);
  }
};

document.getElementById("swap").onclick = async () => {
  try {
    if (!swap) {
      log("Avval Connect Wallet bosing.");
      return;
    }

    await ensureHardhatNetwork();
    const amount = document.getElementById("amount").value;
    const amountIn = ethers.parseUnits(amount, 18);

    const mntWithApproveAbi = [
      ...mineableAbi,
      "function approve(address spender, uint256 amount) returns (bool)"
    ];
    const mineableWithApprove = new ethers.Contract(CONTRACTS.mineableToken, mntWithApproveAbi, signer);

    const approveTx = await mineableWithApprove.approve(CONTRACTS.swap, amountIn);
    await approveTx.wait();

    const tx = await swap.swap(amountIn);
    await tx.wait();
    log(`Swap success. tx=${tx.hash}`);
    await refreshBalances();
  } catch (err) {
    log(`Swap error: ${err?.shortMessage || err?.message || err}`);
  }
};
