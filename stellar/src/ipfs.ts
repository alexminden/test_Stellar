import IPFS from 'ipfs'

export async function createNode(): Promise<any> {
    return await IPFS.create();
}

export async function createFile(data:string, node:any): Promise<string> {
    const { cid } = await node.add(data);
    return cid.toString();
}

export async function getData(cid:string, node:any): Promise<string> {
    const stream = node.cat(cid.toString());
    let data = ''
    for await (const chunk of stream) {
        data += chunk.toString();
    }
    return data;
}
