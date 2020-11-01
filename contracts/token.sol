pragma solidity ^0.6.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";


// Example class - a mock class using delivering from ERC20
contract DictatorDollar is ERC20, Ownable {
    // this function is only ran once, upon first publishing the contract on chain
    constructor(uint256 initialBalance)
    public
    ERC20("DictatorDollar", "DD")  {
        _mint(msg.sender, initialBalance);
    }

    function mint(address account, uint256 amount) public onlyOwner {
        _mint(account, amount);
    }

    function burn(address account, uint256 amount) public onlyOwner {
        _burn(account, amount);
    }
}