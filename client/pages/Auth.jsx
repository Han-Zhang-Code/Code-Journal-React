import React, { useState, useEffect } from 'react';

export default function Auth(props) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [dataView, setDataView] = useState(props.dataView);

  useEffect(() => {
    setDataView(props.dataView);
  }, [props.dataView]);

  function handleSubmit(e) {
    e.preventDefault();
    const newObject = { username, password };
    if (dataView === 'sign-up') {
      fetch('/api/auth/sign-up', { method: 'POST', body: JSON.stringify(newObject), headers: { 'Content-Type': 'application/json' } })
        .then(() => {
          window.location.hash = '#sign-in';
          setUsername('');
          setPassword('');
        });
    }
    if (dataView === 'sign-in') {
      fetch('/api/auth/sign-in', { method: 'POST', body: JSON.stringify(newObject), headers: { 'Content-Type': 'application/json' } })
        .then(res => res.json())
        .then(result => {
          if (result.token && result.user) {
            window.location.hash = '#';
          }
        });
    }
  }

  return (
    <>
      <div className='entries-title-bar'>
        <div className='app-title'> <a href="#entries" className='title-link'>Code Journal</a></div>
      </div>
      <div className='auth-page'>
      <form className='auth-form' onSubmit={handleSubmit}>
        <div className='username-section'>
          <label className='username-label'>
            Username
          </label>
          <input
            required
            autoFocus
            id="username"
            type="text"
            name="username"
            className='username-input'
            value={username}
            onChange={e => (setUsername(e.target.value))}
          />
        </div>
          <div className='password-section'>
            <label className='password-label'>
            Password
          </label>
          <input
            required
            id="password"
            type="password"
            name="password"
            className='password-input'
            value={password}
            onChange={e => (setPassword(e.target.value)) }
          />
        </div>
        <div className='auth-button-div'>
          {dataView === 'sign-up' &&
          <button className='auth-button'>Sign Up</button>
          }
          {dataView === 'sign-in' &&
            <button className='auth-button'>Sign In</button>
          }
        </div>
      </form>
    </div>
  </>
  );
}
