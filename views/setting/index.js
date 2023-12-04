const baseUrl = 'http://localhost:3000';
const token = localStorage.getItem('token');

document.addEventListener('DOMContentLoaded', () => {
    getAllUsers();
})

// get all users
function getAllUsers() {
    const groupId = localStorage.getItem('currGroup');
    axios.get(`${baseUrl}/user/getallusers/${groupId}`, { headers: { "Authorization": token } })
        .then((response) => {
            const users = response.data.user;
            console.log(users);
            users.forEach(user => {
            showUsers(user);
        });
        })
        .catch(err => console.log('err at get all users', err))
}

function parseJwt (token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
}

function showUsers(user) {
    const groupId = localStorage.getItem('currGroup');
    const regUser = document.getElementById('usersReg');

    const li = document.createElement('li');
    li.id = user.id;
    li.className = user.email;
    li.textContent = user.name;
    li.style.padding='5px'

    axios.get(`${baseUrl}/group/isgroupmember/${groupId}/${user.id}`, { headers: { "Authorization": token } })
        .then((response) => {
            const isGroupMember = response.data.userGroup;
            console.log(isGroupMember);

        
            if (!isGroupMember) {
                const addBtn = document.createElement('button');
                addBtn.innerText = 'Add';
                addBtn.id = user.email;
                addBtn.style.backgroundColor=' rgb(7, 94, 84)';
                addBtn.classList = 'btn btn-primary btn-sm m-2 adduserbtnnew';
                addBtn.addEventListener('click', () => {
                    const email = document.getElementById(`${user.email}`).id;
                    const groupId = localStorage.getItem('currGroup');
                    console.log(groupId);
                    axios.post(`${baseUrl}/group/addtogroup/${groupId}`, { email }, { headers: { "Authorization": token } })
                    .then((res) => {
                        console.log('User Added to Group')
                        location.reload();
                    })
                    .catch(error => {
                        alert(error.response.data.message)
                    });
                });
                li.appendChild(addBtn);
            } else {
                const removeBtn = document.createElement('button');
                const decodeUser = parseJwt(token);
                //console.log('token',decodeUser);

                if (decodeUser.userId == user.id) {
                   // console.log('userIDfromtoken',decodeUser.userId);
                    removeBtn.innerText = 'Exit Group';
                } else {
                    removeBtn.innerText = 'Remove';
                }
                removeBtn.id = user.email;
                removeBtn.classList = 'btn btn-danger btn-sm m-2 removeuserbtn';
                removeBtn.addEventListener('click', () => {
                    const email = user.email;
                    const groupId = localStorage.getItem('currGroup');

                    console.log('Removing user:', email);

                    axios.post(`${baseUrl}/group/removeuser/${groupId}`, { email }, { headers: { "Authorization": token } })
                        .then((res) => {
                            console.log('User Removed from Group');
                            location.reload();
                        })
                        .catch(error => {
                            alert(error.response.data.message);
                        });
                });
                li.appendChild(removeBtn);

            }
        })
        axios.get(`${baseUrl}/group/getadmins?groupId=${groupId}&userId=${user.id}`, { headers: { "Authorization": token } })
        .then((response) => {
            const admins = response.data.admins;
            const userGroup = response.data.userGroup;

            const isAdmin = admins.some(admin => admin.userId === user.id);
            
            const makeAdmin = document.createElement('button');
            makeAdmin.classList = 'btn btn-sm border border-info m-2';
            makeAdmin.style.backgroundColor=' rgb(7, 94, 84)';
            makeAdmin.style.color = 'white';
            if (!isAdmin && userGroup != null) {
                makeAdmin.innerText = 'Make Admin';
                makeAdmin.addEventListener('click', () => {
                    const email = user.email;
                    const groupId = localStorage.getItem('currGroup');
                    console.log(email,groupId);

                    axios.post(`${baseUrl}/group/makeadmin/${groupId}`, { email }, { headers: { "Authorization": token } })
                        .then((res) => {
                            console.log('You are admin now');
                            location.reload();
                        })
                        .catch(error => {
                            alert(error.response.data.message)
                        })
                })
                li.appendChild(makeAdmin);
            }
            else if (isAdmin) {
                makeAdmin.innerText = 'Remove Admin';
                makeAdmin.style.backgroundColor=' #d9534f';
                makeAdmin.style.color = 'white';
                makeAdmin.addEventListener('click', () => {
                    const email = user.email;
                    console.log('admin to be removed',email);
                    const groupId = localStorage.getItem('currGroup');
                    console.log(groupId, user.id)
                    axios.post(`${baseUrl}/group/removeadmin?groupId=${groupId}&userId=${user.id}`, { email }, { headers: { "Authorization": token } })
                        .then((res) => {
                            console.log('Admin removed');
                            location.reload();
                        })
                        .catch(error => {
                            alert(error.response.data.message)
                        })
                })
                li.appendChild(makeAdmin);
            };
        });
        regUser.appendChild(li);
};


    
 

 