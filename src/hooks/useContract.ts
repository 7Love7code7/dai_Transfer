import { useMemo } from 'react';
import { Contract } from '@ethersproject/contracts';
import { useActiveWeb3React } from './useWeb3';
import { getContract } from 'utils/contract';

export const useContract = (
	address: string | undefined,
	ABI: any,
	withSignerIfPossible = true
): Contract | null => {
	const { library, account } = useActiveWeb3React();

	return useMemo(() => {
		if (!address || !ABI || !library) return null;
		try {
			return getContract(
				address,
				ABI,
				library,
				withSignerIfPossible && account ? account : undefined
			);
		} catch (error) {
			console.error('Failed to get contract', error);
			return null;
		}
	}, [address, ABI, library, withSignerIfPossible, account]);
};
