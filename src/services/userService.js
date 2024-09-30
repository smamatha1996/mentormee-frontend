import { getUser, updateUser as updateUserService, searchUsers as searchUsersDB } from '../utils/db';

export const fetchUser = async (emailOrUsername) => {
    try {
        const user = await getUser(emailOrUsername);
        return user;
    } catch (error) {
        throw new Error('Error fetching user: ' + error.message);
    }
};

export const updateProfile = async (email, profileData) => {
    try {
        const updatedUser = await updateUserService(email, profileData);
        return updatedUser;
    } catch (error) {
        throw new Error('Error updating profile: ' + error.message);
    }
};

export const searchUsers = async (query) => {
    try {
        const users = await searchUsersDB(query);
        return users;
    } catch (error) {
        throw new Error('Error searching users: ' + error.message);
    }
};

export const sendFriendRequest = async (fromUserEmail, toUserEmail) => {
    try {
        const fromUser = await getUser(fromUserEmail);
        const toUser = await getUser(toUserEmail);

        if (fromUser.friends && fromUser.friends.includes(toUserEmail)) {
            return `You are already friends with ${toUser.username}`;
        }

        if (toUser.friendRequests && toUser.friendRequests.some(request => request.from === fromUserEmail)) {
            return `Friend request already sent to ${toUser.username}`;
        }

        const updatedToUser = {
            ...toUser,
            friendRequests: [...(toUser.friendRequests || []), { from: fromUserEmail, status: 'pending' }]
        };

        await updateUserService(toUserEmail, updatedToUser);

        return `Friend request sent to ${toUser.username}`;
    } catch (error) {
        throw new Error('Error sending friend request: ' + error.message);
    }
};

export const sendFollowRequest = async (fromUserEmail, toUserEmail) => {
    try {
        const fromUser = await getUser(fromUserEmail);
        const toUser = await getUser(toUserEmail);
        if (toUser.followers && toUser.followers.includes(fromUserEmail)) {
            return `You are already following ${toUser.username}`;
        }

        const updatedToUser = {
            ...toUser,
            followRequests: [...(toUser.followRequests || []), { from: fromUserEmail, status: 'pending' }]
        };

        const acceptedToUser = {
            ...updatedToUser,
            followers: [...(toUser.followers || []), fromUserEmail],
            followRequests: toUser.followRequests.filter(request => request.from !== fromUserEmail)
        };
        await updateUserService(toUserEmail, acceptedToUser);

        return `You are now following ${toUser.username}`;
    } catch (error) {
        throw new Error('Error sending follow request: ' + error.message);
    }
};

export const fetchFriends = async (email) => {
    try {
        const user = await getUser(email);

        if (!user || !user.friends) {
            return [];
        }

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

export const fetchSuggestedFriends = async (email) => {
    try {
        const user = await getUser(email);
        const allUsers = await searchUsersDB('');
        const suggestedFriends = allUsers.filter((otherUser) => {
            return (
                otherUser.email !== email &&
                (!user.friends || !user.friends.includes(otherUser.email))
            );
        });

        return suggestedFriends;
    } catch (error) {
        throw new Error('Error fetching suggested friends: ' + error.message);
    }
};

export const fetchFriendRequests = async (userEmail) => {
    const user = await getUser(userEmail);
    return user.friendRequests || []; 
};


export const acceptFriendRequest = async (fromUserEmail, toUserEmail) => {
    try {
        const fromUser = await getUser(fromUserEmail);
        const toUser = await getUser(toUserEmail);

        
        if (!toUser.friendRequests || !toUser.friendRequests.some(request => request.from === fromUserEmail)) {
            return `No friend request from ${fromUser.username}`;
        }

       
        const updatedFromUser = {
            ...fromUser,
            friends: [...(fromUser.friends || []), toUserEmail]
        };

        const updatedToUser = {
            ...toUser,
            friends: [...(toUser.friends || []), fromUserEmail],
            friendRequests: toUser.friendRequests.filter(request => request.from !== fromUserEmail)
        };

        await updateUserService(fromUserEmail, updatedFromUser);
        await updateUserService(toUserEmail, updatedToUser);

        return `Friend request accepted. You are now friends with ${fromUser.username}`;
    } catch (error) {
        throw new Error('Error accepting friend request: ' + error.message);
    }
};
export const rejectFriendRequest = async (fromUserEmail, toUserEmail) => {
    try {
        const toUser = await getUser(toUserEmail);
        if (!toUser.friendRequests || !toUser.friendRequests.some(request => request.from === fromUserEmail)) {
            return `No friend request from ${fromUserEmail}`;
        }

       
        const updatedToUser = {
            ...toUser,
            friendRequests: toUser.friendRequests.filter(request => request.from !== fromUserEmail)
        };
        await updateUserService(toUserEmail, updatedToUser);

        return `Friend request from ${fromUserEmail} rejected.`;
    } catch (error) {
        throw new Error('Error rejecting friend request: ' + error.message);
    }
};