import React, { Fragment, useState } from 'react';
import { makeStyles, Theme } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import { useWeb3React } from '@web3-react/core';
import { shortenAddress } from 'utils';
import { WalletModal } from 'components/Wallet';

const useStyles = makeStyles((theme: Theme) => ({
	div: {
		flexGrow: 1,
	},
	title: {
		flexGrow: 1,
	},
	wallet: {
		cursor: 'pointer',
	},
}));

const Header = () => {
	const classes = useStyles();
	const [isOpen, setOpen] = useState<boolean>(false);
	const { account } = useWeb3React();

	return (
		<Fragment>
			<div className={classes.div}>
				<AppBar position="static">
					<Toolbar>
						<Typography variant="h5" className={classes.title}>
							Defi-Frontend Task
						</Typography>
						{account ? (
							<Button
								variant="contained"
								color="secondary"
								className={classes.wallet}
								onClick={() => setOpen(true)}
							>
								{shortenAddress(account)}
							</Button>
						) : (
							<Button
								variant="contained"
								color="primary"
								onClick={() => setOpen(true)}
							>
								Connect Wallet
							</Button>
						)}
					</Toolbar>
				</AppBar>
			</div>
			<WalletModal isOpen={isOpen} onClose={() => setOpen(false)} />
		</Fragment>
	);
};

export default Header;
