const token = localStorage.getItem('token');
const baseUrl = 'http://localhost:3000';

const socket = io(baseUrl);
const decodedToken = parseJwt(token);

document.getElementById('send').addEventListener('click', async () => {
    try {
        const message = document.getElementById('msg').value;
        const groupId = localStorage.getItem('currGroup')
        console.log(message);
       if (!message && !document.getElementById('mediaInput').files[0]) {
        return;
        }

    if (document.getElementById('mediaInput').files[0]) {
        const mediaFile = document.getElementById('mediaInput').files[0];
        console.log(mediaFile);
        const mediaType = mediaFile.type;
        const formData = new FormData();
        formData.append('media', mediaFile);
        formData.append('mediaType', mediaType);
        console.log('mediaFile>>>>>', formData)

        await axios.post(`${baseUrl}/message/mediasharing/${groupId}`, formData, {
            headers: { "Authorization": token, "Content-Type": 'multipart/form-data' }
        })
    }
    if (message) {
        const response = await axios.post(`${baseUrl}/message/sendmessage/${groupId}`, { message }, { headers: { "Authorization": token } });
    }
        socket.emit('send-message', {message, name:decodedToken.name})
            document.getElementById('msg').value=' ';
                
    } catch (err) {
        console.log(err.response.data);
    }
});

socket.on('receive-message', message => {
    showMessageOnScreen(message);
})


window.addEventListener('DOMContentLoaded', async () => {
    getMessages(); 
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

async function getMessages() {
    try {
        const storedMessages = localStorage.getItem('messages');
        const decodedToken = parseJwt(token);
        const lastRetrievedTimestamp = storedMessages ? JSON.parse(storedMessages).reverse()[0]?.id : 0;
        console.log(decodedToken.userId);
        const userId = decodedToken.userId;
        const groupId = localStorage.getItem('currGroup');
        console.log('id retrived from localStorage', lastRetrievedTimestamp);

        const response = await axios.get(`${baseUrl}/message/getmessage`, {
            headers: {
                "Authorization": token,
            },
            params: { id: userId, groupId, lastRetrievedTimestamp },
        });

        console.log('API Response:', response.data);
        const newMessages = response.data.messages || [];
        let updatedMessages = storedMessages ? JSON.parse(storedMessages).slice(0, 9) : [];

        updatedMessages = [
            ...newMessages.filter(newMsg => !updatedMessages.some(oldMsg => oldMsg.id === newMsg.id)),
            ...updatedMessages
        ];

        localStorage.setItem('messages', JSON.stringify(updatedMessages));
        document.getElementById('chats').innerHTML = '';

        showMessageOnScreen(updatedMessages);
    } catch (err) {
        console.log('Error while fetching the data', err);
    }
}


function showMessageOnScreen(messages) {
    const parentEle = document.getElementById('chats');
    const decodedToken = parseJwt(token);
    const currentUser = decodedToken.name;

    if (!Array.isArray(messages)) {
        messages = [messages];
    }
    console.log(messages);

    messages.forEach(msg => {
        const messageContainer = document.createElement('div'); 
        messageContainer.style.padding = '1px';
        messageContainer.style.margin = '3px';
        messageContainer.style.borderRadius = '2px';
       

        if (msg.name === currentUser) {
            messageContainer.classList.add('own-message'); 
            messageContainer.style.backgroundColor = '#033D39';
            messageContainer.style.display = 'flex';  
            messageContainer.style.justifyContent = 'flex-end';  
            messageContainer.style.textAlign = 'right'; 
            messageContainer.style.marginLeft = 'auto'; 
            messageContainer.innerHTML = `You : ${msg.message}`;
        } else if(msg.name!== currentUser) {
            messageContainer.classList.add('other-message'); 
            messageContainer.style.backgroundColor = '#033D39';
            messageContainer.innerHTML = `${msg.name} : ${msg.message}`;
        } else {
            mediaContainer.classList.add('other-message');
            mediaContainer.innerHTML = `${message.name} : <img src="${message.mediaUrl}" alt="Media" style="max-width: 100%;"/>`;
        }

       messageContainer.style.width = `${messageContainer.textContent.length * 10}px`;
        

        parentEle.appendChild(messageContainer);
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
        const group = response.data.newGroup
        displayGroupsOnScreen(group);
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

    if (!Array.isArray(groups)) {
        groups = [groups];
    }

    console.log(groups);

    groups.forEach(group => {
        const newGroup = document.createElement('li');
        const groupContainer = document.createElement('div'); 
        const groupName = document.createElement('span'); 

        newGroup.style.listStyleType = 'none';

        newGroup.id = 'group';
        newGroup.style.paddingTop = '20px';
        groupName.innerHTML = `${group.name}`;
        groupName.id = group.id;
        groupName.className = group.name;
        groupName.style.border = '1px solid #000'; 
        groupName.style.borderRadius = '10px';
        groupName.style.backgroundColor = '#233142';
        groupName.style.padding = '7px'; 
        groupName.style.cursor = 'pointer';

        
        groupName.addEventListener('click', async (event) => {
            const clickedGroupName = event.target;
            const groupId = clickedGroupName.id;

            const allGroupNames = parentEle.querySelectorAll('span');
            allGroupNames.forEach(name => {
                name.style.backgroundColor = '';
            });

            clickedGroupName.style.backgroundColor = '#484848';
            localStorage.setItem('currGroup', groupId);
            localStorage.removeItem('messages');
            document.getElementById('chats').innerHTML = '';
            getMessages();
        });

        groupContainer.appendChild(groupName);
        newGroup.appendChild(groupContainer);

        parentEle.appendChild(newGroup);
    });
}




document.getElementById('settings').addEventListener('click', () => {
    const currentGroup = localStorage.getItem('currGroup');

    if (!currentGroup) {
        alert('Please select a group before proceeding.');
    } else {
       
        window.location.href = `../setting/index.html?groupId=${currentGroup}`;
    }
});





