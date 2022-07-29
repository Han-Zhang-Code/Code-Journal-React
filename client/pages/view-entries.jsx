import React from 'react';

export default class ViewEntries extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      entries: []
    };
  }

  componentDidMount() {
    fetch('/api/code')
      .then(res => res.json())
      .then(entries => this.setState({ entries }));
  }

  render() {

    return (
      <><div className='view-entries-container'>

        <div className='entries-title-bar'>
          <div className='app-title'>Code Journal</div>
          <a href="#entries" className='view-entries-button'>Entries</a>
        </div>
        <div className='container'>
          <div className='view-entries-title'>
            <h3 className="adjust-save-title">Entries</h3>
            <a href='#' className='save-button'>NEW</a>
          </div>
          <div>
            {this.state.entries[0] === undefined &&
              <div className='no-entries-container' >
                <div>No entries have been recorded.</div>
              </div>
            }
            {this.state.entries[0] !== undefined &&
              <div>
                {this.state.entries.map(entries => (
                  <div key={entries.entryId}>
                    <Entries entries={entries}/>
                  </div>
                ))}
              </div>

            }
          </div>

        </div>
        </div></>
    );
  }

}
function Entries(props) {
  const { title, imageUrl, description } = props.entries;

  return (
  <div className='row'>
    <div className='column-half'>
      <img src={imageUrl} alt={imageUrl} className='view-entries-image'/>
    </div>
    <div className='column-half'>
      <div className='caption'>
        <h2 className='view-entries-content-title'>{title}</h2>
        <p className='view-entries-content'>{description}</p>
      </div>
    </div>
  </div>
  );
}
