import { openDB } from 'idb';
import { v4 as uuidv4 } from 'uuid';

const DB_NAME = 'MentorMeeDB';
const USER_STORE = 'users';
const POST_STORE = 'posts';
const COMMENT_STORE = 'comments';

export const initDB = async () => {
    const db = await openDB(DB_NAME, 1, {
        upgrade(db) {
            if (!db.objectStoreNames.contains(USER_STORE)) {
                db.createObjectStore(USER_STORE, { keyPath: 'email' });
            }
            if (!db.objectStoreNames.contains(POST_STORE)) {
                db.createObjectStore(POST_STORE, { keyPath: 'id' });
            }
            if (!db.objectStoreNames.contains(COMMENT_STORE)) {
                db.createObjectStore(COMMENT_STORE, { keyPath: 'id' });
            }
        },
    });
    return db;
};


const checkUserExists = async (db, { email, username }) => {
    const store = db.transaction(USER_STORE, 'readonly').objectStore(USER_STORE);
    const existingUserByEmail = await store.get(email);
    const allUsers = await store.getAll();
    const existingUserByUsername = allUsers.find((u) => u.username === username);

    return { existingUserByEmail, existingUserByUsername };
};


export const registerUser = async (user) => {
    const db = await initDB();
    const { existingUserByEmail, existingUserByUsername } = await checkUserExists(db, user);

    if (existingUserByEmail) throw new Error('User already exists with this email');
    if (existingUserByUsername) throw new Error('User already exists with this username');

    const newUser = {
        ...user,
        id: uuidv4(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    };

    await db.put(USER_STORE, newUser);
    return newUser;
};

export const loginUser = async ({ input, password }) => {
    const db = await initDB();
    const store = db.transaction(USER_STORE, 'readonly').objectStore(USER_STORE);
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    let user;

    if (emailRegex.test(input)) {
        user = await store.get(input);
    } else {
        const allUsers = await store.getAll();
        user = allUsers.find((u) => u.username === input);
    }

    if (!user || user.password !== password) {
        throw new Error('Invalid credentials');
    }

    const token = `${user.email}-${uuidv4()}`;
    localStorage.setItem('mentorMeeToken', token);

    return { user, token };
};

export const getUser = async (email) => {
    const db = await initDB();
    return await db.get(USER_STORE, email);
};

export const updateUser = async (email, updatedUserData) => {
    const db = await initDB();
    const tx = db.transaction(USER_STORE, 'readwrite');
    const store = tx.objectStore(USER_STORE);
    const user = await store.get(email);

    if (!user) throw new Error('User not found');

    const updatedUser = {
        ...user,
        ...updatedUserData,
        updatedAt: new Date().toISOString(),
    };

    await store.put(updatedUser);
    return updatedUser;
};

export const logoutUser = () => {
    localStorage.removeItem('mentorMeeToken');
};

export const addPost = async (content, author) => {
    const db = await initDB();
    const post = {
        id: uuidv4(),
        content,
        author,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    };

    await db.put(POST_STORE, post);
    return post;
};

export const getPosts = async () => {
    const db = await initDB();
    return await db.getAll(POST_STORE);
};

export const editPost = async (postId, updatedContent, author) => {
    const db = await initDB();
    const tx = db.transaction(POST_STORE, 'readwrite');
    const store = tx.objectStore(POST_STORE);
    const post = await store.get(postId);

    if (!post) throw new Error('Post not found');

    post.content = updatedContent;
    post.author = author;
    post.updatedAt = new Date().toISOString();

    await store.put(post);
    return post;
};

export const removePost = async (postId) => {
    const db = await initDB();
    const postTx = db.transaction([POST_STORE, COMMENT_STORE], 'readwrite');
    const postStore = postTx.objectStore(POST_STORE);
    const commentStore = postTx.objectStore(COMMENT_STORE);

    await postStore.delete(postId);

    const comments = await commentStore.getAll();
    const postComments = comments.filter((comment) => comment.postId === postId);

    postComments.forEach(async (comment) => await commentStore.delete(comment.id));
    await postTx.done;
};

export const addComment = async (postId, content, author) => {
    const db = await initDB();
    const comment = {
        id: uuidv4(),
        postId,
        content,
        author,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    };

    await db.put(COMMENT_STORE, comment);
    return comment;
};

export const getComments = async (postId) => {
    const db = await initDB();
    const comments = await db.getAll(COMMENT_STORE);
    return comments.filter((comment) => comment.postId === postId);
};

export const editComment = async (id, content, author, postId) => {
    const db = await initDB();
    const tx = db.transaction(COMMENT_STORE, 'readwrite');
    const store = tx.objectStore(COMMENT_STORE);
    const comment = await store.get(id);

    if (!comment || comment.postId !== postId) throw new Error('Comment not found');

    comment.content = content;
    comment.author = author;
    comment.updatedAt = new Date().toISOString();

    await store.put(comment);
    return comment;
};

export const removeComment = async (commentId) => {
    const db = await initDB();
    await db.delete(COMMENT_STORE, commentId);
};

export const removeCommentsByPostId = async (postId) => {
    const db = await initDB();
    const tx = db.transaction(COMMENT_STORE, 'readwrite');
    const store = tx.objectStore(COMMENT_STORE);

    const comments = await store.getAll();
    const postComments = comments.filter((comment) => comment.postId === postId);

    postComments.forEach(async (comment) => await store.delete(comment.id));
    await tx.done;
};

export const searchUsers = async (query) => {
    const db = await initDB();
    const tx = db.transaction(USER_STORE, 'readonly');
    const store = tx.objectStore(USER_STORE);
    const allUsers = await store.getAll();

    return allUsers.filter((user) =>
        user.username.toLowerCase().includes(query.toLowerCase()) ||
        user.email.toLowerCase().includes(query.toLowerCase())
    );
};