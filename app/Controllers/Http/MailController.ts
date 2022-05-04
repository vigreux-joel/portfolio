import ContactEmail from 'App/Mailers/ContactEmail'
import ReceivedEmail from 'App/Mailers/ReceivedEmail'

export default class MailController {
  public async index() {
    let email = {
      name: 'mon nom',
      content: 'rferfrferfefrerfe',
    }

    // await new ContactEmail().send()
    await new ReceivedEmail(email).send()

  }
}
