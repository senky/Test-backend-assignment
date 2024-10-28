import { GraphQLHTTP } from "@deno-libs/gql";
import { makeExecutableSchema } from "npm:@graphql-tools/schema@10.0.3";
import { gql } from "https://deno.land/x/graphql_tag@0.1.2/mod.ts";

const typeDefs = gql`
  type Query {
    hello: String
  }
`;

const resolvers = {
  Query: {
    hello: () => `Hello World!`,
  },
};

const schema = makeExecutableSchema({ typeDefs, resolvers });

const handler = async (req: Request) => {
  const { pathname } = new URL(req.url);
  return pathname === "/graphql"
    ? await GraphQLHTTP<Request>({
        schema,
        graphiql: true,
      })(req)
    : new Response("Not Found", { status: 404 });
};

// Deno.serve({ port: 3000 }, route(routes, defaultHandler));

Deno.serve(
  {
    port: 8000,
    // onListen({ hostname, port }) {
    //   console.log(`☁  Started on http://${hostname}:${port}`);
    // },
  },
  handler
);
