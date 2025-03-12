"use client"
import { gql } from '@apollo/client';
import { DocumentNode } from 'graphql'


export const LOGIN_USER : DocumentNode = gql`
    mutation LoginUser($email: String!, $password: String!) {
        Login(
            email: $email,
            password: $password 
        ) {
            user {
                id
                name
                email
                address
                phone_number
            }
                accessToken
                refreshToken
                error {
                    message
                } 
        }
    }
`;
