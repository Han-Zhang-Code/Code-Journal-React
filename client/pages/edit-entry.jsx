import React from 'react';
import CodeEditor from '../components/codeEditor';

export default class EditEntry extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      entries: []
    };
  }

  componentDidMount() {
    fetch(`/api/code/${this.props.entryId}`)
      .then(res => res.json())
      .then(entries => this.setState({ entries }));
  }

  render() {
    const { html, css, javascript, entryId, title, imageUrl, description } = this.state.entries;
    return (
      <CodeEditor html={html} css={css} js={javascript} entryId={entryId} dataView='edit-entry' title={title} imageUrl={imageUrl} description={description}/>
    );
  }

}
