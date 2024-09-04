const usersListQueu=new Set()

const usersListActions={
    addUser:(user_id)=>{
        usersListQueu.add(user_id)
    },
    removeUser:(user_id)=>{
        usersListQueu.delete(user_id)
    },
    getUsersLitQueu:()=>{
        return usersListQueu
    }
}

exports.usersListActions=usersListActions;