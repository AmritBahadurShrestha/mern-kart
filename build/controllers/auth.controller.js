"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.profile = exports.logout = exports.changePassword = exports.login = exports.register = void 0;
const user_model_1 = __importDefault(require("../models/user.model"));
const error_handler_middleware_1 = __importDefault(require("../middlewares/error-handler.middleware"));
const bcrypt_utils_1 = require("../utils/bcrypt.utils");
const async_handler_utils_1 = require("../utils/async-handler.utils");
const jwt_utils_1 = require("../utils/jwt.utils");
// Register
exports.register = (0, async_handler_utils_1.asyncHandler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { first_name, last_name, email, password, phone_number } = req.body;
    if (!password) {
        throw new error_handler_middleware_1.default("Password is Required", 400);
    }
    const user = yield user_model_1.default.create({
        first_name,
        last_name,
        email,
        password,
        phone_number,
    });
    const hashedPassword = yield (0, bcrypt_utils_1.hashPassword)(password);
    user.password = hashedPassword;
    yield user.save();
    const _a = user._doc, { password: pass } = _a, newUser = __rest(_a, ["password"]);
    res.status(201).json({
        message: "Registration Successful",
        status: "success",
        success: true,
        data: newUser,
    });
}));
// Login
exports.login = (0, async_handler_utils_1.asyncHandler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { email, password } = req.body;
    if (!email) {
        throw new error_handler_middleware_1.default("Email is Required", 400);
    }
    if (!password) {
        throw new error_handler_middleware_1.default("Password is Required", 400);
    }
    // Check if user exists
    const user = yield user_model_1.default.findOne({ email }).select("+password");
    if (!user) {
        throw new error_handler_middleware_1.default("Invalid Credentials", 400);
    }
    const isPassMatch = yield (0, bcrypt_utils_1.compareHash)(password, (_a = user.password) !== null && _a !== void 0 ? _a : "");
    if (!isPassMatch) {
        throw new error_handler_middleware_1.default("Invalid Credentials", 400);
    }
    //! Generate Auth Token
    const payload = {
        _id: user._id,
        role: user.role,
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
    };
    //! Generate JWT Token
    const access_token = (0, jwt_utils_1.generateToken)(payload);
    const _b = user._doc, { password: pass } = _b, loggedInUser = __rest(_b, ["password"]);
    res
        .cookie("access_token", access_token, {
        secure: process.env.NODE_ENV === "development" ? false : true,
        httpOnly: true,
        maxAge: Number(process.env.COOKIE_EXPIRY) * 24 * 60 * 60 * 1000,
    })
        .status(200)
        .json({
        message: "Login Successful",
        status: "success",
        success: true,
        data: {
            data: loggedInUser,
            access_token,
        },
    });
}));
// Change Password
exports.changePassword = (0, async_handler_utils_1.asyncHandler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { new_password, old_password, email } = req.body;
    if (!new_password) {
        throw new error_handler_middleware_1.default("New Password is Required", 400);
    }
    if (!old_password) {
        throw new error_handler_middleware_1.default("Old Password is Required", 400);
    }
    if (!email) {
        throw new error_handler_middleware_1.default("Email is Required", 400);
    }
    // Check if user exists
    const user = yield user_model_1.default.findOne({ email }).select("+password");
    if (!user) {
        throw new error_handler_middleware_1.default("Something Went Wrong", 400);
    }
    const isPassMatched = (0, bcrypt_utils_1.compareHash)(old_password, user.password);
    if (!isPassMatched) {
        throw new error_handler_middleware_1.default("Password Does Not Match.", 400);
    }
    user.password = yield (0, bcrypt_utils_1.hashPassword)(new_password);
    yield user.save();
    res.status(200).json({
        message: "Password Updated Successfully",
        status: "success",
        success: true,
        data: user,
    });
}));
// LogOut
exports.logout = (0, async_handler_utils_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.clearCookie("access_token", {
        secure: process.env.NODE_ENV === 'development' ? false : true,
        httpOnly: true,
        sameSite: 'none'
    })
        .status(200).json({
        message: "Logout Successfully",
        status: "success",
        success: true,
        data: null
    });
}));
// Check
exports.profile = (0, async_handler_utils_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.user._id;
    const user = yield user_model_1.default.findById(userId);
    if (!user) {
        throw new error_handler_middleware_1.default('Profile Found', 400);
    }
    res.status(200).json({
        message: "Profile Fetched",
        status: "success",
        success: true,
        data: user
    });
}));
