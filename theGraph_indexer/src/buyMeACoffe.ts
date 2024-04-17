import { Address, BigInt, Bytes } from "@graphprotocol/graph-ts";
import {
  MemoEvent as MemoEventEvent,
  SingUpEvent as SingUpEventEvent,
} from "../generated/BuyMeACoffe/BuyMeACoffe";
import { Memo, SingUp } from "../generated/schema";

const getID = (from: Address, time: BigInt): Bytes =>
  Bytes.fromHexString(from.toHexString() + time.toHexString());

export function handleMemoEvent(event: MemoEventEvent): void {
  let entity = Memo.load(getID(event.params.to, event.params.timestamp));

  if (!entity) {
    entity = new Memo(getID(event.params.to, event.params.timestamp));
  }

  entity.to = event.params.to;
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
  let entity = SingUp.load(getID(event.params.from, event.params.timestamp));

  if (!entity) {
    entity = new SingUp(getID(event.params.from, event.params.timestamp));
  }

  entity.from = event.params.from;
  entity.timestamp = event.params.timestamp;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();
}
