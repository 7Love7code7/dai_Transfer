import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { DEFAULT_NETWORK } from 'utils/constant';
import { RootState } from 'store/reducers';
import { getExplorerLink, getNetworkName } from 'utils/network';

export type AppConfig = {
	selectedChain: string;
	explorerLink: string;
};

interface IAppInit {
	data: AppConfig;
	loading: 'idle' | 'pending';
	error: any;
}

const initialState = {
	data: {
		selectedChain: '',
		explorerLink: '',
	},
	loading: 'idle',
	error: null,
} as IAppInit;

export const fetchAppConfig = createAsyncThunk(
	'app/config',
	async ({ chainId }: any) => {
		let appConfig: AppConfig = {
			explorerLink: await getExplorerLink(chainId || DEFAULT_NETWORK),
			selectedChain: await getNetworkName(chainId || DEFAULT_NETWORK),
		};

		return appConfig;
	}
);

export const appReducer = createSlice({
	name: 'appConfig',
	initialState,
	reducers: {},
	extraReducers: {
		[fetchAppConfig.pending.type]: (state, action) => {
			if (state.loading === 'idle') {
				state.loading = 'pending';
			}
		},
		[fetchAppConfig.fulfilled.type]: (state, action) => {
			if (state.loading === 'pending') {
				state.loading = 'idle';
				state.data = action.payload;
			}
		},
		[fetchAppConfig.rejected.type]: (state, action) => {
			if (state.loading === 'pending') {
				state.loading = 'idle';
				state.error = action.error;
			}
		},
	},
});

export const selectApp = (state: RootState) => state.appConfig;
export const selectExplorerLink = (state: RootState) =>
	state.appConfig.data.explorerLink;
export const selectNetwork = (state: RootState) =>
	state.appConfig.data.selectedChain;
