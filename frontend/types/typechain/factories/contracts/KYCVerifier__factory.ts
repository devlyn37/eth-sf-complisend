/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import { Signer, utils, Contract, ContractFactory, Overrides } from "ethers";
import type { Provider, TransactionRequest } from "@ethersproject/providers";
import type { PromiseOrValue } from "../../common";
import type {
  KYCVerifier,
  KYCVerifierInterface,
} from "../../contracts/KYCVerifier";

const _abi = [
  {
    inputs: [
      {
        internalType: "contract IBalanceOf",
        name: "kycToken",
        type: "address",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
];

const _bytecode =
  "0x6080604052348015600f57600080fd5b5060405160c838038060c8833981016040819052602a91604e565b600080546001600160a01b0319166001600160a01b0392909216919091179055607c565b600060208284031215605f57600080fd5b81516001600160a01b0381168114607557600080fd5b9392505050565b603f8060896000396000f3fe6080604052600080fdfea26469706673582212202913651cd79f126b3d6e78462ee174a119ce15fb2e5e14e3570a0f2b3001836564736f6c63430008110033";

type KYCVerifierConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: KYCVerifierConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class KYCVerifier__factory extends ContractFactory {
  constructor(...args: KYCVerifierConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
  }

  override deploy(
    kycToken: PromiseOrValue<string>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<KYCVerifier> {
    return super.deploy(kycToken, overrides || {}) as Promise<KYCVerifier>;
  }
  override getDeployTransaction(
    kycToken: PromiseOrValue<string>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(kycToken, overrides || {});
  }
  override attach(address: string): KYCVerifier {
    return super.attach(address) as KYCVerifier;
  }
  override connect(signer: Signer): KYCVerifier__factory {
    return super.connect(signer) as KYCVerifier__factory;
  }

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): KYCVerifierInterface {
    return new utils.Interface(_abi) as KYCVerifierInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): KYCVerifier {
    return new Contract(address, _abi, signerOrProvider) as KYCVerifier;
  }
}