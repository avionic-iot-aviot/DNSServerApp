import _ from 'lodash';
import authutils from '../../utils/authutils';
import { connect } from 'react-redux';
import { history } from '../../main';
import React, { Component } from 'react';
import { Menu, Segment, Button, Input } from 'semantic-ui-react';
import * as UserActions from '../../actions/userActions';

interface CompState {
  activeItem: string;
}

class TopBar extends Component<any, CompState> {

  state = { activeItem: 'home' }

  componentWillMount() {
    console.log("componentWillMount TopBar");
    const user = authutils.getTokenPayload();
    if (user) {
      let activeItem = 'home';

      _.defer(() => {
        this.setState({ activeItem })
      });

    }
  }

  onClick(name: string) {
    this.setState({ activeItem: name })
    _.defer(() => {
      history.push(`/${name}`);
    })
  }

  render() {
    const activeItem = this.state.activeItem;
    const user = authutils.getTokenPayload();
    let email = '';
    if (user) {
      email = user.email
    }
    return (
      <div>
        <Menu pointing secondary color='blue'>
          <Menu.Item
            name='home'
            active={activeItem === 'home'}
            onClick={() => {
              this.onClick('home');
            }}
          />
          <Menu.Menu position='right'>
            <Input className='loggedUserInput'>{email}</Input>
            <Button
              name='logout'
              basic
              icon='log out'
              floated='right'
              className='logout'
              color='blue'
              active={activeItem === 'logout'}
              onClick={() => this.props.dispatchLogoutAction()}
            />
          </Menu.Menu>
        </Menu>
        {this.props.children}
      </div >
    )
  }
}

const mapStateToProps = (state: any) => {
  return {
  };
};

const mapDispatchToProps = (dispatch: any) => {
  return {
    dispatchLogoutAction: () => {
      history.push('/')
      dispatch(UserActions.logout());
    },
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TopBar);