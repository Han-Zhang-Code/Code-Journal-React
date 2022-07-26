import React, { useState, useEffect } from 'react';

export default function Auth(props) {
  const [username, setUsername] = useState('Testing-Account');
  const [password, setPassword] = useState('Testing-Account');
  const [dataView, setDataView] = useState(props.dataView);
  const [invalid, setinvalid] = useState(false);

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
          if (result.error) {
            setinvalid(true);
          }
          if (result.token && result.user) {
            window.location.hash = '#entries';
            window.localStorage.setItem('react-context-jwt', result.token);
            window.localStorage.setItem('userId', result.user.userId);
            setinvalid(false);
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
        <div>
            {(dataView === 'sign-up' && invalid === false) &&
          <div className='auth-button-div'>
            <a href="#sign-in" className='auth-link'>Already have account?</a>
            <button className='auth-button'>Sign Up</button>
          </div>
          }
          {(dataView === 'sign-in' && invalid === false) &&
              <div className='auth-button-div'>
                <a href="#sign-up" className='auth-link'>Need an Account? </a>
                <button className='auth-button'>Sign In</button>
              </div>
          }
            {invalid === true &&
              <div className='auth-button-div'>
                <a className='auth-link'>Invalid Login</a>
                <a href="#sign-up" className='auth-invalid-link' onClick={() => { setinvalid(false); }}>Sign Up? </a>
                <button className='auth-button'>Sign In</button>
              </div>
            }
        </div>
      </form>
    </div>
  </>
  );
}
