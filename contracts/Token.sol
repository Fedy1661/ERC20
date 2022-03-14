// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

contract Token {
    string public name = 'Atlantic';
    string public symbol = 'ATH';
    uint8 public decimals = 18;
    uint256 public totalSupply = 1_000_000_000;

    mapping(address => uint256) private _balances;
    mapping(address => mapping(address => uint256)) private _allowances;

    event Transfer(address indexed _from, address indexed _to, uint256 _value);
    event Approval(address indexed _owner, address indexed _spender, uint256 _value);

    function balanceOf(address _owner) public view returns (uint256 balance) {}
    function transfer(address _to, uint256 _value) public returns (bool success) {}
    function transferFrom(address _from, address _to, uint256 _value) public returns (bool success) {}
    function approve(address _spender, uint256 _value) public returns (bool success) {}
    function allowance(address _owner, address _spender) public view returns (uint256 remaining) {}

    function burn(address _account, uint256 _amount) {}
    function mint(address _account, uint256 _amount) {}
}
