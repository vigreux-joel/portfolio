"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class HomeController {
    async index({ view }) {
        return await view.render('home', {});
    }
}
exports.default = HomeController;
//# sourceMappingURL=HomeController.js.map