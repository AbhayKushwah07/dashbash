import Database from "@ioc:Adonis/Lucid/Database";

//type declaration for user data
type User = {
    first_name:string,
    last_name?:string,
    email:string,
    department:string,
    phone:string,
    password:string,
    admin_status:number
    id?:number
}

export default class service {
  // check for email existance 
  static async isUserExist(email:string):Promise<boolean> {
    const userCount = await Database.from("emp")
      .where("email", email)
      .count("* as total");
    return userCount[0].total > 0;
  }
// check for phone existance
  static async isPhoneExist(phone:string):Promise<boolean> {
    const phoneCount = await Database.from("emp")
      .where("phone", phone)
      .count("* as total");
    return phoneCount[0].total > 0;
  }
  // check for admin
  static async isAdmin(username:string):Promise<number> {
    const res = await Database.from("emp").select('admin_status').where('email',username).orWhere('phone',username);
    return res[0].admin_status; 
      
  }
// authenticate user 
  static async authenticateUser(username:string, password:string):Promise<boolean> {
    let result = await Database.from("emp")
      .select("password")
      .where("email", username).orWhere('phone',username);
      
    return result[0].password == password;
  }

// create user 

  static async registerUser(data:User):Promise<number[]> {
    let result = await Database.table("emp").insert(data);
   
    return result;
  }

// delete user 
static async deleteUser(id:number):Promise<boolean> {
    let result = await Database.from('emp').delete().where('id',id)
    
    return !!result;
  }

// delete multiple users 
static async deleteMultiUser(ids:number[]):Promise<number|unknown[]> {
  let result:number|unknown[] = await Database.from('emp').delete().whereIn('id',ids)
  return result;
}  
 //update user 
 static async updateUser(id:number,data:User):Promise<boolean> {
    let result = await Database.from('emp').update(data).where('id',id)
    return !!result;
  }

 //fetch all users
 static async fetchUsers():Promise<User[]> {
    let result = await Database.from('emp').select("*")
    return result;
  }
  // fetch specific user
  static async fetchUser(username:string):Promise<User[]> {
    let result = await Database.from('emp').select("*").where('email',username).orWhere("phone",username)
    return result;
  }

  // change password
  static async changePassword(username:string,password:string):Promise<boolean> {
    let result = await Database.from('emp').update('password',password).where('email',username).orWhere('phone',username)
    return !!result;
  }
 
}
