export interface IUser {
  roomId: string;
  username: string;
  room: string;
  error?:string
}

const users: IUser[] = [];

export const addUser = (user: IUser) => {
  // Clean data
  let username = user.username.trim().toLowerCase();
  let room = user.room.trim().toLowerCase();
  let roomId = user.roomId;
  //Vaidate
  if (!username || !room) {
    return {
      error: "Username and room are required!",
    };
  }

  //Check for existing user
  const existingUser = users.find((user) => {
    return user.room === room && user.username === username;
  });
  //Validate username
  if (existingUser) {
    return {
      error: "Username is in use!",
    };
  }

  //Store user
  const newUser = {roomId, username,room} 
  users.push(newUser);
  return user;
};

export const removeUser =  (roomId:string) => { 
    const index = users.findIndex((user)=>
        user.roomId === roomId
    )

    if(index !== -1){
      return users.splice(index,1)[0]
    }
    return undefined;
}


export const getUser =   (roomId:string) => { 
    return users.find((user)=> user.roomId === roomId)
}


export const getUsersInRoom = (room:string) => { 
    // room = room.trim().toLowerCase();
    return users.filter((user)=>user.room === room);    
}

