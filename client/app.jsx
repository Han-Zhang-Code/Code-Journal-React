import React from 'react';
import Home from './pages/home';
import ViewEntries from './pages/view-entries';
import parseRoute from './lib/parse-route';

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
    if (route.path === 'hi') {
      return <Home />;
    }
    if (route.path === 'entries') {
      return <ViewEntries />;
    }
    return <Home />;
  }

  render() {
    return (<>{this.renderPage()}</>);
  }
}
