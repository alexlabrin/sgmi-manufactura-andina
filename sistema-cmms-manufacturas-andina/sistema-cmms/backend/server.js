const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');

const app = express();
app.use(cors());
app.use(express.json());

const JWT_SECRET = 'sgmi_manufacturas_andina_secret_key_2026';

let inventarioDB = [
  { id: 1, codigo: 'REP-001', nombre: 'Rodamiento de Alta Carga 6205', categoria: 'Mecánica', stock: 18, stockMinimo: 5, precio: 45000, ubicacion: 'Estante A-12' },
  { id: 2, codigo: 'REP-002', nombre: 'Aceite Hidráulico ISO VG 68 (20L)', categoria: 'Lubricantes', stock: 3, stockMinimo: 10, precio: 85000, ubicacion: 'Bodega Químicos' },
  { id: 3, codigo: 'REP-003', nombre: 'Sensor de Vibración Industrial XL4', categoria: 'Electrónica', stock: 2, stockMinimo: 4, precio: 120000, ubicacion: 'Armario B-04' },
  { id: 4, codigo: 'REP-004', nombre: 'Filtro de Aire Compresor Heavy-Duty', categoria: 'Filtros', stock: 15, stockMinimo: 6, precio: 28000, ubicacion: 'Estante C-01' },
  { id: 5, codigo: 'REP-005', nombre: 'Bomba Centrífuga 5HP 380V', categoria: 'Electromecánica', stock: 1, stockMinimo: 2, precio: 450000, ubicacion: 'Bodega Central' }
];

let otDB = [
  { id: 'OT-1001', equipo: 'Prensadora Hidráulica P-01', descripcion: 'Fuga de aceite en cilindro secundario', prioridad: 'Alta', estado: 'En Proceso', reportadoPor: 'operador@andina.cl', tecnico: 'Benjamín López', horasHH: 4, costoParts: 85000 },
  { id: 'OT-1002', equipo: 'Torno CNC Mazak T-02', descripcion: 'Descalibración en eje Z', prioridad: 'Media', estado: 'Pendiente', reportadoPor: 'prod_lead@andina.cl', tecnico: 'Sin Asignar', horasHH: 0, costoParts: 0 },
  { id: 'OT-1003', equipo: 'Compresor de Aire C-01', descripcion: 'Sobrecalentamiento > 88°C', prioridad: 'Crítica', estado: 'Pendiente', reportadoPor: 'maint_tech@andina.cl', tecnico: 'Alexander Labrin', horasHH: 0, costoParts: 0 }
];

let logsAuditoria = [];

// API: Login Gateway
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;

  if (!username || username.length < 6 || !username.includes('@')) {
    return res.status(400).json({ error: 'El usuario debe tener al menos 6 caracteres e incluir un "@"' });
  }

  if (!password || password.length < 6) {
    return res.status(400).json({ error: 'La contraseña debe tener al menos 6 caracteres' });
  }

  let rol = 'Jefe de Mantenimiento';
  if (username.includes('bodega')) rol = 'Encargado de Bodega';
  if (username.includes('tecnico')) rol = 'Técnico de Mantenimiento';
  if (username.includes('prod')) rol = 'Personal de Producción';
  if (username.includes('finanzas')) rol = 'Analista de Finanzas';
  if (username.includes('admin')) rol = 'Administrador del Sistema';

  const token = jwt.sign({ username, role: rol }, JWT_SECRET, { expiresIn: '8h' });

  return res.json({
    token,
    user: {
      username,
      nombre: username.split('@')[0].toUpperCase(),
      rol
    }
  });
});

// API: Inventario
app.get('/api/inventario', (req, res) => res.json(inventarioDB));

app.post('/api/inventario/movimiento', (req, res) => {
  const { id, tipo, cantidad, usuario } = req.body;
  const item = inventarioDB.find(i => i.id === id);

  if (!item) return res.status(404).json({ error: 'Repuesto no encontrado' });

  if (tipo === 'SALIDA') {
    if (item.stock < cantidad) {
      return res.status(400).json({ error: 'Transacción bloqueada: Stock insuficiente en bodega.' });
    }
    item.stock -= cantidad;
  } else {
    item.stock += parseInt(cantidad);
  }

  logsAuditoria.unshift({
    id: Date.now(),
    timestamp: new Date().toLocaleTimeString(),
    usuario: usuario || 'sistema',
    rol: 'Bodega',
    accion: 'MOVIMIENTO_STOCK',
    detalle: `${tipo} ${cantidad} u. en ${item.codigo}`,
    ip: req.ip || '192.168.1.45',
    estado: 'EXITO'
  });

  res.json({ success: true, item, nuevoStock: item.stock });
});

// API: Anomalías & Órdenes de Trabajo
app.get('/api/anomalias', (req, res) => res.json(otDB));

app.post('/api/anomalias', (req, res) => {
  const nuevaOT = {
    id: `OT-${1000 + otDB.length + 1}`,
    ...req.body,
    estado: 'Pendiente',
    horasHH: 0,
    costoParts: 0,
    fecha: new Date().toISOString()
  };
  otDB.unshift(nuevaOT);
  res.status(201).json(nuevaOT);
});

// API: Admin Backup Simulator
app.post('/api/admin/backup', (req, res) => {
  const filename = `sgmi_manufacturas_andina_${new Date().toISOString().slice(0,10)}.sql`;
  res.json({
    success: true,
    filename,
    size: '14.8 MB',
    timestamp: new Date().toISOString()
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Backend SGMI-MA activo en puerto ${PORT}`));
