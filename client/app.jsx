import React from 'react';
import Home from './pages/home';
import jwtDecode from 'jwt-decode';
import ViewEntries from './pages/view-entries';
import parseRoute from './lib/parse-route';
import EntryDetail from './pages/view-entry-detail';
import EditEntry from './pages/edit-entry';
import Auth from './pages/Auth';

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      route: parseRoute(window.location.hash)
    };
  }

  componentDidMount() {
    window.addEventListener('hashchange', event => {
      this.setState({ route: parseRoute(window.location.hash) });
    });
    const token = window.localStorage.getItem('react-context-jwt');
    const user = token ? jwtDecode(token) : null;
    this.setState({ user, isAuthorizing: false });
  }

  renderPage() {
    const { route } = this.state;
    const sort = route.params.get('sort');
    if (route.path === 'entries') {
      return <ViewEntries sort={sort}/>;
    }
    if (route.path === 'code-editor') {
      return <Home />;
    }
    if (route.path === 'code') {
      const entryId = route.params.get('entryId');
      return <EntryDetail entryId={entryId}/>;
    }
    if (route.path === 'edit-code') {
      const entryId = route.params.get('entryId');
      return <EditEntry entryId={entryId} />;
    }
    if (route.path === 'sign-up') {
      return <Auth dataView='sign-up' />;
    }
    if (route.path === '' || route.path === 'sign-in') {
      return <Auth dataView='sign-in' />;
    }
    return <ViewEntries sort = {sort}/>;
  }

  render() {

    return (<>{this.renderPage()}</>);
  }
}
