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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// import { MongoClient, ServerApiVersion } from 'mongodb';
const promise_1 = __importDefault(require("mysql2/promise"));
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const crypto_1 = __importDefault(require("crypto"));
const multer_1 = __importDefault(require("multer"));
const uuid_1 = require("uuid");
const cors_1 = __importDefault(require("cors"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
const upload = (0, multer_1.default)({ dest: `uploads/` });
const sessions = [];
(() => __awaiter(void 0, void 0, void 0, function* () {
    const connection = yield promise_1.default.createConnection({
        host: process.env.MYSQL_HOST,
        port: 31332,
        database: process.env.MYSQL_DATABASE,
        user: process.env.MYSQL_USER,
        password: process.env.MYSQL_PASSWORD
    });
    app.use((req, res, next) => {
        console.log(`fetch ${req.url}`);
        next();
    });
    /**
     * oauth api
     */
    app.post(`/api/oauth/create`, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        res.setHeader(`Content-type`, `application/json`);
        const { user_id, user_name, user_password } = req.body;
        if (!/^(?=.*[a-z].*)(?=.*[0-9].*)[a-z0-9]+$/.test(user_id) && user_id.length <= 20) {
            res.send({ message: `아이디 형식이 잘못되었습니다. (a-z, 0-9, 20자)` });
            return;
        }
        if (!/^[ㄱ-힣]+$/.test(user_name) && user_name.length <= 10) {
            res.send({ message: `이름 형식이 잘못되었습니다. (ㄱ-힣, 10자)` });
            return;
        }
        if (!/^(.+){8}$/.test(user_password)) {
            res.send({ message: `비밀번호 형식이 잘못되었습니다. (8자 이상)` });
            return;
        }
        const exists = yield connection.query(`select * from users where user_id = ?`, [user_id]);
        if (exists[0].length > 0) {
            res.send({ message: `중복된 아이디입니다.` });
            return;
        }
        const password = crypto_1.default.createHash(`sha512`).update(user_id + user_password).digest(`hex`);
        yield connection.query(`insert into users (node_id, user_id, user_name, user_password, user_created_at) VALUES (default, ?, ?, ?, default);`, [user_id, user_name, password]);
        res.send(JSON.stringify({ status: 200, message: `회원가입이 완료되었습니다.` }));
    }));
    app.post(`/api/oauth/verification`, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        res.setHeader(`Content-type`, `application/json`);
        const { user_id, user_password } = req.body;
        const exists = yield connection.query(`select * from users where user_id = ? and user_password = ?`, [user_id, crypto_1.default.createHash(`sha512`).update(user_id + user_password).digest(`hex`)]);
        if (exists[0].length > 0) {
            const token = (0, uuid_1.v4)();
            const { user_id, user_name } = exists[0][0];
            sessions.push({ token, user_id, user_name });
            res.send({ status: 200, message: `로그인에 성공하였습니다.`, token });
            return;
        }
        res.send({ message: `로그인에 실패하였습니다. 아이디 또는 비밀번호를 확인해주세요.` });
    }));
    app.post(`/api/oauth/token`, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        res.setHeader(`Content-type`, `application/json`);
        const { token } = req.body;
        const exists = sessions.find(e => e.token === token);
        if (exists) {
            res.send(Object.assign({ status: 200, message: `인증에 성공하였습니다.` }, exists));
            return;
        }
        res.send({ message: `토큰이 만료되었습니다.` });
    }));
    /**
     * book api
     */
    app.get(`/api/books`, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        res.setHeader(`Content-type`, `application/json`);
        const books = yield connection.query(`select b.*, u.user_name from books b join users u on b.book_author = u.user_id order by b.node_id desc`);
        res.send(JSON.stringify({ status: 200, books: books[0] }));
    }));
    app.get(`/api/books/:node_id`, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        res.setHeader(`Content-type`, `application/json`);
        const items = yield connection.query(`select i.*, b.book_name, b.book_author, u.user_name from books b left outer join items i on b.node_id = i.target left outer join users u on b.book_author = u.user_id where b.node_id = ?`, [req.params.node_id]);
        const links = yield connection.query(`select l.* from links l join items i on l.target = i.node_id join books b on i.target = b.node_id where b.node_id = ?`, [req.params.node_id]);
        items[0].forEach((item) => item.item_image = `https://port-0-book-backend-1ru12mlw1sms1u.sel5.cloudtype.app/cdn/uploads/${item.item_image}`);
        res.send(JSON.stringify({ status: 200, items: items[0], name: items[0][0].book_name, author: items[0][0].book_author, user_name: items[0][0].user_name, links: links[0] }));
    }));
    app.get(`/api/books/:node_id/save`, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        res.setHeader(`Content-type`, `application/json`);
        setTimeout(() => {
            res.send(JSON.stringify({ status: 200 }));
        }, 100);
    }));
    app.post(`/api/books/:node_id/create`, upload.single(`item_image`), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        res.setHeader(`Content-type`, `application/json`);
        const { item_links, item_type, item_tags, item_title, item_difficulty, item_qrcode, item_author, item_created_at, item_page, item_subcontent, item_content, item_index } = req.body;
        const image_name = `${(0, uuid_1.v4)()}.jpg`;
        if (req.file)
            fs_1.default.renameSync(req.file.path, `uploads/${image_name}`);
        yield connection.query(`insert into items (target, item_image, item_type, item_tags, item_title, item_difficulty, item_qrcode, item_author, item_created_at, item_page, item_subcontent, item_content, item_index) values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, [req.params.node_id, image_name, item_type, item_tags, item_title, Number(item_difficulty), item_qrcode, item_author, item_created_at, Number(item_page), item_subcontent, item_content, item_index]);
        const { last_id } = (yield connection.query(`select last_insert_id() as last_id from items`))[0][0];
        JSON.parse(item_links).forEach((link) => __awaiter(void 0, void 0, void 0, function* () {
            if (link.name && link.content)
                yield connection.query(`insert into links (target, link_bookname, link_content) values (?, ?, ?)`, [last_id, link.name, link.content]);
        }));
        res.send(JSON.stringify({ status: 200 }));
    }));
    app.get(`/api/books/:node_id/:target/remove`, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        res.setHeader(`Content-type`, `application/json`);
        yield connection.query(`delete from items where node_id = ?`, [req.params.target]);
        res.send(JSON.stringify({ status: 200 }));
    }));
    app.get(`/api/books/:node_id/remove`, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        res.setHeader(`Content-type`, `application/json`);
        yield connection.query(`delete from books where node_id = ?`, [req.params.node_id]);
        yield connection.query(`delete from items where target = ?`, [req.params.node_id]);
        res.send(JSON.stringify({ status: 200 }));
    }));
    /**
     * link api
     */
    app.get(`/api/links`, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        res.setHeader(`Content-type`, `application/json`);
        const links = yield connection.query(`select l.*, b.book_name, u.user_name, b.node_id from links l left outer join items i on l.target = i.node_id left outer join books b on i.target = b.node_id left outer join users u on b.book_author = u.user_id order by target asc`);
        res.send(JSON.stringify({ status: 200, links: links[0] }));
    }));
    /**
     * cdn api
     */
    app.get(`/cdn/uploads/:filename`, (req, res) => {
        if (/[/\\]/g.test(req.params.filename))
            return;
        res.sendFile(path_1.default.resolve(`./uploads/${req.params.filename}`));
    });
    app.listen(8080, () => {
        console.log(`port 8080`);
    });
}))();
// const client = new MongoClient(process.env.MYSQL_HOST || ``, {
//     serverApi: {
//         version: ServerApiVersion.v1,
//         strict: true,
//         deprecationErrors: true,
//     }
// });
// await client.connect();
// const database = client.db(`book`);
// const users = database.collection(`users`);
// await users.insertOne({
//     user_id: `sans123`,
//     user_name: `샌즈`,
//     user_password: `12345678`
// });
