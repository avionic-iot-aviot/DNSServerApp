import * as React from 'react';
import { connect } from 'react-redux';
import authutils from '../../utils/authutils';
import * as NotificationActions from '../../actions/notificationActions';
import * as UserActions from '../../actions/userActions';
import UserApi from './../../api/userApi';
import DNSBaseComponent from '../dnsBaseComponent';
import { Grid, Input, Button, Container, Segment, Card, Image, Form } from 'semantic-ui-react';
import { history } from '../../main';
import _ from 'lodash';
import { Link } from 'react-router-dom';
import { IUser } from '../../../interfaces/user';

interface CompProps {
}

interface CompState {
    confirm_password?: string;
    email?: string;
    username?: string;
    password?: string;
    isLogin?: boolean;
}


class CreateUserForm extends DNSBaseComponent<CompProps | any, CompState> {
    state = {
        confirm_password: '',
        email: '',
        username: '',
        password: '',
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

    async createUser() {
        try {
            if (this.state.email && this.state.username && this.state.password && this.state.confirm_password) {
                const user: IUser = {
                    username: this.state.username,
                    email: this.state.email,
                    password: this.state.password
                };
                const registerPromise = UserApi.createUser(user);
                this.registerPromise(registerPromise);
                const responseCreate: any = await registerPromise;
                if (responseCreate && responseCreate.status === 200 && responseCreate.data) {
                    if (responseCreate.data.message === 'Creation successfully done')
                        this.props.dispatchNotification('Creation successfully done', 'success', Math.random());
                    if (responseCreate.data.message === 'User already exists.')
                        this.props.dispatchNotification(`User already exists.`, 'warning', Math.random());
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
            <Segment raised>
                <Card fluid centered>
                    <Card.Content>
                        <Card.Header className="headerHomePage">Create User</Card.Header>
                        <Card.Description>

                            <Form size="small">
                                <Grid textAlign="center" className='loginForm'>
                                    <Grid.Row width={12}>
                                        <Input
                                            placeholder="username"
                                            name="username"
                                            type="text"
                                            value={this.state.username}
                                            onChange={(event: any) => {
                                                this.handleChange(event);
                                            }}
                                        />
                                    </Grid.Row>
                                    <Grid.Row width={12}>
                                        <Input
                                            placeholder="email"
                                            name="email"
                                            type="text"
                                            value={this.state.email}
                                            onChange={(event: any) => {
                                                this.handleChange(event);
                                            }}
                                        />
                                    </Grid.Row>
                                    <Grid.Row width={12}>
                                        <Input
                                            placeholder="password"
                                            name="password"
                                            type="password"
                                            value={this.state.password}
                                            onChange={(event: any) => {
                                                this.handleChange(event);
                                            }}
                                        />
                                    </Grid.Row>
                                    <Grid.Row width={12}>
                                        <Input
                                            placeholder="confirm password"
                                            name="confirm_password"
                                            type="password"
                                            value={this.state.confirm_password}
                                            onChange={(event: any) => {
                                                this.handleChange(event);
                                            }}
                                        />
                                    </Grid.Row>
                                    <Button
                                        type='submit'
                                        className="buttonLoginForm"
                                        onClick={(event: any) => {
                                            this.createUser(event);
                                        }}
                                    >Crea
                                    </Button>
                                </Grid>
                            </Form>
                        </Card.Description>
                    </Card.Content>
                </Card>
            </Segment>
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
)(CreateUserForm);
