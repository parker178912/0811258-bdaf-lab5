// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Token is ERC20, Ownable{
    mapping(address => uint256) private _balances;
    uint256 _totalSupply;

    constructor(string memory name_, string memory symbol_) ERC20(name_, symbol_) {
        _totalSupply = 100000 * 10 ** decimals();
    }
    
    // only owner (specific project) can call mint or burn function
    function mint(uint256 amount) external onlyOwner{
        _mint(msg.sender, amount * 10 ** decimals());
    }

    function burn(uint256 amount) external onlyOwner {
        _burn(msg.sender, amount * 10 ** decimals());
    }
}