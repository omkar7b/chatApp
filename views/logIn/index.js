async function logIn(event){
    try {
        event.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    const user = {
        email: email,
        password: password
    }

    const response = await axios.post('http://localhost:3000/user/signup',user)

    } catch (error){
        console.log(error);
        showError(error);
    }
} 

function showError(error) {
const errorEle = document.getElementById('error');
errorEle.innerHTML = error.response.data.message;
}