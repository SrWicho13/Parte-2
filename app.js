// Importar el módulo Express
const express = require('express');

// Crear una aplicación Express
const app = express();

// Middleware para analizar solicitudes JSON
app.use(express.json());

// Crear un arreglo en memoria para almacenar las tareas
let tareas = [];  // Este arreglo almacenará las tareas
let idActual = 1; // Este será el ID incremental para cada nueva tarea

// Crear una nueva tarea
app.post('/tareas', (req, res) => {
  const { descripcion, completada = false } = req.body;  // Desestructuramos los campos del cuerpo de la solicitud
  if (!descripcion) {
    return res.status(400).json({ error: 'La descripción es requerida.' });  // Si falta la descripción, se devuelve un error 400
  }
  const nuevaTarea = { 
    id: idActual++,  // Asigna un ID único
    descripcion, 
    completada, 
    fechaCreacion: new Date()  // Agrega la fecha de creación
  };
  tareas.push(nuevaTarea);  // Agrega la nueva tarea al arreglo de tareas
  res.status(201).json(nuevaTarea);  // Responde con la nueva tarea creada
});

// Leer todas las tareas
app.get('/tareas', (req, res) => {
  res.json(tareas);  // Responde con el arreglo completo de tareas
});

// Leer una tarea específica por su ID
app.get('/tareas/:id', (req, res) => {
  const tarea = tareas.find(t => t.id === parseInt(req.params.id));  // Busca la tarea por ID
  if (!tarea) {
    return res.status(404).json({ error: 'Tarea no encontrada.' });  // Si no se encuentra, responde con un error 404
  }
  res.json(tarea);  // Responde con la tarea encontrada
});

// Actualizar una tarea existente
app.put('/tareas/:id', (req, res) => {
  const { descripcion, completada } = req.body;
  const tarea = tareas.find(t => t.id === parseInt(req.params.id));  // Busca la tarea por ID
  if (!tarea) {
    return res.status(404).json({ error: 'Tarea no encontrada.' });
  }
  if (descripcion) tarea.descripcion = descripcion;  // Actualiza la descripción si se proporciona
  if (completada !== undefined) tarea.completada = completada;  // Actualiza el estado de completada si se proporciona
  res.json(tarea);  // Responde con la tarea actualizada
});

// Eliminar una tarea por su ID
app.delete('/tareas/:id', (req, res) => {
  const tareaIndex = tareas.findIndex(t => t.id === parseInt(req.params.id));  // Busca el índice de la tarea por ID
  if (tareaIndex === -1) {
    return res.status(404).json({ error: 'Tarea no encontrada.' });
  }
  const tareaEliminada = tareas.splice(tareaIndex, 1);  // Elimina la tarea del arreglo
  res.json(tareaEliminada[0]);  // Responde con la tarea eliminada
});

// Calcular estadísticas de las tareas
app.get('/tareas/estadisticas', (req, res) => {
  const totalTareas = tareas.length;  // Calcula el total de tareas
  const tareaMasReciente = tareas.reduce((reciente, tarea) => 
    !reciente || tarea.fechaCreacion > reciente.fechaCreacion ? tarea : reciente, null);  // Encuentra la tarea más reciente
  const tareaMasAntigua = tareas.reduce((antigua, tarea) => 
    !antigua || tarea.fechaCreacion < antigua.fechaCreacion ? tarea : antigua, null);  // Encuentra la tarea más antigua
  const completadas = tareas.filter(t => t.completada).length;  // Cuenta las tareas completadas
  const pendientes = totalTareas - completadas;  // Calcula las tareas pendientes

  res.json({
    totalTareas,
    tareaMasReciente,
    tareaMasAntigua,
    completadas,
    pendientes
  });
});

// Iniciar el servidor en el puerto 3000
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
});
