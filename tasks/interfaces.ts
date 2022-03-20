interface Contract {
  contract: string;
}

interface Owner {
  owner: string;
}

interface Spender {
  spender: string;
}

interface Value {
  value: string;
}

interface To {
  to: string;
}

interface Allowance extends Contract, Owner, Spender {
}

interface Approve extends Contract, Spender, Value {
}

interface BalanceOf extends Contract, Owner {
}

interface Transfer extends Contract, Value, To {
}

interface TransferFrom extends Contract, Value, To {
  from: string;
}

export {Allowance, Approve, BalanceOf, Transfer, TransferFrom}