import Mail from '@ioc:Adonis/Addons/Mail'

export default class MailController {
  public async index() {
    await Mail.send((message) => {
      message
        .from('contact@vigreux-joel.fr', 'Vigreux Joël - Développeur web')
        .to('vigreux.joel@hotmail.com')
        .subject('Welcomme Onboard!')
        .htmlView('emails/test', { name: 'vigreux' })
    })
  }
}
