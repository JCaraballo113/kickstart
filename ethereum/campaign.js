import web3 from '../web3';
import Campaign from './build/contracts/Campaign.json';

export const getContract = async (address) => {
    const campaign = await new web3.eth.Contract(Campaign.abi, address);

    return campaign;
};
