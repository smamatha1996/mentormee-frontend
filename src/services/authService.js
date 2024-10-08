import { registerUser as registerUserService, loginUser as loginService } from '../utils/db';

export const signupUser = async (userData) => {
    try {
        const user = await registerUserService(userData);
        return user;
    } catch (error) {
        throw new Error(`Error signing up user: ${error.message}`);
    }
};

export const loginUser = async ({ input, password }) => {
    try {
        const { user, token } = await loginService({ input, password });
        return { user, token };
    } catch (error) {
        throw new Error(`Error logging in user: ${error.message}`);
    }
};