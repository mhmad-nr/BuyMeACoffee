import { gql } from "@apollo/client";

export const GET_MEMO_LAST = gql`
  query Memos($first: Int) {
    memos(first: $first) {
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
