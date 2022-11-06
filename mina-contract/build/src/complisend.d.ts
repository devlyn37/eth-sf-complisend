import { Field, SmartContract, State, PublicKey, isReady, Encoding } from 'snarkyjs';
export { isReady, Field, Encoding };
export declare class CompliSend extends SmartContract {
    publicKey: State<PublicKey>;
    threshold: State<Field>;
    init(publicKey: PublicKey, threshold: number): void;
    add(from: string, to: string, amount: bigint): void;
}
