"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = require("dotenv");
const connectDb_1 = __importDefault(require("./util/connectDb"));
const error_middleware_1 = require("./middleware/error.middleware");
const cloth_router_1 = __importDefault(require("./router/cloth.router"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
(0, dotenv_1.config)();
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cors_1.default)({
    origin: ["https://virtual-wardrobe-frontend.vercel.app", "http://localhost:5173"],
    credentials: true,
}));
app.use(express_1.default.urlencoded({ extended: false }));
app.use((0, cookie_parser_1.default)());
const PORT = process.env.PORT || 4001;
app.use("/cloth", cloth_router_1.default);
(0, connectDb_1.default)();
app.use(error_middleware_1.ErrorhandlerMiddleware);
app.listen(PORT, () => {
    console.log(`wardrobe service is running on port : ${PORT}`);
});
