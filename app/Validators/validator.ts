import { schema, CustomMessages } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class validator {
  constructor(protected ctx: HttpContextContract) {}


  public schema = schema.create({
    first_name:schema.string(),
    last_name:schema.string.optional(),
    email:schema.string(),
    department:schema.string(),
    phone:schema.string(),
    password:schema.string(),
    // confirm_password:schema.string(),
    admin_status:schema.number()
  })

  public messages: CustomMessages = {
    required:'This field is required'
  }
}
