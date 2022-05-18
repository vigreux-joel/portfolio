//import ContactEmail from 'App/Mailers/ContactEmail'
import ReceivedEmail from 'App/Mailers/ReceivedEmail'

export type Email = {
  name: string
  sender: string
  object: string
  content: string
}

export default class MailController {
  public async index() {
    let email: Email = {
      name: 'mon nom',
      sender: 'test@xample.fr',
      object: 'eee',
      content: 'rferfrferfefrerfe',
    }

    // await new ContactEmail().send()
    await new ReceivedEmail(email).send()
  }
}
