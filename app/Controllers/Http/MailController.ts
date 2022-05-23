import ContactEmail from 'App/Mailers/ContactEmail'
import ReceivedEmail from 'App/Mailers/ReceivedEmail'
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
      return e.messages
    }

    let email: Email = {
      email: payload.email,
      name: payload.name,
      tel: payload.tel,
      object: payload.service,
      content: payload.message.replace(/([^>\r\n]?)(\r\n|\n\r|\r|\n)/g, '<br />'),
    }

    await new ContactEmail(email).send()
    await new ReceivedEmail(email).send()
  }
}
