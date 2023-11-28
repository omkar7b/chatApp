const token = localStorage.getItem('token');
const baseUrl = 'http://localhost:3000';


document.getElementById('send').addEventListener('click', async () => {
    try {
        const message = document.getElementById('msg').value;
        console.log('Message:', message);
        const response = await axios.post(`${baseUrl}/message/sendmessage`, {message}, {headers: {"Authorization" : token}});
        //console.log(response.data);
       
       // showMessageOnScreen(response.data);
    } catch (err) {
       console.log(err.response.data);
    };
});

window.addEventListener('DOMContentLoaded', async () => {
    getMessage();
});

function getMessage() {
    const chats = JSON.parse(localStorage.getItem('chats')) || [];
    let chatId;

    if (chats.length > 0) {
        chatId = chats[chats.length - 1].id;
    } else {
        chatId = 0;
    }

    axios.get(`${baseUrl}/message/getmessage/${chatId}`, { headers: { "Authorization": token } })
        .then(response => {
            const messages = response.data.message;
            const allchats = chats.concat(response.data.message);

            const last5chats = allchats.slice(-5).reverse();

            localStorage.setItem('chats', JSON.stringify(allchats));
            document.getElementById('chat').innerHTML = '';
           
            messages.forEach(msg => {
                showMessageOnScreen(msg);
                console.log(msg.message);
                localStorage.setItem('oldMessages', msg);
            });
        })
        .catch(err => {
            console.log('Error while fetching the data', err);
        })
        .finally(() => {
            setTimeout(() => getMessage(), 1000);
        });
}


function showMessageOnScreen(message) {
    let parentEle = document.getElementById('chat');
    let newMessage = document.createElement('li');
    newMessage.classList.add('message');
    newMessage.innerHTML = `${message.name}: ${message.message}`; // Adjust the property names

    parentEle.appendChild(newMessage);
}
