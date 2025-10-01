import e from "express";
import mongoose from "mongoose";

const contaSchema = new mongoose.Schema({
  nome: String,
  email: String,
  senhaHash: String,
  cursos:[{
    nome:String
  }],
  resetPasswordToken: String,
  resetPasswordExpires: Date
});

const Conta = mongoose.model("Conta", contaSchema); 
export default Conta;