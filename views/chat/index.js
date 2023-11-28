const token = localStorage.getItem('token');
const baseUrl = 'http://localhost:3000';

document.getElementById('send').addEventListener('click', async () => {
    try {
        const message = document.getElementById('msg').value;
        console.log('Message:', message);
        const response = await axios.post(`${baseUrl}/message/sendmessage`, {message}, {headers: {"Authorization" : token}});
        console.log(response.data);
       // showMessageOnScreen(response.data);
    } catch (err) {
       console.log(err.response.data);
    };
});

window.addEventListener('DOMContentLoaded', async () => {
    try {
        const response = await axios.get(`${baseUrl}/message/getmessage`, { headers: { "Authorization": token } });
        const messages = response.data.message;

        messages.forEach(msg => {
            showMessageOnScreen(msg);
        });
    } catch (err) {
        console.log('Error while fetching the data', err);
    }
});

function showMessageOnScreen(message) {
    let parentEle = document.getElementById('chat');
    let newMessage = document.createElement('li');
    newMessage.id = 'message';
    newMessage.innerHTML = `${message.name}: ${message.message}`; // Adjust the property names

    parentEle.appendChild(newMessage);
}
