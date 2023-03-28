
const Web3 = require("web3");
const web3 = new Web3("http://124.251.110.238/rpc");
const AssemblyNotes = require("./AssemblyNotes.json");

function from_tran() {
    const th = "0x6e48e232fc3d49bd04db1918bbf9e7ffe3ac250b4f7e9199a86735fffd85daec";
    web3.eth.getTransactionReceipt(th, (error, receipt) => {
        if(error) {
            console.error(error);
        } else {
            console.log(receipt.logs);
        }
    });
} 

const address = "0xA2F2025D4B39Efc3E48706053031b8150C3948dc";
client = new web3.eth.Contract(AssemblyNotes["abi"], address);

function read(client, block_number, index, max_count, msgs)
{
    if (max_count <= 0 || block_number <= 0 || index < 0) return [];
    console.log("index: " + index);
    console.log("block_number : " + block_number);
    pre_block_number = web3.utils.toBN(0);
    client.getPastEvents("Write", {
        filter: {index: index},
        fromBlock: block_number - 10,
        toBlock: block_number + 10 
    }, function(error, logs) { 
        if(error) {
            console.error(error);
        } else {
            console.log("getPastEvents, logs.count:" + logs.length);
            for (i in logs) {
                log = logs[i];

                rvals = log["returnValues"];

                pre_block_number = rvals["preBlockNumber"];
                let event_data = { 
                    "blockNumber": log["blockNumber"],
                    "blockHash": log["blockHash"],
                    "transactionHash": log["transactionHash"],
                    "timestamp": rvals["timestamp"], 
                    "data": web3.eth.abi.decodeParameter("string", rvals["data"])
                };
                console.log(event_data);
                msgs.push(event_data);
            }
        }
    }
    );
    max_count--;
    if (max_count > 0) {
        index--;
        read(client, pre_block_number, index, max_count, msgs);
    }
}

function logs() {

    //block_number = client.methods.lastBlockNumber().call();
    //count = client.methods.count().call();
    block_number = 15899197;
    count = 5;

    if (block_number == 0 || count == 0) {
        console.log("not found logs");
        return;
    }

    msgs = []
    read(client, block_number, count - 1, 10, msgs);
    msgs.forEach(function(item) {console.log(item)});
}

logs();
