export default class UsersDTO{

    constructor(user){
        this.name= user.name
        this.last_name=user.last_name
        this.email= user.email
        this.role= user.role
    }
}

