import * as React from 'react';
import { connect } from 'react-redux';
import authutils from '../../utils/authutils';
import * as NotificationActions from '../../actions/notificationActions';
import * as UserActions from '../../actions/userActions';
import DeviceApi from './../../api/deviceApi';
import DNSBaseComponent from '../dnsBaseComponent';
import { Grid, Input, Button, Container, Segment, Card, Image, Form, Icon } from 'semantic-ui-react';
import { history } from '../../main';
import _ from 'lodash';
import { IDevice } from '../../../interfaces/device';

interface CompProps {
    onBack?: (arg?: any) => any;
}

interface CompState {
    dns_name_auto: string;
    dns_name_manual: string;
    is_gw: boolean;
    gw_id: number | any;
    mac_address: string;
    tenant_id: number | any;
}

class DeviceForm extends DNSBaseComponent<CompProps | any, CompState> {
    state = {
        dns_name_auto: '',
        dns_name_manual: '',
        is_gw: false,
        gw_id: null,
        mac_address: '',
        tenant_id: null
    };

    constructor(props: any) {
        super(props);
    }

    componentWillMount() {
    }

    componentDidMount() {
        this.init();
    }

    componentWillReceiveProps(nextProps: any) {

    }

    componentWillUnmount() {
        this.cancelPromises();
    }

    handleChange(event: any) {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;
        this.setState({
            [name]: value
        });
    }

    async init() {
        console.log("INITTTTTTTTT", this.props);
        if (this.props.match.params.device_id) {
            let device: IDevice = { id: this.props.match.params.device_id };
            console.log("device", device);

            if (this.props.location.state && this.props.location.state.device) {
                console.log("device", this.props.location.state);
                device = this.props.location.state.device;

            } else {
                const deviceResponsePromise: any = DeviceApi.getById(this.props.match.params.device_id);
                this.registerPromise(deviceResponsePromise);
                const deviceResponse = await deviceResponsePromise;
                console.log("deviceResponse", deviceResponse);
                if (deviceResponse && deviceResponse.data && deviceResponse.data.payload) {
                    device = deviceResponse.data.payload;
                }

            }
            if (device && device.id) {
                this.setState({
                    dns_name_auto: device.dns_name_auto || '',
                    dns_name_manual: device.dns_name_manual || '',
                    is_gw: device.is_gw,
                    gw_id: device.gw_id,
                    mac_address: device.mac_address || '',
                    tenant_id: device.tenant_id
                });
            }
        }
    }

    async submit() {
        try {
            if (this.state.mac_address && this.state.dns_name_manual) {
                const device: IDevice = {
                    mac_address: this.state.mac_address,
                    dns_name_manual: this.state.dns_name_manual
                };
                let registerPromise: any = null;
                if (this.props.match && this.props.match.params && this.props.match.params.device_id) {
                    device.id = this.props.match.params.device_id;
                    registerPromise = DeviceApi.update(device);
                } else {
                    registerPromise = DeviceApi.create(device);
                }
                this.registerPromise(registerPromise);
                const responseCreate: any = await registerPromise;

                if (responseCreate && responseCreate.status === 200 && responseCreate.data) {
                    if (responseCreate.data.message === 'Device successfully created') {
                        this.props.dispatchNotification('Creation successfully done', 'success', Math.random());
                    } else if (responseCreate.data.message === 'Device already exists') {
                        this.props.dispatchNotification('Creation successfully done', 'warning', Math.random());
                    } if (responseCreate.data.message === 'Device successfully updated') {
                        this.props.dispatchNotification('the change was successful', 'success', Math.random());
                    } else {
                        this.props.dispatchNotification(`Error creation.`, 'error', Math.random());
                    }
                }

            } else {
                this.props.dispatchNotification(`Missing Data`, 'warning', Math.random());
            }

        } catch (error) {
            console.log('error: ', error);
            this.props.dispatchNotification('Sign Up Error', 'error', Math.random());
        }
    }

    render() {
        return (
            <>
                <Button floated='right' icon primary size='small' className="customButton"
                    onClick={() => {
                        history.push(`/home`);
                    }}>
                    <Icon name='arrow left' />
                </Button>
                <Segment raised>
                    Creazione Device
                <Form size="small">
                        <Grid textAlign="center" className='loginForm'>
                            <Grid.Row width={12}>
                                <Input
                                    placeholder="edge mac_address name"
                                    name="mac_address"
                                    type="text"
                                    value={this.state.mac_address}
                                    onChange={(event: any) => {
                                        this.handleChange(event);
                                    }}
                                />
                            </Grid.Row>
                            <Grid.Row width={12}>
                                <Input
                                    placeholder="dns_name_manual"
                                    name="dns_name_manual"
                                    type="text"
                                    value={this.state.dns_name_manual}
                                    onChange={(event: any) => {
                                        this.handleChange(event);
                                    }}
                                />
                            </Grid.Row>

                            <Button
                                type='submit'
                                className="buttonLoginForm"
                                onClick={(event: any) => {
                                    this.submit();
                                }}
                            >Crea
                        </Button>
                        </Grid>
                    </Form>
                </Segment>
            </>
        );
    }
}

const mapStateToProps = (state: any) => {
    return {
        userdata: state.userReducer.userdata,
        status: state.userReducer.status
    };
};

const mapDispatchToProps = (dispatch: any) => {
    return {
        dispatchLoginAction: (username: string, password: string) => {
            dispatch(UserActions.login(username, password));
        },
        dispatchNotification: (body: string, status: string, id: string) => {
            dispatch(NotificationActions.globalStatusChanged({ body, status, id }));
        }
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(DeviceForm);
