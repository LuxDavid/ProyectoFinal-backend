let emailUser=document.getElementById('userForChanges');
let newRoleUser=document.getElementById('role-select');
const searchUser=document.querySelector('#searchUser');
const updateRole=document.querySelector('#updateUser');
const deletUser=document.querySelector('#deletUser');
const deteailInfo=document.getElementById('details-user');


searchUser.addEventListener('click', async ()=>{
    
    const user= await fetch(`/api/user/${emailUser.value}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });

    const resultUser= await user.json();

    const {name, last_name, email, role}=resultUser.user

    const filterData={name, lastName: last_name, email, role}

    for (let key in filterData) {

    const newInfo=document.createElement("p")
    newInfo.className='dataUser'
    newInfo.innerText=`${key} : ${filterData[key]}`

    deteailInfo.append(newInfo);
    }

})


updateRole.addEventListener('click', async ()=>{
 
   const user= await fetch(`/api/user/changeRole/${emailUser.value}/${newRoleUser.value}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
    });

    const resultUser= await user.json();

    if(resultUser.result == true){
        Swal.fire({
        icon:'error',
        title: 'Role its the same, please select other Role',
        position: 'top-end',
        showConfirmButton: false,
        toast: true,
        timer: 1000,
        background:'black',
        color: "white"
    })
    }else{

    Swal.fire({
        icon:'success',
        title: 'Role updated successfully',
        position: 'top-end',
        showConfirmButton: false,
        toast: true,
        timer: 1000,
        background:'blue',
        color: "white"
    })
    }

})


deletUser.addEventListener('click', async ()=>{

    const user= await fetch(`/api/user/${emailUser.value}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        },
    });

    const resultUser= await user.json();

    
    if(resultUser.result == false){
        Swal.fire({
        icon:'error',
        title: 'Error to try to delet user',
        position: 'top-end',
        showConfirmButton: false,
        toast: true,
        timer: 1000,
        background:'black',
        color: "white"
    })
    }else{

    Swal.fire({
        icon:'success',
        title: 'user deleted successfully',
        position: 'top-end',
        showConfirmButton: false,
        toast: true,
        timer: 1000,
        background:'blue',
        color: "white"
    })
    }

})