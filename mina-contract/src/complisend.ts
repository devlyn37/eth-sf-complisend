import {
  Field,
  SmartContract,
  state,
  State,
  method,
  DeployArgs,
  Permissions,
  PrivateKey,
  PublicKey,
  isReady,
  Encoding,
  Encryption,
} from 'snarkyjs';

// import * as IPFS from 'ipfs';
// import OrbitDB from 'orbit-db';

export { isReady, Field, Encoding };

// Wait till our SnarkyJS instance is ready
await isReady;

// Initialize IPFS and OrbitDB
// const ipfs = await IPFS.create()
// console.log(ipfs);
// const orbitdb = await OrbitDB.createInstance(ipfs);
// const db = await orbitdb.eventlog('complisend.transaction');

export class CompliSend extends SmartContract {
  // On-chain state definitions
  @state(PublicKey) publicKey = State<PublicKey>();
  @state(Field) threshold = State<Field>();

  // temporary, to be moved to ipfs
  @state(Field) part0 = State<Field>();
  @state(Field) part1 = State<Field>();
  @state(Field) part2 = State<Field>();
  @state(Field) part3 = State<Field>();

  deploy(args: DeployArgs) {
    super.deploy(args);
    this.setPermissions({
      ...Permissions.default(),
      editState: Permissions.proofOrSignature(),
    });
  }

  @method init(publicKey: PublicKey, threshold: Field) {
    // Define initial values of on-chain state
    this.publicKey.set(publicKey);
    this.threshold.set(threshold);
  }

  @method add(from: Field, to: Field, amount: Field) {
    console.log('from=%s, to=%s, amount=%s', from, to, amount);
    this.publicKey.assertEquals(this.publicKey.get());
    this.threshold.assertEquals(this.threshold.get());

    const tx: Field[] = new Array<Field>();
    tx[0] = from;
    tx[1] = to;
    tx[2] = amount < this.threshold.get() ? Field.fromNumber(0) : amount;

    // encrypt transaction details
    const { publicKey, cipherText } = Encryption.encrypt(
      tx,
      this.publicKey.get()
    );

    // update public key of last encryption record
    this.publicKey.set(PublicKey.fromGroup(publicKey));

    // update cypher text
    this.part0.set(cipherText[0]);
    this.part1.set(cipherText[1]);
    this.part2.set(cipherText[2]);
    this.part3.set(cipherText[3]);

    // // persist encrypted transaction data to IPFS
    // db.add({
    //     from: txEncrypted[0].toString,
    //     to: txEncrypted[1].toString,
    //     amount: txEncrypted[2].toString
    // });
  }

  @method list(auditor: PrivateKey, limit: Field) {
    this.publicKey.assertEquals(this.publicKey.get());
    this.part0.assertEquals(this.part0.get());
    this.part1.assertEquals(this.part1.get());
    this.part2.assertEquals(this.part2.get());
    this.part3.assertEquals(this.part3.get());

    const publicKey = this.publicKey.get();

    // recreate cipher text
    const cipherText = new Array<Field>();
    cipherText[0] = this.part0.get();
    cipherText[1] = this.part1.get();
    cipherText[2] = this.part2.get();
    cipherText[3] = this.part3.get();
    console.log(
      'limit=%s, cipherText=%s, publicKey.x=%s,',
      limit.toString(),
      cipherText,
      publicKey.x
    );

    const txDecrypted = Encryption.decrypt(
      { publicKey: publicKey.toGroup(), cipherText },
      auditor
    );

    console.log(
      'txDecrypted=%s, %s, %s',
      txDecrypted[0],
      txDecrypted[1],
      txDecrypted[2]
    );

    // // retrieved encrypted transaction data from IPFS
    // const txEncryptedList = db.iterator({ limit })
    //     .collect()
    //     .map((e) => e.payload.value)

    // console.log("txEncryptedList=%s", txEncryptedList)

    // const txs = txEncryptedList
    //     .map((txEncrypted) => {
    //         const tx: Field[] = new Array<Field>
    //         tx[0] = Field.fromString(txEncrypted.from)
    //         tx[1] = Field.fromString(txEncrypted.to)
    //         tx[2] = Field.fromBigInt(txEncrypted.amount)

    //         const publicKey = this.publicKey.get();
    //         Encryption.decrypt({ publicKey, tx }, privateKey)
    //     });
  }
}
