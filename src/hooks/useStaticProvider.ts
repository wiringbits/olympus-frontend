import { StaticJsonRpcProvider } from "@ethersproject/providers";
import { useMemo } from "react";
import { NetworkId } from "src/constants";
import { NodeHelper } from "src/helpers/NodeHelper";

const providers = {
  [NetworkId.ARBITRUM_TESTNET]: new StaticJsonRpcProvider("https://rinkeby.arbitrum.io/rpc"),
  [NetworkId.ARBITRUM]: new StaticJsonRpcProvider("https://arb1.arbitrum.io/rpc"),
} as Record<NetworkId, StaticJsonRpcProvider>;

const getProvider = (networkId: NetworkId) => {
  if (!providers[networkId]) providers[networkId] = NodeHelper.getAnynetStaticProvider(networkId);

  return providers[networkId];
};

export const useStaticProvider = (networkId: NetworkId) => getProvider(networkId);

export const useStaticProviders = (networkIds: NetworkId[]) => {
  return useMemo(() => networkIds.map(getProvider), [networkIds]);
};
