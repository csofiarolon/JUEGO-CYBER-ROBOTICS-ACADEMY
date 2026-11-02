import { RawModuleQuestion } from '../../types/game';

export const module6Questions: RawModuleQuestion[] = [
  {
    id: 85,
    modulo: 6,
    moduloNombre: 'Índices B-Tree, Rendimiento y Seguridad',
    tituloDesafio: 'Diagnóstico de Sobrecarga Térmica: COLLSCAN vs IXSCAN',
    premisa: 'El reactor del androide se sobrecalienta. La herramienta explain("executionStats") revela: stage: "COLLSCAN", totalDocsExamined: 2,500,000, nReturned: 1, executionTimeMillis: 3400ms. ¿Qué componente soluciona el fallo?',
    codigoContexto: '// explain("executionStats"):\n{\n  "executionStages": {\n    "stage": "COLLSCAN",\n    "nReturned": 1,\n    "totalDocsExamined": 2500000\n  }\n}',
    opciones: [
      {
        id: 'm6-c1',
        nombre: 'B-Tree Index Injection Unit (IXSCAN)',
        tipo: 'instruction_set',
        descripcion: 'Crea un índice B-Tree en el campo consultado para transformar el escaneo lineal de colección en una búsqueda logarítmica O(log N).',
        iconoPixelArt: 'crystal',
        codigoSnippet: 'db.robots.createIndex({ serialCode: 1 });'
      },
      {
        id: 'm6-c2',
        nombre: 'Cooling Liquid Overdrive',
        tipo: 'flux_capacitor',
        descripcion: 'Baja la temperatura del procesador pero deja la query tardando 3.4 segundos.',
        iconoPixelArt: 'capacitor'
      },
      {
        id: 'm6-c3',
        nombre: 'Collection Scan Accelerator',
        tipo: 'core_processor',
        descripcion: 'Obliga a MongoDB a leer los 2.5 millones de documentos con 4 hilos sin usar índice.',
        iconoPixelArt: 'microchip'
      }
    ],
    solucion: ['m6-c1'],
    pistaError: {
      mensaje: 'Un COLLSCAN examina cada documento de la colección en disco. Un índice B-Tree (IXSCAN) reduce la búsqueda a saltos de puntero directos.',
      tipoAnimacion: 'COLLSCAN_OVERHEAT',
      detallesTecnicos: 'La métrica totalDocsExamined / nReturned debe aproximarse a 1. Un ratio de 2,500,000 / 1 denota ausencia absoluta de índice.',
      recomendacionDoc: 'MongoDB Performance: Analyzing explain() executionStats.'
    },
    explicacionAcierto: 'Crear el índice B-Tree pasa la consulta de COLLSCAN a IXSCAN, reduciendo los documentos examinados de 2,500,000 a 1.'
  },
  {
    id: 86,
    modulo: 6,
    moduloNombre: 'Índices B-Tree, Rendimiento y Seguridad',
    tituloDesafio: 'La Regla de Oro ESR (Equality, Sort, Range)',
    premisa: 'Se ejecuta la consulta: db.robots.find({ status: "ACTIVE", battery: { $gte: 20 } }).sort({ priority: -1 }). Para maximizar el rendimiento y evitar un SORT en memoria, ¿en qué orden deben definirse los campos del índice compuesto?',
    opciones: [
      {
        id: 'm6-c4',
        nombre: 'ESR Rule Compiler ({ Equality, Sort, Range })',
        tipo: 'instruction_set',
        descripcion: 'Aplica el orden axiomático: 1° Igualdad (status), 2° Ordenamiento (priority), 3° Rango (battery).',
        iconoPixelArt: 'pipeline',
        codigoSnippet: 'db.robots.createIndex({ status: 1, priority: -1, battery: 1 });'
      },
      {
        id: 'm6-c5',
        nombre: 'Range First Inversion ({ battery: 1, priority: -1, status: 1 })',
        tipo: 'core_processor',
        descripcion: 'Pone el rango primero, lo cual anula el uso del índice para el ordenamiento sort.',
        iconoPixelArt: 'microchip'
      },
      {
        id: 'm6-c6',
        nombre: 'Sort Only Single Field Index',
        tipo: 'memory_bus',
        descripcion: 'Indexa solo priority descartando los filtros de igualdad y rango.',
        iconoPixelArt: 'ram'
      }
    ],
    solucion: ['m6-c4'],
    pistaError: {
      mensaje: 'Si colocas un campo de Rango antes del campo de Ordenamiento, MongoDB no puede usar el árbol B-Tree para ordenar y hace un SORT en memoria.',
      tipoAnimacion: 'PIPELINE_STALL_ORDER',
      detallesTecnicos: 'La regla ESR (Equality, Sort, Range) es la directriz fundamental para diseñar índices compuestos de máximo rendimiento en MongoDB.',
      recomendacionDoc: 'MongoDB Manual: The Equality, Sort, Range (ESR) Rule.'
    },
    explicacionAcierto: 'La regla ESR garantiza que el índice resuelva la igualdad exacta, entregue los datos preordenados y finalmente aplique el rango sin SORT en RAM.'
  },
  {
    id: 87,
    modulo: 6,
    moduloNombre: 'Índices B-Tree, Rendimiento y Seguridad',
    tituloDesafio: 'Consultas Cubiertas (Covered Queries): Cero Lecturas de Documento',
    premisa: 'Se busca alcanzar el máximo rendimiento posible donde totalDocsExamined sea exactamente 0 (cero), respondiendo la consulta exclusivamente desde la memoria del índice B-Tree sin tocar los documentos en disco.',
    opciones: [
      {
        id: 'm6-c7',
        nombre: 'Covered Query Indexer & Projection Unit',
        tipo: 'instruction_set',
        descripcion: 'Indexa todos los campos consultados y proyecta únicamente campos del índice excluyendo explícitamente el _id.',
        iconoPixelArt: 'crystal',
        codigoSnippet: '// Índice: db.robots.createIndex({ callsign: 1, sector: 1 });\n// Query: db.robots.find({ callsign: "R2" }, { callsign: 1, sector: 1, _id: 0 });'
      },
      {
        id: 'm6-c8',
        nombre: 'Default Wildcard Projection (with _id: 1)',
        tipo: 'core_processor',
        descripcion: 'Olvida excluir el _id obligando a MongoDB a ir al disco a leer el documento.',
        iconoPixelArt: 'microchip'
      },
      {
        id: 'm6-c9',
        nombre: 'Unindexed Projection Bus',
        tipo: 'memory_bus',
        descripcion: 'Proyecta campos que no existen en el índice B-Tree.',
        iconoPixelArt: 'ram'
      }
    ],
    solucion: ['m6-c7'],
    pistaError: {
      mensaje: 'Una Covered Query requiere que TODOS los campos del filtro y la proyección residan en el índice, y que el _id sea explícitamente suprimido ({ _id: 0 }).',
      tipoAnimacion: 'COLLSCAN_OVERHEAT',
      detallesTecnicos: 'Al cumplirse, `totalDocsExamined` es 0 y `stage` es solo IXSCAN + PROJECTION_COVERED, eliminando totalmente los I/O a páginas de documentos.',
      recomendacionDoc: 'MongoDB Documentation: Covered Queries.'
    },
    explicacionAcierto: 'Las Covered Queries responden al 100% desde la memoria del índice B-Tree logrando tiempos de respuesta de sub-milisegundos.'
  },
  {
    id: 88,
    modulo: 6,
    moduloNombre: 'Índices B-Tree, Rendimiento y Seguridad',
    tituloDesafio: 'Límite Estructural de Índices Multikey en Arrays',
    premisa: 'Un desarrollador intenta crear un índice compuesto sobre dos campos de tipo array simultáneamente: db.robots.createIndex({ tags: 1, components: 1 }). La consola devuelve un error fatal del motor.',
    opciones: [
      {
        id: 'm6-c10',
        nombre: 'Single-Array Multikey Constraint Law',
        tipo: 'instruction_set',
        descripcion: 'MongoDB prohibe terminantemente que un índice compuesto contenga más de un campo que sea un array (producto cartesiano de entradas).',
        iconoPixelArt: 'diode',
        codigoSnippet: '// Límite: Solo 1 campo de tipo array permitido por índice compuesto en BSON'
      },
      {
        id: 'm6-c11',
        nombre: 'Cartesian Matrix Multiplier',
        tipo: 'flux_capacitor',
        descripcion: 'Configura MongoDB para calcular millones de combinaciones cartesianas en el índice.',
        iconoPixelArt: 'capacitor'
      },
      {
        id: 'm6-c12',
        nombre: 'Array Flattening Hack',
        tipo: 'core_processor',
        descripcion: 'Convierte los arrays en un solo string separado por comas.',
        iconoPixelArt: 'microchip'
      }
    ],
    solucion: ['m6-c10'],
    pistaError: {
      mensaje: 'Indexar dos arrays en el mismo índice requeriría indexar el producto cartesiano de sus elementos, desbordando el tamaño del árbol B-Tree.',
      tipoAnimacion: 'INDEX_DESYNC',
      detallesTecnicos: 'MongoDB arroja CannotCreateIndex: cannot index parallel arrays when an index covers more than one array field.',
      recomendacionDoc: 'MongoDB Manual: Multikey Indexes Limitations.'
    },
    explicacionAcierto: 'MongoDB restringe los índices compuestos a un solo campo tipo array para evitar la explosión combinatoria del índice.'
  },
  {
    id: 89,
    modulo: 6,
    moduloNombre: 'Índices B-Tree, Rendimiento y Seguridad',
    tituloDesafio: 'Auto-Expiración de Tokens con Índices TTL',
    premisa: 'Las claves de autenticación cuántica del robot deben destruirse de la base de datos automáticamente 3,600 segundos (1 hora) después de su emisión, sin necesidad de crons ni scripts externos.',
    opciones: [
      {
        id: 'm6-c13',
        nombre: 'Time-To-Live (TTL) Auto-Expiring Index',
        tipo: 'instruction_set',
        descripcion: 'Crea un índice TTL sobre un campo BSON Date configurando expireAfterSeconds: 3600.',
        iconoPixelArt: 'crystal',
        codigoSnippet: 'db.auth_tokens.createIndex({ createdAt: 1 }, { expireAfterSeconds: 3600 });'
      },
      {
        id: 'm6-c14',
        nombre: 'Cron Job Delete Poller (setInterval)',
        tipo: 'core_processor',
        descripcion: 'Corre un setInterval() en Node.js que ejecuta deleteMany({ createdAt: { $lt: exp } }).',
        iconoPixelArt: 'microchip'
      },
      {
        id: 'm6-c15',
        nombre: 'String Timestamp Auto-Delete Bus',
        tipo: 'memory_bus',
        descripcion: 'Crea el índice sobre un campo String en vez de un Date perdiendo la función TTL.',
        iconoPixelArt: 'ram'
      }
    ],
    solucion: ['m6-c13'],
    pistaError: {
      mensaje: 'El hilo interno de TTL de MongoDB purga documentos automáticamente en segundo plano. Requiere obligatoriamente un campo tipo Date.',
      tipoAnimacion: 'PIPELINE_STALL_ORDER',
      detallesTecnicos: 'El hilo de fondo de TTL corre cada 60 segundos leyendo el índice y purgando documentos expirados sin sobrecargar la aplicación.',
      recomendacionDoc: 'MongoDB Manual: Expire Data from Collections by Setting TTL.'
    },
    explicacionAcierto: 'Los índices TTL automatizan la purga de sesiones y datos temporales directamente en el motor de base de datos.'
  },
  {
    id: 90,
    modulo: 6,
    moduloNombre: 'Índices B-Tree, Rendimiento y Seguridad',
    tituloDesafio: 'Índices Parciales (Partial Indexes) para Ahorro de RAM',
    premisa: 'En una flota de 10 millones de androides, el 98% están "DECOMMISSIONED" y solo el 2% están "ACTIVE". Se necesita un índice único sobre serialCode pero únicamente para los androides activos, sin gastar RAM en los inactivos.',
    opciones: [
      {
        id: 'm6-c16',
        nombre: 'Partial Index Filter Unit (partialFilterExpression)',
        tipo: 'instruction_set',
        descripcion: 'Indexa únicamente los documentos que satisfacen el filtro especificado reduciendo drásticamente el tamaño del índice en RAM.',
        iconoPixelArt: 'pipeline',
        codigoSnippet: 'db.robots.createIndex(\n  { serialCode: 1 },\n  { partialFilterExpression: { status: "ACTIVE" }, unique: true }\n);'
      },
      {
        id: 'm6-c17',
        nombre: 'Full 10-Million Monolithic Index',
        tipo: 'core_processor',
        descripcion: 'Indexa los 10 millones de registros consumiendo 4GB de RAM innecesariamente.',
        iconoPixelArt: 'microchip'
      },
      {
        id: 'm6-c18',
        nombre: 'Sparse Index Bypass Trap',
        tipo: 'memory_bus',
        descripcion: 'Usa sparse: true que solo chequea si el campo existe pero no puede filtrar por status: "ACTIVE".',
        iconoPixelArt: 'ram'
      }
    ],
    solucion: ['m6-c16'],
    pistaError: {
      mensaje: 'Los índices Sparse solo omiten documentos donde el campo no existe. Los Índices Parciales permiten filtros arbitrarios con expresiones complejas.',
      tipoAnimacion: 'BUFFER_16MB_OVERFLOW',
      detallesTecnicos: '`partialFilterExpression` permite crear índices un 95% más pequeños y rápidos limitando las entradas a subconjuntos calientes de datos.',
      recomendacionDoc: 'MongoDB Manual: Partial Indexes.'
    },
    explicacionAcierto: 'Los índices parciales optimizan el working set reteniendo en RAM solo las entradas de documentos que realmente se consultan.'
  },
  {
    id: 91,
    modulo: 6,
    moduloNombre: 'Índices B-Tree, Rendimiento y Seguridad',
    tituloDesafio: 'Búsquedas de Texto Completo con Text Indexes',
    premisa: 'Se necesita realizar búsquedas en lenguaje natural sobre las bitácoras del robot buscando palabras clave como "reactor sobrecalentado falla crítica", calculando la relevancia lingüística de cada resultado.',
    opciones: [
      {
        id: 'm6-c19',
        nombre: 'Full-Text Search Index & Score Unit ($text / $meta)',
        tipo: 'instruction_set',
        descripcion: 'Crea un índice de texto con tokenización, soporte de stopwords y ordenamiento por relevancia textScore.',
        iconoPixelArt: 'crystal',
        codigoSnippet: 'db.logs.createIndex({ message: "text" });\n// Query: db.logs.find({ $text: { $search: "reactor sobrecalentado" } }, { score: { $meta: "textScore" } }).sort({ score: { $meta: "textScore" } });'
      },
      {
        id: 'm6-c20',
        nombre: 'Linear Regex Scan Pipe (/.*falla.*/i)',
        tipo: 'core_processor',
        descripcion: 'Usa una expresión regular no anclada insensible a mayúsculas forzando un escaneo lineal completo de la colección.',
        iconoPixelArt: 'microchip'
      },
      {
        id: 'm6-c21',
        nombre: 'String Equality Exact Match',
        tipo: 'memory_bus',
        descripcion: 'Busca con { message: "reactor" } sin encontrar textos que contengan palabras adicionales.',
        iconoPixelArt: 'ram'
      }
    ],
    solucion: ['m6-c19'],
    pistaError: {
      mensaje: 'Usar regex no ancladas (`/.*text.*/`) invalida el uso de índices B-Tree estándar y causa un COLLSCAN de alto impacto en CPU.',
      tipoAnimacion: 'COLLSCAN_OVERHEAT',
      detallesTecnicos: 'Los índices de tipo "text" tokenizan palabras, descartan stopwords y calculan puntuaciones de relevancia matemática con `$meta: "textScore"`.',
      recomendacionDoc: 'MongoDB Documentation: Text Search and Text Indexes.'
    },
    explicacionAcierto: 'Los índices de texto ofrecen búsqueda semántica y ordenamiento por relevancia sin penalizar el rendimiento con escaneos regex.'
  },
  {
    id: 92,
    modulo: 6,
    moduloNombre: 'Índices B-Tree, Rendimiento y Seguridad',
    tituloDesafio: 'Navegación Geoespacial con 2dsphere',
    premisa: 'El dron de rescate debe localizar a los 3 robots más cercanos a su posición geográfica actual en el planeta (latitud, longitud) dentro de un radio de 5,000 metros.',
    opciones: [
      {
        id: 'm6-c22',
        nombre: 'GeoJSON 2dsphere Navigation Matrix',
        tipo: 'instruction_set',
        descripcion: 'Almacena coordenadas en formato GeoJSON Point [longitud, latitud] indexado con 2dsphere y consulta con $near / $maxDistance.',
        iconoPixelArt: 'pipeline',
        codigoSnippet: 'db.robots.createIndex({ location: "2dsphere" });\n// Query: db.robots.find({ location: { $near: { $geometry: { type: "Point", coordinates: [lon, lat] }, $maxDistance: 5000 } } }).limit(3);'
      },
      {
        id: 'm6-c23',
        nombre: 'Pythagorean Client Math Loop',
        tipo: 'core_processor',
        descripcion: 'Descarga todas las posiciones del planeta y calcula la distancia euclidiana plana en JavaScript.',
        iconoPixelArt: 'microchip'
      },
      {
        id: 'm6-c24',
        nombre: 'Inverted Lat/Lon Array Trap',
        tipo: 'memory_bus',
        descripcion: 'Guarda [latitud, longitud] en lugar del estándar GeoJSON [longitud, latitud] causando coordenadas erróneas.',
        iconoPixelArt: 'ram'
      }
    ],
    solucion: ['m6-c22'],
    pistaError: {
      mensaje: 'GeoJSON exige estrictamente el orden [Longitud, Latitud] y un índice 2dsphere para cálculos sobre la curvatura de la esfera terrestre.',
      tipoAnimacion: 'INDEX_DESYNC',
      detallesTecnicos: '2dsphere indexa puntos sobre la geometría WGS84 permitiendo queries $near, $geoWithin y $geoIntersects ultra-rápidas.',
      recomendacionDoc: 'MongoDB Geospatial Queries: 2dsphere Indexes.'
    },
    explicacionAcierto: 'Los índices 2dsphere y GeoJSON permiten resolver búsquedas de proximidad esférica precisas en una sola consulta indexada.'
  },
  {
    id: 93,
    modulo: 6,
    moduloNombre: 'Índices B-Tree, Rendimiento y Seguridad',
    tituloDesafio: 'Sobrecarga de Índices en Operaciones de Escritura',
    premisa: 'Un equipo junior creó 35 índices en la colección de telemetría para "prever cualquier query". El rendimiento de inserción cayó de 10,000 inserts/segundo a apenas 400 inserts/segundo. ¿Cuál es la causa?',
    opciones: [
      {
        id: 'm6-c25',
        nombre: 'Index Write-Penalty Audit & Pruning',
        tipo: 'storage_controller',
        descripcion: 'Cada índice adicional es un árbol B-Tree que debe actualizarse, rebalancearse y sincronizarse a disco en cada operación de escritura.',
        iconoPixelArt: 'storage_controller' as any,
        codigoSnippet: '// Cada insert en una colección con N índices ejecuta N+1 escrituras atómicas en disco'
      },
      {
        id: 'm6-c26',
        nombre: 'Infinite Index Free-Lunch Hypothesis',
        tipo: 'core_processor',
        descripcion: 'Cree erróneamente que los índices son gratis y no consumen CPU ni I/O en escrituras.',
        iconoPixelArt: 'microchip'
      },
      {
        id: 'm6-c27',
        nombre: 'SSD Drive Burner Relay',
        tipo: 'flux_capacitor',
        descripcion: 'Asume que el disco duro se gastó por coincidencia exactamente en el mismo instante.',
        iconoPixelArt: 'capacitor'
      }
    ],
    solucion: ['m6-c25'],
    pistaError: {
      mensaje: 'Cada índice incrementa el costo de inserción, actualización y borrado (Write Amplification). Los índices deben crearse con estricta justificación.',
      tipoAnimacion: 'COLLSCAN_OVERHEAT',
      detallesTecnicos: 'Un balance de índices saludable mantiene solo los necesarios para los patrones de lectura reales del sistema.',
      recomendacionDoc: 'MongoDB Best Practices: Indexing Strategies.'
    },
    explicacionAcierto: 'Auditar y eliminar índices redundantes recupera el throughput de escritura y reduce el consumo de memoria del working set.'
  },
  {
    id: 94,
    modulo: 6,
    moduloNombre: 'Índices B-Tree, Rendimiento y Seguridad',
    tituloDesafio: 'Desactivación Segura con Índices Ocultos (Hidden Indexes)',
    premisa: 'El DBA sospecha que el índice "old_index_v1" no se usa. Si lo borra con dropIndex() y una consulta crítica en producción dependía de él, el clúster colapsará en un COLLSCAN de emergencia antes de poder reconstruirlo (lo cual tardaría horas).',
    opciones: [
      {
        id: 'm6-c28',
        nombre: 'Hidden Index Evaluation Circuit (hideIndex)',
        tipo: 'instruction_set',
        descripcion: 'Oculta el índice al optimizador de consultas sin destruirlo de memoria/disco, permitiendo verificar si la app sufre degradación.',
        iconoPixelArt: 'crystal',
        codigoSnippet: 'db.robots.hideIndex("old_index_v1"); // Desocultar al instante si falla: db.robots.unhideIndex("old_index_v1");'
      },
      {
        id: 'm6-c29',
        nombre: 'Immediate Production dropIndex() Drop',
        tipo: 'core_processor',
        descripcion: 'Borra el índice en pleno horario pico a ciegas sin plan de contingencia.',
        iconoPixelArt: 'microchip'
      },
      {
        id: 'm6-c30',
        nombre: 'Database Replica Reboot Shift',
        tipo: 'memory_bus',
        descripcion: 'Reinicia el nodo para ver si el índice se borra solo.',
        iconoPixelArt: 'ram'
      }
    ],
    solucion: ['m6-c28'],
    pistaError: {
      mensaje: 'Borrar un índice grande en producción es irreversible a corto plazo: reconstruirlo puede demorar horas y bloquear el clúster.',
      tipoAnimacion: 'COLLSCAN_OVERHEAT',
      detallesTecnicos: 'Los índices ocultos (`hidden: true`) continúan actualizándose con las escrituras pero el planificador los ignora, permitiendo pruebas A/B seguras.',
      recomendacionDoc: 'MongoDB Manual: Hidden Indexes.'
    },
    explicacionAcierto: 'hideIndex permite comprobar la prescindibilidad de un índice de manera segura con capacidad de reversión instantánea.'
  },
  {
    id: 95,
    modulo: 6,
    moduloNombre: 'Índices B-Tree, Rendimiento y Seguridad',
    tituloDesafio: 'Auditoría de Uso de Índices con $indexStats',
    premisa: 'El hangar quiere identificar con precisión científica qué índices no han recibido una sola consulta desde el último reinicio del servidor para proceder a su eliminación.',
    opciones: [
      {
        id: 'm6-c31',
        nombre: 'Index Usage Telemetry Aggregator ($indexStats)',
        tipo: 'pipeline',
        descripcion: 'Ejecuta la etapa de agregación $indexStats para consultar el contador exacto de accesos (accesses.ops) por cada índice.',
        iconoPixelArt: 'pipeline',
        codigoSnippet: 'db.robots.aggregate([{ $indexStats: {} }]);\n// Devuelve: { name: "idx_1", accesses: { ops: 0, since: ISODate(...) } }'
      },
      {
        id: 'm6-c32',
        nombre: 'Codebase Grep Search Only',
        tipo: 'core_processor',
        descripcion: 'Busca con grep en los archivos de texto esperando encontrar todas las queries dinámicas.',
        iconoPixelArt: 'microchip'
      },
      {
        id: 'm6-c33',
        nombre: 'Random Index Russian Roulette',
        tipo: 'flux_capacitor',
        descripcion: 'Elimina un índice al azar cada viernes por la tarde.',
        iconoPixelArt: 'capacitor'
      }
    ],
    solucion: ['m6-c31'],
    pistaError: {
      mensaje: 'La etapa $indexStats provee telemetría directa desde el motor de base de datos sobre la cantidad de veces que cada índice fue elegido.',
      tipoAnimacion: 'INDEX_DESYNC',
      detallesTecnicos: 'Un índice con `accesses.ops: 0` durante semanas es un candidato indiscutible para purga, liberando RAM y optimizando writes.',
      recomendacionDoc: 'MongoDB Operators: $indexStats aggregation stage.'
    },
    explicacionAcierto: '$indexStats identifica con precisión objetiva los índices inactivos que consumen memoria y ralentizan las escrituras.'
  },
  {
    id: 96,
    modulo: 6,
    moduloNombre: 'Índices B-Tree, Rendimiento y Seguridad',
    tituloDesafio: 'Prevención de Inyecciones NoSQL por Expresiones de Objeto',
    premisa: 'Un atacante envía en el cuerpo JSON de autenticación { "username": "admin", "password": { "$gt": "" } }. El endpoint usa findOne(req.body) sin sanitizar y el atacante ingresa como administrador sin conocer la contraseña.',
    codigoContexto: '// Vulnerabilidad crítica NoSQL Injection:\nconst user = await UserModel.findOne({\n  username: req.body.username,\n  password: req.body.password // Si recibe {"$gt": ""}, evalúa verdadero para cualquier string\n});',
    opciones: [
      {
        id: 'm6-c34',
        nombre: 'NoSQL Operator Sanitizer & Type Enforcer',
        tipo: 'instruction_set',
        descripcion: 'Sanitiza los datos de entrada eliminando claves que inicien con "$" y fuerza tipos primitivos estrictos (String) antes de la consulta.',
        iconoPixelArt: 'crystal',
        codigoSnippet: '// Sanitización con mongo-sanitize o forzado de tipo:\nconst password = String(req.body.password);\n// O validación de esquema con Zod/Joi'
      },
      {
        id: 'm6-c35',
        nombre: 'Disable MongoDB Authentication',
        tipo: 'core_processor',
        descripcion: 'Quita las contraseñas de todos los androides para que no haga falta autenticar.',
        iconoPixelArt: 'microchip'
      },
      {
        id: 'm6-c36',
        nombre: 'Raw JSON Input Trust Pipeline',
        tipo: 'memory_bus',
        descripcion: 'Pasa req.body directamente a la base de datos confiando en el usuario.',
        iconoPixelArt: 'ram'
      }
    ],
    solucion: ['m6-c34'],
    pistaError: {
      mensaje: 'Aceptar objetos JSON arbitrarios en campos de consulta permite inyectar operadores de comparación de MongoDB como $gt, $ne o $regex.',
      tipoAnimacion: 'DATA_CORRUPTION_NO_SET',
      detallesTecnicos: 'Convertir explícitamente a String primitivo o usar middleware de sanitización (ej. mongo-sanitize) neutraliza la inyección NoSQL.',
      recomendacionDoc: 'OWASP: Testing for NoSQL Injection in MongoDB.'
    },
    explicacionAcierto: 'Sanitizar operadores de consulta y validar tipos estrictos previene ataques de inyección NoSQL y omisiones de autenticación.'
  },
  {
    id: 97,
    modulo: 6,
    moduloNombre: 'Índices B-Tree, Rendimiento y Seguridad',
    tituloDesafio: 'Control de Acceso Basado en Roles (RBAC) y Menor Privilegio',
    premisa: 'El microservicio de reportes solo necesita consultar la colección de robots. El administrador le otorgó el rol "root" en la base "admin", violando los principios de seguridad de la Flota.',
    opciones: [
      {
        id: 'm6-c37',
        nombre: 'Principle of Least Privilege Role (read)',
        tipo: 'instruction_set',
        descripcion: 'Asigna un usuario específico con el rol read acotado exclusivamente a la base de datos de producción requerida.',
        iconoPixelArt: 'crystal',
        codigoSnippet: 'db.createUser({\n  user: "reportService",\n  pwd: password,\n  roles: [{ role: "read", db: "fleet_db" }]\n});'
      },
      {
        id: 'm6-c38',
        nombre: 'Superadmin Root Everywhere Token',
        tipo: 'core_processor',
        descripcion: 'Usa el usuario root con permisos de clusterAdmin para todas las aplicaciones.',
        iconoPixelArt: 'microchip'
      },
      {
        id: 'm6-c39',
        nombre: 'Anonymous No-Auth Port Opener',
        tipo: 'flux_capacitor',
        descripcion: 'Inicia mongod sin el flag --auth en el puerto público 27017.',
        iconoPixelArt: 'capacitor'
      }
    ],
    solucion: ['m6-c37'],
    pistaError: {
      mensaje: 'El principio de menor privilegio exige conceder únicamente los permisos estrictamente necesarios para la función del servicio.',
      tipoAnimacion: 'TRANSACTION_ABORT',
      detallesTecnicos: 'El RBAC de MongoDB provee roles granulares (read, readWrite, dbAdmin) aislados por base de datos, mitigando el impacto de brechas de seguridad.',
      recomendacionDoc: 'MongoDB Security: Built-In Roles.'
    },
    explicacionAcierto: 'Asignar roles de lectura acotados previene modificaciones accidentales o destructivas por parte de servicios analíticos.'
  },
  {
    id: 98,
    modulo: 6,
    moduloNombre: 'Índices B-Tree, Rendimiento y Seguridad',
    tituloDesafio: 'Cifrado en Tránsito (TLS/SSL) y en Reposo (Encryption at Rest)',
    premisa: 'Las transmisiones entre el robot y el clúster viajan en texto plano a través de la red estelar, exponiendo credenciales a ataques de interceptación Man-In-The-Middle.',
    opciones: [
      {
        id: 'm6-c40',
        nombre: 'TLS/SSL Cryptographic Shield & WiredTiger Keyfile',
        tipo: 'crypto_unit',
        descripcion: 'Exige TLS 1.3 con certificados de autoridad para el tráfico de red y activa el cifrado AES-256 en reposo de WiredTiger.',
        iconoPixelArt: 'shield',
        codigoSnippet: 'net.tls.mode: "requireTLS"\nnet.tls.certificateKeyFile: "/certs/mongo.pem"\nsecurity.enableEncryption: true'
      },
      {
        id: 'm6-c41',
        nombre: 'Plaintext Unencrypted Port',
        tipo: 'memory_bus',
        descripcion: 'Envía paquetes de red abiertos sin cifrado para ahorrar 0.1% de CPU.',
        iconoPixelArt: 'ram'
      },
      {
        id: 'm6-c42',
        nombre: 'ROT13 String Obfuscator',
        tipo: 'core_processor',
        descripcion: 'Aplica el algoritmo ROT13 en el cliente antes de enviar el JSON.',
        iconoPixelArt: 'microchip'
      }
    ],
    solucion: ['m6-c40'],
    pistaError: {
      mensaje: 'Operar sin TLS permite a cualquier nodo intermedio de red inspeccionar y modificar el tráfico de base de datos en tránsito.',
      tipoAnimacion: 'TRANSACTION_ABORT',
      detallesTecnicos: 'TLS garantiza confidencialidad e integridad criptográfica en la capa de transporte, mientras Encryption at Rest protege los archivos físicos ante robo de discos.',
      recomendacionDoc: 'MongoDB Security: TLS/SSL Configuration.'
    },
    explicacionAcierto: 'Requerir TLS y cifrado en reposo protege los datos sensibles tanto durante el tránsito por red como en el almacenamiento físico.'
  },
  {
    id: 99,
    modulo: 6,
    moduloNombre: 'Índices B-Tree, Rendimiento y Seguridad',
    tituloDesafio: 'Elección de Primario en Replica Sets y Quórum',
    premisa: 'En un Replica Set de 3 nodos (1 Primario y 2 Secundarios), el nodo Primario se desconecta de la red. ¿Cómo detectan los secundarios el fallo y cuánto tiempo dura el proceso de elección de un nuevo Primario?',
    opciones: [
      {
        id: 'm6-c43',
        nombre: 'Heartbeat Quorum Protocol (2s Heartbeat / 10s Timeout)',
        tipo: 'instruction_set',
        descripcion: 'Los nodos intercambian heartbeats cada 2 segundos; tras 10 segundos sin respuesta, los secundarios forman quórum de mayoría y eligen un nuevo Primario.',
        iconoPixelArt: 'crystal',
        codigoSnippet: '// Protocolo Raft-like de Replica Set: Quórum de mayoría estricta (N/2 + 1)'
      },
      {
        id: 'm6-c44',
        nombre: 'Manual Admin Intervention Required',
        tipo: 'core_processor',
        descripcion: 'El clúster permanece caído para siempre hasta que un operador humano se conecte por SSH a reiniciar.',
        iconoPixelArt: 'microchip'
      },
      {
        id: 'm6-c45',
        nombre: 'Multi-Primary Simultaneous Split-Brain',
        tipo: 'flux_capacitor',
        descripcion: 'Todos los nodos se autoproclaman Primarios al mismo tiempo escribiendo datos contradictorios.',
        iconoPixelArt: 'capacitor'
      }
    ],
    solucion: ['m6-c43'],
    pistaError: {
      mensaje: 'MongoDB previene el temido escenario de "Split-Brain" exigiendo una mayoría estricta de votos (N/2 + 1) para que un nodo sea promovido a Primario.',
      tipoAnimacion: 'TRANSACTION_ABORT',
      detallesTecnicos: 'La detección de caída ocurre típicamente dentro de los 10 a 12 segundos, tras lo cual se realiza la elección automática sin intervención humana.',
      recomendacionDoc: 'MongoDB Replication: Replica Set Elections.'
    },
    explicacionAcierto: 'El protocolo de elección por quórum asegura alta disponibilidad y conmutación automática ante caídas sin riesgo de Split-Brain.'
  },
  {
    id: 100,
    modulo: 6,
    moduloNombre: 'Índices B-Tree, Rendimiento y Seguridad',
    tituloDesafio: 'Antipatrón de Sharding: Clave Monotónica Creciente',
    premisa: 'Para particionar una flota de 100 millones de robots en un clúster de Sharding, se eligió como Shard Key el campo createdAt (o un ObjectId auto-incremental). De inmediato, todo el tráfico de escritura colapsa en un solo Shard mientras los demás están al 0% de uso.',
    opciones: [
      {
        id: 'm6-c46',
        nombre: 'Hashed Shard Key / High-Cardinality Composite Distributor',
        tipo: 'storage_controller',
        descripcion: 'Un contador monotónico enruta todas las inserciones al último chunk del mismo Shard ("Hot Shard"). Se debe usar Hashed Shard Key o clave compuesta balanceada.',
        iconoPixelArt: 'storage_controller' as any,
        codigoSnippet: 'sh.shardCollection("fleet.robots", { _id: "hashed" }); // Distribución uniforme por hash'
      },
      {
        id: 'm6-c47',
        nombre: 'Keep Monotonic Hotspot Overload',
        tipo: 'core_processor',
        descripcion: 'Deja el campo monotónico y compra 50 servidores más para el shard que sufre el cuello de botella.',
        iconoPixelArt: 'microchip'
      },
      {
        id: 'm6-c48',
        nombre: 'Single-Shard Consolidation Revert',
        tipo: 'memory_bus',
        descripcion: 'Desactiva el sharding y vuelve a una base de datos de un solo disco.',
        iconoPixelArt: 'ram'
      }
    ],
    solucion: ['m6-c46'],
    pistaError: {
      mensaje: 'Valores monotónicos crecientes insertan siempre en el límite superior del rango ({ $gte: MaxKey }), sobrecargando un solo servidor (Hotspot).',
      tipoAnimacion: 'COLLSCAN_OVERHEAT',
      detallesTecnicos: 'Una Shard Key hashed calcula un hash MD5/SHA de la clave distribuyendo los chunks equitativamente entre todos los shards del clúster.',
      recomendacionDoc: 'MongoDB Sharding: Shard Key Selection & Hashed Sharding.'
    },
    explicacionAcierto: 'Las Shard Keys hasheadas o de alta cardinalidad dispersa distribuyen uniformemente las escrituras eliminando puntos calientes en el clúster.'
  }
];

