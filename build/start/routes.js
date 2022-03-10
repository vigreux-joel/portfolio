"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Route_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Core/Route"));
Route_1.default.group(() => {
    Route_1.default
        .get('/', 'HomeController.index')
        .as('home');
})
    .as('web');
Route_1.default.group(() => {
    Route_1.default
        .get('/login', 'UsersController.index')
        .as('users.login');
}).prefix('/api')
    .as('api');
//# sourceMappingURL=routes.js.map