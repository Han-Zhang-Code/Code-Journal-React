import React from 'react';

export default function Auth(props) {
  return (
    <>

      <div className='entries-title-bar'>
        <div className='app-title'> <a href="#entries" className='title-link'>Code Journal</a></div>
      </div>
      <div className='auth-page'>
      <form className='auth-form'>
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
          />
        </div>
        <div className='auth-button-div'>
          <button className='auth-button'>Submit</button>
        </div>
      </form>
    </div>
  </>
  );
}
