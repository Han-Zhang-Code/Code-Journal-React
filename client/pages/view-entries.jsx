import React, { useState } from 'react';

export default class ViewEntries extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      entries: [],
      userinput: ''
    };
  }

  componentDidMount() {
    fetch('/api/code', { headers: { 'x-access-token': window.localStorage.getItem('react-context-jwt') } })
      .then(res => res.json())
      .then(entries => this.setState({ entries }));
  }

  componentDidUpdate(prevProps) {
    const { sort } = this.props;
    if (this.props.sort !== prevProps.sort) {
      fetch(`/api/${sort === null ? 'code' : sort}`, { headers: { 'x-access-token': window.localStorage.getItem('react-context-jwt') } })
        .then(res => res.json())
        .then(entries => this.setState({ entries }));
    }

  }

  render() {

    return (
      <><div className='view-entries-container'>

        <div className='entries-title-bar'>
          <div className='features'>
          <div className='app-title'> <a href="#entries" className='title-link'>Code Journal</a></div>
          <a href="#entries" className='view-entries-button'>Entries</a>
          <div className="dropdown">
            <button className="dropbtn">Sort by</button>
            <div className="dropdown-content">
              <a href="#entries?sort=createTime">Create Time</a>
              <a href="#entries?sort=size">Size</a>
              <a href="#entries?sort=alphabet">Alphabet</a>
            </div>
          </div>
          <form className='search-field' onSubmit={e => {
            e.preventDefault();
            window.location.hash = 'search';
            fetch(`/api/search/${this.state.userinput}`, { headers: { 'x-access-token': window.localStorage.getItem('react-context-jwt') } })
              .then(res => res.json())
              .then(entries => this.setState({ entries }));

          }}>
            <input required type="text" className="search-area" value={this.state.userinput} onChange={e => { this.setState({ userinput: e.target.value }); }}/>
            <button className='search-button' type='submit'>Search</button>
          </form>
          </div>
          <div className='sign-out-div'>
            {window.localStorage.getItem('react-context-jwt') === null &&
            <a href="#sign-in" className='signout-button'>Sign In</a>
            }
            {window.localStorage.getItem('react-context-jwt') !== null &&
              <a href="#sign-in" className='signout-button' onClick={() => { window.localStorage.removeItem('react-context-jwt'); window.localStorage.removeItem('userId'); }}>Sign Out</a>
            }
          </div>
        </div>
        <div className='container'>
          <div className='view-entries-title'>
            <h3 className="adjust-save-title">Entries</h3>
            <a href='#code-editor' className='save-button'>NEW</a>
          </div>
          <div>
            {this.state.entries[0] === undefined &&
              <div className='no-entries-container' >
                <div>No entries have been found.</div>
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
  const { entryId, title, imageUrl, description, userId } = props.entries;
  const [shared, setShared] = useState(props.entries.shared);
  return (

  <div className='row'>
    <div className='column-half'>
      <img src={imageUrl} alt={imageUrl} className='view-entries-image'/>
    </div>
    <div className='column-half'>
      <div className='caption'>
        <div className='view-entries-title-section'>
          <a href={`#code?entryId=${entryId}`} className='entries-anchor'><h2 className='view-entries-content-title'>{title}</h2></a>
            {window.localStorage.getItem('userId') === userId.toString() &&
          <div>
          <a href={`#edit-code?entryId=${entryId}`} className='entries-anchor'><i className="fas fa-edit adjust-editing-button"></i></a>
            <a href="#entries" onClick={() => {
              if (shared === 'no') {
                fetch(`/api/share/${entryId}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json', 'x-access-token': window.localStorage.getItem('react-context-jwt') } });
                setShared('yes');
              }
              if (shared === 'yes') {
                fetch(`/api/noshare/${entryId}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json', 'x-access-token': window.localStorage.getItem('react-context-jwt') } });
                setShared('no');
              }
            }}><i className={shared === 'yes' ? 'fas fa-share-square share-icon' : 'fas fa-share share-icon'}></i></a>
            </div>
          }
        </div>
        <p className='view-entries-content'>{description}</p>
      </div>
    </div>
  </div>

  );
}
