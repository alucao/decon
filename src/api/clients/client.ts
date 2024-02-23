
interface Transaction {
    hash: string;
    block: number;
    ts: number;
    metadata: any;
}

interface ApiClient {
    getTransactions(fromTransaction: Transaction|null): Promise<Transaction[]>;
}

export { Transaction, ApiClient };
