import { useRouter } from 'next/router';
import { useState } from 'react';
import { Button, Form, Input, Message } from 'semantic-ui-react';
import campaignFactory from '../../ethereum/factory';
import web3 from '../../web3';

const NewCampaign = () => {
    const [state, setState] = useState({
        minimumContribution: '',
        errorMessage: '',
        loading: false,
    });

    const { minimumContribution, errorMessage, loading } = state;

    const router = useRouter();

    const onSubmit = async (e) => {
        e.preventDefault();
        setState((ps) => ({ ...ps, errorMessage: '', loading: true }));

        try {
            const accounts = await web3.eth.getAccounts();

            await campaignFactory.methods
                .createCampaign(minimumContribution)
                .send({
                    from: accounts[0],
                });

            setState((ps) => ({ ...ps, loading: false }));
            router.replace('/');
        } catch (err) {
            setState((ps) => ({
                ...ps,
                errorMessage: err.message,
                loading: false,
            }));
        }
    };
    return (
        <div>
            <h1>Create a Campaign</h1>
            <Form onSubmit={onSubmit} error={!!errorMessage}>
                <Form.Field>
                    <label>Minimum Contribution</label>
                    <Input
                        labelPosition='right'
                        label='wei'
                        value={minimumContribution}
                        onChange={(e) =>
                            setState((ps) => ({
                                ...ps,
                                minimumContribution: e.target.value,
                            }))
                        }
                    />
                </Form.Field>
                <Message error header='Oops!' content={errorMessage} />
                <Button primary loading={loading}>
                    Create!
                </Button>
            </Form>
        </div>
    );
};

export default NewCampaign;
