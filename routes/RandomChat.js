// backend.js
const axios = require("axios");
const io = require("../index");
const router = require("express").Router();

const usersListId = new Set(); // Store user IDs that are waiting to be matched
let matchedPairs = []; // Store matched user pairs
const usersSocket = {}; // Store sockets for users

// Function to match users
const findMatch = async (userId) => {
    const usersArray = Array.from(usersListId);
    for (let otherUserId of usersArray) {
        if (otherUserId !== userId) {
            let room = `${Date.now()}_${Math.random()}`; // Unique room identifier
            usersListId.delete(userId);
            usersListId.delete(otherUserId);

            // Fetch a random topic (commented out in your original code)
            let randomTopic;
            try {
                const response = await axios.post("https://germany-chat.onrender.com/api/topics/getRandomTopic");
                if(response.data.status){
                    randomTopic = response.data.randomTopic;
                }
                
            } catch (error) {
                console.error("Error fetching random topic:", error);
                randomTopic = {title:null}; // Default topic
            }

            matchedPairs.push([userId, otherUserId, room, randomTopic]);

            // Join both users to the room
            const socket1 = usersSocket[userId];
            const socket2 = usersSocket[otherUserId];

            if (socket1) {
                socket1.join(room);  
                console.log("Socket 1 joined room ########## " + room);
            }
            if (socket2) {
                socket2.join(room);  
                console.log("Socket 2 joined room ########## " + room);
            }

            return { matchedUser: otherUserId, randomTopic:randomTopic, room:room };
        }
    }
    return null; // No match found
};

const randomChatNamespace = io.of('/random_chat');

// Listen to connections in the /random_chat namespace
randomChatNamespace.on('connection', (socket) => {
    socket.on("joinSocket", (user_id) => {
        if (usersSocket[user_id]) {
            console.log("User socket is already here");
            return;
        } else {
            usersSocket[user_id] = socket;
            console.log("User joined:", user_id,typeof(socket));
        }
    });

    //handel user window close

    socket.on("socketLeave", (user_id) => {
        delete usersSocket[user_id];
        console.log("User left:", user_id);
    });

    // Handle receiving a message from a user
    socket.on('sendMessage', ({ roomId, message }) => {
        console.log("Message received on backend:", message);
        randomChatNamespace.to(roomId).emit('receiveMessage', { message });
    });

    // Handle user disconnection
    socket.on('disconnect', (roomId) => {
        // console.log('A user disconnected from /random_chat:', socket.id);
        // Find the user by socket and remove
        for (let userId in usersSocket) {
            if (usersSocket[userId].id === socket.id) {
                delete usersSocket[userId];
                usersListId.delete(userId); // Remove user from waiting list if they disconnect
                break;
            }
        }
       
        
    });

    socket.on("userDisconnectFromChat",roomId=>{
             if(roomId){
                randomChatNamespace.to(roomId).emit("chat_end");
                matchedPairs = matchedPairs.filter(pair => !pair.includes(String(roomId)));
            }
    })
});

// POST request handler for random chat
router.post("/chat_random", async (req, res) => {
    const { user_id } = req.body;
    usersListId.add(user_id);

    let isAlreadyMatched = false;
    let matchedUser, topic, room;

    matchedPairs.forEach(pair => {
        if (pair.includes(user_id)) {
            matchedUser = pair.find(id => id !== user_id);
            room = pair[2];
            topic = pair[3];
            isAlreadyMatched = true;

            const socket1 = usersSocket[user_id];
            const socket2 = usersSocket[matchedUser];
            if (socket1) {
                console.log(room," rooooom")
                socket1.join(room);
            }

            if(socket2){
                console.log(room," rooooom")
                socket2.join(room);
            }

            usersListId.delete(user_id);
        }
    });

    if (isAlreadyMatched) {
        return res.status(200).json({ status: true, matchedUser, topic:topic||{title:null}, room });
    }

    const userDidMatchNow = await findMatch(user_id);

    if (userDidMatchNow) {
        const { matchedUser, randomTopic, room } = userDidMatchNow;
        return res.status(200).json({ status: true, matchedUser, topic: randomTopic||{title:null}, room });
    } else {
        return res.status(200).json({ status: false, msg: "Waiting for a match" });
    }
});

router.post("/leave", async (req, res) => {
    try {
        const { user_id, roomId } = req.body;
        console.log("User leaving room:", roomId);
        randomChatNamespace.to(roomId).emit("chat_end");
        matchedPairs = matchedPairs.filter(pair => !pair.includes(String(user_id)));
        res.json({ status: true, msg: "User left the room" });
    } catch (err) {
        console.error(err);
        res.json({ status: false, msg: "Server error while trying to remove closed user ID pairs" });
    }
});

module.exports = router;
