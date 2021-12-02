import web3 from '../web3';
import CampaignFactory from './build/contracts/CampaignFactory.json';

const instance = new web3.eth.Contract(
    CampaignFactory.abi,
    '0xdeEf021F04A5255Ec58DFEd6E6bC26F3f43A0b11'
);

export default instance;
