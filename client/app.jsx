import React from 'react';
import Home from './pages/home';
import ViewEntries from './pages/view-entries';
import parseRoute from './lib/parse-route';
import EntryDetail from './pages/view-entry-detail';
import EditEntry from './pages/edit-entry';

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
  }

  renderPage() {
    const { route } = this.state;
    if (route.path === '' || route.path === 'entries') {
      const sort = route.params.get('sort');
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
    return <ViewEntries />;
  }

  render() {
    return (<>{this.renderPage()}</>);
  }
}
