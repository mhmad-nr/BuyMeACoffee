import { newMockEvent } from "matchstick-as"
import { ethereum, Address, BigInt } from "@graphprotocol/graph-ts"
import { MemoEvent, SingUpEvent } from "../generated/Contract/Contract"

export function createMemoEventEvent(
  from: Address,
  timestamp: BigInt,
  amount: BigInt,
  name: string,
  message: string
): MemoEvent {
  let memoEventEvent = changetype<MemoEvent>(newMockEvent())

  memoEventEvent.parameters = new Array()

  memoEventEvent.parameters.push(
    new ethereum.EventParam("from", ethereum.Value.fromAddress(from))
  )
  memoEventEvent.parameters.push(
    new ethereum.EventParam(
      "timestamp",
      ethereum.Value.fromUnsignedBigInt(timestamp)
    )
  )
  memoEventEvent.parameters.push(
    new ethereum.EventParam("amount", ethereum.Value.fromUnsignedBigInt(amount))
  )
  memoEventEvent.parameters.push(
    new ethereum.EventParam("name", ethereum.Value.fromString(name))
  )
  memoEventEvent.parameters.push(
    new ethereum.EventParam("message", ethereum.Value.fromString(message))
  )

  return memoEventEvent
}

export function createSingUpEventEvent(
  from: Address,
  timestamp: BigInt
): SingUpEvent {
  let singUpEventEvent = changetype<SingUpEvent>(newMockEvent())

  singUpEventEvent.parameters = new Array()

  singUpEventEvent.parameters.push(
    new ethereum.EventParam("from", ethereum.Value.fromAddress(from))
  )
  singUpEventEvent.parameters.push(
    new ethereum.EventParam(
      "timestamp",
      ethereum.Value.fromUnsignedBigInt(timestamp)
    )
  )

  return singUpEventEvent
}
