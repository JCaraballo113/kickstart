const CampaignFactory = artifacts.require('CampaignFactory');
const Campaign = artifacts.require('Campaign');

/*
 * uncomment accounts to access the test accounts made available by the
 * Ethereum client
 * See docs: https://www.trufflesuite.com/docs/truffle/testing/writing-tests-in-javascript
 */

let factory;
let campaignAddress;
let campaign;
contract('Campaign', async function (accounts) {
    beforeEach(async () => {
        factory = await CampaignFactory.new();
        await factory.createCampaign('100', { from: accounts[0] });
        [campaignAddress] = await factory.getDeployedCampaigns.call();
        campaign = await new web3.eth.Contract(Campaign.abi, campaignAddress);
    });
    it('should assert true', async function () {
        await CampaignFactory.deployed();
        return assert.isTrue(true);
    });

    it('marks caller as the campaign manager', async () => {
        const manager = await campaign.methods.manager().call();
        assert.equal(accounts[0], manager);
    });

    it('allows people to contribute money and marks them as approvers', async () => {
        await campaign.methods.contribute().send({
            from: accounts[1],
            value: '200',
        });

        const isContributor = await campaign.methods
            .approvers(accounts[1])
            .call();

        assert.isTrue(isContributor);
    });

    it('requires a minimum contribution', async () => {
        try {
            await campaign.methods.contribute().send({
                value: '5',
                from: accounts[1],
            });
            assert(false);
        } catch (err) {
            assert(err);
        }
    });

    it('allows a manager to make a payment request', async () => {
        await campaign.methods
            .createRequest('Buy batteries', '200', accounts[1])
            .send({
                from: accounts[0],
                gas: '1000000',
            });

        const request = await campaign.methods.requests(0).call();
        assert.equal('Buy batteries', request.description);
    });

    it('processes requests', async () => {
        await campaign.methods.contribute().send({
            from: accounts[0],
            value: web3.utils.toWei('10', 'ether'),
        });

        await campaign.methods
            .createRequest('A', web3.utils.toWei('5', 'ether'), accounts[1])
            .send({ from: accounts[0], gas: '1000000' });

        await campaign.methods.approveRequest(0).send({
            from: accounts[0],
            gas: '1000000',
        });

        await campaign.methods.finalizeRequest(0).send({
            from: accounts[0],
            gas: '1000000',
        });

        let balance = await web3.eth.getBalance(accounts[1]);
        balance = web3.utils.fromWei(balance, 'ether');
        balance = parseFloat(balance);

        assert(balance > 103);
    });
});
