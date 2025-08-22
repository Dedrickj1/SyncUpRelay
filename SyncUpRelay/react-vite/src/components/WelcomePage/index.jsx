import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import OpenModalButton from '../OpenModalButton';
import LoginFormModal from '../LoginFormModal';
import SignupFormModal from '../SignupFormModal';
import './WelcomePage.css';

function WelcomePage() {
  const user = useSelector(state => state.session.user);

  return (
    <div className="welcome-page-container">
      <div className="welcome-content">
        <h1 className="welcome-title">Welcome to SyncUp Relay</h1>
        
        {user ? (
          <>
            <p className="welcome-subtitle">You are already logged in.</p>
            <div className="welcome-actions">
              {/* This link now points to "/" */}
              <Link to="/" className="welcome-button continue">
                Continue to App
              </Link>
            </div>
          </>
        ) : (
          <>
            <p className="welcome-subtitle">Your new hub for real-time communication.</p>
            <div className="welcome-actions">
              <OpenModalButton
                buttonText="Log In"
                modalComponent={<LoginFormModal />}
                className="welcome-button login"
              />
              <OpenModalButton
                buttonText="Sign Up"
                modalComponent={<SignupFormModal />}
                className="welcome-button signup"
              />
            </div>
            {/* This link now points to "/" */}
            <Link to="/" className="skip-link">
              Skip for now &rarr;
            </Link>
          </>
        )}
      </div>
    </div>
  );
}

export default WelcomePage;
