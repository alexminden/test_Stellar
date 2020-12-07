var StellarSdk = require('stellar-sdk');
import fetch from "node-fetch";

export class Stellar {
    transactionOption: { fee: number; networkPassphrase: string; };
    server: any;
    constructor() {
        this.transactionOption = {
            fee: StellarSdk.BASE_FEE,
            networkPassphrase: StellarSdk.Networks.TESTNET
        };
        this.server = new StellarSdk.Server('https://horizon-testnet.stellar.org');
    }

    async makeAccount(): Promise<any> {
        const pair = StellarSdk.Keypair.random();
        const response = await fetch(
            `https://friendbot.stellar.org?addr=${encodeURIComponent(pair.publicKey())}`
        );
        const responseJSON = await response.json();
        return pair;
    }

    async getBalance(pair: any): Promise<any> {
        const account = await this.server.loadAccount(pair.publicKey());
        return account.balances;
    }

    async manageData(pair: any, name: string, value: string): Promise<any> {
        const keypair = StellarSdk.Keypair.fromSecret(pair.secret());
        const account = await this.server.loadAccount(pair.publicKey());
        const setting = StellarSdk.Operation.manageData({
            name: name,
            value: value
        });

        const tx = new StellarSdk.TransactionBuilder(account, this.transactionOption)
            .addOperation(setting)
            .setTimeout('280')
            .build();
        
        tx.sign(keypair);
        let res = await this.server.submitTransaction(tx);
        return res;
    }

    async manageDataCurl(pair: any, name: string, value: string): Promise<any> {
        const keypair = StellarSdk.Keypair.fromSecret(pair.secret());
        const account = await this.server.loadAccount(pair.publicKey());
        const setting = StellarSdk.Operation.manageData({
            name: name,
            value: value
        });

        const tx = new StellarSdk.TransactionBuilder(account, this.transactionOption)
            .addOperation(setting)
            .setTimeout('280')
            .build();
        
        tx.sign(keypair);
        return tx.toEnvelope().toXDR().toString("base64");
    }
}
