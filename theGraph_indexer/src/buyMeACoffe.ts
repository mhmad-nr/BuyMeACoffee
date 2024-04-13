import { Address, BigInt, Bytes } from "@graphprotocol/graph-ts";
import {
  MemoEvent as MemoEventEvent,
  SingUpEvent as SingUpEventEvent,
} from "../generated/Contract/Contract";
import { MemoEvent, SingUpEvent } from "../generated/schema";

const getID = (from: Address, to: Address = new Address(0)): Bytes =>
  Bytes.fromHexString(from.toHexString() + to.toHexString());

export function handleMemoEvent(event: MemoEventEvent): void {
  let entity = MemoEvent.load(getID(event.params.to, event.params.from));

  if (!entity) {
    entity = new MemoEvent(getID(event.params.to, event.params.from));
  }

  entity.from = event.params.from;
  entity.timestamp = event.params.timestamp;
  entity.amount = event.params.amount;
  entity.name = event.params.name;
  entity.message = event.params.message;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();
}

export function handleSingUpEvent(event: SingUpEventEvent): void {
  let entity = SingUpEvent.load(getID(event.params.from));

  if (!entity) {
    entity = new SingUpEvent(getID(event.params.from));
  }

  entity.from = event.params.from;
  entity.timestamp = event.params.timestamp;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();
}
