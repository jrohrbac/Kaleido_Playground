const HTTPProviderRateLimitRetry = require('./lib/http-provider-rate-limit-retry')

module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // to customize your Truffle configuration!
  networks: {
    development: {
      // provider: () => {
      //   const appCred = 'u0d7elqqwy:654WW9ieVumGUel_fdK5YwWeFKibt0DFgGHir9EdKsU'; // from application credential widget
      //   const connectionURL = 'u0qze5aarl-u0ap30iv13-rpc.us0-aws.kaleido.io'; // without protocol (https://)
      //   return new HTTPProviderRateLimitRetry(`https://${appCred}@${connectionURL}`, 100000);
      // },
      host: "127.0.0.1",
      port: 7545,
      network_id: "*", // Match any network id
      gasPrice: 0,
      gas: 0,
      type: 'quorum' // Use this property for Quorum environments */
    },
  },
  mocha: {
    enableTimeouts: false,
    before_timeout: 600000
  },
  compilers: {
    solc: {
      version: "0.5.0",
      settings: {
        evmVersion: "byzantium"
      }
    },
  }
};
