"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = __importDefault(require("./routes/auth"));
const cors_1 = __importDefault(require("cors"));
const app = express_1.default();
// import routes
app.use(cors_1.default());
app.use(auth_1.default);
const port = process.env.port || 8000;
app.listen(port, () => {
    console.log(`API is running on port ${port}`);
});
