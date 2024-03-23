import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import validator from "App/Validators/validator";
import service from "App/Service/service";
export default class controller {
  //response state
  protected state = {
    status: false,
    msg: "",
  };
  // method for change state
  protected setState(status:boolean, msg:string) {
    this.state.status = status;
    this.state.msg = msg;
  }
  // method for user registration request
  public async registerUser({ request }: HttpContextContract) {
    const user = await request.validate(validator);
    // const { prop2, ...newObj } = obj;
    if (await service.isUserExist(user.email)) {
      this.setState(false, "user already exist");
      return this.state;
    } else if (await service.isPhoneExist(user.phone)) {
      this.setState(
        false,
        "This phone number is already in use in another registered account."
      );
      return this.state;
    } else {
      const res = await service.registerUser(user);
      if (res.length) {
        this.setState(true, "User registered successfully");
        return this.state;
      } else {
        this.setState(false, "registration failed");
        return this.state;
      }
    }
  }

  // method for login request
  public async login({ request }: HttpContextContract) {
   
    const user = request.all();
    const Exist =
      (await service.isUserExist(user.username)) ||
      (await service.isPhoneExist(user.username));
    if (!Exist) {
      this.setState(false, "User not found");
      return this.state;
    } else {
      const validuser = await service.authenticateUser(
        user.username,
        user.password
      );
      if (validuser) {
        this.setState(true, "valid user");
        const adminStatus = await service.isAdmin(user.username);
        return { ...this.state, adminStatus };
      } else {
        this.setState(false, "invalid user");
        return this.state;
      }
    }
  }

    // method for update user
  public async update({ params, request }: HttpContextContract) {
    const body = request.all();
    const id:number = params.id;
    const {
      newEmail,
      oldEmail,
      first_name,
      last_name,
      newPhone,
      oldPhone,
      password,
      department,
      admin_status,
    } = body;

    if (oldEmail != newEmail && (await service.isUserExist(newEmail))) {
      this.setState(false, "This email is already in use");
      return this.state;
    } else if (oldPhone != newPhone && (await service.isPhoneExist(newPhone))) {
      this.setState(false, "This phone number is already in use");
      return this.state;
    } else {
      const data = {
        first_name: first_name,
        last_name: last_name,
        email: newEmail,
        password: password,
        phone: newPhone,
        department: department,
        admin_status: admin_status,
      };
      const res = await service.updateUser(id, data);
      if (res) {
        this.setState(true, "user updated successfully");
        return this.state;
      } else {
        this.setState(false, "invalid id");
        return this.state;
      }
    }
  }

  // method for delete user
  public async deleteUser({ params }: HttpContextContract) {
    const res = await service.deleteUser(params.id);
    if (res) {
      this.setState(true, "user deleted successfully");
      return this.state;
    } else {
      this.setState(false, "invalid id");
      return this.state;
    }
  }

  //method for deleteMultipleUsers

  public async deleteMultipleUsers({ request }: HttpContextContract) {
    const { ids } = request.all();

    const res = await service.deleteMultiUser(ids);
    if (res) {
      this.setState(true, "users deleted successfully");
      return { ...this.state, count: res };
    } else {
      this.setState(false, "users deletion failed");
      return this.state;
    }
  }

  //method for fetchUsers

  public async fetchUsers({}: HttpContextContract) {
    const res = await service.fetchUsers();
    if (res.length) {
      this.setState(true, "fetching successfully");
      return { state: this.state, data: res };
    } else {
      this.setState(false, "No users found");
      return { state: this.state, data: res };
    }
  }

 //method for fetchuser
 public async fetchUser({params}: HttpContextContract) {
  const res = await service.fetchUser(params.username);
  if (res.length) {
    this.setState(true, "fetching successfully");
    return { state: this.state, data: res };
  } else {
    this.setState(false, "No users found");
    return this.state;
  }
}


  //method for change password

  public async changePassword({ request }: HttpContextContract) {
    const userData = request.all();
    const username: string = userData.username;
    const currentPassword: string = userData.currentPassword;
    const newPassword: string = userData.newPassword;
    const Exist:boolean =
      (await service.isUserExist(username)) ||
      (await service.isPhoneExist(username));
    if(!Exist)
    {
      this.setState(false,"user not exist")
      return this.state
    }
    else if(!(await service.authenticateUser(username,currentPassword)))  
    {
      this.setState(false,"incorrect password")
      return this.state
    }
    else
    {

      const res: boolean = await service.changePassword(username, newPassword);
      if(res)
      {
        this.setState(true,"Password change successfully")
        return this.state
      }
      else
      {
        this.setState(false,"Password not change")
        return this.state
      }
    }
  }

}
