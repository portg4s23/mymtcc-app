import { gql } from "@apollo/client";

export const USER_FRAGMENT = gql`
  fragment UserFields on User {
    id
    rcno
    fullName
    email
    division
    divisionId
    divisionCode
    phoneMobile
    phoneOffice
  }
`;
