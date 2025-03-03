import { MongoOIDCError } from "mongodb";
import mongoose from "mongoose";
import Usuario from "./usuario";

const maratonSchema = mongoose.Schema({
    id_maraton: { type: ObjectId, required: true},
    nombre: { type: String, required: true},
    descripcion: { type: String, required: true},
    fecha_inicio: { type: Date, required: true},
    fecha_fin: { type: Date, required: true},
    problemas : [{type: mongoose.Schema.Types.ObjectId, ref: "Problema"}],
    participantes: [{type: mongoose.Schema.Types.ObjectId, ref: "Usuario"}],
    ranking: [
        {
            usuario: {type: mongoose.Schema.Types.ObjectId, ref: "Usuario"},
            puntuacion: {type: Number, default: 0},
        },
    ],
    estado: {type: String, enum: ["abierto", "cerrado"]},
    creador: {type: mongoose.Schema.Types.ObjectId, ref: "Usuario"},
    generado_IA: {type: Boolean},
    modelo_usado: {type:String},
});