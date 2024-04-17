import { gql } from "@apollo/client";

export const GET_SING_UP = gql`
  {
    singUps {
      id
      from
      timestamp
      blockNumber
      blockTimestamp
    }
  }
`;
