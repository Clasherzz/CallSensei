import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { exchangeCodeForToken, setToken } from '../../../state/githubSlice';
import dotenv from 'dotenv';


const GitHubAuthButton = () => {
  const dispatch = useDispatch();
  const token = useSelector((state: any) => state.github.token);

  const handleLogin = () => {
    const clientId = import.meta.env.VITE_GITHUB_CLIENT_ID;
    const redirectUri = import.meta.env.VITE_GITHUB_CALLBACK_URL; // must match your GitHub OAuth app
    const scope = 'repo';
    window.location.href = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}`;
  };

  const handleLogout = () => {
    dispatch(setToken(null));
  };

  // Check for ?code in URL (after GitHub redirect)
  React.useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get('code');
    if (code && !token) {
      dispatch(exchangeCodeForToken(code));
    }
  }, [dispatch, token]);

  return (
    <button onClick={token ? handleLogout : handleLogin}>
      {token ? '🚪 Logout from GitHub' : '🔐 Login with GitHub'}
    </button>
  );
};

export default GitHubAuthButton;
