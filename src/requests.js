const https = require('https')

let API_KEY = process.env.API_KEY;

//Establishes the url to fetch normal transactions from the account in question
//(depending on the API Key provided and the address in question)
function makeNormalTxURL(addressWanted) {

    return 'https://api.etherscan.io/api'
    + '?module=account'
    + '&action=txlist'
    + '&address=' + addressWanted
    + '&startblock=0'
    + '&endblock=99999999'
    + '&page=1'
    + '&offset=10'
    + '&sort=asc'
    + '&apikey='+ API_KEY   
}

//Establishes the url to fetch internal transactions (interactions with smart contracts) from the account in question
//(depending on the API Key provided and the address in question)
function makeInternalTxURL(addressWanted) {

    return 'https://api.etherscan.io/api'
    + '?module=account'
    + '&action=txlistinternal'
    + '&address=' + addressWanted
    + '&startblock=0'
    + '&endblock=2702578'
    + '&page=1'
    + '&offset=10'
    + '&sort=asc'
    + '&apikey='+ API_KEY   
}

//Gets all addresses the acount has interected with (either sent or received funds from)
function getConnections(addressWanted) {

    let url = makeNormalTxURL(addressWanted)

    https.get(url, res => {
        let data = '';
        res.on('data', chunk => {
          data += chunk;
        });
        res.on('end', () => {
          data = JSON.parse(data);

          for(let i=0; i<data.result.length; i++){
            //If the address is receiving funds, if there is no input in the tx (simple funds transfer)
            //and if it wasn't a fake tx (value of the transfered should be greater than zero)
            if(data.result[i].from != addressWanted && data.result[i].input == '0x' && data.result[i].value != '0')
            console.log(data.result[i]);
          }
        })
      }).on('error', err => {
        console.log(err.message);
      })
}

//Creats a "from" tree (see image anexed "tree.png")

//Checks if any of the wallets in a tree have interacted with a contract linked to CoinJoin

//If one of the accounts in the tree has interacted with the TornadoCash contracts
function interactedWithTORN() {
    //From DUNE analytics 'https://dune.xyz/queries/100948/205031'
    let address_01 = '0x12D66f87A04A9E220743712cE6d9bB1B5616B8Fc' //0.1eth pool
    let address_1 = '0x47ce0c6ed5b0ce3d3a51fdb1c52dc66a7c3c2936' //1eth pool
    let address_10 = '0x910cbd523d972eb0a6f4cae4618ad62622b39dbf' //10eth pool
    let address_100 = '0xa160cdab225685da1d56aa342ad8841c3b53f291' //100eth pool
}
//If an address interacted with a TORN contract, it checks what percentage of the money withdrawn from said contract

//Call Functions
getConnections('0xcFCB441dD850aF358eE7156907103B7A79475522');
//tornado cash user https://etherscan.io/address/0x1e423f3eabb63a1d7033016cbd1398512d964207