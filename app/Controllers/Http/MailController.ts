//import ContactEmail from 'App/Mailers/ContactEmail'
//import ReceivedEmail from 'App/Mailers/ReceivedEmail'
import {HttpContextContract} from "@ioc:Adonis/Core/HttpContext";
import {schema, rules} from "@ioc:Adonis/Core/Validator";

export type Email = {
  email: string
  name: string
  tel: string
  object: string
  content: string
}

export default class MailController {
  public async index({ request }: HttpContextContract) {


    const newPostSchema = schema.create({
      email: schema.string({
        rules.email()
      }),
      // name: schema.string({
      //   rules.minLength(10),
      // }),
      // tel: schema.string.optional({rules.email})
    })

    /**
     * Validate request body against the schema
     */
    const payload = await request.validate({ schema: newPostSchema })

    // let email: Email = {
    //   email: request.body().email,
    //   name: request.body().name,
    //   tel: request.body().tel,
    //   object: request.body().services,
    //   content: request.body().message,
    // }


    console.log(payload)

    return { page: 'home' }
    // await new ContactEmail().send()
    //await new ReceivedEmail(email).send()
  }
}
