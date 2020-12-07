
const ipfs = require('./ipfs');
const CoinGecko = require('coingecko-api');
const airContract = artifacts.require("airContract");
const bs58 = require('bs58')
let ipfsCID = [];
let node;

contract("airContract", () => {
    beforeEach(async () => {
        contractAir = await airContract.deployed();
    });

    it("should create node", async () => {
        node = await ipfs.createNode();
    })

    it("should create mulitple IPFS file", async () => {
        ipfsCID.push(await ipfs.createFile('test', node));
        assert.equal(ipfsCID[0].length, 46);

        ipfsCID.push(await ipfs.createFile('test1', node));
        assert.equal(ipfsCID[1].length, 46);

        ipfsCID.push(await ipfs.createFile('test2', node));
        assert.equal(ipfsCID[2].length, 46);
    })

    it("should return right IPFS data", async () => {
        let data = await ipfs.getData(ipfsCID[0], node);
        assert.equal(data, 'test');

        data = await ipfs.getData(ipfsCID[1], node);
        assert.equal(data, 'test1');
    })

    it("should add a IPFS file", async () => {
        let hashHex = "0x" + bs58.decode(ipfsCID[0]).slice(2).toString('hex');
        console.log('HashHex: ', hashHex);
        await contractAir.setSensorData(hashHex);
    })

    it("should return first IPFS file registered", async () => {
        const result = await contractAir.getSensorDataByID(0);
        console.log('result: ', result);
        const hashHex = "1220" + result.slice(2);
        const hashBytes = Buffer.from(hashHex, 'hex');
        const hashStr = bs58.encode(hashBytes);
        console.log('result: ', hashStr);
        assert.equal(hashStr, ipfsCID[0]);
    })

    it("should return last IPFS file registered", async () => {
        const result = await contractAir.getSensorDataLatest();
        const hashHex = "1220" + result.slice(2);
        const hashBytes = Buffer.from(hashHex, 'hex');
        const hashStr = bs58.encode(hashBytes);
        console.log('result: ', hashStr);
        assert.equal(hashStr, ipfsCID[0]);
    })

    it("should return price", async () => {
        //Convert Ipfs hash in 32 Bytes
        let hashHex = "0x" + bs58.decode(ipfsCID[1]).slice(2).toString('hex');

        //Ethereum price in Yen
        const CoinGeckoClient = new CoinGecko();
        var params = {
            vs_currency: 'jpy'
        }
        const fetchResult = await CoinGeckoClient.coins.fetchMarketChart('ethereum', params);
        const yenPrice = fetchResult.data.prices[fetchResult.data.prices.length - 1][1]

        //Gas price
        const price = await airContract.web3.eth.getGasPrice();
        var gasPrice = Number(price);


        //SetSensorData price
        var result = await contractAir.setSensorData.estimateGas(hashHex);
        var gas = Number(result);
        var finalPrice = await airContract.web3.utils.fromWei((gas * gasPrice).toString(), 'ether');
        console.log("gas cost estimation setSensorData = " + (finalPrice * yenPrice) + " yen");

        //GetSensorDataByID price
        result = await contractAir.getSensorDataByID.estimateGas(0);
        gas = Number(result);
        finalPrice = await airContract.web3.utils.fromWei((gas * gasPrice).toString(), 'ether');
        console.log("gas cost estimation getSensorDataByID = " + (finalPrice * yenPrice) + " yen");

        //GetSensorDataLatest price
        result = await contractAir.getSensorDataLatest.estimateGas();
        gas = Number(result);
        finalPrice = await airContract.web3.utils.fromWei((gas * gasPrice).toString(), 'ether');
        console.log("gas cost estimation getSensorDataLatest = " + (finalPrice * yenPrice) + " yen");
    });
})


