import React, { useState, useEffect } from 'react';
import Editor from './Editor';
export default function CodeEditor(props) {
  const [html, setHtml] = useState(props.html);
  const [css, setCss] = useState(props.css);
  const [javascript, setJs] = useState(props.js);
  const [srcDoc, setSrcDoc] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [title, setTitle] = useState(props.title);
  const [imageUrl, setImageUrl] = useState(props.imageUrl);
  const [description, setDescription] = useState(props.description);
  const [entryId, setEntryId] = useState(props.entryId);
  const [dataView, setDataView] = useState(props.dataView);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setSrcDoc(`
        <html>
          <body>${html}</body>
          <style>${css}</style>
          <script>${javascript}</script>
        </html>
      `);
    }, 250);

    return () => clearTimeout(timeout);
  }, [html, css, javascript]);

  useEffect(() => {
    setHtml(props.html);
    setCss(props.css);
    setJs(props.js);
    setTitle(props.title);
    setImageUrl(props.imageUrl);
    setDescription(props.description);
    setEntryId(props.entryId);
    setDataView(props.dataView);

  }, [props.html, props.css, props.js, props.title, props.imageUrl, props.description, props.entryId, props.dataView]);

  function handleTitle(event) {
    setTitle(event.target.value);
  }
  function handleImage(event) {
    setImageUrl(event.target.value);
  }
  function handleDescription(event) {
    setDescription(event.target.value);
  }
  function handleDelete(event) {
    event.preventDefault();
    fetch(`/api/code/${entryId}`, { method: 'DELETE', headers: { 'Content-Type': 'application/json', 'x-access-token': window.localStorage.getItem('react-context-jwt') } })
      .then(() => {
        window.location.hash = '#entries';
      });
  }
  function handleSubmit(event) {
    event.preventDefault();
    const newObject = { html, css, javascript, title, imageUrl, description };
    if (dataView === 'createEntry') {
      fetch('/api/code', { method: 'POST', body: JSON.stringify(newObject), headers: { 'Content-Type': 'application/json', 'x-access-token': window.localStorage.getItem('react-context-jwt') } })
        .then(() => {
          window.location.hash = '#entries';
        });
    }
    if (dataView === 'edit-entry') {
      fetch(`/api/code/${entryId}`, { method: 'PATCH', body: JSON.stringify(newObject), headers: { 'Content-Type': 'application/json', 'x-access-token': window.localStorage.getItem('react-context-jwt') } })
        .then(() => {
          window.location.hash = '#entries';
        });
    }

  }
  return (
    <>
      <div>
      <form onSubmit={handleSubmit}>

        <div className={`${modalOpen ? 'modal' : 'modal-hide'}`}>
            <div className={`delete-modal ${deleteModalOpen ? '' : 'hidden'}`}>
              <p className='delete-message'>Are you sure you want to delete this entry?</p>
              <div>
                <button className='cancel-button-delete' onClick={e => { setDeleteModalOpen(false); e.preventDefault(); }}>CANCEL</button>
                <button className='confirm-button-delete' onClick={handleDelete}>CONFIRM</button>
              </div>
            </div>
            <div className={`modal-content ${deleteModalOpen ? 'hidden' : ''}`}>
            <div className='title-bar'>
              <div className='save-title'>Code Journal</div>
            </div>
            <h3 className="adjust-save-title">New Entry</h3>
            <div className="row">
              <div className="column-half">
                  <img src={imageUrl === '' ? 'image/placeholder-image-square.jpeg' : imageUrl} alt="placeholder-image-square" className="adjust-img column-full"/>
              </div>
              <div className="column-half">
                <div>
                  <label className="adjust-label">Title</label>
                </div>
                <div className='input-field'>
                  <input required name="name" type="text" className="input-area column-full" value={title} onChange={handleTitle}/>
                </div>
                <div>
                  <label className="adjust-label">Photo URL</label>
                </div>
                <div className='input-field'>
                    <input required name="photo" type="text" className="input-area column-full" value={imageUrl} onChange={handleImage}/>
                </div>
              </div>
            </div>
            <div className="column-full ">
              <div>
                <label className="adjust-notes">Description</label>
              </div>
              <div className='note-field'>
                  <textarea required rows="7" className="input-area column-full" value={description} onChange={handleDescription}></textarea>
              </div>

              <div className="row adjust-button-position">
                  { dataView === 'createEntry' &&
                  <a href="#code-editor" className="cancel-button" onClick={() => { setModalOpen(prevOpen => false); setImageUrl(''); }}>Cancel</a>
                  }
                  {dataView === 'edit-entry' &&
                    <a className="delete-button" onClick={() => { setDeleteModalOpen(true); }}>Delete Entry</a>
                  }
                  <button type="submit" className="save-button" >Save</button>
              </div>

            </div>

          </div>
        </div>
        </form>
      </div>
    <div className='code-editor-page'>
        {(dataView === 'createEntry' || dataView === 'edit-entry') &&
      <div className='title-bar'>
          <div className='app-title'> <a href="#entries" className='title-link'>Code Journal</a></div>
          <a href="#entries" className='view-entries-button'>Entries</a>
          <div className='save-button' onClick={() => setModalOpen(prevOpen => true)}>SAVE</div>
      </div>
        }
        {
         dataView === 'view-detail' &&
          <div className='title-bar'>
            <div className='app-title'> <a href="#entries" className='title-link'>Code Journal</a></div>
          </div>
        }
      <div className={`top-pane ${modalOpen ? 'hidden' : ''}`}>

          <Editor
            language="xml"
            displayName="HTML"
            value={html}
            onChange={setHtml}
            />

          <Editor
            language="css"
            displayName="CSS"
            value={css}
            onChange={setCss}
          />

          <Editor
            language="javascript"
            displayName="JavaScript"
            value={javascript}
            onChange={setJs}
          />

      </div>
      <div className='result-window'>Result</div>
        <div className='result-container'>
      <div className="pane ">
        <iframe
          srcDoc={srcDoc}
          title="output"
              sandbox="allow-scripts allow-forms allow-same-origin"
          frameBorder="0"
          width="100%"
          height="100%"
        />
        </div></div>
      </div>
    </>
  );
}
