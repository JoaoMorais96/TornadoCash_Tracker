const https = require('https');
const { resolve } = require('path');

let API_KEY = process.env.API_KEY;

//From DUNE analytics 'https://dune.xyz/queries/100948/205031'
let address_01 = '0x12D66f87A04A9E220743712cE6d9bB1B5616B8Fc' //0.1eth pool
let address_1 = '0x47ce0c6ed5b0ce3d3a51fdb1c52dc66a7c3c2936' //1eth pool
let address_10 = '0x910cbd523d972eb0a6f4cae4618ad62622b39dbf' //10eth pool
let address_100 = '0xa160cdab225685da1d56aa342ad8841c3b53f291' //100eth pool
let TORNContractAddresses = {'0.1ETH': address_01, 
                            '1ETH': address_1, 
                            '10ETH': address_10, 
                            '100ETH': address_100};

//Updates the most recent block


//INTERNAL TXs
    //Establishes the url to fetch internal transactions (interactions with smart contracts) from the account in question
    //(depending on the API Key provided and the address in question)
    function makeInternalTxURL(addressWanted) {

        return 'https://api.etherscan.io/api'
        + '?module=account'
        + '&action=txlistinternal'
        + '&address=' + addressWanted
        + '&startblock=0'
        + '&endblock=99999999'
        + '&page=1'
        + '&offset=10'
        + '&sort=asc'
        + '&apikey='+ API_KEY   
    }
    //Gets the requested promise
    async function  getRequestInternalTx(url, i){
        return new Promise((resolve, reject) => {
            https.get(url, res => {
                let data = '';
                res.on('data', chunk => {
                data += chunk;
                });
                res.on('end', async () => {
                    let arr = [];
                data = JSON.parse(data);
                console.log(Object.keys(TORNContractAddresses)[i]+':')
                for(let j=0; j<data.result.length; j++){ 
                    arr[j]= data.result[j].to;
                }
                resolve(arr)
                })
            }).on('error', err => {
                console.log(err.message);
            })
        })     
    }

    //Timeout between loops (only necessary if using the free key)
    async function addDelayInternalTx(i){
        setTimeout(async function (){
            let url = makeInternalTxURL(Object.values(TORNContractAddresses)[i])
            console.log(await getRequestInternalTx(url, i));
        }, i * 10000);
    }

    //If one of the accounts in the tree has interacted with the TornadoCash contracts
    async function interactedWithTORN() {

        for(let i =0; i< Object.keys(TORNContractAddresses).length; i++) {
            addDelayInternalTx(i);
        }

    }

//NORMAL TXs
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

    //Gets the requested promise
    async function  getRequestNomralTx(url, i){
        return new Promise((resolve, reject) => {
            https.get(url, res => {
                let data = '';
                res.on('data', chunk => {
                data += chunk;
                });
                res.on('end', async () => {
                    let arr = [];
                data = JSON.parse(data);
                let count = 0;
                for(let j=0; j<data.result.length; j++){ 
                    if(data.result[i].input == '0x' && data.result[i].value != '0')
                    arr[count]=data.result[i].to;
                    count++;
                }
                resolve(arr)
                })
            }).on('error', err => {
                console.log(err.message);
            })
        })     
    }

    //Timeout between loops (only necessary if using the free key)
    async function addDelayNormalTx(i){
        setTimeout(async function (){
            let url = makeNormalTxURL(Object.values(TORNContractAddresses)[i])
            console.log(await getRequestNomralTx(url, i));//If there are more than 1 instance of the same account, 
                                                          //just sum the values instead of creating to children with the same name
        }, i * 10000);
    }

    //Gets all addresses the acount has sent funds to, after receiving funds from a TCash contract
    async function getAddressConnections() {

        for(let i =0; i< Object.keys(TORNContractAddresses).length; i++) {
            addDelayNormalTx(i);
            
            //Create Tree or update tree
            
        }

    }

//If one of the accounts in the tree has interacted with the TornadoCash contracts


//Creats a "from" tree (see image anexed "tree.png")

//Checks if any of the wallets in a tree have interacted with a contract linked to CoinJoin


//If an address interacted with a TORN contract, it checks what percentage of the money withdrawn from said contract

//Call Functions
//getConnections('0xcFCB441dD850aF358eE7156907103B7A79475522');
//tornado cash user https://etherscan.io/address/0x1e423f3eabb63a1d7033016cbd1398512d964207
interactedWithTORN()
