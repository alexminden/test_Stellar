import { expect } from 'chai';
import { Stellar } from '../src/stellar'
import fetch from "node-fetch";
var FormData = require('form-data');
import { createNode, createFile, getData } from '../src/ipfs'

describe('Options tests', () => {
    const stellar = new Stellar;
    let ipfs: any;
    let account: any;
    let ipfsCID: string[];

    it('checking default options', async () => {
        account = await stellar.makeAccount();
        console.log('public Key: ', account.publicKey(), 'private Key: ', account.secret());
        expect(account.type).to.equal('ed25519');
    });

    it('should return balance of account', async () => {
        const balance = await stellar.getBalance(account);
        console.log(balance[0].balance)
        expect(balance[0].balance).to.equal('10000.0000000');
    });

    // it("should create an IPFS node", async () => {
    //     ipfs = await createNode();
    // });

    // it("should create an IPFS file", async () => {
    //     ipfsCID.push(await createFile('test', ipfs));
    //     console.log('ipfsCID: ',ipfsCID);
    //     expect(ipfsCID[0].length).to.equal(46);
    // });

    it('should create data in the account', async () => {
        const data = await stellar.manageData(account, `IPFS Hash`, 'Test');
        console.log(data.hash);
        console.log(data.successful);
        expect(data.successful).to.be.true;
    })

    it('should create data in the account', async () => {
        const data = await stellar.manageDataCurl(account, `IPFS Hash`, 'TestMadeWithCurl');
        console.log(data);
        const url = "https://horizon-testnet.stellar.org/transactions"
        var form = new FormData();
        form.append('tx', data);
        const options = {
            method: "POST",
            body: form
        };
        const res = await fetch(url, options);
        console.log(res);
    })
});
