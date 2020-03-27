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
    device?: IDevice;
    onBack?: (arg?: any) => any;

}

interface CompState {
    dns_name_auto: string;
    dns_name_manual: string;
    is_gw: boolean;
    gw_id: number;
    mac_address: string;
    tenant_id: number;
}

class DeviceForm extends DNSBaseComponent<CompProps | any, CompState> {
    state = {
        dns_name_auto: '',
        dns_name_manual: '',
        is_gw: false,
        gw_id: null,
        mac_address: '',
        tenant_id: null,
    };

    constructor(props: any) {
        super(props);
    }

    componentWillMount() {
    }

    componentDidMount() {
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

    async createDevice() {
        try {
            if (this.state.mac_address && this.state.dns_name_manual) {
                const tenant: IDevice = {
                    mac_address: this.state.mac_address,
                    dns_name_manual: this.state.dns_name_manual
                };
                const registerPromise = DeviceApi.create(tenant);
                this.registerPromise(registerPromise);
                const responseCreate: any = await registerPromise;
                if (responseCreate && responseCreate.status === 200 && responseCreate.data) {
                    if (responseCreate.data.message === 'Tenant successfully created') {
                        this.props.dispatchNotification('Creation successfully done', 'success', Math.random());
                    } else if (responseCreate.data.message === 'Tenant already exists') {
                        this.props.dispatchNotification('Creation successfully done', 'warning', Math.random());
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
                                placeholder="edge interface name"
                                name="edge_interface_name"
                                type="text"
                                value={this.state.edge_interface_name}
                                onChange={(event: any) => {
                                    this.handleChange(event);
                                }}
                            />
                        </Grid.Row>
                        <Grid.Row width={12}>
                            <Input
                                placeholder="description"
                                name="description"
                                type="text"
                                value={this.state.description}
                                onChange={(event: any) => {
                                    this.handleChange(event);
                                }}
                            />
                        </Grid.Row>

                        <Button
                            type='submit'
                            className="buttonLoginForm"
                            onClick={(event: any) => {
                                this.createDevice();
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
