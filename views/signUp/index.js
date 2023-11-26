async function signUp(event){
    try{
        event.preventDefault();

        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const mobileNumber = document.getElementById('mobilenumber').value;
        const password = document.getElementById('password').value;
        
        
        const newUser = {
            name: name,
            email:email,
            mobileNumber: mobileNumber,
            password: password
        };
    
        const response = await axios.post('http://localhost:3000/user/signup', newUser);
        console.log(response.data.newUser);
        alert('New User Created Successfully')
    } catch (error){
        console.log(error);
    }
} 