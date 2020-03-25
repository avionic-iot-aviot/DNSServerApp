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
    name?: string;
    password?: string;
    isLogin?: boolean;
}


class LoginForm extends DNSBaseComponent<CompProps | any, CompState> {
    state = {
        confirm_password: '',
        email: '',
        name: '',
        password: '',
        isLogin: true,
    };

    constructor(props: any) {
        super(props);
    }

    componentWillMount() {
    }

    componentDidMount() {
    }

    componentWillReceiveProps(nextProps: any) {
        if (nextProps && nextProps.status && nextProps.status == 'success' && nextProps.userdata) {
            this.props.dispatchNotification(`Login successfully done`, 'success', Math.random());
            history.push('/home');
        } else if (nextProps && nextProps.status && nextProps.status == 'error') {
            this.props.dispatchNotification(`Error Login`, 'error', Math.random());
        }
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

    handleLoginClick(event: any) {
        if (this.state.email && this.state.password) {
            this.props.dispatchLoginAction(this.state.email, this.state.password);
            // this.props.dispatchNotification(`Login successfully done`, 'success', Math.random());
        } else {
            this.props.dispatchNotification(`Missing Data`, 'warning', Math.random());
        }
    }

    render() {
        return (
            <Segment raised>
                <Card fluid centered>
                    <Image src="../../../public/images/drone.jpg" size="huge" centered></Image>
                    <Card.Content>
                        <Card.Header className="headerHomePage">Aviot</Card.Header>
                        <Card.Description>

                            <Form size="small">
                                <Grid textAlign="center" className='loginForm'>
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
                                    <Button
                                        type='submit'
                                        className="buttonLoginForm"
                                        onClick={(event: any) => {
                                            this.handleLoginClick(event);
                                        }}
                                    > Login
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
)(LoginForm);
