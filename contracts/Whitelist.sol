// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Whitelist {
    address public owner;
    mapping(address => bool) public whitelistedAddresses;

    event WhitelistedAddressAdded(address addr);
    event WhitelistedAddressRemoved(address addr);

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function");
        _;
    }

    modifier onlyWhitelisted(address addr) {
        require(whitelistedAddresses[addr], "Address is not whitelisted");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    function addAddressToWhitelist(address addr) public onlyOwner {
        whitelistedAddresses[addr] = true;
        emit WhitelistedAddressAdded(addr);
    }

    function removeAddressFromWhitelist(address addr) public onlyOwner {
        whitelistedAddresses[addr] = false;
        emit WhitelistedAddressRemoved(addr);
    }

    function isWhitelisted(address addr) public view returns (bool) {
        return whitelistedAddresses[addr];
    }
}
