import mongoose from "mongoose";
import express from "express";
import session from 'express-session';
import MongoStore from 'connect-mongo';
import user from "./models/Contas.js";
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import cors from 'cors';
import {Resend} from 'resend';
import crypto from 'crypto';
dotenv.config();
const resenda = new Resend(process.env.RESEND_API_KEY);

const app = express();
const PORT = process.env.PORT || 3000;



app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));



app.use(
    session({
        secret: process.env.SESSION_SECRET, 
        resave: false,
        saveUninitialized: false,
        store: MongoStore.create({
            mongoUrl: process.env.MONGO_URI,
            collectionName: 'sessions',
        }),
        cookie: {
    maxAge: 1000 * 60 * 60, 
    httpOnly: true,
    sameSite: 'lax'       
  }
    })
    
);

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000,   // tenta 5s
      socketTimeoutMS: 45000,           // fecha conexões mortas
      ssl: true,                        // força SSL
      tlsAllowInvalidCertificates: false
    });
    console.log('MongoDB conectado com sucesso');
  } catch (err) {
    console.error('Erro de conexão MongoDB:', err.message);
    process.exit(1);
  }
};

connectDB();
app.post('/cadastrar', async (req, res) => {
    const { nome, email, senha } = req.body;
    try{
        const senhaHash = await bcrypt.hash(senha, 10);
        const newUser = await user.create({nome, email, senhaHash, cursos: []});
        req.session.userId = newUser._id;
        res.redirect('/pages/alumnarea/index.html');
    }catch(err){
        console.error('Erro ao cadastrar:', err);
        res.status(500).end();
    }
});
app.post('/login', async (req, res) => {
    const { email, senha } = req.body;
    try {
        const userFound = await user.findOne({ email });
        if (!userFound) {
            return res.status(404).end();
        }
        const senhaOk = await bcrypt.compare(senha, userFound.senhaHash);
        if (!senhaOk) {
            return res.status(401).end();
        }
        req.session.userId = userFound._id;
        res.redirect('/pages/alumnarea/index.html');
    }catch (err) {
        console.error('Erro ao fazer login:', err);
        res.status(500).end();
    }
});
app.post('/salvar', async (req, res) => {
    const {cursos}  = req.body;
    if(req.session.userId) {
        try {
            const userFound = await user.findById(req.session.userId);
            if (!userFound) {
                return res.status(404).end();
            }
            userFound.cursos = cursos;
            await userFound.save();
            res.status(200).end();
        } catch (err) {
            console.error('Erro ao salvar cursos:', err);
            res.status(500).end();
        }
    }else{
        console.error('Usuário não autenticado');
        res.status(401).end();
    }
});
app.get('/usuario', async (req, res) => {
    if (req.session.userId) {
        try {
            const userFound = await user.findById(req.session.userId);
            if (!userFound) {
                return res.status(404).end();
            }
            res.json({cursos: userFound.cursos, name: userFound.nome});
        } catch (err) {
            console.error('Erro ao buscar usuário:', err);
            res.status(500).end();
        }}});
app.get('/autenticado', (req, res) => {
    if (req.session.userId) {
      try {
        res.json({ autenticado: true });
      } catch (err) {
        console.error('Erro ao verificar autenticação:', err);
        res.status(500).end();
      }
    }else{
      res.json({ autenticado: false });
    }});
app.get("/logout", (req, res) => {
  if (req.session) {
    req.session.destroy(err => {
      if (err) {
        console.error("Erro ao deslogar:", err);
        return res.status(500).send("Erro ao deslogar");
      }
      res.clearCookie("connect.sid", {path: '/'});
      res.json({redirect:"/"});
    });
  } else {
    res.json({redirect:"/"});
  }
});
app.post('/recpass', async (req, res) => {
    const { email } = req.body;
    try {
        const userFound = await user.findOne({ email });
        if (!userFound) { 
            return res.status(404).end();
        }
        const token = crypto.randomBytes(20).toString('hex');
        userFound.resetPasswordToken = token;
        userFound.resetPasswordExpires = Date.now() + 3600000;
        await userFound.save();

        const link = `http://localhost:3000/resetpass?token=${token}`;
        await resenda.emails.send({
          from: 'onboarding@resend.dev',
          to: email,
          subject: 'Recuperação de Senha - FTi Cursos',
          html: `<p>Você solicitou a recuperação de senha. Clique no link abaixo para redefinir sua senha:</p>
                 <a href="${link}">Redefinir Senha</a>
                 <p>Se você não solicitou essa ação, ignore este email.</p>`,
        });
      } catch (err) {
        console.error('Erro ao enviar email:', err);
      }}); 
app.get('/resetpass', async (req, res) => {
  const { token } = req.query;
  const userFound = await user.findOne({ 
    resetPasswordToken: token, 
    resetPasswordExpires: { $gt: Date.now() } 
  });
  if (!userFound) {
    return res.status(400).send('Token inválido ou expirado');
  }
  res.send(`<form action="/resetpass/${token}" method="POST">
              
              <label for="senha">Nova Senha:</label>
              <input type="password" id="senha" name="senha" required />
              <button type="submit">Redefinir Senha</button>
            </form>`);
});
app.post('/resetpass/:token', async (req, res) => {
  const { token } = req.params;
  const { senha } = req.body;
  try {
    const userFound = await user.findOne({ 
      resetPasswordToken: token, 
      resetPasswordExpires: { $gt: Date.now() } 
    });
    if (!userFound) {
      return res.status(400).send('Token inválido ou expirado');
    }
    const senhaHash = await bcrypt.hash(senha, 10);
    userFound.senhaHash = senhaHash;
    userFound.resetPasswordToken = undefined;
    userFound.resetPasswordExpires = undefined;
    await userFound.save();
    res.send('Senha redefinida com sucesso. Você já pode fazer login com sua nova senha. Pode fechar esta aba.');
  }catch (err) {
    console.error('Erro ao redefinir senha:', err);
    res.status(500).end();
  }});
app.use(express.static('public'));
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});

