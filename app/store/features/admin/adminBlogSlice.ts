import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import api from '@/lib/api';
import { BlogPost } from '@/types';

interface AdminBlogState {
    posts: BlogPost[];
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
}

const initialState: AdminBlogState = {
    posts: [],
    status: 'idle',
    error: null,
};

export const fetchAdminBlogPosts = createAsyncThunk('adminBlog/fetchAll', async (_, { rejectWithValue }) => {
    try {
        const { data } = await api.get('/admin/blog');
        return data;
    } catch (error: any) {
        return rejectWithValue(error.response.data.message);
    }
});

export const createBlogPost = createAsyncThunk('adminBlog/create', async (postData: Partial<BlogPost>, { dispatch }) => {
    const { data } = await api.post('/admin/blog', postData);
    dispatch(fetchAdminBlogPosts());
    return data;
});

export const updateBlogPost = createAsyncThunk('adminBlog/update', async (postData: Partial<BlogPost>, { dispatch }) => {
    const { data } = await api.put(`/admin/blog/${postData._id}`, postData);
    dispatch(fetchAdminBlogPosts());
    return data;
});

export const deleteBlogPost = createAsyncThunk('adminBlog/delete', async (id: string, { rejectWithValue }) => {
    try {
        await api.delete(`/admin/blog/${id}`);
        return id;
    } catch (error: any) {
        return rejectWithValue(error.response.data.message);
    }
});

const adminBlogSlice = createSlice({
    name: 'adminBlog',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchAdminBlogPosts.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchAdminBlogPosts.fulfilled, (state, action: PayloadAction<BlogPost[]>) => {
                state.status = 'succeeded';
                state.posts = action.payload;
            })
            .addCase(fetchAdminBlogPosts.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload as string;
            })
            .addCase(deleteBlogPost.fulfilled, (state, action: PayloadAction<string>) => {
                state.posts = state.posts.filter(post => post._id !== action.payload);
            });
    },
});

export default adminBlogSlice.reducer;