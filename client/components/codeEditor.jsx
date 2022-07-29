import React, { useState, useEffect } from 'react';
import Editor from './Editor';
export default function CodeEditor(props) {
  const [html, setHtml] = useState('');
  const [css, setCss] = useState('');
  const [javascript, setJs] = useState('');
  const [srcDoc, setSrcDoc] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [description, setDescription] = useState('');

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

  function handleTitle(event) {
    setTitle(event.target.value);
  }
  function handleImage(event) {
    setImageUrl(event.target.value);
  }
  function handleDescription(event) {
    setDescription(event.target.value);
  }
  function handleSubmit() {
    const newObject = { html, css, javascript, title, imageUrl, description };
    fetch('/api/code', { method: 'POST', body: JSON.stringify(newObject), headers: { 'Content-Type': 'application/json' } });
    window.location.hash = '#entries';
  }
  return (
    <>
      <div>
      <form onSubmit={handleSubmit}>
        <div className={`${modalOpen ? 'modal' : 'modal-hide'}`}>
          <div className="modal-content">
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
                <a href="#" className="cancel-button" onClick={() => { setModalOpen(prevOpen => false); setImageUrl(''); }}>Cancel</a>
                  <button type="submit" className="save-button" >Save</button>
              </div>
            </div>
          </div>
        </div>
        </form>
      </div>
    <div className='code-editor-page'>
      <div className='title-bar'>
        <div className='app-title'>Code Journal</div>
          <a href="#entries" className='view-entries-button'>Entries</a>
          <div className='save-button' onClick={() => setModalOpen(prevOpen => true)}>SAVE</div>
      </div>
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
          sandbox="allow-scripts allow-forms"
          frameBorder="0"
          width="100%"
          height="100%"
        />
        </div></div>
      </div>
    </>
  );
}
