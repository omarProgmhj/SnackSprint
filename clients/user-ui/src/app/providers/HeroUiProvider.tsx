// app/providers.tsx
"use client"


import { graphqlClient } from "@/src/graphql/gql.setup";
import { ApolloProvider } from "@apollo/client";
import { HeroUIProvider } from "@heroui/react";
import { ThemeProvider as NextThemesProvider } from "next-themes";


export function Providers({ children }: { children: React.ReactNode }) {
    return (
            <ApolloProvider client={graphqlClient}>
                <HeroUIProvider>
                    <NextThemesProvider attribute="class" defaultTheme="dark">
                        {children}
                    </NextThemesProvider>
                </HeroUIProvider>
            </ApolloProvider>
    )       
}