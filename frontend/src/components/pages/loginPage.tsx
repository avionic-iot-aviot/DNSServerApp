import React, { Component } from "react";
import { connect } from "react-redux";
import { Container, Button, Card, Image, Segment } from "semantic-ui-react";
import DNSBaseComponent from '../dnsBaseComponent';
import { history } from '../../main';
import * as NotificationActions from '../../actions/notificationActions';
import authutils from '../../utils/authutils';
import LoginForm from "../forms/loginForm";

interface CompState {
}

class LoginPage extends DNSBaseComponent<any, CompState> {
  componentWillMount() {
    const token = authutils.getToken();
    if (token && !authutils.isTokenExpired()) {
        history.push('/home');
    }
  }

  componentDidMount() {
  }

  componentWillUnmount() {
    this.cancelPromises();
  }

  componentWillReceiveProps(nextProps: any) {
   }

  render() {
    return (
       <LoginForm></LoginForm>           
    );
  }
}

const mapStateToProps = (state: any) => {
  return {
    
  };
};

const mapDispatchToProps = (dispatch: any) => {
  return {
    dispatchNotification: (body: string, status: string, id: string) => {
      dispatch(NotificationActions.globalStatusChanged({ body, status, id }));
  },
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(LoginPage);
