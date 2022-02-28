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
                            let treeArr = []
//Credit: https://github.com/HaysS/javascript-cs-fundamentals/blob/e1a0ebf9b97369f4cc3ac7e0c98c0bd3fd6890db/data-structures/tree.js
function Node(data) {
    this.data = data;
    this.children = [];
}

class Tree {
    constructor() {
        this.root = null;
    }

    add(data, toNodeData) {
        const node = new Node(data);
        // If the toNodeData arg is passed, find it. Otherwise, store null.
        const parent = toNodeData ? this.findBFS(toNodeData) : null;

        // Push new node to parent whose value matches toNodeData
        if(parent) {
            parent.children.push(node)
        } else {
            // If there's no parent, make this the root node
            if(!this.root)
                this.root = node;
            else
                return "Tried to store node as root when root already exists."
        }
    }

    findBFS(data) {
        const queue = [this.root];
        let _node = null;

        // Go thru every node in BFS
        this.traverseBFS((node) => {
            // Return match if found
            if(node.data === data) {
                _node = node;
            }
        })

        return _node;
    }

    traverseBFS(cb) {
        const queue = [this.root];

        if(cb)
            while(queue.length) {
                // Store current node & remove it from queue
                const node = queue.shift();

                cb(node)

                    // Push children of current node to end of queue
                    for(const child of node.children) {
                    queue.push(child);
                }
            }
    }
}

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

    //If one of the accounts in the tree has interacted with the TornadoCash contracts
    async function interactedWithTORN(){
        let promiseArray=[];

        
            for(let i =0; i< Object.keys(TORNContractAddresses).length; i++) {
                promiseArray.push(new Promise((resolve, reject) => {
                    setTimeout(async function (){//Timeout between loops (only necessary if using the free key)
                    
                        let url = makeInternalTxURL(Object.values(TORNContractAddresses)[i])

                        let tree = new Tree();
                        tree.add(Object.keys(TORNContractAddresses)[i])
                    
                        getRequestInternalTx(url, i).then((res) => {
                            for(let j=0; j<res.length; j++){
                                tree.add(res[j], Object.keys(TORNContractAddresses)[i]);
                            }
                        }).then(()=>{
                            console.log(tree.findBFS(Object.keys(TORNContractAddresses)[i]))
                            resolve()
                        })
                    }, i * 10000);
                }))
            }
            return await Promise.all(promiseArray)
        
    }

    


//If one of the accounts in the tree has interacted with the TornadoCash contracts


//Creats a "from" tree (see image anexed "tree.png")

//Checks if any of the wallets in a tree have interacted with a contract linked to CoinJoin


//If an address interacted with a TORN contract, it checks what percentage of the money withdrawn from said contract

//Call Functions
//getConnections('0xcFCB441dD850aF358eE7156907103B7A79475522');
//tornado cash user https://etherscan.io/address/0x1e423f3eabb63a1d7033016cbd1398512d964207


//getAddressConnections()
interactedWithTORN().then(()=>{
    console.log('blh blah' + treeArr)
})