import { createMuiTheme } from '@material-ui/core';

export const theme = createMuiTheme({
	props: {
		MuiTypography: {
			variantMapping: {
				subtitle1: 'h2',
				subtitle2: 'h2',
				body1: 'span',
				body2: 'span'
			}
		}
	},
});
