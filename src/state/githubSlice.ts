// src/store/githubSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// const clientId = 'YOUR_CLIENT_ID';
// const clientSecret = 'YOUR_CLIENT_SECRET';

export const exchangeCodeForToken = createAsyncThunk(
  'github/exchangeCode',
  async (code : string) => {
    // Use the proxy server to avoid CORS issues
    const proxyUrl = import.meta.env.VITE_PROXY_URL || 'http://localhost:3001';
    const res = await fetch(`${proxyUrl}/api/github/oauth/token`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        client_id: import.meta.env.VITE_GITHUB_CLIENT_ID || 'Ov23liR0F5RL7r5YcC8H',
        client_secret: import.meta.env.VITE_GITHUB_CLIENT_SECRET,
        code,
      }),
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({ error: 'Unknown error' }));
      throw new Error(errorData.error || 'Failed to exchange code for token');
    }

    const data = await res.json();
    return data.access_token;
  }
);

// export const fetchModel = createAsyncThunk(
//   'github/fetchModel',
//   async ({ token, owner, repo, path }) => {
//     const res = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/${path}`, {
//       headers: {
//         Authorization: `Bearer ${token}`,
//       },
//     });

//     const data = await res.json();
//     return Buffer.from(data.content, 'base64').toString('utf-8');
//   }
// );

// export const pushModel = createAsyncThunk(
//   'github/pushModel',
//   async ({ token, owner, repo, path, content, message }) => {
//     const encoded = Buffer.from(content).toString('base64');

//     await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/${path}`, {
//       method: 'PUT',
//       headers: {
//         Authorization: `Bearer ${token}`,
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify({
//         message,
//         content: encoded,
//       }),
//     });

//     return path;
//   }
// );

const githubSlice = createSlice({
  name: 'github',
  initialState: {
    token: null,
    modelContent: '',
    status: 'idle',
    error: null as string | null,
  },
  reducers: {
    setToken(state, action) {
      state.token = action.payload;
      state.error = null;
    },
    clearError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(exchangeCodeForToken.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(exchangeCodeForToken.fulfilled, (state, action) => {
        state.status = 'idle';
        state.token = action.payload;
        state.error = null;
      })
      .addCase(exchangeCodeForToken.rejected, (state, action) => {
        state.status = 'idle';
        state.error = action.error.message || 'Failed to exchange code for token';
      });
    //   .addCase(fetchModel.fulfilled, (state, action) => {
    //     state.modelContent = action.payload;
    //   });
  },
});

export const { setToken } = githubSlice.actions;
export default githubSlice;