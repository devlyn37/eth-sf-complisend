/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import type {
  BaseContract,
  BigNumber,
  BytesLike,
  CallOverrides,
  ContractTransaction,
  Overrides,
  PopulatedTransaction,
  Signer,
  utils,
} from "ethers";
import type {
  FunctionFragment,
  Result,
  EventFragment,
} from "@ethersproject/abi";
import type { Listener, Provider } from "@ethersproject/providers";
import type {
  TypedEventFilter,
  TypedEvent,
  TypedListener,
  OnEvent,
  PromiseOrValue,
} from "../common";

export interface YourContractInterface extends utils.Interface {
  functions: {
    "greeting()": FunctionFragment;
    "setGreeting(string)": FunctionFragment;
  };

  getFunction(
    nameOrSignatureOrTopic: "greeting" | "setGreeting"
  ): FunctionFragment;

  encodeFunctionData(functionFragment: "greeting", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "setGreeting",
    values: [PromiseOrValue<string>]
  ): string;

  decodeFunctionResult(functionFragment: "greeting", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "setGreeting",
    data: BytesLike
  ): Result;

  events: {
    "SetGreeting(address,string)": EventFragment;
  };

  getEvent(nameOrSignatureOrTopic: "SetGreeting"): EventFragment;
}

export interface SetGreetingEventObject {
  sender: string;
  greeting: string;
}
export type SetGreetingEvent = TypedEvent<
  [string, string],
  SetGreetingEventObject
>;

export type SetGreetingEventFilter = TypedEventFilter<SetGreetingEvent>;

export interface YourContract extends BaseContract {
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  interface: YourContractInterface;

  queryFilter<TEvent extends TypedEvent>(
    event: TypedEventFilter<TEvent>,
    fromBlockOrBlockhash?: string | number | undefined,
    toBlock?: string | number | undefined
  ): Promise<Array<TEvent>>;

  listeners<TEvent extends TypedEvent>(
    eventFilter?: TypedEventFilter<TEvent>
  ): Array<TypedListener<TEvent>>;
  listeners(eventName?: string): Array<Listener>;
  removeAllListeners<TEvent extends TypedEvent>(
    eventFilter: TypedEventFilter<TEvent>
  ): this;
  removeAllListeners(eventName?: string): this;
  off: OnEvent<this>;
  on: OnEvent<this>;
  once: OnEvent<this>;
  removeListener: OnEvent<this>;

  functions: {
    greeting(overrides?: CallOverrides): Promise<[string]>;

    setGreeting(
      newGreeting: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;
  };

  greeting(overrides?: CallOverrides): Promise<string>;

  setGreeting(
    newGreeting: PromiseOrValue<string>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  callStatic: {
    greeting(overrides?: CallOverrides): Promise<string>;

    setGreeting(
      newGreeting: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<void>;
  };

  filters: {
    "SetGreeting(address,string)"(
      sender?: null,
      greeting?: null
    ): SetGreetingEventFilter;
    SetGreeting(sender?: null, greeting?: null): SetGreetingEventFilter;
  };

  estimateGas: {
    greeting(overrides?: CallOverrides): Promise<BigNumber>;

    setGreeting(
      newGreeting: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;
  };

  populateTransaction: {
    greeting(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    setGreeting(
      newGreeting: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;
  };
}