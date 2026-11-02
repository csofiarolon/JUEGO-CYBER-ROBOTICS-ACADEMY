import { Level, Question, HardwareChip } from '../types/game';
import { module1Questions } from './questions/module1';
import { module2Questions } from './questions/module2';
import { module3Questions } from './questions/module3';
import { module4Questions } from './questions/module4';
import { module5Questions } from './questions/module5';
import { module6Questions } from './questions/module6';

// =========================================================================
// BANCO PEDAGÓGICO DE MICROCHIPS Y TEORÍA POR NIVEL
// =========================================================================

export const LEVEL_1_THEORY = {
  titulo: 'Nivel 1: Fundamento Cero — De SQL a MongoDB NoSQL',
  subtitulo: 'Tablas rígidas vs Colecciones dinámicas y Documentos BSON',
  analogiaMecanica: 'En una fábrica tradicional (SQL), cada androide debe encajar en casilleros de metal con medidas fijas (columnas). Si un androide tiene un sensor nuevo, debes reconstruir todos los casilleros de la fábrica (ALTER TABLE). En un taller moderno (MongoDB), cada androide lleva su propia mochila de componentes (Documento BSON): puede tener los sensores que necesite sin obligar a los demás a tenerlos.',
  puntosClave: [
    {
      concepto: 'Tablas vs. Colecciones',
      detalle: 'En SQL guardas datos en Tablas con esquema rígido. En MongoDB guardas datos en Colecciones flexibles sin esquema forzado a nivel de motor.',
      ejemplo: 'db.createCollection("androides")'
    },
    {
      concepto: 'Filas vs. Documentos BSON',
      detalle: 'Un Documento es la unidad básica de datos. Es similar a un objeto JSON, pero codificado en formato binario (BSON) que soporta tipos avanzados (ObjectId, Date, Decimal128, BinData).',
      ejemplo: '{ _id: ObjectId("..."), nombre: "Titan-1", blindaje: 85 }'
    },
    {
      concepto: 'Documentos Embebidos (Subdocumentos)',
      detalle: 'A diferencia de SQL donde separas todo con claves foráneas y haces JOINs, en MongoDB colocas juntos los datos que se consultan juntos.',
      ejemplo: '{ modelo: "Scout", sensor: { tipo: "Infrarrojo", rangoKm: 5 } }'
    },
    {
      concepto: 'Límite Crítico BSON de 16 Megabytes',
      detalle: 'Un solo documento no puede pesar más de 16MB en memoria. Si necesitas almacenar archivos gigantescos o telemetría infinita, se usa GridFS o referencias.',
    }
  ]
};

export const LEVEL_1_CHIPS: [HardwareChip, HardwareChip, HardwareChip] = [
  {
    id: 'l1-bson-doc',
    nombre: 'Documento BSON Flexible',
    tipo: 'Estructura NoSQL',
    descripcion: 'Almacena registros en documentos BSON auto-contenidos con tipos ricos.',
    analogia: 'Una mochila modular donde cada robot lleva sus propios sensores sin pedir permiso al hangar.',
    iconoPixelArt: 'microchip',
    codigoSnippet: '{ _id: ObjectId(), nombre: "R2", estado: "ACTIVO" }'
  },
  {
    id: 'l1-gridfs-bus',
    nombre: 'Controlador de Partición GridFS',
    tipo: 'Storage Chunk',
    descripcion: 'Divide datos masivos mayores a 16MB en fragmentos (chunks) estándar de 255KB.',
    analogia: 'Una cinta transportadora que divide una carga pesada en cajas de 255KB para no romper la grúa de 16MB.',
    iconoPixelArt: 'storage_controller',
    codigoSnippet: 'const bucket = new mongoose.mongo.GridFSBucket(db);'
  },
  {
    id: 'l1-rigid-sql',
    nombre: 'Adaptador SQL de Tablas Rígidas',
    tipo: 'Antipatrón / Rígido',
    descripcion: 'Obliga a que todos los documentos compartan exactamente las mismas columnas vacías (nulls).',
    analogia: 'Un molde de acero soldado que no permite añadir un cable nuevo sin fundir toda la fábrica.',
    iconoPixelArt: 'diode',
    codigoSnippet: 'ALTER TABLE robots ADD COLUMN laser_power INT;'
  }
];

export const LEVEL_2_THEORY = {
  titulo: 'Nivel 2: Operaciones CRUD Atómicas',
  subtitulo: 'Identificador _id, búsquedas find() y mutaciones con $set e $inc',
  analogiaMecanica: 'Si vas a pintar solo la puerta de un robot, no desarmas el robot entero para construirlo desde cero. Usas una pistola de pintura precisa ($set). Si cambias el odómetro de batería, no lees el valor, le sumas en un papel y vuelves mañana: usas un engranaje atómico ($inc) que gira directamente en el motor.',
  puntosClave: [
    {
      concepto: 'El Identificador Único _id (ObjectId)',
      detalle: 'Cada documento tiene una clave primaria inmutable de 12 bytes. Los primeros 4 bytes contienen la fecha y hora de creación (timestamp) en segundos.',
      ejemplo: 'robotId.getTimestamp() // Devuelve la fecha exacta de ensamblaje'
    },
    {
      concepto: 'Consultas con Filtros y Proyecciones',
      detalle: 'find() recibe dos argumentos: el filtro de búsqueda y la proyección (qué campos traer para no gastar ancho de banda).',
      ejemplo: 'db.robots.find({ status: "ACTIVO" }, { nombre: 1, _id: 0 })'
    },
    {
      concepto: 'Operador Atómico $set',
      detalle: 'Modifica únicamente las propiedades indicadas. ¡Peligro! Si olvidas $set en updateOne nativo, sobreescribirás el documento completo borrando todos los demás campos.',
      ejemplo: 'db.robots.updateOne({ _id }, { $set: { firmware: "2.1.0" } })'
    },
    {
      concepto: 'Operador Atómico $inc',
      detalle: 'Incrementa o decrementa números de forma atómica en el motor, neutralizando condiciones de carrera cuando múltiples usuarios modifican un contador a la vez.',
      ejemplo: 'db.robots.updateOne({ _id }, { $inc: { bateria: -5 } })'
    }
  ]
};

export const LEVEL_2_CHIPS: [HardwareChip, HardwareChip, HardwareChip] = [
  {
    id: 'l2-atomic-set',
    nombre: 'Inyector Atómico $set',
    tipo: 'Modificador Selectivo',
    descripcion: 'Actualiza quirúrgicamente campos específicos sin alterar ni borrar el resto del documento.',
    analogia: 'Una pistola de pintura láser que pinta solo el panel que necesitas sin despintar el androide.',
    iconoPixelArt: 'crystal',
    codigoSnippet: '{ $set: { version: "2.0", estado: "CALIBRADO" } }'
  },
  {
    id: 'l2-atomic-inc',
    nombre: 'Contador Atómico $inc',
    tipo: 'Aritmética Atómica',
    descripcion: 'Modifica valores numéricos directamente en memoria de página evitando condiciones de carrera.',
    analogia: 'Un odómetro mecánico que avanza un diente a la vez sin posibilidad de que dos personas confundan el valor.',
    iconoPixelArt: 'pipeline',
    codigoSnippet: '{ $inc: { energiaBateria: -10, misiones: 1 } }'
  },
  {
    id: 'l2-blind-overwrite',
    nombre: 'Controlador de Sobreescritura Total',
    tipo: 'Peligro de Corrupción',
    descripcion: 'Pasa un objeto directo sin operadores, reemplazando todo el documento y borrando campos no listados.',
    analogia: 'Tirar todo el robot a la trituradora porque solo querías cambiarle una tuerca.',
    iconoPixelArt: 'capacitor',
    codigoSnippet: '// ERROR: borra todo salvo firmware\nupdateOne({ _id }, { firmware: "2.0" })'
  }
];

export const LEVEL_3_THEORY = {
  titulo: 'Nivel 3: Aggregation Framework (Tuberías de Datos)',
  subtitulo: 'La cinta transportadora secuencial: $match, $group y $project',
  analogiaMecanica: 'Imagina una línea de montaje en una fábrica de autos. Primero filtras las piezas defectuosas ($match). Luego agrupas los chasis por modelo y cuentas cuántos hay ($group con acumuladores). Finalmente, les pegas la etiqueta con los datos que el cliente pidió ($project). Cada estación hace un trabajo específico y le pasa el resultado a la siguiente.',
  puntosClave: [
    {
      concepto: 'El Pipeline de Agregación',
      detalle: 'Un array de etapas ordenadas donde los documentos pasan secuencialmente. Cada etapa recibe documentos, los procesa y emite un flujo transformado.',
      ejemplo: 'db.robots.aggregate([ { $match: ... }, { $group: ... } ])'
    },
    {
      concepto: 'Regla de Oro: $match Temprano',
      detalle: 'Siempre coloca $match al inicio del pipeline. Esto permite al motor usar índices B-Tree y descartar millones de documentos antes de consumir memoria.',
      ejemplo: '{ $match: { sector: "ALPHA", activo: true } }'
    },
    {
      concepto: 'Agrupaciones con $group y _id',
      detalle: 'Agrupa documentos por un campo clave y calcula métricas ($sum, $avg, $max). Si usas _id: null, calculas totales sobre toda la colección.',
      ejemplo: '{ $group: { _id: "$modelo", promedioEnergia: { $avg: "$energia" } } }'
    },
    {
      concepto: 'Límite de 100MB de RAM por Etapa',
      detalle: 'Cada etapa puede usar máximo 100MB de memoria RAM. Para ordenamientos masivos de millones de filas se activa allowDiskUse: true.',
      ejemplo: 'db.robots.aggregate(pipeline).allowDiskUse(true)'
    }
  ]
};

export const LEVEL_3_CHIPS: [HardwareChip, HardwareChip, HardwareChip] = [
  {
    id: 'l3-early-match',
    nombre: 'Filtro Inicial Indexado ($match)',
    tipo: 'Etapa Temprana',
    descripcion: 'Descarta documentos al inicio del pipeline usando índices B-Tree de alta velocidad.',
    analogia: 'El portero del hangar que revisa la credencial antes de dejar entrar a 1 millón de androides.',
    iconoPixelArt: 'pipeline',
    codigoSnippet: '[\n  { $match: { sector: "BETA" } },\n  { $group: { _id: "$tipo", total: { $sum: 1 } } }\n]'
  },
  {
    id: 'l3-group-accumulator',
    nombre: 'Agrupador de Métricas ($group)',
    tipo: 'Acumulador',
    descripcion: 'Condensa flujos de documentos calculando sumatorias, promedios y métricas estadísticas.',
    analogia: 'Una báscula industrial que pesa todos los androides de la línea y calcula el peso promedio por escuadrón.',
    iconoPixelArt: 'crystal',
    codigoSnippet: '{ $group: { _id: null, media: { $avg: "$potencia" } } }'
  },
  {
    id: 'l3-js-function-stall',
    nombre: 'Inyector Javascript ($function V8)',
    tipo: 'Degradación de CPU',
    descripcion: 'Ejecuta código JavaScript interpretado documento por documento, apagando las optimizaciones C++.',
    analogia: 'Detener toda la cinta transportadora automática para que un operador lea una carta a mano en cada auto.',
    iconoPixelArt: 'ram',
    codigoSnippet: '{\n  $function: { body: "function(x){ return x*2; }", args: ["$val"] }\n}'
  }
];

export const LEVEL_4_THEORY = {
  titulo: 'Nivel 4: Mongoose ODM y Modelado en Node.js',
  subtitulo: 'Esquemas estrictos, validaciones, hooks de ciclo de vida y .lean()',
  analogiaMecanica: 'MongoDB es como un almacén abierto donde puedes guardar cualquier cosa. Mongoose es el inspector de aduana en tu servidor Node.js: verifica que cada robot tenga su número de serie, que el blindaje esté entre 0 y 100, y que la contraseña esté cifrada antes de autorizar la entrada al almacén.',
  puntosClave: [
    {
      concepto: 'Por qué Mongoose en Node.js',
      detalle: 'Aporta modelado de objetos, tipado estricto, validadores de negocio, relaciones y middleware sobre la flexibilidad de MongoDB.',
      ejemplo: 'const Robot = mongoose.model("Robot", RobotSchema);'
    },
    {
      concepto: 'Validaciones de Schema',
      detalle: 'Puedes definir tipos requeridos, valores mínimos/máximos, expresiones regulares y validadores asíncronos personalizados.',
      ejemplo: 'blindaje: { type: Number, required: true, min: 0, max: 100 }'
    },
    {
      concepto: 'La Trampa de los Middleware en Updates',
      detalle: 'Los hooks pre("save") SOLO se ejecutan al llamar a doc.save(). Las consultas directas como findOneAndUpdate() NO disparan pre("save") y por defecto tienen las validaciones apagadas a menos que pases { runValidators: true }.',
      ejemplo: 'Robot.findOneAndUpdate({ _id }, { ... }, { runValidators: true })'
    },
    {
      concepto: 'Consultas Rápidas con .lean()',
      detalle: 'doc.find() devuelve instancias pesadas con métodos internos. Si solo vas a enviar JSON al cliente, .lean() devuelve objetos JavaScript planos un 80% más rápidos.',
      ejemplo: 'const robots = await Robot.find().lean();'
    }
  ]
};

export const LEVEL_4_CHIPS: [HardwareChip, HardwareChip, HardwareChip] = [
  {
    id: 'l4-schema-validator',
    nombre: 'Validador de Esquema Mongoose',
    tipo: 'Protección de Integridad',
    descripcion: 'Aplica reglas de negocio estrictas ({ required, min, max, runValidators: true }).',
    analogia: 'El inspector de calidad que rechaza piezas oxidadas o con dimensiones fuera de norma.',
    iconoPixelArt: 'shield',
    codigoSnippet: '{ runValidators: true, new: true }'
  },
  {
    id: 'l4-lean-reader',
    nombre: 'Lector Plano POJO (.lean())',
    tipo: 'Acelerador de Lectura',
    descripcion: 'Omite la hidratación de documentos Mongoose pesados para devolver JSON plano ultra-rápido.',
    analogia: 'Sacar solo la foto del robot en vez de transportar el robot entero de 500 kilos a la oficina.',
    iconoPixelArt: 'microchip',
    codigoSnippet: 'const lista = await Robot.find().lean();'
  },
  {
    id: 'l4-mixed-bypass',
    nombre: 'Bypass Total (Schema.Types.Mixed)',
    tipo: 'Anarquía de Esquema',
    descripcion: 'Desactiva toda validación de tipos permitiendo que se guarden strings en campos numéricos y arrays corruptos.',
    analogia: 'Quitar todas las puertas del almacén y dejar que cualquiera tire basura en el suelo.',
    iconoPixelArt: 'diode',
    codigoSnippet: 'new Schema({ datos: Schema.Types.Mixed })'
  }
];

export const LEVEL_5_THEORY = {
  titulo: 'Nivel 5: Diseño de Esquemas (Embeber vs Referenciar)',
  subtitulo: 'Regla de acceso, el límite de 16MB y antipatrones de arrays infinitos',
  analogiaMecanica: 'Si construyes un robot de combate, los brazos y la cabeza van soldados al chasis (embebidos) porque siempre se mueven juntos. Pero no le sueldas el camión cisterna de combustible de la base (referenciado por ID): eso se conecta solo cuando el robot va a cargar combustible.',
  puntosClave: [
    {
      concepto: 'Cuándo Embeber (Embedded Documents)',
      detalle: 'Embebe cuando la relación es 1:1 o 1:Pocos y los datos se consultan siempre juntos en la misma pantalla. Evita JOINs y asegura lectura en una pasada.',
      ejemplo: '{ _id, nombre, direccion: { calle, ciudad, cp } }'
    },
    {
      concepto: 'Cuándo Referenciar (References con _id)',
      detalle: 'Referencia cuando los datos crecen sin límite (1:Muchos, 1:Infinito) o cuando el documento secundario se consulta de forma independiente.',
      ejemplo: '// En SensorLog: { _id, robotId: ObjectId("..."), valor: 42 }'
    },
    {
      concepto: 'El Antipatrón del Array Infinito (Unbounded Array)',
      detalle: 'Hacer $push indefinidamente a un array dentro de un documento causa que exceda los 16MB de BSON y fragmenta el disco de WiredTiger.',
      ejemplo: 'Solución: Subset Pattern o guardar logs en colección separada'
    },
    {
      concepto: 'Hidratación con .populate()',
      detalle: 'Mongoose permite reemplazar un ObjectId referenciado con el documento completo de la otra colección mediante populate().',
      ejemplo: 'await Robot.findById(id).populate("hangarId");'
    }
  ]
};

export const LEVEL_5_CHIPS: [HardwareChip, HardwareChip, HardwareChip] = [
  {
    id: 'l5-parent-reference',
    nombre: 'Enlace por Referencia al Padre',
    tipo: 'Modelado Escalable 1:N',
    descripcion: 'Guarda el ID del robot en cada registro de sensor hijo evitando que el documento principal crezca sin control.',
    analogia: 'Ponerle una etiqueta con el número de serie del robot a cada una de sus 10 millones de balas disparadas.',
    iconoPixelArt: 'pipeline',
    codigoSnippet: '{ _id, robotId: ObjectId("..."), lectura: 102 }'
  },
  {
    id: 'l5-subset-pattern',
    nombre: 'Unidad de Subconjunto (Subset Pattern)',
    tipo: 'Caché Documental',
    descripcion: 'Conserva solo los últimos 5 elementos recientes en el documento principal y el historial completo en otra colección.',
    analogia: 'Tener una bandeja de acceso rápido con las 5 herramientas que más usas y el resto en el galpón de repuestos.',
    iconoPixelArt: 'crystal',
    codigoSnippet: '{ ultimosLogs: [ /* max 5 */ ], totalLogs: 50000 }'
  },
  {
    id: 'l5-unbounded-embedder',
    nombre: 'Embebedor Masivo Infinito (Crash 16MB)',
    tipo: 'Antipatrón Fatal',
    descripcion: 'Inserta millones de lecturas en un array interno hasta que el documento supera los 16MB y arroja BSONObjException.',
    analogia: 'Meter 50 elefantes dentro del maletero de un auto hasta que revienten los neumáticos.',
    iconoPixelArt: 'capacitor',
    codigoSnippet: '$push: { telemetriaInfinita: nuevaLectura }'
  }
];

export const LEVEL_6_THEORY = {
  titulo: 'Nivel 6: Rendimiento, Seguridad y Conexión',
  subtitulo: 'Índices B-Tree (IXSCAN vs COLLSCAN), regla ESR, .env y Connection Pools',
  analogiaMecanica: 'Buscar un tornillo en un galpón con 10 millones de tornillos desparramados en el piso sin orden te llevará días (COLLSCAN). Si tienes un fichero ordenado por tipo y medida (Índice B-Tree IXSCAN), vas al cajón exacto en 1 milisegundo. Y nunca dejes la llave del taller pegada en la puerta exterior: se guarda en una caja fuerte (.env).',
  puntosClave: [
    {
      concepto: 'COLLSCAN vs IXSCAN en explain()',
      detalle: 'COLLSCAN significa que MongoDB escaneó todos los documentos de la colección en disco. IXSCAN significa que usó un índice B-Tree saltando directo a los resultados.',
      ejemplo: 'db.robots.find({ serial: "SN-9" }).explain("executionStats")'
    },
    {
      concepto: 'La Regla de Oro ESR (Equality, Sort, Range)',
      detalle: 'Al diseñar índices compuestos para queries complejas, los campos deben ordenarse: 1° Igualdad, 2° Ordenamiento (Sort), 3° Rango.',
      ejemplo: 'db.robots.createIndex({ estado: 1, prioridad: -1, bateria: 1 })'
    },
    {
      concepto: 'Seguridad y Variables de Entorno (.env)',
      detalle: 'Nunca incluyas la cadena de conexión de MongoDB (con usuario y contraseña) en el código fuente de Git. Usa dotenv y variables de entorno.',
      ejemplo: 'mongoose.connect(process.env.MONGO_URI)'
    },
    {
      concepto: 'Pool de Conexiones (maxPoolSize)',
      detalle: 'Mongoose reutiliza conexiones TCP para no abrir y cerrar sockets en cada petición HTTP. Se calibra con maxPoolSize (default 100).',
      ejemplo: 'mongoose.connect(uri, { maxPoolSize: 50, minPoolSize: 10 })'
    }
  ]
};

export const LEVEL_6_CHIPS: [HardwareChip, HardwareChip, HardwareChip] = [
  {
    id: 'l6-btree-index',
    nombre: 'Acelerador de Índice B-Tree (IXSCAN)',
    tipo: 'Optimización de Búsqueda',
    descripcion: 'Convierte escaneos de millones de documentos en búsquedas logarítmicas de sub-milisegundos.',
    analogia: 'El índice alfabético al final de un libro que te dice exactamente en qué página está el concepto.',
    iconoPixelArt: 'crystal',
    codigoSnippet: 'db.robots.createIndex({ serialCode: 1 });'
  },
  {
    id: 'l6-esr-rule',
    nombre: 'Compilador de Regla ESR',
    tipo: 'Índice Compuesto',
    descripcion: 'Ordena los campos del índice compuesto en Igualdad -> Sort -> Rango, evitando ordenamientos pesados en RAM.',
    analogia: 'Organizar los expedientes primero por país, luego por fecha, y buscar por rango de edad.',
    iconoPixelArt: 'pipeline',
    codigoSnippet: '{ status: 1, priority: -1, battery: 1 }'
  },
  {
    id: 'l6-insecure-conn',
    nombre: 'Conector Inseguro Hardcoded (No Auth)',
    tipo: 'Vulnerabilidad Crítica',
    descripcion: 'Pone la contraseña en texto plano en Git, usa usuario root y permite inyecciones NoSQL sin sanitizar.',
    analogia: 'Dejar la puerta de la bóveda abierta con un cartel luminoso invitando a pasar.',
    iconoPixelArt: 'diode',
    codigoSnippet: 'mongoose.connect("mongodb://root:12345@public-ip/admin")'
  }
];

// Adaptador de preguntas para el formato Question de la especificación
function adaptQuestion(rawQ: any, levelId: number): Question {
  return {
    id: rawQ.id,
    levelId: levelId as any,
    tituloDesafio: rawQ.tituloDesafio,
    missionDescription: rawQ.premisa,
    codigoContexto: rawQ.codigoContexto,
    opciones: rawQ.opciones.map((opt: any) => ({
      id: opt.id,
      nombre: opt.nombre,
      tipo: opt.tipo,
      descripcion: opt.descripcion,
      analogia: opt.descripcion,
      iconoPixelArt: opt.iconoPixelArt || 'microchip',
      codigoSnippet: opt.codigoSnippet,
    })) as [HardwareChip, HardwareChip, HardwareChip],
    correctComponents: rawQ.solucion,
    errorExplanation: {
      mensaje: rawQ.pistaError.mensaje,
      causaRaizTecnica: rawQ.pistaError.detallesTecnicos,
      recomendacionDoc: rawQ.pistaError.recomendacionDoc,
    },
    explicacionAcierto: rawQ.explicacionAcierto,
  };
}

// Estructura completa de los 6 Niveles Curriculares
export const CURRICULUM_LEVELS: Level[] = [
  {
    id: 1,
    title: 'Nivel 1: Conceptos Básicos NoSQL',
    subtitulo: 'Tablas vs Colecciones, BSON y Documentos Embebidos',
    theorySummary: LEVEL_1_THEORY,
    components: LEVEL_1_CHIPS,
    questions: module1Questions.map(q => adaptQuestion(q, 1)),
  },
  {
    id: 2,
    title: 'Nivel 2: Operaciones CRUD Básicas',
    subtitulo: 'Identificador _id, consultas find() y mutaciones con $set e $inc',
    theorySummary: LEVEL_2_THEORY,
    components: LEVEL_2_CHIPS,
    questions: module2Questions.map(q => adaptQuestion(q, 2)),
  },
  {
    id: 3,
    title: 'Nivel 3: Aggregation Framework (Tuberías)',
    subtitulo: 'Cinta de montaje: $match, $group con acumuladores y $project',
    theorySummary: LEVEL_3_THEORY,
    components: LEVEL_3_CHIPS,
    questions: module3Questions.map(q => adaptQuestion(q, 3)),
  },
  {
    id: 4,
    title: 'Nivel 4: Mongoose ODM y Modelado',
    subtitulo: 'Esquemas estrictos, validaciones, hooks de ciclo de vida y .lean()',
    theorySummary: LEVEL_4_THEORY,
    components: LEVEL_4_CHIPS,
    questions: module4Questions.map(q => adaptQuestion(q, 4)),
  },
  {
    id: 5,
    title: 'Nivel 5: Diseño de Esquemas (Embeber vs Referenciar)',
    subtitulo: 'Criterio de acceso, límite de 16MB y antipatrón de arrays infinitos',
    theorySummary: LEVEL_5_THEORY,
    components: LEVEL_5_CHIPS,
    questions: module5Questions.map(q => adaptQuestion(q, 5)),
  },
  {
    id: 6,
    title: 'Nivel 6: Rendimiento, Seguridad y Conexión',
    subtitulo: 'Índices B-Tree (IXSCAN vs COLLSCAN), regla ESR, .env y Connection Pools',
    theorySummary: LEVEL_6_THEORY,
    components: LEVEL_6_CHIPS,
    questions: module6Questions.map(q => adaptQuestion(q, 6)),
  },
];

// Lista aplanada de las 100 preguntas para acceso indexado rápido
export const ALL_100_QUESTIONS: Question[] = CURRICULUM_LEVELS.flatMap(lvl => lvl.questions);
export const TOTAL_QUESTIONS_COUNT = ALL_100_QUESTIONS.length; // 100

