import React, { FC } from 'react';
import { Button, Typography, makeStyles, Theme } from '@material-ui/core';
import { AbstractConnector } from '@web3-react/abstract-connector';
import { Box } from '@material-ui/core';

const useStyles = makeStyles((theme: Theme) => ({
	container: {
		margin: theme.spacing(2, 0),
	},
}));

type WalletPendingProps = {
	connector?: AbstractConnector;
	error?: boolean;
	setPendingIssue: (error: boolean) => void;
	activateConnection: (connector: AbstractConnector) => void;
};

export const WalletPending: FC<WalletPendingProps> = ({
	error,
	connector,
	setPendingIssue,
	activateConnection,
}) => {
	const { container } = useStyles();
	return (
		<Box>
			{error ? (
				<Box className={container}>
					<Typography>Error connecting to Wallet</Typography>
					<Button
						onClick={() => {
							setPendingIssue(false);
							connector && activateConnection(connector);
						}}
					>
						Retry
					</Button>
				</Box>
			) : (
				<Box className={container}>
					<Typography>Connecting to a wallet</Typography>
				</Box>
			)}
		</Box>
	);
};
