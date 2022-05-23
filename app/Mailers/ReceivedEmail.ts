import { BaseMailer, MessageContract } from '@ioc:Adonis/Addons/Mail'
import View from '@ioc:Adonis/Core/View'
import mjml from 'mjml'
//Imports mail type
import { Email } from 'App/Controllers/Http/MailController'

export default class ReceivedEmail extends BaseMailer {
  //Recovers the view containing the mjml tag using the email object as a parameter
  public html = View.render('emails/received', {
    email: this.email,
  })

  //uses the constructor of the parent class and initializes the email property
  constructor(private email: Email) {
    super()
  }

  /*Method used when initializing an instance, it allows to send the email by defining:
    the subject, the sender, the recipient and the content using MJML,
    and thus to send an email.
    */
  public prepare(message: MessageContract): void {
    this.html.then((vue) => {
      message
        .subject('Accusé de reception')
        .from('contact@vigreux-joel.fr', 'Vigreux Joël - Développeur web')
        .to(this.email.email)
        .html(mjml(vue).html)
    })
  }
}
