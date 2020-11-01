const PrivateKeyProvider = require ('./private-provider')
var privateKey = process.env.PRIV_KEY;

module.exports = {
  networks: {
    development: {
      provider: () => new PrivateKeyProvider(privateKey, "http://localhost:9933/", 43),
      network_id: 43
    },
    moon: {
      provider: () => new PrivateKeyProvider(privateKey, "https://rpc.testnet.moonbeam.network", 43),
      network_id: 43
    },
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