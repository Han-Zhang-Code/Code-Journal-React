import React from 'react';
import CodeEditor from '../components/codeEditor';

export default class EntryDetail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      entries: []
    };
  }

  componentDidMount() {
    fetch(`/api/code/${this.props.entryId}`, { headers: { 'x-access-token': window.localStorage.getItem('react-context-jwt') } })
      .then(res => res.json())
      .then(entries => this.setState({ entries }));
  }

  render() {
    const { html, css, javascript, entryId } = this.state.entries;
    return (
      <CodeEditor html={html} css={css} js={javascript} entryId={entryId} dataView='view-detail'/>
    );
  }

}
