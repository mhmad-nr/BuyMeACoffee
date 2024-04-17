import { gql } from "@apollo/client";

export const GET_MEMO_BY_FROM = gql`
  query GetMemo($address: String!) {
    memos(where: { from: $address }) {
      id
      to
      from
      timestamp
      message
      name
      blockTimestamp
      blockNumber
      amount
    }
  }
`;
