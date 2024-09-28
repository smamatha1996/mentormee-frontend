import { registerUser as registerUserService, loginUser as loginService, getUser, updateUser as updateUserService } from '../utils/db';

// Signup a user using IndexedDB
export const signupUser = async (userData) => {
    try {
        const user = await registerUserService(userData);
        return user;
    } catch (error) {
        throw new Error('Error signing up user: ' + error.message);
    }
};

// Login a user using IndexedDB
export const loginUser = async ({ input, password }) => {
    try {
        const { user, token } = await loginService({ input, password });
        return { user, token };
    } catch (error) {
        throw new Error('Error logging in user: ' + error.message);
    }
};

// Fetch user data by email or username
export const fetchUser = async (emailOrUsername) => {
    try {
        const user = await getUser(emailOrUsername);
        return user;
    } catch (error) {
        throw new Error('Error fetching user: ' + error.message);
    }
};

// Update user profile in IndexedDB
export const updateProfile = async (email, profileData) => {
    try {
        const updatedUser = await updateUserService(email, profileData);
        return updatedUser;
    } catch (error) {
        throw new Error('Error updating profile: ' + error.message);
    }
};