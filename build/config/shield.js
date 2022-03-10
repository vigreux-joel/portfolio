"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.contentTypeSniffing = exports.hsts = exports.xFrame = exports.dnsPrefetch = exports.csrf = exports.csp = void 0;
const Env_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Core/Env"));
exports.csp = {
    enabled: false,
    directives: {},
    reportOnly: false,
};
exports.csrf = {
    enabled: Env_1.default.get('NODE_ENV') !== 'testing',
    exceptRoutes: [],
    enableXsrfCookie: true,
    methods: ['POST', 'PUT', 'PATCH', 'DELETE'],
};
exports.dnsPrefetch = {
    enabled: true,
    allow: true,
};
exports.xFrame = {
    enabled: true,
    action: 'DENY',
};
exports.hsts = {
    enabled: true,
    maxAge: '180 days',
    includeSubDomains: true,
    preload: false,
};
exports.contentTypeSniffing = {
    enabled: true,
};
//# sourceMappingURL=shield.js.map