async function logIn(event){
    try {
        event.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    const user = {
        email: email,
        password: password
    }

    const response = await axios.post('http://localhost:3000/user/login',user);
    console.log(response.data.message);
    localStorage.setItem('token', response.data.token)
    alert('User Logged in Successfully');

    } catch (error){
        console.log(error.response.data);
        showError(error);
    };
};

function showError(error) {
const errorEle = document.getElementById('error');
errorEle.innerHTML = error.response.data.message;
};