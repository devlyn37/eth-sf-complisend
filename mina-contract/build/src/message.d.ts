import { Field, SmartContract, State, PrivateKey, PublicKey, isReady, Encoding } from 'snarkyjs';
export { isReady, Field, Encoding };
export declare const users: {
    Auditor: PrivateKey;
};
export declare class Message extends SmartContract {
    publicKey: State<PublicKey>;
    threshold: State<Field>;
    init(): void;
    addTransaction(from: string, to: string, amount: bigint): void;
}
