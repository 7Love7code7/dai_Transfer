import { useEffect, useState } from 'react';
import { useWeb3React as useWeb3ReactCore } from '@web3-react/core';
import { Web3ReactContextInterface } from '@web3-react/core/dist/types';
import { Web3Provider } from '@ethersproject/providers';
import { isMobile } from 'react-device-detect';
import { injected } from 'utils';
import { NetworkContextName } from 'utils/constant';

export function useActiveWeb3React(): Web3ReactContextInterface<Web3Provider> & {
	chainId?: number | string;
} {
	const context = useWeb3ReactCore<Web3Provider>();
	const contextNetwork = useWeb3ReactCore<Web3Provider>(NetworkContextName);
	return context.active ? context : contextNetwork;
}

export function useEagerConnect() {
	const { activate, active } = useWeb3ReactCore(); // use useWeb3ReactCore for hook
	const [tried, setTried] = useState(false);

	useEffect(() => {
		injected.isAuthorized().then((isAuthorized) => {
			if (isAuthorized) {
				activate(injected, undefined, true).catch(() => {
					setTried(true);
				});
			} else {
				// @ts-ignore
				if (isMobile && typeof window.ethereum !== 'undefined') {
					activate(injected, undefined, true).catch(() => {
						setTried(true);
					});
				} else {
					setTried(true);
				}
			}
		});
	}, [activate]); //run when mound did

	// wait until wallet is confirmed to flip the flag
	useEffect(() => {
		if (active) {
			setTried(true);
		}
	}, [active]);

	return tried;
}

// check the which network is injected

export function setInactiveListener(suppress = false) {
	const { active, error, activate } = useWeb3ReactCore();

	useEffect(() => {
		// @ts-ignore
		const { ethereum } = window;

		if (ethereum && ethereum.on && !active && !error && !suppress) {
			const handleChainChanged = () => {
				// check errors
				activate(injected, undefined, true).catch((error) => {
					console.error('Failed to activate after chain changed', error);
				});
			};

			const handleAccountsChanged = (accounts: string[]) => {
				if (accounts.length > 0) {
					// check errors
					activate(injected, undefined, true).catch((error) => {
						console.error('Failed to activate after accounts changed', error);
					});
				}
			};

			ethereum.on('chainChanged', handleChainChanged);
			ethereum.on('accountsChanged', handleAccountsChanged);

			return () => {
				if (ethereum.removeListener) {
					ethereum.removeListener('chainChanged', handleChainChanged);
					ethereum.removeListener('accountsChanged', handleAccountsChanged);
				}
			};
		}
		return undefined;
	}, [active, error, suppress, activate]);
}
