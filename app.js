require('dotenv').config()
const express = require('express');
const pool = require('./db');
const app = express();
app.use(express.json());//JSON

const PORT = process.env.PORT || 3000;

const handDbError = (res, error) => {
  console.error('Error de acceso:', error);
  res.status(500).json({ error: 'Error interno en el servidor' });
}
//Verbos

//GET(Consulta)
app.get('/vehiculos', async (req, res) => {
  try {
    const rows = await pool.query('SELECT * FROM vehiculos');
    res.status(200).json(rows);
  } catch (error) {
    handDbError(res, error);
  }
});

//POST(Insertar)
app.post('/vehiculos', async (req, res) => {

    const {marca, modelo, color, precio, placa}  = req.body;

    if(!marca || !modelo || !color || !precio || !placa) {
        return res.status(400).json({error: 'Faltan ingresar datos'});
    }

  try {
    const [result] = await pool.query(
      'INSERT INTO vehiculos (marca, modelo, color, precio, placa) VALUES (?,?,?,?,?)',
      [marca, modelo, color, precio, placa] 
    );

    //Obtener el PK generado
    const id = result.insertId
    res.status(200).json("Vehículo generado: " + id);
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY'){
      return res.status(409).json({ error: 'La placa ya existe en la bd' });
    }
    handDbError(res, error);
  }
});

//PUT(Actualizar)
app.put("/vehiculos/:id", async (req, res) => {
    const {id} = req.params;
    const {marca, modelo, color, precio, placa}  = req.body;

    if(!marca || !modelo || !color || !precio || !placa) {
        return res.status(400).json({error: 'Faltan ingresar datos'});
    }

  try {
    const [result] = await pool.query(
      'UPDATE vehiculos SET marca=?, modelo=?, color=?, precio=?, placa=? WHERE id=?',
      [marca, modelo, color, precio, placa, id] 
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({succes: false,message: 'Vehículo no encontrado'});
    }

    res.status(200).json({succes: true, message: "Vehículo actualizado"});
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY'){
      return res.status(409).json({error: 'La placa ya existe en la bd' });
    }
    handDbError(res, error);
  }
});

//Delete(Eliminar)
app.delete("/vehiculos/:id", async (req, res) => {
    const {id} = req.params;

  try {
    const [result] = await pool.query(
      "DELETE FROM vehiculos WHERE id=?",[id] 
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({succes: false,message: 'Error, vehiculo no encontrado'});
    }

    res.status(200).json({succes: true, message: "Vehículo eliminado"});
  } catch (error) {
    handDbError(res, error);
  }
});

//Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor iniciado en http://localhost:${PORT}`);
});
