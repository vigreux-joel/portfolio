import { BaseMailer, MessageContract } from '@ioc:Adonis/Addons/Mail'
import View from '@ioc:Adonis/Core/View'
import mjml from 'mjml'

export default class ReceivedEmail extends BaseMailer {
  public html = View.render('emails/received', {
    email: this.email
  })

  constructor(private email: object) {
    super();
  }

  public prepare(message: MessageContract) {
    this.html.then((vue) => {
      message
        .subject('Votre a bien été recu!')
        .from('contact@vigreux-joel.fr', 'Vigreux Joël - Développeur web')
        .to('vigreux.joel@hotmail.com')
        .html(mjml(vue).html)
    })
  }
}
