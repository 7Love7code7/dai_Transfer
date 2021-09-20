/// <reference types="next" />
/// <reference types="next/types/global" />

declare global {
	interface Window {
		ethereum?: {
			isMetaMask?: true;
			on?: (...args: any[]) => void;
			removeListener?: (...args: any[]) => void;
			autoRefreshOnNetworkChange?: boolean;
		};
		web3?: {};
	}
}
