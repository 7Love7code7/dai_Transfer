export const getExplorerLink = async (id: string | number | undefined) => {
	let link: string;
	switch (id) {
		case 1:
			link = `https://etherscan.io/`;
			break;
		case 3:
			link = `https://ropsten.etherscan.io/`;
			break;
		case 4:
			link = `https://rinkeby.etherscan.io/`;
			break;
		case 42:
			link = `https://kovan.etherscan.io/`;
			break;
		default:
			link = 'Unknown network';
			break;
	}

	return link as string;
};

export const getNetworkName = async (id: string | number) => {
	let link: string;
	switch (id) {
		case 1:
			link = 'Main Network';
			break;
		case 3:
			link = 'Ropsten Testnet Network';
			break;
		case 4:
			link = 'Rinkeby Testnet Network';
			break;
		case 42:
			link = 'Kovan Testnet Network';
			break;
		default:
			link = 'Local Testnet Network';
			break;
	}

	return link as string;
};
