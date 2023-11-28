const token = localStorage.getItem('token');
const baseUrl = 'http://localhost:3000';

document.getElementById('send').addEventListener('click', async () => {
    try {
        const message = document.getElementById('message').value;
        const response = await axios.post(`${baseUrl}/message/sendmessage`, {message}, {headers: {"Authorization" : token}});
        console.log(response.data.message);
    } catch (err) {
       console.log(err);
    };
})