contract owned{
  function owned() {
		owner = msg.sender;
	}

  modifier onlyowner() {
		if(msg.sender==owner) _
	}

  address owner;
}

contract SimpleCoin is owned {
	mapping (address => uint32) balance;

	function issue(address recipient, uint32 amount) onlyowner{
		balance[recipient] += amount;
	}

  function balanceOf(address holder) returns (uint b){
		return balance[holder];
	}

  function transferTo(address recipient, uint32 amount){
		if(balance[msg.sender] < amount) return;

		balance[msg.sender] -= amount;
		balance[recipient] += amount;
	}
}
