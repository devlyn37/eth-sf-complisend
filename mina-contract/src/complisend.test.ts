import { CompliSend } from './complisend';
import {
  isReady,
  shutdown,
  Field,
  Mina,
  PrivateKey,
  PublicKey,
  AccountUpdate,
} from 'snarkyjs';

function createLocalBlockchain() {
  const Local = Mina.LocalBlockchain();
  Mina.setActiveInstance(Local);
  return Local.testAccounts[0].privateKey;
}

async function localDeploy(
  zkAppInstance: CompliSend,
  zkAppPrivatekey: PrivateKey,
  auditor: PrivateKey
) {
  const txn = await Mina.transaction(auditor, () => {
    AccountUpdate.fundNewAccount(auditor);
    zkAppInstance.deploy({ zkappKey: zkAppPrivatekey });
    zkAppInstance.init(auditor.toPublicKey(), Field.fromNumber(3000));
    // zkAppInstance.init(Field.fromNumber(3000));
    zkAppInstance.sign(zkAppPrivatekey);
  });
  await txn.send().wait();
}

describe('CompliSend', () => {
  let auditor: PrivateKey, zkAppAddress: PublicKey, zkAppPrivateKey: PrivateKey;

  beforeEach(async () => {
    await isReady;
    auditor = createLocalBlockchain();
    zkAppPrivateKey = PrivateKey.random();
    zkAppAddress = zkAppPrivateKey.toPublicKey();
  });

  afterAll(async () => {
    // `shutdown()` internally calls `process.exit()` which will exit the running Jest process early.
    // Specifying a timeout of 0 is a workaround to defer `shutdown()` until Jest is done running all tests.
    // This should be fixed with https://github.com/MinaProtocol/mina/issues/10943
    setTimeout(shutdown, 0);
  });

  it('generates and deploys the contract', async () => {
    const zkAppInstance = new CompliSend(zkAppAddress);
    await localDeploy(zkAppInstance, zkAppPrivateKey, auditor);
    // zkAppInstance.publicKey.get().assertEquals(auditor.toPublicKey())
  });

  it('correctly adds new transactions to the contract', async () => {
    const zkAppInstance = new CompliSend(zkAppAddress);
    await localDeploy(zkAppInstance, zkAppPrivateKey, auditor);

    const addTx = await Mina.transaction(auditor, () => {
      const sender = Field.fromString(BigInt('0xE898').toString());
      const receiver = Field.fromString(BigInt('0x9A87').toString());
      const amount = Field.fromNumber(3500);
      zkAppInstance.add(sender, receiver, amount);
      zkAppInstance.sign(zkAppPrivateKey);
    });
    await addTx.send().wait();

    const listTx = await Mina.transaction(auditor, () => {
      zkAppInstance.list(auditor, Field.fromNumber(10));
      zkAppInstance.sign(zkAppPrivateKey);
    });
    await listTx.send().wait();
  });
});
