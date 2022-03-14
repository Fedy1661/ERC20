// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

contract Token {
    string private _name = 'Atlantic';
    string private _symbol = 'ATH';
    uint8 private _decimals = 18;
    uint256 private _totalSupply = 1_000_000_000;
    address private owner;

    mapping(address => uint256) private _balances;
    mapping(address => mapping(address => uint256)) private _allowances;

    event Transfer(address indexed _from, address indexed _to, uint256 _value);
    event Approval(address indexed _owner, address indexed _spender, uint256 _value);

    constructor() {
        owner = msg.sender;
        _balances[msg.sender] = _totalSupply;
    }

    function name() public view returns (string memory) {
        return _name;
    }

    function symbol() public view returns (string memory) {
        return _symbol;
    }

    function decimals() public view returns (uint8) {
        return _decimals;
    }

    function totalSupply() public view returns (uint256) {
        return _totalSupply;
    }

    function balanceOf(address _owner) public view returns (uint256) {
        return _balances[_owner];
    }

    function transfer(address _to, uint256 _value) public returns (bool) {
        require(_value > 0, 'Value should be positive');
        require(msg.sender != _to, 'You cannot transfer to yourself');
        require(_balances[msg.sender] >= _value, 'You do not have enough tokens');

        _balances[_to] += _value;
        _balances[msg.sender] -= _value;

        emit Transfer(msg.sender, _to, _value);
        return true;
    }

    function transferFrom(address _from, address _to, uint256 _value) public returns (bool) {
        require(_balances[_from] >= _value, 'Owner has not enough tokens');
        require(_allowances[_from][msg.sender] >= _value, 'You can\'t transfer so tokens from this user');

        _balances[_from] -= _value;
        _allowances[_from][msg.sender] -= _value;
        _balances[_to] += _value;

        emit Transfer(_from, _to, _value);
        return true;
    }

    function approve(address _spender, uint256 _value) public returns (bool) {
        require(_value > 0, 'Value should be positive');
        _allowances[msg.sender][_spender] += _value;
        emit Approval(msg.sender, _spender, _value);
        return true;
    }

    function allowance(address _owner, address _spender) public view returns (uint256) {
        return _allowances[_owner][_spender];
    }

    function burn(address _account, uint256 _amount) public {
        require(_amount > 0, 'Amount should be positive');
        require(msg.sender == owner, 'You should be an owner');
        _balances[_account] -= _amount;
        _totalSupply -= _amount;
    }

    function mint(address _account, uint256 _amount) public {
        require(_amount > 0, 'Amount should be positive');
        require(msg.sender == owner, 'You should be an owner');
        _balances[_account] += _amount;
        _totalSupply += _amount;
    }

}
