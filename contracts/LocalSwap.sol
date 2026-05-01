// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract LocalSwap {
    IERC20 public immutable tokenIn;
    IERC20 public immutable tokenOut;
    uint256 public immutable rate;

    event Swapped(address indexed user, uint256 amountIn, uint256 amountOut);

    constructor(address _tokenIn, address _tokenOut, uint256 _rate) {
        tokenIn = IERC20(_tokenIn);
        tokenOut = IERC20(_tokenOut);
        rate = _rate;
    }

    function seed(uint256 amountOut) external {
        require(tokenOut.transferFrom(msg.sender, address(this), amountOut), "seed failed");
    }

    function swap(uint256 amountIn) external {
        uint256 amountOut = amountIn * rate;
        require(tokenOut.balanceOf(address(this)) >= amountOut, "insufficient liquidity");

        require(tokenIn.transferFrom(msg.sender, address(this), amountIn), "transfer in failed");
        require(tokenOut.transfer(msg.sender, amountOut), "transfer out failed");

        emit Swapped(msg.sender, amountIn, amountOut);
    }
}
