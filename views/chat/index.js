const token = localStorage.getItem('token');
const baseUrl = 'http://localhost:3000';

document.getElementById('send').addEventListener('click', async () => {
    try {
        const message = document.getElementById('msg').value;
        const groupId = localStorage.getItem('currGroup')
        console.log(groupId);
        console.log('Message:', message);
        const response = await axios.post(`${baseUrl}/message/sendmessage/${groupId}`, { message }, { headers: { "Authorization": token } });
        console.log(response.data);
        // showMessageOnScreen(response.data);
    } catch (err) {
        console.log(err.response.data);
    }
});

window.addEventListener('DOMContentLoaded', async () => {
    getMessages(); // Call fetchNewMessages on page load
    getGroups();
});

function parseJwt (token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
}

async function getMessages(){
    try {
        const storedMessages = localStorage.getItem('messages');
        const decodedToken = parseJwt(token);
        const lastRetrievedTimestamp = storedMessages ? JSON.parse(storedMessages)[0]?.createdAt : 0;
        console.log(decodedToken.userId);
        const userId = decodedToken.userId;
        const groupId = localStorage.getItem('currGroup');
        
        const response = await axios.get(`${baseUrl}/message/getmessage`, {
            headers: {
                "Authorization": token,
                "Last-Retrieved-Timestamp": lastRetrievedTimestamp,
            },
            params: { id: userId,groupId  },
        });
        
        const newMessages = response.data.message || [];
        const updatedMessages = [
            ...newMessages.filter(msg => msg.createdAt), // Filter out messages without createdAt property
            ...(storedMessages ? JSON.parse(storedMessages).slice(0, 9) : [])
        ];

        localStorage.setItem('messages', JSON.stringify(updatedMessages));
        document.getElementById('chats').innerHTML = '';

        showMessageOnScreen(updatedMessages);

    } catch (err) {
        console.log('Error while fetching the data', err);
    } finally {
        await new Promise(resolve => setTimeout(resolve, 1000));
        getMessages();
    }
}


function showMessageOnScreen(messages) {
    const parentEle = document.getElementById('chats');
    parentEle.innerHTML = '';

    messages.forEach(msg => {
        const newMessage = document.createElement('li');
        newMessage.id = 'message';
        newMessage.innerHTML = `${msg.name}: ${msg.message}`;
        newMessage.style.color = 'black';
        parentEle.appendChild(newMessage);
    });
}

document.getElementById('createGroupbtn').addEventListener('click', async () => {
    try {
        const groupName = document.getElementById('groupname').value;
        console.log(groupName);
        
        const decodedToken = parseJwt(token);
        const id = decodedToken.userId;
        console.log('userid:', id);

        const response = await axios.post(
            `${baseUrl}/group/creategroup/${id}`,
            { groupName },
            { headers: { "Authorization": token } }
        );

        console.log(response.data);
        getGroups();
    } catch (err) {
        console.log(err);
    }
});


async function getGroups() {
    try {
        const decodedToken = parseJwt(token);
        const id = decodedToken.userId;
        const response = await axios.get(`${baseUrl}/group/getgroups/${id}`, {
            headers: { "Authorization": token },
        });

        const groups = response.data.groups;
        displayGroupsOnScreen(groups);
    } catch (err) {
        console.log('Error while fetching groups', err);
    };
};

function displayGroupsOnScreen(groups) {
    const parentEle = document.getElementById('listOfGroups');
    parentEle.innerHTML = '';

    groups.forEach(group => {
        const newGroup = document.createElement('li');
        const groupContainer = document.createElement('div'); // Container for the group name and the box
        const groupName = document.createElement('span'); // Element for the group name
        
        newGroup.style.listStyleType = 'none'; 
        
        newGroup.id = 'group';
        newGroup.style.paddingTop='20px'
        groupName.innerHTML = `${group.name}`;
        groupName.id = group.id;
        groupName.className = group.name;
        groupName.style.border = '1px solid #000'; // Border around the group name
        groupName.style.borderRadius = '10px'
        groupName.style.backgroundColor='#233142'
        groupName.style.padding = '7px'; // Padding inside the border
        groupName.style.cursor = 'pointer';

        // Inside the click event listener for groupName
    groupName.addEventListener('click', async () => {
    const groupId = groupName.id;
    localStorage.setItem('currGroup', groupId);
    console.log('Clicked on group with groupId:', groupId);
    document.getElementById('chats').innerHTML = '';
    await getMessages();
});

        groupContainer.appendChild(groupName);
        newGroup.appendChild(groupContainer);

        parentEle.appendChild(newGroup);
    });
}


