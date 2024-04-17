import { gql } from "@apollo/client";

export const GET_MEMO_BY_TO = gql`
  query GetMemo($address: String!) {
    memos(where: { to: $address }) {
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
