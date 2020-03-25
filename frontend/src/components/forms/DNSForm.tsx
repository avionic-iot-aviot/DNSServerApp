import React, { useState } from 'react';
import DNSBaseComponent from '../dnsBaseComponent';

import { Grid, Input, Button, Container, Segment, Card, Image, Form } from 'semantic-ui-react';
import { history } from '../../main';
import _ from 'lodash';
import { Link } from 'react-router-dom';
import DNSApi from './../../api/dnsApi';

// interface CompProps {
// }

// interface CompState {
//     confirm_password?: string;
//     email?: string;
//     name?: string;
//     password?: string;
//     isLogin?: boolean;
// }


// export default class DNSForm extends DNSBaseComponent<CompProps | any, null> {
// state = {
// };

const DNSForm = () => {
    const [mac_address, setMacAddress] = useState('test');
    const [name, setName] = useState('name');
    // const [form, setState] = useState({
    //     ip: '',
    //     mac_address: ''
    // });


    // constructor(props: any) {
    //     super(props);
    // }

    // componentWillMount() {
    // }

    // componentDidMount() {
    // }

    // componentWillReceiveProps(nextProps: any) {

    // }

    // componentWillUnmount() {
    //     this.cancelPromises();
    // }

    // render() {

    async function submit() {
        try {
            const responseInsertion = await DNSApi.addElement({
                mac_address,
                name
            });
            console.log("CREATED???", responseInsertion);
        } catch (error) {
            console.log("ERROR", error);
        }
    }

    function handleChange(event: any) {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;
        console.log("name", name);
        console.log("value", value);
        // setState({ ...form });

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
                                placeholder="name"
                                name="Name"
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
