import { gql } from "@apollo/client";

export const GET_MEMO = ({ from, to }: { from?: boolean; to?: boolean }) => {
  return gql`
  query GetMemo(${to ? "$to: String" : ""} ${from && to ? "," : ""} ${
    from ? "$from: String" : ""
  }) {
    memos(where: {${from ? "from: $from" : ""} ${from && to ? "," : ""} ${
    to ? "to: $to" : ""
  }}) {
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
};
