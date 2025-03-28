import Usuario from "../models/usuario.js";
import generarJWT from "../middleware/generarJWT.js"; // Para generar el token
import bcrypt from "bcrypt";

//  Obtener todos los usuarios 
export const obtenerUsuarios = async (req, res) => {
  try {
    const usuarios = await Usuario.find().select("-contraseña"); // No enviamos la contraseña
    res.json(usuarios);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al obtener usuarios", error });
  }
};

//  Obtener un usuario por ID 
export const obtenerUsuario = async (req, res) => {
  try {
    const usuario = await Usuario.findById(req.params.id).select("-contraseña");
    if (!usuario) return res.status(404).json({ mensaje: "Usuario no encontrado" });

    res.json(usuario);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al obtener el usuario", error });
  }
};

// Actualizar un usuario 
export const actualizarUsuario = async (req, res) => {
  try {
    const { nombre, correo, nivel, rol } = req.body;

    const usuarioActualizado = await Usuario.findByIdAndUpdate(
      req.params.id,
      { nombre, correo, nivel, rol },
      { new: true }
    );

    if (!usuarioActualizado) return res.status(404).json({ mensaje: "Usuario no encontrado" });

    res.json({ mensaje: "Usuario actualizado", usuario: usuarioActualizado });
  } catch (error) {
    res.status(500).json({ mensaje: "Error al actualizar el usuario", error });
  }
};

//  Eliminar un usuario 
export const eliminarUsuario = async (req, res) => {
  try {
    const usuarioEliminado = await Usuario.findByIdAndDelete(req.params.id);
    if (!usuarioEliminado) return res.status(404).json({ mensaje: "Usuario no encontrado" });

    res.json({ mensaje: "Usuario eliminado correctamente" });
  } catch (error) {
    res.status(500).json({ mensaje: "Error al eliminar el usuario", error });
  }
};

// Registrar Usuario 
export const registrarUsuario = async (req, res) => {
  try {
    const { nombre , correo, contraseña, nivel, rol } = req.body;//123456

    const usuarioExistente = await Usuario.findOne({ correo });
    if (usuarioExistente) return res.status(400).json({ mensaje: "El correo ya está registrado" });

    const salt = await bcrypt.genSalt(10); // 12345874587trretjregjgrt3298r234u435u4r3ettrejutreu345tjuretuertu
    const contraseñaHasheada = await bcrypt.hash(contraseña, salt); // 2$B372473425/fjfsjhsue/wdaeaef/

    const nuevoUsuario = new Usuario({ nombre, correo, contraseña: contraseñaHasheada, nivel, rol });
    await nuevoUsuario.save();

    const token = generarJWT(nuevoUsuario._id);

    res.status(201).json({ mensaje: "Usuario registrado", usuario: nuevoUsuario, token });
  } catch (error) {
    res.status(500).json({ mensaje: "Error en el registro", error: error.message});
  }
};

// Login de Usuario 
export const loginUsuario = async (req, res) => {
  try {
    const { correo, contraseña } = req.body;

    const usuario = await Usuario.findOne({ correo });
    if (!usuario) return res.status(400).json({ mensaje: "Usuario no encontrado" });

    const contraseñaValida = await bcrypt.compare(contraseña, usuario.contraseña);
    if (!contraseñaValida) return res.status(400).json({ mensaje: "Contraseña incorrecta" });

    const token = generarJWT(usuario._id);

    res.json({ mensaje: "Login exitoso", usuario, token });
  } catch (error) {
    res.status(500).json({ mensaje: "Error en el login", error: error.message });
  }
};
