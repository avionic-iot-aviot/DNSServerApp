import _ from 'lodash';
import { connect } from 'react-redux';
import { getRoutesGroupByName } from '../routes';
import React, { Component, ReactText } from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
// import TokenWatchdog from './tokenwatchdog';
import * as NotificationActions from '../actions/notificationActions';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Helpers from '../utils/helpers';
import TopBar from "./toolbars/topBar";
import { Button, Container, Segment, Card, Image } from 'semantic-ui-react';

let container: any;
class App extends Component<any, any> {

  constructor(props: any) {
    super(props);
  }
  toastId = null;
  notify = (message: string, id: string, status: string) => {
    if (!toast.isActive(this.toastId)) {
      this.toastId = toast(message, {
        toastId: id,
        position: toast.POSITION.TOP_RIGHT,
        type: Helpers.getToastType(status)
      });
    }
  }

  componentWillMount() {

  }
  componentDidMount() { }

  componentWillUnmount() {
  }

  componentWillReceiveProps(nextProps: any) {
    if (nextProps && nextProps.notification) {
      if ((this.props.notification && this.props.notification.id != nextProps.notification.id) || !this.props.notification)
        this.notify(nextProps.notification.body, nextProps.notification.id, nextProps.notification.status);
    }
  }

  render() {

    let accessibleRoutes: any[] = getRoutesGroupByName('public');
    return (
      <> 
      <ToastContainer />
      {/* <TokenWatchdog {...this.props} />         */}
      <Container textAlign="center">
        <Switch>
          {_.map(accessibleRoutes, (route: any, idx: number) => {
            if (route.showTopbar) {
              return (
                <Route
                  key={idx}
                  path={route.path}
                  exact={route.exact}
                  render={
                    props => (
                      <TopBar className="topBar" {...props}>
                        <Card fluid centered className="cardStyle">
                          <route.component {...props}></route.component>
                        </Card>
                      </TopBar>
                    )
                  }
                />
              );
            } else {
              return (
                <Route
                  key={idx}
                  path={route.path}
                  exact={route.exact}
                  component={route.component}
                />
              );
            }
          })}
          <Redirect from="*" to="/" />
        </Switch>
      </Container>       
      </>
    );
  }
}

const mapStateToProps = (state: any, action: any) => {
  return {
    notification: state.notificationReducer.data,
    userdata: state.userReducer.userdata,
    logout: state.userReducer.logout
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
)(App);
