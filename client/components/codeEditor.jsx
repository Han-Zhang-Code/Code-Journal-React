import React, { useState, useEffect } from 'react';
import Editor from './Editor';

export default function CodeEditor(props) {
  const [html, setHtml] = useState('');
  const [css, setCss] = useState('');
  const [javascript, setJs] = useState('');
  const [srcDoc, setSrcDoc] = useState('');

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

  function addtoDatabase() {
    const newObject = { html, css, javascript };
    fetch('/api/code', { method: 'POST', body: JSON.stringify(newObject), headers: { 'Content-Type': 'application/json' } });
  }

  return (
    <>
    <div className='code-editor-page'>
      <div className='title-bar'>
        <div className='app-title'>Code Journal</div>
        <div className='save-button' onClick={addtoDatabase}>SAVE</div>
      </div>
      <div className="top-pane">

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
          sandbox="allow-scripts"
          frameBorder="0"
          width="100%"
          height="100%"
        />
        </div></div>
      </div>
    </>
  );
}
