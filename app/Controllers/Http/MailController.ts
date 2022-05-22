//import ContactEmail from 'App/Mailers/ContactEmail'
//import ReceivedEmail from 'App/Mailers/ReceivedEmail'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema, rules } from '@ioc:Adonis/Core/Validator'

export type Email = {
  email: string
  name: string
  tel: string
  object: string
  content: string
}

export default class MailController {
  public async index({ request, response }: HttpContextContract) {
    const newPostSchema = schema.create({
      email: schema.string([rules.required(), rules.email()]),
      name: schema.string([rules.required(), rules.minLength(3)]),
      tel: schema.string.nullableAndOptional([rules.mobile()]),
      service: schema.string([rules.required()]),
      message: schema.string([rules.required()]),
    })

    /**
     * Validate request body against the schema
     */
    let payload
    try {
      payload = await request.validate({ schema: newPostSchema })
    } catch (e) {
      response.status(400)
      console.log(e.message)
      return e.messages
    }


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
