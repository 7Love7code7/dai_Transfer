import { FC } from 'react';
import { Box, makeStyles, Theme } from '@material-ui/core';
import { Typography } from '@material-ui/core';
import grey from '@material-ui/core/colors/grey';

const useStyles = makeStyles((theme: Theme) => ({
	flex_div: {
		display: 'flex',
		alignItems: 'center',
	},

	box: {
		padding: theme.spacing(2),
		cursor: 'pointer',
		border: `1px solid ${grey[500]}`,
		borderRadius: 5,
		margin: theme.spacing(2, 0),
	},
}));

type WalletOptionsProps = {
	onClick?: () => void;
	id: string;
	header: string;
	color?: string;
	subheader: string;
	link?: string;
	icon?: string;
};

export const WalletOptions: FC<WalletOptionsProps> = ({
	onClick,
	id,
	header,
	subheader,
}) => {
	const { box, flex_div } = useStyles();
	return (
		<Box id={id} onClick={onClick} className={box}>
			<div className={flex_div}>
				<Typography variant="body1" gutterBottom>
					{header}
				</Typography>
			</div>
			{subheader && (
				<Typography variant="body2" gutterBottom>
					{subheader}
				</Typography>
			)}
		</Box>
	);
};
