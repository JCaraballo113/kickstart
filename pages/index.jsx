import React, { useEffect } from 'react';
import Link from 'next/link';
import { Button, Card } from 'semantic-ui-react';
import campaignFactory from '../ethereum/factory';

const CampaignPage = ({ campaigns }) => {
    const renderCampaigns = () => {
        const items = campaigns.map((c) => ({
            header: c,
            description: <Link href={`/campaigns/${c}`}>View Campaign</Link>,
            fluid: true,
        }));

        return <Card.Group items={items}></Card.Group>;
    };
    return (
        <div>
            <h3>Open Campaigns</h3>
            <Link href='/campaigns/new'>
                <Button
                    floated='right'
                    content='Create campaign'
                    icon='add circle'
                    primary
                />
            </Link>
            {renderCampaigns()}
        </div>
    );
};

export async function getServerSideProps(context) {
    const campaigns = await campaignFactory.methods
        .getDeployedCampaigns()
        .call();

    return {
        props: {
            campaigns,
        },
    };
}

export default CampaignPage;
