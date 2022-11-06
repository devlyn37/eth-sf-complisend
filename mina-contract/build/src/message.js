var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Field, SmartContract, state, State, method, 
// DeployArgs,
// Permissions,
PrivateKey, PublicKey, isReady, Encoding, Encryption, } from 'snarkyjs';
// import * as IPFS from 'ipfs';
// import OrbitDB from 'orbit-db';
export { isReady, Field, Encoding };
// Wait till our SnarkyJS instance is ready
await isReady;
// // Initialize IPFS and OrbitDB
// const ipfsOptions = { repo: './ipfs', };
// const ipfs = await IPFS.create(ipfsOptions);
// const orbitdb = await OrbitDB.createInstance(ipfs);
// const db = await orbitdb.eventlog('complisend.transaction')
export const users = {
    Auditor: PrivateKey.fromBase58('EKFAdBGSSXrBbaCVqy4YjwWHoGEnsqYRQTqz227Eb5bzMx2bWu3F')
};
export class Message extends SmartContract {
    constructor() {
        super(...arguments);
        // On-chain state definitions
        this.publicKey = State();
        this.threshold = State();
        //   @method getTransaction(privateKey: PrivateKey, limit: number) {
        //     // retrieved encrypted transaction data from IPFS
        //     const txEncryptedList = db.iterator({ limit })
        //         .collect()
        //         .map((e) => e.payload.value)
        //     console.log("txEncryptedList=%s", txEncryptedList)
        //     const txs = txEncryptedList
        //         .map((txEncrypted) => {
        //             const tx: Field[] = new Array<Field>
        //             tx[0] = Field.fromString(txEncrypted.from)
        //             tx[1] = Field.fromString(txEncrypted.to)
        //             tx[2] = Field.fromBigInt(txEncrypted.amount)
        //             const publicKey = this.publicKey.get();
        //             Encryption.decrypt({ publicKey, tx}, privateKey)
        //         });
        //   }
    }
    init() {
        // Define initial values of on-chain state
        this.publicKey.set(users['Auditor'].toPublicKey());
        this.threshold.set(Field.fromNumber(3000));
    }
    addTransaction(from, to, amount) {
        console.log("from=%s, to=%s, amount=%s", from, to, amount);
        const publicKey = this.publicKey.get();
        const tx = new Array < Field >
            tx[0], Field, fromString;
        (from);
        tx[1] = Field.fromString(to);
        tx[2] = (Field.fromBigInt(amount) < this.threshold.get()) ? Field.fromNumber(0) : Field.fromBigInt(amount);
        // encrypt transaction details
        const txEncrypted = Encryption.encrypt(tx, publicKey).cipherText;
        console.log("txEncrypted=%s", txEncrypted);
        // // persist encrypted transaction data to IPFS
        // db.add({
        //     from: txEncrypted[0].toString, 
        //     to: txEncrypted[1].toString, 
        //     amount: txEncrypted[2].toString
        // });
    }
}
__decorate([
    state(PublicKey),
    __metadata("design:type", Object)
], Message.prototype, "publicKey", void 0);
__decorate([
    state(Field),
    __metadata("design:type", Object)
], Message.prototype, "threshold", void 0);
__decorate([
    method,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], Message.prototype, "init", null);
__decorate([
    method,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, typeof BigInt === "function" ? BigInt : Object]),
    __metadata("design:returntype", void 0)
], Message.prototype, "addTransaction", null);
