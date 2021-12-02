import { useRouter } from 'next/router';
import Link from 'next/link';
import { getContract } from '../../ethereum/campaign';
import { Button, Card, Grid } from 'semantic-ui-react';
import web3 from '../../web3';
import ContributeForm from '../../components/ContributeForm';
import { useState } from 'react';

const ViewCampaign = (props) => {
    const [state, setState] = useState({
        address: props.address,
        minimumContribution: props.minimumContribution,
        balance: props.balance,
        requestsCount: props.requestsCount,
        approversCount: props.approversCount,
        manager: props.manager,
    });

    const {
        address,
        minimumContribution,
        balance,
        requestsCount,
        approversCount,
        manager,
    } = state;

    const onContribution = (approversCount, balance) => {
        setState((ps) => ({ ...ps, approversCount, balance }));
    };

    const renderCards = () => {
        const items = [
            {
                header: manager,
                description: 'Address of Manager',
                meta: 'The manager who created this campaign and can create requests for money',
                style: { overflowWrap: 'break-word' },
            },
            {
                header: minimumContribution,
                description:
                    'you must contribute at leas this much wei to become an approver',
                meta: 'Minimum Contribution(wei)',
                style: { overflowWrap: 'break-word' },
            },
            {
                header: requestsCount,
                description:
                    'A request tries to remove money from the contract. Request must be approved by approvers',
                meta: 'Number of requests',
                style: { overflowWrap: 'break-word' },
            },
            {
                header: approversCount,
                description:
                    'Number of people who have already donated to this campaign',
                meta: 'Number of Approvers',
                style: { overflowWrap: 'break-word' },
            },
            {
                header: web3.utils.fromWei(balance, 'ether'),
                description:
                    'The balance is how much money this campaign has left to spend.',
                meta: 'Campaign Balance (ether)',
                style: { overflowWrap: 'break-word' },
            },
        ];

        return <Card.Group items={items} />;
    };
    return (
        <div>
            <h3>Campaign Details</h3>
            <Grid>
                <Grid.Row>
                    <Grid.Column width={10}>{renderCards()}</Grid.Column>
                    <Grid.Column width={6}>
                        <ContributeForm
                            campaignAddress={address}
                            onContribute={onContribution}
                        />
                    </Grid.Column>
                </Grid.Row>
                <Grid.Row>
                    <Grid.Column>
                        <h3>Campaign Requests</h3>
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        </div>
    );
};

export async function getServerSideProps(context) {
    const campaign = await getContract(context.query.campaignAddress);
    const summary = await campaign.methods.getSummary().call();

    return {
        props: {
            address: context.query.campaignAddress,
            minimumContribution: summary[0],
            balance: summary[1],
            requestsCount: summary[2],
            approversCount: summary[3],
            manager: summary[4],
        },
    };
}

export default ViewCampaign;
