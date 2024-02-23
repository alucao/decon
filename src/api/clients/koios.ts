import axios from "axios";
import { ApiClient, Transaction } from "./client";
import NinjaConfig from "../../ninjaConfig";

class KoiosApiClient implements ApiClient {
    private apiKey = "";

    constructor(apiKey: string) {
        this.apiKey = apiKey;
    }

    async getTransactions(fromTransaction: Transaction|null): Promise<Transaction[]> {
        let url = new NinjaConfig().getCfg().KOIOS_URL;
        console.log(fromTransaction)
        let lastBlock = fromTransaction?.block ?? 1;

        const txRequestConfig = {
            headers: {
                Authorization: 'Bearer ' + this.apiKey,
            },
            method: 'post',
            url: `${url}/address_txs`, //?select=tx_hash`,
            data: {
                "_addresses": [
                    new NinjaConfig().getCfg().WALLET_ADDRESS
                ],
                "_after_block_height": lastBlock+1
            }
        }

        const txResponse = await axios(txRequestConfig);
        if (txResponse.status != 200) {
            console.log("Tx api request failed!", txResponse);
            throw new Error("tx api request failed:" + txResponse);
        }

        let transactions: Transaction[] = txResponse.data.map(tx => {
            return {
                hash: tx.tx_hash,
                block: tx.block_height,
                ts: tx.block_time,
                metadata: null,
            }
        });
        if (!transactions) {
            console.log('no tx hashes...');
            return [];
        }

        const requestConfig = {
            headers: {
                Authorization: 'Bearer ' + this.apiKey,
            },
            method: 'post',
            url: `${url}/tx_metadata`,
            data: {
                "_tx_hashes": transactions.map(tx => tx.hash)
            }
        }

        const response = await axios(requestConfig);
        if (response.status != 200) {
            console.log("Api request failed!", response);
            throw new Error("api request failed:" + response);
        }

        for (let tx of response.data) {
            let transaction = transactions.find(x => x.hash == tx.tx_hash);
            if (transaction) transaction.metadata = tx.metadata;
        }
        console.log(transactions)

        transactions.sort((a, b) => a.block - b.block);

        return transactions;
    }
}

export { KoiosApiClient };
