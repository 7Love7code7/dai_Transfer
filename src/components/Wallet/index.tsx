import React, { useCallback, useEffect, useState } from 'react';
import { UnsupportedChainIdError, useWeb3React } from '@web3-react/core';
import {
	Typography,
	makeStyles,
	Theme,
	Box,
	Link,
	Dialog,
	DialogTitle,
	DialogContent,
	Button,
} from '@material-ui/core';
import { AbstractConnector } from '@web3-react/abstract-connector';
import { SUPPORTED_WALLETS } from 'utils/constant';
import { isMobile } from 'react-device-detect';
import { WalletOptions } from 'components/Wallet/Option';
import { useEagerConnect, setInactiveListener } from 'hooks/useWeb3';
import { useAppSelector } from 'hooks/useRedux';
import { shortenAddress } from 'utils';
import { selectExplorerLink } from 'store/reducers/app';
import { injected } from 'utils';
import { WalletPending } from 'components/Wallet/Pending';
import usePrevious from 'hooks/usePrevious';
import CloseIcon from '@material-ui/icons/Close';

type WalletModalProps = {
	isOpen: boolean;
	onClose: () => void;
};

const useStyles = makeStyles((theme: Theme) => ({
	dialogContainer: {
		padding: theme.spacing(1),
		position: 'absolute',
		top: theme.spacing(5),
		width: 300,
	},
	dialogTitle: {
		padding: theme.spacing(1),
	},
	dialogContent: {
		padding: theme.spacing(1),
	},
	flex: {
		display: 'flex',
		justifyContent: 'space-between',
		alignItems: 'center',
	},
}));

const WALLET_VIEWS = {
	OPTIONS: 'options',
	OPTIONS_SECONDARY: 'options_secondary',
	ACCOUNT: 'account',
	PENDING: 'pending',
};

export const WalletModal = ({ isOpen, onClose }: WalletModalProps) => {
	const { dialogTitle, dialogContainer, dialogContent, flex } = useStyles();
	const { account, connector, activate, error, active } = useWeb3React();
	const [wallet, setWallet] = useState<string>(WALLET_VIEWS.ACCOUNT);
	const [pendingWallet, setPendingWallet] = useState<
		AbstractConnector | undefined
	>();
	const [pendingIssue, setPendingIssue] = useState<boolean>();
	const [activeConnector, setActiveConnector] = useState<any>();
	const explorerLink = useAppSelector(selectExplorerLink);
	const previousAccount = usePrevious(account);

	useEffect(() => {
		if (account && !previousAccount && isOpen) {
			onClose();
		}
	}, [account, previousAccount, onClose, isOpen]);

	useEffect(() => {
		if (isOpen) {
			setPendingIssue(false);
			setWallet(WALLET_VIEWS.ACCOUNT);
		}
	}, [isOpen]);

  useEffect(() => {
		if (activeConnector && activeConnector === connector) {
			setActiveConnector(undefined);
		}
	}, [activeConnector, connector]);

	const activePrevious = usePrevious(active);
	const connectorPrevious = usePrevious(connector);

	useEffect(() => {
		if (
			isOpen &&
			((active && !activePrevious) ||
				(connector && connector !== connectorPrevious && !error))
		) {
			setWallet(WALLET_VIEWS.ACCOUNT);
		}
	}, [
		setWallet,
		isOpen,
		activePrevious,
		connectorPrevious,
		active,
		error,
		connector,
	]);

	const handleWalletChange = useCallback(() => {
		setWallet(WALLET_VIEWS.OPTIONS);
	}, []);

	const activateConnection = async (connector: AbstractConnector | undefined) => {
		Object.keys(SUPPORTED_WALLETS).map((key) => {
			if (connector === SUPPORTED_WALLETS[key].connector) {
				return SUPPORTED_WALLETS[key].name;
			}
			return true;
		});
		setPendingWallet(connector); // Set wallet as pending view
		setWallet(WALLET_VIEWS.PENDING);

		connector &&
			activate(connector, undefined, true).catch((error) => {
				if (error instanceof UnsupportedChainIdError) {
					activate(connector); // the connector is not set, seterror is not working
				} else {
					setPendingIssue(true);
				}
			});
	};

	function formatConnectorName() {
		// @ts-ignore
		const { ethereum } = window;
		const isMetaMask = !!(ethereum && ethereum.isMetaMask);
		const name: string = Object.keys(SUPPORTED_WALLETS)
			.filter(
				(k) =>
					SUPPORTED_WALLETS[k].connector === connector &&
					(connector !== injected || isMetaMask === (k === 'METAMASK'))
			)
			.map((k) => SUPPORTED_WALLETS[k].name)[0];

		return (
			<Typography variant={'body1'}>
				Connected with {name.toString()}
			</Typography>
		);
	}

	const isTriedEager = useEagerConnect();
	setInactiveListener(!isTriedEager || !!activeConnector);

	const getOptions = () => {
		let isMetamask: boolean = false;
		if (typeof window !== 'undefined') {
			// @ts-ignore
			isMetamask = window?.ethereum?.isMetaMask;
		}

		return Object.keys(SUPPORTED_WALLETS).map((key) => {
			const option = SUPPORTED_WALLETS[key];

			if (isMobile) {
				// @ts-ignore
				if (!window?.web3 && !window?.ethereum && option.mobile) {
					return (
						<WalletOptions
							onClick={() => {
								option.connector !== connector &&
									!option.href &&
									activateConnection(option.connector);
							}}
							id={`connect-${key}`}
							key={key}
							color={option.color}
							link={option.href}
							header={option.name}
							subheader=""
							icon=""
						/>
					);
				}
				return null;
			}

			// overwrite injected when needed
			if (option.connector === injected) {
				// Not show injected if provider is not injected
				// @ts-ignore
				if (!(window?.web3 || window?.ethereum)) {
					if (option.name === 'MetaMask') {
						return (
							<WalletOptions
								id={`connect-${key}`}
								color={'#E8831D'}
								key={key}
								header={'Install Metamask'}
								icon=""
								subheader=""
								link={'https://metamask.io/'}
							/>
						);
					} else {
						return null; //disable duplicated install
					}
				}
				// Not return metamask if injected provider is not metamask
				else if (option.name === 'MetaMask' && !isMetamask) {
					return null;
				}
				// likewise for generic
				else if (option.name === 'Injected' && isMetamask) {
					return null;
				}
			}

			// return rest of options
			return (
				!isMobile &&
				!option.mobileOnly && (
					<WalletOptions
						id={`connect-${key}`}
						onClick={() => {
							option.connector === connector
								? setWallet(WALLET_VIEWS.ACCOUNT)
								: !option.href && activateConnection(option.connector);
						}}
						key={key}
						color={option.color}
						link={option.href}
						header={option.name}
						subheader="" //use option.description to bring back multi-line
						icon=""
					/>
				)
			);
		});
	};
	return (
		<Dialog open={isOpen} maxWidth="lg" classes={{ paper: dialogContainer }}>
			{wallet === WALLET_VIEWS.ACCOUNT && account ? (
				<Box>
					<DialogTitle className={dialogTitle}>
						<Box className={flex}>
							<Typography variant="h5">{formatConnectorName()}</Typography>
							<CloseIcon onClick={onClose} />
						</Box>
					</DialogTitle>
					<DialogContent className={dialogContent}>
						<Box className={flex}>
							<Typography variant="h5">{shortenAddress(account)}</Typography>
							<Box>
								{connector !== injected && (
									<Button
										size="small"
										variant="contained"
										color="primary"
										onClick={() => {
											(connector as any).close();
										}}
									>
										Disconnect
									</Button>
								)}
								<Button
									size="small"
									onClick={handleWalletChange}
									variant="outlined"
								>
									Change
								</Button>
							</Box>
						</Box>

						<Box>
							<Typography variant="body2">
								<Link
									href={`${explorerLink}/address/${account}`}
									target="_blank"
									rel="noreferrer noopener"
								>
									View on Etherscan
								</Link>
							</Typography>
						</Box>
					</DialogContent>
				</Box>
			) : error ? (
				<Box>
					<DialogTitle className={dialogTitle}>
						<Box className={flex}>
							<Typography variant="h6" component="div" style={{ flexGrow: 1 }}>
								{error instanceof UnsupportedChainIdError
									? 'Wrong Network'
									: 'Error connecting'}
							</Typography>
							<CloseIcon onClick={onClose} />
						</Box>
					</DialogTitle>
					<DialogContent dividers className={dialogContent}>
						{error instanceof UnsupportedChainIdError ? (
							<Typography>
								{`App is running on ROPSTEN NETWORK. Please update your
                network configuration.`}
							</Typography>
						) : (
							'Error connecting. Try refreshing the page.'
						)}
					</DialogContent>
				</Box>
			) : (
				<Box>
					<DialogTitle className={dialogTitle}>
						<Box className={flex}>
							<Typography variant="h6" component="div" style={{ flexGrow: 1 }}>
								Connect Wallet
							</Typography>
							<CloseIcon onClick={onClose} />
						</Box>
					</DialogTitle>
					<DialogContent className={dialogContent}>
						{wallet === WALLET_VIEWS.PENDING ? (
							<WalletPending
								connector={pendingWallet}
								error={pendingIssue}
								setPendingIssue={setPendingIssue}
								activateConnection={activateConnection}
							/>
						) : (
							<>{getOptions()} </>
						)}
					</DialogContent>
				</Box>
			)}
		</Dialog>
	);
};
