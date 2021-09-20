import {
	makeStyles,
	Theme,
	Container,
	FormControl,
	Button,
	TextField,
	Link,
} from '@material-ui/core';
import { useWeb3React } from '@web3-react/core';
import { BigNumber } from 'ethers';
import { formatEther } from 'ethers/lib/utils';
import { useFormik } from 'formik';
import { useAppDispatch, useAppSelector } from 'hooks/useRedux';
import { FC } from 'react';
import { selectExplorerLink } from 'store/reducers/app';
import {
	Balance,
	selectDAIBalance,
	selectTxHash,
	transferFunds,
} from 'store/reducers/balance';
import SendIcon from '@material-ui/icons/Send';
import * as yup from 'yup';

type TransferFormProps = {
	balances: Balance;
};

const useStyles = makeStyles((theme: Theme) => ({
	textField: {
		width: '100%',
	},
	formControl: {
		margin: theme.spacing(1),
	},
	root: {
		flexGrow: 1,
		display: 'flex',
		flexDirection: 'column',
	},
}));

const validationSchema = yup.object({
	amount: yup
		.number()
		.typeError('Amount must be a number')
		.positive('Valid amount not allowed'),
	address: yup
		.string()
		.matches(
			/^(0x[a-fA-F0-9]{40})|(([a-zA-Z0-9][a-zA-Z0-9-_]*\.)*[a-zA-Z0-9]*[a-zA-Z0-9-_]*[[a-zA-Z0-9]+)$/i,
			"Should start with '0x' or be a ENS name"
		)
		.required('Reciepient address is required'),
});

export const TransferForm: FC<TransferFormProps> = ({ balances }) => {
	const { root, formControl } = useStyles();
	const { library, account } = useWeb3React();
	const dispatch = useAppDispatch();
	const dai = useAppSelector(selectDAIBalance);
	const explorerLink = useAppSelector(selectExplorerLink);
	const txHash = useAppSelector(selectTxHash);

	const formik = useFormik({
		initialValues: {
			amount: '',
			address: '',
		},
		validationSchema: validationSchema,
		onSubmit: (values) => {
			if (!values.amount) {
				formik.setFieldError('amount', 'Amount is required');
			} else if (!values.address) {
				formik.setFieldError('address', 'Recipient address is required');
			} else if (BigNumber.from(values.amount).gte(dai.crypto)) {
				formik.setFieldError('amount', 'Insufficient amount in wallet');
			} else {
				dispatch(transferFunds({ library, account, payload: values }));
				formik.setSubmitting(false);
			}
		},
	});

	return (
		<Container maxWidth="sm">
			<form onSubmit={formik.handleSubmit} className={root}>
				<FormControl className={formControl}>
					<TextField
						fullWidth
						variant="filled"
						id="amount"
						name="amount"
						label="DAI Amount"
						value={formik.values.amount}
						onChange={formik.handleChange}
						error={formik.touched.amount && Boolean(formik.errors.amount)}
						helperText={
							formik.touched.amount && formik.errors.amount
								? formik.errors.amount
								: `Balance: ${formatEther(balances.dai.crypto)} DAI ($ ${
										balances.dai.fiat
								  })`
						}
					/>
				</FormControl>
				<FormControl className={formControl}>
					<TextField
						fullWidth
						variant="filled"
						id="address"
						name="address"
						label="Enter recipient address"
						value={formik.values.address}
						onChange={formik.handleChange}
						error={formik.touched.address && Boolean(formik.errors.address)}
						helperText={formik.touched.address && formik.errors.address}
					/>
				</FormControl>
				<FormControl className={formControl}>
					<FormControl className={formControl}>
						<Button
							disabled={
								!(formik.isValid && formik.dirty) || formik.isSubmitting
							}
							variant="contained"
							color="primary"
							// className={classes.button}
							endIcon={<SendIcon />}
							type="submit"
						>
							Send
						</Button>
					</FormControl>
					{txHash && (
						<FormControl className={formControl}>
							<Link
								href={`${explorerLink}tx/${txHash}`}
								component="button"
								target="_blank"
								rel="noreferrer noopener"
								color="primary"
							>
								View on Etherscan
							</Link>
						</FormControl>
					)}
				</FormControl>
			</form>
		</Container>
	);
};
