import { getUser, updateUser as updateUserService, searchUsers as searchUsersDB } from '../utils/db';

// Fetch user data by email or username
export const fetchUser = async (emailOrUsername) => {
    try {
        const user = await getUser(emailOrUsername);
        return user;
    } catch (error) {
        throw new Error('Error fetching user: ' + error.message);
    }
};

// Update user profile
export const updateProfile = async (email, profileData) => {
    try {
        const updatedUser = await updateUserService(email, profileData);
        return updatedUser;
    } catch (error) {
        throw new Error('Error updating profile: ' + error.message);
    }
};

// Search users by query (username or email)
export const searchUsers = async (query) => {
    try {
        const users = await searchUsersDB(query);
        return users;
    } catch (error) {
        throw new Error('Error searching users: ' + error.message);
    }
};

// Send a friend request and add both users to the friends array once accepted
export const sendFriendRequest = async (fromUserEmail, toUserEmail) => {
    try {
        const fromUser = await getUser(fromUserEmail);
        const toUser = await getUser(toUserEmail);

        // Check if they are already friends
        if (fromUser.friends && fromUser.friends.includes(toUserEmail)) {
            return `You are already friends with ${toUser.username}`;
        }

        // Check if the request already exists
        if (toUser.friendRequests && toUser.friendRequests.some(request => request.from === fromUserEmail)) {
            return `Friend request already sent to ${toUser.username}`;
        }

        // Add the friend request to the recipient's friendRequests list
        const updatedToUser = {
            ...toUser,
            friendRequests: [...(toUser.friendRequests || []), { from: fromUserEmail, status: 'pending' }]
        };

        // Update the recipient user with the new friend request
        await updateUserService(toUserEmail, updatedToUser);

        return `Friend request sent to ${toUser.username}`;
    } catch (error) {
        throw new Error('Error sending friend request: ' + error.message);
    }
};

// Send a follow request and add to the followers array
export const sendFollowRequest = async (fromUserEmail, toUserEmail) => {
    try {
        const fromUser = await getUser(fromUserEmail);
        const toUser = await getUser(toUserEmail);

        // Check if the user is already following
        if (toUser.followers && toUser.followers.includes(fromUserEmail)) {
            return `You are already following ${toUser.username}`;
        }

        // Add the follow request to the recipient's followRequests array (if needed)
        const updatedToUser = {
            ...toUser,
            followRequests: [...(toUser.followRequests || []), { from: fromUserEmail, status: 'pending' }]
        };

        // Automatically add the follower to the recipient's followers array
        const acceptedToUser = {
            ...updatedToUser,
            followers: [...(toUser.followers || []), fromUserEmail],
            // Remove the pending follow request since it's now accepted
            followRequests: toUser.followRequests.filter(request => request.from !== fromUserEmail)
        };

        // Update the recipient user to include the new follower
        await updateUserService(toUserEmail, acceptedToUser);

        return `You are now following ${toUser.username}`;
    } catch (error) {
        throw new Error('Error sending follow request: ' + error.message);
    }
};

// Fetch the list of friends for a given user
export const fetchFriends = async (email) => {
    try {
        const user = await getUser(email);

        if (!user || !user.friends) {
            return [];
        }

        // Fetch details of all friends
        const friends = await Promise.all(
            user.friends.map(async (friendEmail) => {
                const friend = await getUser(friendEmail);
                return friend;
            })
        );

        return friends;
    } catch (error) {
        throw new Error('Error fetching friends: ' + error.message);
    }
};

// Fetch suggested friends for a user
export const fetchSuggestedFriends = async (email) => {
    try {
        const user = await getUser(email);

        // Search for users who are not friends and are not the current user
        const allUsers = await searchUsersDB('');
        const suggestedFriends = allUsers.filter((otherUser) => {
            return (
                otherUser.email !== email &&
                (!user.friends || !user.friends.includes(otherUser.email)) // Exclude current user's friends
            );
        });

        return suggestedFriends;
    } catch (error) {
        throw new Error('Error fetching suggested friends: ' + error.message);
    }
};

// Fetch friend requests for the current user
export const fetchFriendRequests = async (userEmail) => {
    const user = await getUser(userEmail);
    return user.friendRequests || []; // Return the pending friend requests
};

// Accept friend request
export const acceptFriendRequest = async (fromUserEmail, toUserEmail) => {
    try {
        const fromUser = await getUser(fromUserEmail);
        const toUser = await getUser(toUserEmail);

        // Ensure there is a pending friend request
        if (!toUser.friendRequests || !toUser.friendRequests.some(request => request.from === fromUserEmail)) {
            return `No friend request from ${fromUser.username}`;
        }

        // Add both users to each other's friends list
        const updatedFromUser = {
            ...fromUser,
            friends: [...(fromUser.friends || []), toUserEmail]
        };

        const updatedToUser = {
            ...toUser,
            friends: [...(toUser.friends || []), fromUserEmail],
            // Remove the pending friend request after acceptance
            friendRequests: toUser.friendRequests.filter(request => request.from !== fromUserEmail)
        };

        // Update both users
        await updateUserService(fromUserEmail, updatedFromUser);
        await updateUserService(toUserEmail, updatedToUser);

        return `Friend request accepted. You are now friends with ${fromUser.username}`;
    } catch (error) {
        throw new Error('Error accepting friend request: ' + error.message);
    }
};

// Reject friend request
export const rejectFriendRequest = async (fromUserEmail, toUserEmail) => {
    try {
        const toUser = await getUser(toUserEmail);

        // Ensure there is a pending friend request
        if (!toUser.friendRequests || !toUser.friendRequests.some(request => request.from === fromUserEmail)) {
            return `No friend request from ${fromUserEmail}`;
        }

        // Remove the friend request
        const updatedToUser = {
            ...toUser,
            friendRequests: toUser.friendRequests.filter(request => request.from !== fromUserEmail)
        };

        // Update the recipient user
        await updateUserService(toUserEmail, updatedToUser);

        return `Friend request from ${fromUserEmail} rejected.`;
    } catch (error) {
        throw new Error('Error rejecting friend request: ' + error.message);
    }
};