// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract MineableToken is ERC20 {
    bytes32 public challenge;
    uint256 public immutable reward;
    uint256 public target;

    mapping(bytes32 => bool) public usedSolutions;

    event Mined(address indexed miner, uint256 reward, uint256 nonce, bytes32 digest);

    constructor(uint256 _reward, uint256 _target) ERC20("Mineable Token", "MNT") {
        reward = _reward;
        target = _target;
        challenge = keccak256(abi.encodePacked(block.prevrandao, block.timestamp, address(this)));
    }

    function mine(uint256 nonce) external returns (bool) {
        bytes32 digest = sha256(abi.encodePacked(challenge, msg.sender, nonce));
        require(!usedSolutions[digest], "Solution already used");
        require(uint256(digest) < target, "Invalid PoW");

        usedSolutions[digest] = true;
        _mint(msg.sender, reward);
        challenge = keccak256(abi.encodePacked(digest, block.timestamp, block.number));

        emit Mined(msg.sender, reward, nonce, digest);
        return true;
    }

    function setTarget(uint256 newTarget) external {
        // Demo uchun ochiq qoldirildi; real loyihada onlyOwner kerak.
        target = newTarget;
    }
}
