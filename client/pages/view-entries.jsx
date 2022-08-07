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
  const [sharedEdit, setSharedEdit] = useState(props.entries.sharedEdit);
  const [commentOpen, setCommentOpen] = useState(false);
  const [postcomments, setpostComments] = useState('');
  const [comments, setComments] = useState('');
  const [username, setUsername] = useState('');

  function handleShared() {
    fetch(`/api/share/${entryId}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json', 'x-access-token': window.localStorage.getItem('react-context-jwt') } });
    if (shared) setShared(false);
    if (!shared) setShared(true);
  }
  function handleSharedEdit() {
    fetch(`/api/sharedit/${entryId}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json', 'x-access-token': window.localStorage.getItem('react-context-jwt') } });
    if (sharedEdit) setSharedEdit(false);
    if (!sharedEdit) setSharedEdit(true);
  }
  function handleCommentSubmit(e) {
    e.preventDefault();
    const commentsObject = { postcomments };
    fetch(`/api/comments/${entryId}`, { method: 'POST', body: JSON.stringify(commentsObject), headers: { 'Content-Type': 'application/json', 'x-access-token': window.localStorage.getItem('react-context-jwt') } });
    setpostComments('');
  }
  function handleCommentClick() {
    fetch(`/api/viewcomments/${entryId}`, { headers: { 'Content-Type': 'application/json', 'x-access-token': window.localStorage.getItem('react-context-jwt') } })
      .then(res => res.json()).then(data => {
        if (!data.error) {
          setComments(data[0].comments);
          setUsername(data[0].username);
        }
        // console.log(comments);
        // console.log(data);
      });
    setCommentOpen(!commentOpen);
  }

  return (
  <div className='row'>
    <div className='column-half'>
      <img src={imageUrl} alt={imageUrl} className='view-entries-image'/>
    </div>
    <div className='column-half'>
      <div className='caption'>
        <div className='view-entries-title-section'>
          <div>
          <a href={`#code?entryId=${entryId}`} className='entries-anchor'><h2 className='view-entries-content-title'>{title}</h2></a>
            </div>
            <div className='row'>
            {window.localStorage.getItem('userId') === userId.toString() &&
          <div>
          <a href={`#edit-code?entryId=${entryId}`} className='entries-anchor'><i className="fas fa-edit adjust-editing-button"></i></a>
          <a href="#entries" onClick={handleShared}><i className={shared === true ? 'fas fa-share-square share-icon' : 'fas fa-share share-icon'}></i></a>
          <a href="#entries" onClick={handleSharedEdit}><i className={sharedEdit === true ? 'fas fa-glasses share-icon' : 'fas fa-user-edit share-icon'}></i></a>
            </div>
          }
          {(window.localStorage.getItem('userId') !== userId.toString() && sharedEdit === true) &&
            <div>
              <a href={`#edit-code?entryId=${entryId}`} className='entries-anchor'><i className="fas fa-edit adjust-editing-button"></i></a>
            </div>
          }
              <a href="#entries" onClick={handleCommentClick}><i className="fa-solid fa-comment-dots share-icon"></i></a>
            </div>
        </div>
        <p className="view-entries-content" >{description}</p>
          <div className={`comments-section ${commentOpen ? '' : 'hidden'}`}>
            <div>
              <div>{username}</div>
              <div>{comments}</div>
            </div>
            <form className='comments-field' onSubmit={handleCommentSubmit}>
              <textarea required name="name" type="text" className="comments" value={postcomments} onChange={e => { setpostComments(e.target.value); }}/>
              <button className='comment-button' type='submit'>POST</button>
            </form>
          </div>
      </div>
    </div>
  </div>

  );
}
