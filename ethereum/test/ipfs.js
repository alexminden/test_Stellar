const IPFS = require('ipfs')

async function createNode() {
    return await IPFS.create();
}

async function createFile(data, node) {
    const { cid } = await node.add(data);
    return cid.toString();
}

async function getData(cid, node) {
    const stream = node.cat(cid.toString());
    let data = ''
    for await (const chunk of stream) {
        data += chunk.toString();
    }
    return data;
}

module.exports = { createFile, getData, createNode };