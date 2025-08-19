"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AllUsersAdmins = exports.onlyUser = exports.allAdmins = void 0;
const enum_types_1 = require("./enum.types");
exports.allAdmins = [enum_types_1.Role.ADMIN, enum_types_1.Role.SUPER_ADMIN];
exports.onlyUser = [enum_types_1.Role.USER];
exports.AllUsersAdmins = [...exports.allAdmins, ...exports.onlyUser];
