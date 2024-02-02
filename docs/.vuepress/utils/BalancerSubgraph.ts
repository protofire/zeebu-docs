import {
  ApolloClient,
  InMemoryCache,
  NormalizedCacheObject,
  gql,
} from '@apollo/client/core/index';
import { ethers } from 'ethers';

export type TokenType = {
  name: string;
  symbol: string;
  decimals: string;
};

export type PoolType = {
  id: string;
  symbol: string;
  address: string;
  tokens: TokenType[];
};

export class BalancerSubgraph {
  public client: ApolloClient<NormalizedCacheObject>;

  constructor(uri: string) {
    this.client = new ApolloClient({
      uri,
      cache: new InMemoryCache(),
    });
  }

  public async getPoolsByAddressOrSymbol(
    addressOrSymbol: string
  ): Promise<PoolType[]> {
    if (ethers.isAddress(addressOrSymbol)) {
      return this.getPoolsByAddress(addressOrSymbol);
    }

    return this.getPoolsBySymbol(addressOrSymbol);
  }

  public async getPoolsByAddress(address: string): Promise<PoolType[]> {
    const query = gql(`
      query GetPoolsQuery($address: Bytes!) {
        pools(where: { address: $address }) {
          id
          name
          symbol
          address
          tokens {
            name
            symbol
            decimals
          }
        }
      }
    `);

    const {
      data: { pools },
    } = await this.client.query({ query, variables: { address } });

    return pools;
  }

  public async getPoolsBySymbol(symbol: string): Promise<PoolType[]> {
    const query = gql(`
      query GetPoolsQuery($symbol: String!) {
        pools(where: { symbol_contains_nocase: $symbol }) {
          id
          name
          symbol
          address
          tokens {
            name
            symbol
            decimals
          }
        }
      }
    `);

    const {
      data: { pools },
    } = await this.client.query({ query, variables: { symbol } });

    return pools;
  }

  public async getPools(): Promise<PoolType[]> {
    const query = gql(`
      query GetPoolsQuery {
        pools {
          id
          name
          symbol
          address
          tokens {
            name
            symbol
            decimals
          }
        }
      }
    `);

    const {
      data: { pools },
    } = await this.client.query({ query });

    return pools;
  }
}
