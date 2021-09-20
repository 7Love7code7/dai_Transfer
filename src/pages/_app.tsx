import { useEffect, Fragment } from 'react';
import { AppProps } from 'next/app';
import Head from 'next/head';
import dynamic from 'next/dynamic';

import { Provider } from 'react-redux';
import { ThemeProvider, CssBaseline } from '@material-ui/core';
import { createWeb3ReactRoot, Web3ReactProvider } from '@web3-react/core';
import { theme } from 'theme';
import { getLibrary } from 'utils';
import { NetworkContextName } from 'utils/constant';
import store from 'store';

const Header = dynamic(() => import('components/Header'), { ssr: false });

const Web3ProviderNetwork = createWeb3ReactRoot(NetworkContextName);

function MyApp({ Component, pageProps }: AppProps) {
	useEffect(() => {
		const jssStyles = document.querySelector('#jss-server-side');
		if (jssStyles) {
			jssStyles.parentElement!.removeChild(jssStyles);
		}
	}, []);
	return (
		<Fragment>
			<Head>
				<title>Defi-Frontend</title>
				<meta
					name="viewport"
					content="minimum-scale=1, initial-scale=1, width=device-width"
				/>
			</Head>
			<Web3ReactProvider getLibrary={getLibrary}>
				<Web3ProviderNetwork getLibrary={getLibrary}>
					<Provider store={store}>
						<ThemeProvider theme={theme}>
							<CssBaseline />
							<Header />
							<Component {...pageProps} />
						</ThemeProvider>
					</Provider>
				</Web3ProviderNetwork>
			</Web3ReactProvider>
		</Fragment>
	);
}
export default MyApp;
