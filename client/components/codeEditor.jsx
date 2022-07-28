import React, { useState, useEffect } from 'react';
import Editor from './Editor';

export default function CodeEditor(props) {
  const [html, setHtml] = useState('');
  const [css, setCss] = useState('');
  const [javascript, setJs] = useState('');
  const [srcDoc, setSrcDoc] = useState('');
  const [modalOpen, setModalOpen] = useState(false);

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

  // function addtoDatabase() {
  //   const newObject = { html, css, javascript };
  //   fetch('/api/code', { method: 'POST', body: JSON.stringify(newObject), headers: { 'Content-Type': 'application/json' } });

  // }

  return (
    <>
      <div>
        <div className={`${modalOpen ? 'modal' : 'modal-hide'}`}>
          <div className="modal-content">
            <div className='title-bar'>
              <div className='save-title'>Code Journal</div>
            </div>
            <h3 className="adjust-save-title">New Entry</h3>
            <div className="row">
              <div className="column-half">
                <img src="image/placeholder-image-square.jpeg" alt="placeholder-image-square" className="adjust-img column-full"/>
              </div>
              <div className="column-half">
                <div>
                  <label className="adjust-label">Title</label>
                </div>
                <div className='input-field'>
                  <input required name="name" type="text" className="input-area column-full"/>
                </div>
                <div>
                  <label className="adjust-label">Photo URL</label>
                </div>
                <div className='input-field'>
                  <input required name="photo" type="text" className="input-area column-full" />
                </div>
              </div>
            </div>
            <div className="column-full ">
              <div>
                <label className="adjust-notes">Notes</label>
              </div>
              <div className='note-field'>
                <textarea required rows="7" className="input-area column-full" ></textarea>
              </div>
              <div className="row adjust-button-position">
                <a href="#" className="cancel-button" onClick={() => setModalOpen(prevOpen => false)}>Cancel</a>
                <button type="submit" className="save-button">Save</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    <div className='code-editor-page'>
      <div className='title-bar'>
        <div className='app-title'>Code Journal</div>
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
