async function singUp(event) {
    try{
        event.preventDefault();
        const newUser = {
            name: event.target.name.value,
            email: event.target.email.value,
            mobileNumber: event.target.mobileNumber.value,
            password: event.target.password.value
        };
    
        const response = await axios.post('http://localhost:3000/user/signup', newUser);
        if(response.data.status === 201){
            console.log('New User Created');
        };
    } catch (error){
        console.log(err);
    }
} 