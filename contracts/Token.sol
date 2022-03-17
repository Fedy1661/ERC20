// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

contract Token {
    string public name = 'Atlantic';
    string public symbol = 'ATH';
    uint8 public decimals = 18;
    uint256 public totalSupply = 1_000_000_000;
    address private _minter;

    mapping(address => uint256) private _balances;
    mapping(address => mapping(address => uint256)) private _allowances;

    event Transfer(address indexed _from, address indexed _to, uint256 _value);
    event Approval(address indexed _owner, address indexed _spender, uint256 _value);

    constructor() {
        _minter = msg.sender;
        _balances[msg.sender] = totalSupply;
    }

    function balanceOf(address _owner) public view returns (uint256) {
        return _balances[_owner];
    }

    function transfer(address _to, uint256 _value) public returns (bool) {
        require(_value > 0, 'Value should be positive');
        require(msg.sender != _to, 'You cannot transfer to yourself');
        uint256 balanceSender = _balances[msg.sender];
        require(balanceSender >= _value, 'You do not have enough tokens');

        _balances[_to] += _value;
        _balances[msg.sender] = _balances[msg.sender] - _value;

        emit Transfer(msg.sender, _to, _value);
        return true;
    }

    function transferFrom(address _from, address _to, uint256 _value) public returns (bool) {
        uint256 fromValue = _balances[_from];
        require(fromValue >= _value, 'Owner has not enough tokens');
        uint256 availableValue = _allowances[_from][msg.sender];
        require(availableValue >= _value, 'You can\'t transfer so tokens from this user');

        _balances[_from] = fromValue - _value;
        _allowances[_from][msg.sender] = availableValue - _value;
        _balances[_to] += _value;

        emit Transfer(_from, _to, _value);
        return true;
    }

    function approve(address _spender, uint256 _value) public returns (bool) {
        require(_value > 0, 'Value should be positive');
        _allowances[msg.sender][_spender] = _value;
        emit Approval(msg.sender, _spender, _value);
        return true;
    }

    function allowance(address _owner, address _spender) public view returns (uint256) {
        return _allowances[_owner][_spender];
    }

    function burn(address _account, uint256 _amount) public {
        require(_amount > 0, 'Amount should be positive');
        require(msg.sender == _minter, 'You should be an owner');
        _balances[_account] -= _amount;
        totalSupply -= _amount;
        emit Transfer(msg.sender, _account, _amount);
    }

    function mint(address _account, uint256 _amount) public {
        require(_amount > 0, 'Amount should be positive');
        require(msg.sender == _minter, 'You should be an owner');
        _balances[_account] += _amount;
        totalSupply += _amount;
        emit Transfer(msg.sender, _account, _amount);
    }

}
