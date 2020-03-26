import * as React from 'react';
import { connect } from 'react-redux';
import authutils from '../../utils/authutils';
import * as NotificationActions from '../../actions/notificationActions';
import * as UserActions from '../../actions/userActions';
import TenantApi from './../../api/tenantApi';
import DNSBaseComponent from '../dnsBaseComponent';
import { Grid, Input, Button, Container, Segment, Card, Image, Form, Icon } from 'semantic-ui-react';
import { history } from '../../main';
import _ from 'lodash';
import { ITenant } from '../../../interfaces/tenant';

interface CompProps {
    tenant?: ITenant;
    onBack?: (arg?: any) => any;

}

interface CompState {
    description?: string;
    edge_interface_name?: string;
}

class TenantForm extends DNSBaseComponent<CompProps | any, CompState> {
    state = {
        description: '',
        edge_interface_name: ''
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

    async createTenant() {
        try {
            if (this.state.edge_interface_name && this.state.description) {
                const tenant: ITenant = {
                    description: this.state.description,
                    edge_interface_name: this.state.edge_interface_name
                };
                const registerPromise = TenantApi.create(tenant);
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
                    Creazione Tenant
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
                                this.createTenant();
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
)(TenantForm);
