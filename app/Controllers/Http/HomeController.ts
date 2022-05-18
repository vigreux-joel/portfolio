import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class HomeController {

    async index({view}: HttpContextContract) {
      return  await view.render('home', {
        //greeting: 'Hello'
      })
    }
}
