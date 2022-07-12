import { gql } from "@apollo/client";

const STUDENTS = gql`
  query {
    students(name: "") {
      name
      cpf
      email
      id
    }
  }
`;

export default STUDENTS;