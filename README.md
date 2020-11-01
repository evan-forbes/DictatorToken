# Moonbeam Incentivized Test Network: The Best Video Game Ever Made
[Moonbeam](https://moonbeam.network/) will soon launch an incentivized test network. This means that the more ambitious and jovial among us have a unique opportunity awaiting. Not only can we build experimental governance structures with the most innovative financial tooling in the space, but also make (figuratively and literally) real money! All while helping to beta test cutting-edge technology, hence, "The Best Video Game Ever Made".

## What is Moonbeam?
Moonbeam is a blockchain. More aptly, a fully ethereum compatible [parachain](https://wiki.polkadot.network/docs/en/learn-parachains) that capitalizes on the [Substrate](https://substrate.dev/) framework. This provides Moonbeam with unique technical capabilities and an interesting position in the blockchain space.

Mainly, all of the tools that developers have worked so hard on for the past 5 years, the same tools that powered the explosive growth in the ethereum ecosystem, work *seamlessly* with Moonbeam. I'm not just talking about metamask and solidity (those are table-stakes tbh). I'm talking about the many battle-tested opensource projects like [uniswap](https://github.com/Uniswap), [Compound's Governance Module](https://github.com/compound-finance/compound-protocol/tree/master/contracts/Governance), and [OpenZeppelin](https://github.com/OpenZeppelin/openzeppelin-contracts). While other smart contract chains have to agree upon, *and then audit*, their own implementations of ERC20's, NFT's, etc., Moonbeam can hit the ground running.

Also, as part of the Polkadot ecosystem, Moonbeam will have access to modern blockchain primitives such as staking, on-chain governance, and inter-chain communication between fellow parachains. This last attribute is likely the most important feature mentioned so far. Soon, we will be the among the first to be able to use the flexible tooling from ethereum in conjunction with the [many polkadot projects in the making](https://polkaproject.com/). Nothing is off the table, especially on the incentivized test network.

## What is an Incentivized Test Network (aka Canary Network)?
Decentralized autonomous organizations (DAOs), such as blockchains, require an extra layer of testing before they're ready to secure billions of dollars worth of assets. Even small changes in the incentive structures that hold DAOs together can cause drastic changes to the overall system. This is what incentivized networks are used for, testing those small changes with real money. The devs get meaningful data on the impact of their alterations, and we get a chaotic wide open space to experiment, farm, and breed digital cats. It's a match made in heaven!

Slight side note: Staying up-to-date on upcoming changes to the test network gives us important details that could lead to having an edge while staking, farming, etc. Stay informed [here](https://discord.com/channels/745382242326413442/748926222930804861). It pays to be clever.

## How to launch projects
TLDR; if you've used truffle before, you can just fork [this](https://github.com/evan-forbes/DictatorToken), run `npm install`, export your private key to an environment variable as PRIV_KEY, and start playing around. use `truffle migrate --network moon` to deploy to the alpha-net.

Before we begin, I just want provide a little encouragement to those of us who are just getting started with programming/blockchain. Things are going to break. That's okay. You've got this. The pay-off is worth it, it's just going to take some time is all. We're [here](https://discord.com/channels/745382242326413442/748926166815080509) to help if you need it. Chances are, if you're running into a problem, others have run into the exact same problem as well. The search engine is your friend.

As mentioned above, Moonbeam and its incentivized test network fully utilize ethereum tooling. Launching a project on one of these networks is just as easy as it to launch on ethereum! While we wait for the incentivized test network to launch, let's get some practice in on the boring old non-incentivized test network. You know what, let's go ahead and launch a copy of the world renowned [Uniswap](https://uniswap.org/) decentralized exchange.

### Install Dependencies 
This tutorial also assumes that you have access to a unix (mac or linux) command line. For those on windows, [try this](https://www.howtogeek.com/249966/how-to-install-and-use-the-linux-bash-shell-on-windows-10/).

We are going to need to install:
- [metamask](https://metamask.io/download.html)
- [nodejs](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm)
- Whatever text editor you prefer. Try [vs code](https://code.visualstudio.com/download) if you don't have one you already like.
- Preferably a solidity extension for that editor.

### Connect to the Non-incentivized Test Network
First thing's first. Let's get a test account, and connect to test net. [Here's a fantastic tutorial from the Moonbeam team](https://docs.moonbeam.network/getting-started/testnet/metamask/ ). 

Once we're connected, let's get some test net token to deploy our contracts. Simply go to the [Moonbeam discord](https://discord.com/channels/745382242326413442/748921391646244864) and ask the bot to give use some tokens using the `!drip send YOUR_ADDRESS_HERE`. After a few moments, you should have some fresh funds to play around with. 

### Export our Private Key
Alright. Even though we're not using real money, we're still going to practice decent habits when we handle our private key. Never, literally never, store our private key as plain text. Every time we access it in an unencrypted form, it should only be in your machine's memory. Use the metamask menu's to gain access to your key. [Further details here.](https://metamask.zendesk.com/hc/en-us/articles/360015289632-How-to-Export-an-Account-Private-Key)

In your unix command line, run:  
`export PRIV_KEY="your_private_key_here"`  
We're going to access this later using some code.

For the record, while leaving our private keys in memory is better than leaving as plain text, it is still not secure enough for even a moderate amount of funds. Investing the time to learn best practices is worth it. Here's a pretty good [thread](https://softwareengineering.stackexchange.com/questions/220950/where-to-store-the-private-key) for more clarity. **Stay safe out there, okay?**

### Initializing Our Project
Create a directory wherever you like to keep your code.  
```mkdir token```  
then enter that directory  
```cd token```  

Start by running  
`npm init`  
and answering the questions it asks. The answers really don't matter that much, so you can just keep hitting enter to ignore them

then run  
`npm install -g truffle`  
to install truffle and   
`truffle init`  
to initialize truffle.  

Currently the Moonbeam team is perfecting a few small kinks in compatability, so we're going to use some slightly modified code to talk to the node. Simply copy and paste the code below in a file called `private-prodiver.js`.

```javascript
const ProviderEngine = require("web3-provider-engine");
const WalletSubprovider = require("web3-provider-engine/subproviders/wallet");
const RpcSubprovider = require("web3-provider-engine/subproviders/rpc");
const EthereumjsWallet = require("ethereumjs-wallet");

function ChainIdSubProvider(chainId) {
  this.chainId = chainId;
}

ChainIdSubProvider.prototype.setEngine = function (engine) {
  const self = this;
  if (self.engine) return;
  self.engine = engine;
};
ChainIdSubProvider.prototype.handleRequest = function (payload, next, end) {
  if (
    payload.method == "eth_sendTransaction" &&
    payload.params.length > 0 &&
    typeof payload.params[0].chainId == "undefined"
  ) {
    payload.params[0].chainId = this.chainId;
  }
  next();
};

function NonceSubProvider() {}

NonceSubProvider.prototype.setEngine = function (engine) {
  const self = this;
  if (self.engine) return;
  self.engine = engine;
};
NonceSubProvider.prototype.handleRequest = function (payload, next, end) {
  if (payload.method == "eth_sendTransaction") {
    this.engine.sendAsync(
      {
        jsonrpc: "2.0",
        id: Math.ceil(Math.random() * 4415011859092441),
        method: "eth_getTransactionCount",
        params: [payload.params[0].from, "latest"],
      },
      (err, result) => {
        const nonce =
          typeof result.result == "string"
            ? result.result == "0x"
              ? 0
              : parseInt(result.result.substring(2), 16)
            : 0;
        payload.params[0].nonce = nonce || 0;
        next();
      }
    );
  } else {
    next();
  }
};

function PrivateKeyProvider(privateKey, providerUrl, chainId) {
  if (!privateKey) {
    throw new Error(`Private Key missing, non-empty string expected, got "${privateKey}"`);
  }

  if (!providerUrl) {
    throw new Error(`Provider URL missing, non-empty string expected, got "${providerUrl}"`);
  }

  this.wallet = EthereumjsWallet.default.fromPrivateKey(new Buffer(privateKey, "hex"));
  this.address = "0x" + this.wallet.getAddress().toString("hex");

  this.engine = new ProviderEngine({ useSkipCache: false });

  this.engine.addProvider(new ChainIdSubProvider(chainId));
  this.engine.addProvider(new NonceSubProvider());
  this.engine.addProvider(new WalletSubprovider(this.wallet, {}));
  this.engine.addProvider(new RpcSubprovider({ rpcUrl: providerUrl }));

  this.engine.start();
}

PrivateKeyProvider.prototype.sendAsync = function (payload, callback) {
  return this.engine.sendAsync.apply(this.engine, arguments);
};

PrivateKeyProvider.prototype.send = function () {
  return this.engine.send.apply(this.engine, arguments);
};

module.exports = PrivateKeyProvider;  
```

now, we're going to add some super useful contracts as dependencies.  
`npm add @openzeppelin/contracts -D`  
this allows us to use these contracts in our own contracts.

almost done, we have to tell truffle which networks we want to connect to, and with which credentials, so we're going to replace the contents of the `truffle-config.js` file with this:
```javascript
const PrivateKeyProvider = require ('./private-provider')
// get our private key from the environment (in memory)
var privateKey = process.env.PRIV_KEY;

module.exports = {
  networks: {
    development: {
      provider: () => new PrivateKeyProvider(privateKey, "http://localhost:9933/", 43),
      network_id: 43
    },
    // we're going to use this option to publish our contracts on the alpha-net
    moon: {
      provider: () => new PrivateKeyProvider(privateKey, "https://rpc.testnet.moonbeam.network", 43),
      network_id: 43
    },
    // we could alternatively use this option if we were running a lite weight test node
    ganache: {
      provider: () => new PrivateKeyProvider(privateKey, "http://localhost:8545/", 43),
      network_id: 43
    }
  },
  compilers: {
    solc: {
      version: "^0.6"
    }
  }
}
```

### Start Coding

add our first contract inside the contracts directory using:  
`cd contracts`  
`touch DictatorDollar.sol`  

after you copy and paste this code into DictatorDollar.sol, let's talk about it.

```solidity
pragma solidity ^0.6.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";


// DictatorDollar is a standard ERC20, with the caveat that only the Owner of the 
// contract can mint and burn tokens
contract DictatorDollar is ERC20, Ownable {
    // this function is only ran once, upon first publishing the contract on chain
    constructor(uint256 initialBalance)
    public
    ERC20("DictatorDollar", "DD")  {
        _mint(msg.sender, initialBalance);
    }

    // mint allows the owner to create tokens
    function mint(address account, uint256 amount) public onlyOwner {
        _mint(account, amount);
    }

    // burn allows the owner to burn tokens
    function burn(address account, uint256 amount) public onlyOwner {
        _burn(account, amount);
    }
}
```
Let's dig into this contract a little bit. To describe it quickly, the contract we're defining is using code from the two contracts we're inheriting from. This means that it's as if we took all the code in ERC20 and Ownable and put it in our contract. Then we're defining 3 additional methods to that contract. 

The constructor tells the compiler what to do right after we deploy the contract. While the two methods, mint and burn, enable `public` functionality, meaning anyone can call these functions. Well, anyone *can* call these functions, but that doesn't mean that the functions will *work*. In fact, if we dig a little deeper into the code that we [imported](https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/access/Ownable.sol), we can find out why.
```solidity
contract Ownable is Context {
    address private _owner;

    event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);

    /**
     * @dev Initializes the contract setting the deployer as the initial owner.
     */
    constructor () internal {
        address msgSender = _msgSender();
        _owner = msgSender;
        emit OwnershipTransferred(address(0), msgSender);
    }

    /**
     * @dev Throws if called by any account other than the owner.
     */
    modifier onlyOwner() {
        require(_owner == _msgSender(), "Ownable: caller is not the owner");
        _;
    }
```  
In this contract we see that this contract also has a constructor, which assigns the msg.sender as _owner. In solidity smart contracts, msg.sender is the account that is making the call to the function. That's us! We're the owner. The second solidity concept that gives us control over minting and burning tokens is modifiers. 

Modifiers are simply functinos that run before or after a function call. The underscore in a modifier represents when to call the funtion that the modifier is modifying. Now if we look at the `modifier` `onlyOwner`, we see a require statement, that ensures the caller is the owner. So, any function that has the modifier `onlyOwner`, ensures that only we can call that function. That's why we use that modifier in our contract's mint and burn methods, so that only we can mint burn.  
#### Compiling our Contract
let's go back one directory using:  
`cd ..`  
now let's compile our contracts by calling 
`truffle compile`  
if we've done everthing correctly, our terminals should look somethign like    
```
Compiling your contracts...
===========================
✔ Fetching solc version list from solc-bin. Attempt #1
> Compiling ./contracts/token.sol
✔ Fetching solc version list from solc-bin. Attempt #1
> Compilation warnings encountered:

    /home/evan/solidity/src/github.com/evan-forbes/test/contracts/token.sol: Warning: SPDX license identifier not provided in source file. Before publishing, consider adding a comment containing "SPDX-License-Identifier: <SPDX-License>" to each source file. Use "SPDX-License-Identifier: UNLICENSED" for non-open-source code. Please see https://spdx.org for more information.

> Artifacts written to /home/evan/solidity/src/github.com/evan-forbes/test/build/contracts
> Compiled successfully using:
   - solc: 0.6.12+commit.27d51765.Emscripten.clang
```  
#### Deploying our Contract
We need to change one last file before we can deploy. This file tell truffle what the deployment should actually do. In the migrations directory, there should be a file called `1_initial_migration.js`, replace it's contents with
```javascript
const Migrations = artifacts.require("Migrations");
const DictatorDollar = artifacts.require("DictatorDollar");

module.exports = async function (deployer) {
  deployer.deploy(Migrations);
  // give ourselves a bunch of money
  deployer.deploy(DictatorDollar, "8000000000000000000000000");
};
```
Now that we know our contracts can compile, let's run:  
`truffle migrate --network moon`  
to deploy our contracts  
we should see something like:
```
Compiling your contracts...
===========================
✔ Fetching solc version list from solc-bin. Attempt #1
> Everything is up to date, there is nothing to compile.



Starting migrations...
======================
> Network name:    'moon'
> Network id:      43
> Block gas limit: 0 (0x0)


1_initial_migration.js
======================

   Replacing 'DictatorDollar'
   --------------------------
   > transaction hash:    0x35836ec156921898453ea30049efa92b05cf5248ac46e6f1883c2216c4f2f9a4
   > Blocks: 0            Seconds: 4
   > contract address:    0xD13422F033d5b9527E03Be1cA6294bBeE26eec99
   > block number:        237480
   > block timestamp:     1604272608
   > account:             0x1e259A6490fFa98EcBa6FB61b6A8BF79325507A3
   > balance:             9.86579752
   > gas used:            1728695 (0x1a60b7)
   > gas price:           20 gwei
   > value sent:          0 ETH
   > total cost:          0.0345739 ETH

   > Saving artifacts
   -------------------------------------
   > Total cost:           0.0345739 ETH


Summary
=======
> Total deployments:   1
> Final cost:          0.0345739 ETH
```
We did it! we are now the controller of our own DictatorDollars! We can print money and give it to whomever we feel like! We can also burn the dollars of whoever we want...

This quick tutorial shows us how to get started, but the real fun has yet to begin. Stay tuned for updates on the launch of the Moonbeam incentivized network launch, along with more tutorials to help us get ready to build the craziest financial-governance-DAO stuff ever seen!
