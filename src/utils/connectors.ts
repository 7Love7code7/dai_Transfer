import { InjectedConnector } from '@web3-react/injected-connector';
import { NetworkConnector } from '@web3-react/network-connector';

import { PUBLIC_NODE_URLS_BY_NETWORK_ID } from 'utils/config';

const RPC_URLS: { [chainId: number]: string } = {
	3: PUBLIC_NODE_URLS_BY_NETWORK_ID[3][0],
	4: PUBLIC_NODE_URLS_BY_NETWORK_ID[4][0]
};

export const network = new NetworkConnector({
	urls: { 3: RPC_URLS[3], 4: RPC_URLS[4] },
	defaultChainId: 3
});

export const injected = new InjectedConnector({
	supportedChainIds: [3, 4]
});
