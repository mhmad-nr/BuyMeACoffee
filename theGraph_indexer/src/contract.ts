import {
  MemoEvent as MemoEventEvent,
  SingUpEvent as SingUpEventEvent
} from "../generated/Contract/Contract"
import { MemoEvent, SingUpEvent } from "../generated/schema"

export function handleMemoEvent(event: MemoEventEvent): void {
  let entity = new MemoEvent(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.from = event.params.from
  entity.timestamp = event.params.timestamp
  entity.amount = event.params.amount
  entity.name = event.params.name
  entity.message = event.params.message

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleSingUpEvent(event: SingUpEventEvent): void {
  let entity = new SingUpEvent(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.from = event.params.from
  entity.timestamp = event.params.timestamp

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}
