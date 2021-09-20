import { InjectedConnector } from '@web3-react/injected-connector';
import { NetworkConnector } from '@web3-react/network-connector';
import { Web3Provider } from '@ethersproject/providers';

export const getLibrary = (provider: any): Web3Provider => {
	const library = new Web3Provider(
		provider,
		typeof provider.chainId === 'number'
			? provider.chainId
			: typeof provider.chainId === 'string'
			? parseInt(provider.chainId)
			: 'any'
	);
	library.pollingInterval = 15000;
	return library;
};

const INFURA_API_KEY = 'e936b16f38ea43b6b7ecc8df1dbdb3d5'; //8d810610fe7741cc9753cbaafb1f000c

export const PUBLIC_NODE_URLS_BY_NETWORK_ID = {
	1: [`https://mainnet.infura.io/v3/${INFURA_API_KEY}`],
	3: [`https://ropsten.infura.io/v3/${INFURA_API_KEY}`],
	4: [`https://rinkeby.infura.io/v3/${INFURA_API_KEY}`],
	42: [`https://kovan.infura.io/v3/${INFURA_API_KEY}`],
};

export const shortenAddress = (address: string) => {
	return `${address.substring(0, 6)}...${address.substring(
		address.length - 4
	)}`;
};

const RPC_URLS: { [chainId: number]: string } = {
	3: PUBLIC_NODE_URLS_BY_NETWORK_ID[3][0],
	4: PUBLIC_NODE_URLS_BY_NETWORK_ID[4][0],
};

export const network = new NetworkConnector({
	urls: { 3: RPC_URLS[3], 4: RPC_URLS[4] },
	defaultChainId: 3,
});

export const injected = new InjectedConnector({
	supportedChainIds: [3, 4],
});
