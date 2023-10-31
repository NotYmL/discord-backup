const sleep = (milliseconds) => {return new Promise(resolve => setTimeout(resolve, milliseconds))};
const fetch = require('node-fetch');
const WebSocket = require('ws');
const fs = require('fs');

let token = "xxx.xxx.xxx";
let i = 0;

async function createOrOverwriteFile(filename, content) {
    return new Promise((resolve, reject) => {
        fs.writeFile(filename, content, (err) => {
            if (err) {
                reject(err);
            } else {
                resolve(`File '${filename}' created or overwritten with new content.`);
            }
        });
    });
}  

function recursion()
{
    let socket = new WebSocket("wss://gateway.discord.gg/?encoding=json&v=9");

    socket.onclose = async function(event){
        console.log("Recursion!")
        sleep(1000*60*60*24)
        i++;
        recursion()
    }
    
    socket.onmessage = async function(event) {
        let ctx = JSON.parse(event.data);

        if(ctx?.d?.heartbeat_interval!==undefined){
            socket.send(JSON.stringify({
                "op": 2, "d": { 
                "token": token,
                "properties":{
                    "os":"Linux",
                    "browser":"Firefox",
                    "device":"",
                },
                "compress":false,
                }
            }));
        };

        if(ctx['t'] == "READY") {
            createOrOverwriteFile(`backup_${i}.json`, JSON.stringify(ctx, null, 2))
        }
    }
}

recursion()