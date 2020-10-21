const path = require("path");
var Web3 = require('web3');

module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // to customize your Truffle configuration!
  contracts_build_directory: path.join(__dirname, "app/src/contracts"),
  networks: {
    development: {
      provider: () => {
        const appCred = 'u0b23c5fh6:EgfMw4LsnTjJtJ9WQxVRVjwT0B-ykhDBmcBiiOPN440'; // from application credential widget
        const connectionURL = 'u0qze5aarl-u0ap30iv13-rpc.us0-aws.kaleido.io'; // without protocol (https://)
        return new Web3.providers.HttpProvider(`https://${appCred}@${connectionURL}`, 100000);
      },
      network_id: "*", // Match any network id
      gasPrice: 0,
      gas: 4500000,
      type: 'quorum' // Use this property for Quorum environments */
    },
  },
  compilers: {
    solc: {
      version: "0.5.0",
    }
  }
};
