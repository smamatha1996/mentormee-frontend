import { openDB } from 'idb';
import { v4 as uuidv4 } from 'uuid';

const DB_NAME = 'MentorMeeDB';
const USER_STORE = 'users';
const POST_STORE = 'posts';
const COMMENT_STORE = 'comments';

// Initialize the database
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

// User Registration
export const registerUser = async (user) => {
    const db = await initDB();

    // Check if user already exists by email
    const existingUserByEmail = await db.get(USER_STORE, user.email);
    if (existingUserByEmail) {
        throw new Error('User already exists with this email');
    }

    // Check if username is taken
    const tx = db.transaction(USER_STORE, 'readonly');
    const store = tx.objectStore(USER_STORE);
    const users = await store.getAll();
    const existingUserByUsername = users.find((u) => u.username === user.username);

    if (existingUserByUsername) {
        throw new Error('User already exists with this username');
    }

    // Register new user
    const newUser = {
        ...user,
        id: uuidv4(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    };

    await db.put(USER_STORE, newUser);
    return newUser;
};

// User Login
export const loginUser = async ({ input, password }) => {
    const db = await initDB();
    let user;

    // Check if input is an email or username
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (emailRegex.test(input)) {
        // Input is an email
        user = await db.get(USER_STORE, input);
        if (!user) {
            throw new Error('No user found with this email');
        }
    } else {
        // Input is a username
        const tx = db.transaction(USER_STORE, 'readonly');
        const store = tx.objectStore(USER_STORE);
        const allUsers = await store.getAll();
        user = allUsers.find((u) => u.username === input);
        if (!user) {
            throw new Error('No user found with this username');
        }
    }

    // Check if password is correct
    if (user.password !== password) {
        throw new Error('Invalid credentials');
    }

    // Generate a token and store it in localStorage
    const token = `${user.email}-${uuidv4()}`;
    localStorage.setItem('mentorMeeToken', token);

    return { user, token };
};

// Get the logged-in user by email
export const getUser = async (email) => {
    const db = await initDB();
    return await db.get(USER_STORE, email);
};

// Update user profile
export const updateUser = async (email, updatedUserData) => {
    const db = await initDB();
    const tx = db.transaction(USER_STORE, 'readwrite');
    const store = tx.objectStore(USER_STORE);

    const user = await store.get(email);

    if (!user) {
        throw new Error('User not found');
    }

    const updatedUser = {
        ...user,
        ...updatedUserData,
        updatedAt: new Date().toISOString(),
    };

    await store.put(updatedUser);
    await tx.done;
    return updatedUser;
};

// Logout User
export const logoutUser = () => {
    localStorage.removeItem('mentorMeeToken');
};

// Post-related functions

// Add a post with an author
export const addPost = async (content, author) => {
    const db = await initDB();
    const tx = db.transaction(POST_STORE, 'readwrite');
    const store = tx.objectStore(POST_STORE);

    const post = {
        id: uuidv4(), // Ensure a unique ID is created
        content: content,  // Store content as a string
        author: author,    // Store author as a string
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    };

    await store.add(post);
    await tx.done;

    return post;
};

// Get all posts
export const getPosts = async () => {
    const db = await initDB();
    const tx = db.transaction(POST_STORE, 'readonly');
    const store = tx.objectStore(POST_STORE);
    const posts = await store.getAll();
    await tx.done;
    return posts;
};

// Edit a post with updated content and author
export const editPost = async (postId, updatedContent, author) => {
    const db = await initDB();
    const tx = db.transaction(POST_STORE, 'readwrite');
    const store = tx.objectStore(POST_STORE);

    const post = await store.get(postId);
    if (post) {
        post.content = updatedContent;
        post.author = author;
        post.updatedAt = new Date().toISOString();
        await store.put(post);
    }
    await tx.done;
    return post;
};

// Delete a post by ID and remove associated comments
export const removePost = async (postId) => {
    const db = await initDB();
    const tx = db.transaction([POST_STORE, COMMENT_STORE], 'readwrite');

    // Delete the post
    await tx.objectStore(POST_STORE).delete(postId);

    // Delete associated comments
    const commentStore = tx.objectStore(COMMENT_STORE);
    const comments = await commentStore.getAll();
    comments.forEach(async (comment) => {
        if (comment.postId === postId) {
            await commentStore.delete(comment.id);
        }
    });

    await tx.done;
};

// Comment-related functions

// Add a comment to a post with an author
export const addComment = async (postId, content, author) => {
    const db = await initDB();
    const tx = db.transaction(COMMENT_STORE, 'readwrite');
    const store = tx.objectStore(COMMENT_STORE);

    const comment = {
        id: uuidv4(),
        postId: postId,
        content: content,  // Correctly set content as a string
        author: author,    // Correctly set author as a string
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    };

    await store.add(comment);
    await tx.done;

    return comment;
};

// Get comments for a specific post
export const getComments = async (postId) => {
    const db = await initDB();
    const tx = db.transaction(COMMENT_STORE, 'readonly');
    const store = tx.objectStore(COMMENT_STORE);
    const comments = await store.getAll();
    await tx.done;
    return comments.filter((comment) => comment.postId === postId);
};

// Function to edit a comment in the IndexedDB
export const editComment = async (id, content, author, postId) => {
    const db = await initDB();
    const tx = db.transaction(COMMENT_STORE, 'readwrite');
    const store = tx.objectStore(COMMENT_STORE);

    // Ensure the id is used as the key to get the specific comment
    const comment = await store.get(id);

    if (comment && comment.postId === postId) {  // Check that comment belongs to the postId
        comment.content = content;
        comment.author = author;
        comment.updatedAt = new Date().toISOString(); // Update the updatedAt field
        await store.put(comment); // Save the updated comment back to IndexedDB
    } else {
        throw new Error(`No comment found with ID: ${id} and postId: ${postId}`);
    }

    await tx.done;
    return comment;
};

// Delete a comment by ID
export const removeComment = async (commentId) => {
    const db = await initDB();
    const tx = db.transaction(COMMENT_STORE, 'readwrite');
    await tx.objectStore(COMMENT_STORE).delete(commentId);
    await tx.done;
};

// Delete all comments by postId
export const removeCommentsByPostId = async (postId) => {
    const db = await initDB();
    const tx = db.transaction(COMMENT_STORE, 'readwrite');
    const store = tx.objectStore(COMMENT_STORE);

    // Get all comments
    const comments = await store.getAll();

    // Delete comments associated with the postId
    comments.forEach(async (comment) => {
        if (comment.postId === postId) {
            await store.delete(comment.id);
        }
    });

    await tx.done;
};