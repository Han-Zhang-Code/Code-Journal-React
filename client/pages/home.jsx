import React from 'react';
import CodeEditor from '../components/codeEditor';

export default function Home(props) {
  return (
    <div>
      <CodeEditor html='' css='' js='' title='' imageUrl='' description='' dataView='createEntry'/>
    </div>
  );
}
