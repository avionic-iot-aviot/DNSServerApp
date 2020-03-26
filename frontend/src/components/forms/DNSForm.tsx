import React, { useState } from 'react';
import DNSBaseComponent from '../dnsBaseComponent';

import { Grid, Input, Button, Container, Segment, Card, Image, Form } from 'semantic-ui-react';
import { history } from '../../main';
import _ from 'lodash';
import { Link } from 'react-router-dom';
import DNSApi from './../../api/dnsApi';
import DeviceApi from './../../api/deviceApi';

const DNSForm = () => {
    const [mac_address, setMacAddress] = useState('');
    const [dns_name_manual, setDnsNameManual] = useState('');
  

    async function submit() {
        try {
            const responseInsertion = await DeviceApi.create({
                mac_address,
                dns_name_manual
            });
        } catch (error) {
            console.log("ERROR", error);
        }
    }

    function handleChange(event: any) {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;
        eval(`set${name}("${value}")`);
    }

    return (
        <>
            <Segment>
                <h1>Aggiungi elemento</h1>
                <Form>
                    <Grid textAlign="center" className='addItem'>
                        <Grid.Row width={16}>
                            <Input
                                placeholder="mac_address"
                                name="MacAddress"
                                type="text"
                                value={mac_address}
                                onChange={(event: any) => {
                                    handleChange(event);
                                }}
                            />
                        </Grid.Row>
                        <Grid.Row width={16}>
                            <Input
                                placeholder="dns_name_manual"
                                name="DnsNameManual"
                                type="text"
                                value={name}
                                onChange={(event: any) => {
                                    handleChange(event);
                                }}
                            />
                        </Grid.Row>

                        <Button type='submit'
                            onClick={(event: any) => {
                                submit();
                            }}
                        >Submit</Button>

                    </Grid>

                </Form>
            </Segment>
        </>
    );
    // }
}
export default DNSForm;
