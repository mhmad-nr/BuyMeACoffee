import { Address, BigInt, Bytes } from "@graphprotocol/graph-ts";
import {
  ItemBought as ItemBoughtEvent,
  ItemCancelled as ItemCancelledEvent,
  tokenListed as tokenListedEvent,
} from "../generated/Contract/Contract";
import {
  ItemBought,
  ItemCanceled,
  ItemListed,
  ActiveItem,
} from "../generated/schema";
const getID = (tokenId: BigInt, nftAddress: Address): string =>
  tokenId.toHexString() + nftAddress.toHexString();
export function handleItemBought(event: ItemBoughtEvent): void {
  let itemBought = ItemBought.load(
    getID(event.params.tokenId, event.params.nftAddress)
  );
  let activeItem = ActiveItem.load(
    getID(event.params.tokenId, event.params.nftAddress)
  );

  if (!itemBought) {
    itemBought = new ItemBought(
      getID(event.params.tokenId, event.params.nftAddress)
    );
  }

  itemBought.buyer = event.params.buyer;
  itemBought.nftAddress = event.params.nftAddress;
  itemBought.tokenId = event.params.tokenId;
  itemBought.price = event.params.price;
  activeItem!.buyer = event.params.buyer;

  itemBought.save();
  activeItem!.save();
}

export function handleItemCancelled(event: ItemCancelledEvent): void {
  let itemCanceled = ItemCanceled.load(
    getID(event.params.tokenId, event.params.nftAddress)
  );
  let activeItem = ActiveItem.load(
    getID(event.params.tokenId, event.params.nftAddress)
  );
  if (!itemCanceled) {
    itemCanceled = new ItemCanceled(
      getID(event.params.tokenId, event.params.nftAddress)
    );
  }
  itemCanceled.seller = event.params.seller;
  itemCanceled.nftAddress = event.params.nftAddress;
  itemCanceled.tokenId = event.params.tokenId;
  activeItem!.buyer = Address.fromString(
    "0x000000000000000000000000000000000000dEaD"
  );

  itemCanceled.save();
  activeItem!.save();
}

export function handletokenListed(event: tokenListedEvent): void {
  let itemListed = ItemListed.load(
    getID(event.params.tokenId, event.params.nftAddress)
  );
  let activeItem = ActiveItem.load(
    getID(event.params.tokenId, event.params.nftAddress)
  );

  if (!itemListed) {
    itemListed = new ItemListed(
      getID(event.params.tokenId, event.params.nftAddress)
    );
  }
  if (!activeItem) {
    activeItem = new ActiveItem(
      getID(event.params.tokenId, event.params.nftAddress)
    );
  }

  itemListed.nftAddress = event.params.nftAddress;
  itemListed.price = event.params.price;
  itemListed.seller = event.params.seller;
  itemListed.tokenId = event.params.tokenId;

  activeItem.nftAddress = event.params.nftAddress;
  activeItem.price = event.params.price;
  activeItem.seller = event.params.seller;
  activeItem.tokenId = event.params.tokenId;
  activeItem.buyer = Address.fromString(
    "0x0000000000000000000000000000000000000000"
  );

  itemListed.save();
  activeItem.save();
}
