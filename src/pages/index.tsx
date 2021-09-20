import { Theme, makeStyles, Paper } from '@material-ui/core';
import { useWeb3React } from '@web3-react/core';
import { TransferForm } from 'components/Transfer';
import { useAppDispatch, useAppSelector } from 'hooks/useRedux';
import { useEffect } from 'react';
import { fetchAppConfig } from 'store/reducers/app';
import { fetchBalances, selectBalances } from 'store/reducers/balance';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import { formatEther, parseEther } from "ethers/lib/utils";
import { selectETHBalance } from 'store/reducers/balance';

const useStyles = makeStyles((theme: Theme) => ({
	root: {
		display: 'flex',
		flexDirection: 'column',
		justifyContent: 'center',
		height: '90vh',
	},
  eth: {
    textAlign: 'center'
  }
}));

export default function Index() {
	const { account, library, chainId } = useWeb3React();
	const dispatch = useAppDispatch();
	const { data, loading } = useAppSelector(selectBalances);
  const ethBalance = useAppSelector(selectETHBalance);

	useEffect(() => {
		if (account) {
			// @ts-ignore
			dispatch(fetchAppConfig({ chainId }));
			// @ts-ignore
			dispatch(fetchBalances({ address: account, library }));
			// dispatch(fetchBalances({ address: account, library: library }));
		}
	}, [account, dispatch, library, chainId]);
	const { root, eth } = useStyles();
	return (
		<div className={root}>
      <Container maxWidth="sm">
        <Typography className={eth} component="div">
          {formatEther(ethBalance.crypto)} ETH
        </Typography>
        <TransferForm balances={data} />
      </Container>
		</div>
	);
}
