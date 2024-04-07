import { userModel } from '../mongoDB/models/userModel.js'
import { DateTime } from "luxon";

class userManager {

    async getUsers() {

        try {
            const users = await userModel.find();
            return users;

        } catch (error) {
            return [];
        }
    }

    //-------------------------------------------------------------------------

    async getUserByEmail(emailUser) {

        try {

            const user = await userModel.findOne({ email: emailUser });

            return user

        } catch (error) {
            return false
        }
    }

    //-------------------------------------------------------------------------

    async updateUser(idUser, newValue) {

        try {

            const user = await userModel.updateOne({ _id: idUser }, newValue)

            return user

        } catch (error) {
            return false
        }

    }

    //-------------------------------------------------------------------------

    async deletUser(emailUser) {

        try {
            const userFound = await userModel.findOne({ email: emailUser });
            const deletedUser = await userModel.deleteOne({ email: emailUser });

            return userFound

        } catch (error) {
            return false
        }

    }


    async deletUsersForInactivity() {

        const users = await userModel.find();
        const usersForDelet = []

        for (const user of users) {

            let fecha1 = DateTime.fromISO(DateTime.now());
            let fecha2 = DateTime.fromISO(user.last_connection);

            const diferenciaDias = fecha2.diff(fecha1, 'days').toObject().days;

            const redondeo = Math.round(diferenciaDias)

            if (redondeo >= 2) {
                usersForDelet.push(user);
            }

        }

        return usersForDelet

    }


}

export default userManager