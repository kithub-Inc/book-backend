// import { MongoClient, ServerApiVersion } from 'mongodb';
import mysql from 'mysql2/promise';
import express from 'express';
import dotenv from 'dotenv';
import crypto from 'crypto';
import multer from 'multer';
import { v4 } from 'uuid';
import cors from 'cors';
import path from 'path';
import fs from 'fs';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

const upload = multer({ dest: `uploads/` });

interface Session {
    token: string;
    user_id: string;
    user_name: string;
}

const sessions: Session[] = [];

(async () => {
    const connection = await mysql.createConnection({
        host: process.env.MYSQL_HOST,
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
    app.post(`/api/oauth/create`, async (req, res) => {
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

        const exists: any = await connection.query(`select * from users where user_id = ?`, [user_id]);

        if (exists[0].length > 0) {
            res.send({ message: `중복된 아이디입니다.` });
            return;
        }

        const password = crypto.createHash(`sha512`).update(user_id + user_password).digest(`hex`);
        
        await connection.query(`insert into users (node_id, user_id, user_name, user_password, user_created_at) VALUES (default, ?, ?, ?, default);`, [user_id, user_name, password]);
        res.send(JSON.stringify({ status: 200, message: `회원가입이 완료되었습니다.` }));
    });

    app.post(`/api/oauth/verification`, async (req, res) => {
        res.setHeader(`Content-type`, `application/json`);

        const { user_id, user_password } = req.body;

        const exists: any = await connection.query(`select * from users where user_id = ? and user_password = ?`, [user_id, crypto.createHash(`sha512`).update(user_id + user_password).digest(`hex`)]);

        if (exists[0].length > 0) {
            const token = v4();

            const { user_id, user_name } = exists[0][0];

            sessions.push({ token, user_id, user_name });
            res.send({ status: 200, message: `로그인에 성공하였습니다.`, token });
            return;
        }
        
        res.send({ message: `로그인에 실패하였습니다. 아이디 또는 비밀번호를 확인해주세요.` });
    });

    app.post(`/api/oauth/token`, async (req, res) => {
        res.setHeader(`Content-type`, `application/json`);

        const { token } = req.body;

        const exists = sessions.find(e => e.token === token);

        if (exists) {
            res.send({ status: 200, message: `인증에 성공하였습니다.`, ...exists });
            return;
        }
        
        res.send({ message: `토큰이 만료되었습니다.` });
    });

    /**
     * book api
     */
    app.get(`/api/books`, async (req, res) => {
        res.setHeader(`Content-type`, `application/json`);

        const books = await connection.query(`select b.*, u.user_name from books b join users u on b.book_author = u.user_id order by b.node_id desc`);
        res.send(JSON.stringify({ status: 200, books: books[0] }));
    });

    app.get(`/api/books/:node_id`, async (req, res) => {
        res.setHeader(`Content-type`, `application/json`);

        const items: any = await connection.query(`select i.*, b.book_name, b.book_author, u.user_name from books b left outer join items i on b.node_id = i.target left outer join users u on b.book_author = u.user_id where b.node_id = ?`, [req.params.node_id]);
        const links: any = await connection.query(`select l.* from links l join items i on l.target = i.node_id join books b on i.target = b.node_id where b.node_id = ?`, [req.params.node_id]);

        items[0].forEach((item: any) => item.item_image = `https://port-0-book-backend-1ru12mlw1sms1u.sel5.cloudtype.app/cdn/uploads/${item.item_image}`);

        res.send(JSON.stringify({ status: 200, items: items[0], name: items[0][0].book_name, author: items[0][0].book_author, user_name: items[0][0].user_name, links: links[0] }));
    });

    app.get(`/api/books/:node_id/save`, async (req, res) => {
        res.setHeader(`Content-type`, `application/json`);

        setTimeout(() => {
            res.send(JSON.stringify({ status: 200 }));
        }, 100);
    });

    app.post(`/api/books/:node_id/create`, upload.single(`item_image`), async (req, res) => {
        res.setHeader(`Content-type`, `application/json`);

        const { item_links, item_type, item_tags, item_title, item_difficulty, item_qrcode, item_author, item_created_at, item_page, item_subcontent, item_content, item_index } = req.body;

        const image_name = `${v4()}.jpg`;
        if (req.file) fs.renameSync(req.file.path, `uploads/${image_name}`);

        await connection.query(`insert into items (target, item_image, item_type, item_tags, item_title, item_difficulty, item_qrcode, item_author, item_created_at, item_page, item_subcontent, item_content, item_index) values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, [req.params.node_id, image_name, item_type, item_tags, item_title, Number(item_difficulty), item_qrcode, item_author, item_created_at, Number(item_page), item_subcontent, item_content, item_index]);
        const { last_id } = (await connection.query(`select last_insert_id() as last_id from items`) as any)[0][0];
        JSON.parse(item_links).forEach(async (link: any) => {
            if (link.name && link.content) await connection.query(`insert into links (target, link_bookname, link_content) values (?, ?, ?)`, [last_id, link.name, link.content])
        });

        res.send(JSON.stringify({ status: 200 }));
    });

    app.get(`/api/books/:node_id/:target/remove`, async (req, res) => {
        res.setHeader(`Content-type`, `application/json`);
        
        await connection.query(`delete from items where node_id = ?`, [req.params.target]);

        res.send(JSON.stringify({ status: 200 }));
    });

    app.get(`/api/books/:node_id/remove`, async (req, res) => {
        res.setHeader(`Content-type`, `application/json`);
        
        await connection.query(`delete from books where node_id = ?`, [req.params.node_id]);
        await connection.query(`delete from items where target = ?`, [req.params.node_id]);

        res.send(JSON.stringify({ status: 200 }));
    });

    /**
     * link api
     */
    app.get(`/api/links`, async (req, res) => {
        res.setHeader(`Content-type`, `application/json`);

        const links: any = await connection.query(`select l.*, b.book_name, u.user_name, b.node_id from links l left outer join items i on l.target = i.node_id left outer join books b on i.target = b.node_id left outer join users u on b.book_author = u.user_id order by target asc`);
        res.send(JSON.stringify({ status: 200, links: links[0] }));
    });

    /**
     * cdn api
     */
    app.get(`/cdn/uploads/:filename`, (req, res) => {
        if (/[/\\]/g.test(req.params.filename)) return;
        res.sendFile(path.resolve(`./uploads/${req.params.filename}`));
    });

    app.listen(3001);
})();

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