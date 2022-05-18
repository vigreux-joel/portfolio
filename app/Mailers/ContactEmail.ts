import { BaseMailer, MessageContract } from '@ioc:Adonis/Addons/Mail'
import View from '@ioc:Adonis/Core/View'
import mjml from 'mjml'

export default class ContactEmail extends BaseMailer {
  public html = View.render('emails/test')


  public prepare(message: MessageContract) {
    this.html.then((vue) => {
      message
        .subject('Welcomme Onboard!')
        .from('contact@vigreux-joel.fr', 'Vigreux Joël - Développeur web')
        .to('vigreux.joel@hotmail.com')
        .html(mjml(vue).html)
    })
  }
}
