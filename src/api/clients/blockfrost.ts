import axios from "axios";
import { ApiClient, Transaction } from "./client";
import NinjaConfig from "../../ninjaConfig";


class BlockfrostApiClient implements ApiClient {
    private apiKey = "";

    constructor(apiKey: string) {
        this.apiKey = apiKey;
    }

    async getTransactions(fromTransaction: Transaction|null): Promise<Transaction[]> {
        let url = new NinjaConfig().getCfg().BLOCKFROST_URL;
        console.log(fromTransaction)
        let lastBlock = fromTransaction?.block ?? 1;

        const txRequestConfig = {
            headers: {
                project_id: this.apiKey,
            },
            method: 'get',
            url: `${url}/addresses/${new NinjaConfig().getCfg().WALLET_ADDRESS}/transactions?from=${lastBlock+1}`,
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

        for (let transaction of transactions) {
            const requestConfig = {
                headers: {
                    project_id: this.apiKey,
                },
                method: 'get',
                url: `${url}/txs/${transaction.hash}/metadata`,
            }

            const response = await axios(requestConfig);
            if (response.status != 200) {
                console.log("Api request failed!", response);
                throw new Error("api request failed:" + response);
            }

            // let transaction = transactions.find(x => x.hash == tx.tx_hash);
            console.log(response.data)
            //transaction.metadata = response.data.find(x => x.label == "987").json_metadata;
            transaction.metadata = Object.fromEntries(response.data.map(x => [x.label, x.json_metadata]));
            console.log(transaction.metadata)
        }
        console.log(transactions)

        transactions.sort((a, b) => a.block - b.block);

        return transactions;
    }
}

export { BlockfrostApiClient };
