import React, { useEffect, useState } from 'react';
import { Button, Form, Input, Message } from 'semantic-ui-react';
import { getContract } from '../ethereum/campaign';
import web3 from '../web3';

const ContributeForm = ({ campaignAddress, onContribute }) => {
    const [state, setState] = useState({
        value: '',
        loading: false,
        errorMessage: '',
        campaign: null,
    });

    const setup = async () => {
        const c = await getContract(campaignAddress);
        c.events.Contributed({}).on('data', async (event) => {
            console.log(event.returnValues);
            onContribute(event.returnValues[2], event.returnValues[1]);
        });
        setState((ps) => ({ ...ps, campaign: c }));
    };
    useEffect(() => {
        setup();
    }, []);

    const { value, loading, errorMessage, campaign } = state;

    const onSubmit = async (e) => {
        e.preventDefault();

        setState((ps) => ({
            ...ps,
            loading: true,
            errorMessage: '',
        }));

        try {
            const accounts = await web3.eth.getAccounts();
            await campaign.methods.contribute().send({
                from: accounts[0],
                value: web3.utils.toWei(value, 'ether'),
            });
            setState((ps) => ({
                ...ps,
                loading: false,
                value: '',
            }));
        } catch (err) {
            setState((ps) => ({
                ...ps,
                errorMessage: err.message,
                loading: false,
            }));
        }
    };
    return (
        <Form error={!!errorMessage} onSubmit={onSubmit}>
            <Form.Field>
                <label htmlFor=''>Amount to contribute:</label>
                <Input
                    label='ether'
                    labelPosition='right'
                    value={value}
                    onChange={(e) =>
                        setState((ps) => ({ ...ps, value: e.target.value }))
                    }
                />
            </Form.Field>

            <Message error header='Oops!' content={errorMessage} />

            <Button primary loading={loading}>
                Contribute!
            </Button>
        </Form>
    );
};

export default ContributeForm;
