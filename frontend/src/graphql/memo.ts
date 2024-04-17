import { gql } from "@apollo/client";

export const GET_MEMO = gql`
  {
    memos {
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
