import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from 'store/reducers';
import { getContract } from 'utils/contract';
import { BigNumber } from "ethers";
import { erc20 } from 'abis/erc20';
import { DAI_ADDRESS } from 'utils/constant';
import { Web3Provider } from '@ethersproject/providers';
import { formatEther, parseEther } from "ethers/lib/utils";

export type Balance = {
	eth: {
		crypto: BigNumber | string | number;
		fiat: number | string;
	};
	dai: {
		crypto: BigNumber | string | number;
		fiat: number | string;
	};
};

type TransferValues = {
	address: string;
	amount: string;
};

type TransferPayload = {
	library: Web3Provider;
	account: string | null | undefined;
	payload: TransferValues;
};

interface BalanceState {
	data: Balance;
	loading: 'idle' | 'pending';
	error: any;
	txHash: string;
}

const initialState = {
	data: {
		eth: {
			crypto: BigNumber.from(0),
			fiat: 0
		},
		dai: {
			crypto: BigNumber.from(0),
			fiat: 0
		}
	},
	loading: 'idle',
	error: null
} as BalanceState;

const fetchUSDRate = async (coin: string) => {
	const price = await fetch(
		`https://api.coingecko.com/api/v3/simple/price?ids=${coin}&vs_currencies=usd`
	).then(response => response.json());

	return price[coin];
};

const round = async (amount: number) => amount.toFixed(2);

export const fetchBalances = createAsyncThunk(
	'balances/all',
	async ({ address, library }: any) => {
		const token = await getContract(DAI_ADDRESS, erc20.abi, library);
		const ethBalance = await library.getBalance(address);
		const daiBalance = await token.balanceOf(address);
		const daiFiat = await fetchUSDRate('dai');
		const ethFiat = await fetchUSDRate('ethereum');
		const formatEthBalance = +formatEther(ethBalance);
		const formatDaiBalance = +formatEther(daiBalance);

		let cryptoBalance: Balance = {
			dai: {
				crypto: daiBalance,
				fiat: await round(+formatDaiBalance * daiFiat['usd'])
			},
			eth: {
				crypto: ethBalance,
				fiat: await round(ethFiat['usd'] * +formatEthBalance)
			}
		}
		return cryptoBalance;
	}
);

const sendFunds = async ({ account, library, payload }: TransferPayload) => {
	if (!account) return;
	const token = await getContract(DAI_ADDRESS, erc20.abi, library, account);
	const transaction = await token.transfer(
		payload.address,
		parseEther(payload.amount)
	);
	const tx = await transaction.wait(2); // 2 confirmation
	return tx;
};

export const balanceReducer = createSlice({
	name: 'balance',
	initialState,
	reducers: {
		transferFunds: (state, { payload }: PayloadAction<TransferPayload>) => {
			sendFunds(payload).then(
				result => (console.log(result.transactionHash))
			);
		}
	},
	extraReducers: {
		[fetchBalances.pending.type]: (state, action) => {
			if (state.loading === 'idle') {
				state.loading = 'pending';
				state.txHash = '';
			}
		},
		[fetchBalances.fulfilled.type]: (state, action) => {
			if (state.loading === 'pending') {
				state.loading = 'idle';
				state.data = action.payload;
				state.txHash = '';
			}
		},
		[fetchBalances.rejected.type]: (state, action) => {
			if (state.loading === 'pending') {
				state.loading = 'idle';
				state.error = action.error;
				state.txHash = '';
			}
		}
	}
});

export const selectDAIBalance = (state: RootState) => state.balances.data.dai;
export const selectETHBalance = (state: RootState) => state.balances.data.eth;
export const selectBalances = (state: RootState) => state.balances;
export const selectTxHash = (state: RootState) => state.balances.txHash;

export const { transferFunds } = balanceReducer.actions;
