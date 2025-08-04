import { createSlice , createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';



export const exchangeCodeForToken = createAsyncThunk(
    'github/exchangeCode',
    async (code) => {
      const res = await axios.post(
        'https://github.com/login/oauth/access_token',
        {
          client_id: clientId,
          client_secret: clientSecret,
          code,
        },
        {
          headers: { Accept: 'application/json' },
        }
      );
      return res.data.access_token;
    }
  );
  
  export const fetchModel = createAsyncThunk(
    'github/fetchModel',
    async ({ token, owner, repo, path }) => {
      const res = await axios.get(`https://api.github.com/repos/${owner}/${repo}/contents/${path}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return Buffer.from(res.data.content, 'base64').toString('utf-8');
    }
  );
  
  export const pushModel = createAsyncThunk(
    'github/pushModel',
    async ({ token, owner, repo, path, content, message }) => {
      const encoded = Buffer.from(content).toString('base64');
      await axios.put(
        `https://api.github.com/repos/${owner}/${repo}/contents/${path}`,
        {
          message,
          content: encoded,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return path;
    }
  );
  
const githubSlice = createSlice({
    name: 'github',
    initialState: {
      token: null,
      modelContent: '',
      status: 'idle',
    },
    reducers: {
      setToken(state, action) {
        state.token = action.payload;
      },
    },
    extraReducers: (builder) => {
      builder
        .addCase(exchangeCodeForToken.fulfilled, (state, action) => {
          state.token = action.payload;
        })
        .addCase(fetchModel.fulfilled, (state, action) => {
          state.modelContent = action.payload;
        });
    },
  });