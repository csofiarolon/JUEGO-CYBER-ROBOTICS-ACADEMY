import { RawModuleQuestion } from '../../types/game';

export const module1Questions: RawModuleQuestion[] = [
  {
    id: 1,
    modulo: 1,
    moduloNombre: 'Fundamentos NoSQL y Arquitectura BSON',
    tituloDesafio: 'Flexibilidad de Esquema vs Tablas Rígidas SQL',
    premisa: 'En el taller de cyber-robótica, cada robot se ensambla con sensores personalizados (un dron tiene alas y altitud, un robot terrestre tiene orugas y blindaje). En una base de datos relacional SQL clásica, agregar un sensor nuevo obliga a ejecutar un costoso ALTER TABLE que bloquea la producción y llena la tabla de columnas NULL vacías. ¿Qué arquitectura NoSQL de MongoDB resuelve esto permitiendo que cada robot guarde sus propios atributos de forma flexible?',
    codigoContexto: '// En SQL relacional tradicional:\nALTER TABLE robots ADD COLUMN scanner_cuantico VARCHAR(255); -- Bloquea escrituras\n// En MongoDB NoSQL:\n// Los documentos en la misma colección no requieren las mismas columnas fijas.',
    opciones: [
      {
        id: 'm1-c1',
        nombre: 'Colección de Documentos BSON Dinámicos (Schema-Free)',
        tipo: 'instruction_set',
        descripcion: 'Permite que cada documento en la misma colección contenga atributos diferentes sin un esquema tabular rígido ni bloqueos por ALTER TABLE.',
        iconoPixelArt: 'microchip',
        codigoSnippet: '// Cada documento es auto-contenido\n{ modelo: "Dron", altitudMax: 1200 }\n{ modelo: "Tanque", blindajeMm: 80 }'
      },
      {
        id: 'm1-c2',
        nombre: 'Tabla Relacional con 50 Columnas NULL',
        tipo: 'core_processor',
        descripcion: 'Crea una tabla SQL fija con decenas de columnas vacías para prever futuros componentes desconocidos.',
        iconoPixelArt: 'diode'
      },
      {
        id: 'm1-c3',
        nombre: 'Bloqueador Estático ALTER TABLE',
        tipo: 'memory_bus',
        descripcion: 'Detiene las operaciones del taller durante horas cada vez que un robot añade un sensor nuevo.',
        iconoPixelArt: 'ram'
      }
    ],
    solucion: ['m1-c1'],
    pistaError: {
      mensaje: 'Las bases de datos relacionales SQL exigen que todas las filas compartan exactamente las mismas columnas predefinidas. MongoDB es NoSQL documental y permite esquemas dinámicos flexibles.',
      tipoAnimacion: 'SCHEMA_VALIDATION_BLOCKED',
      detallesTecnicos: 'En MongoDB, las colecciones no imponen una estructura rígida de columnas a nivel de almacenamiento. Cada documento BSON es auto-contenido.',
      recomendacionDoc: 'Manual MongoDB: SQL to MongoDB Mapping Chart & Document Model.'
    },
    explicacionAcierto: '¡Correcto! En MongoDB no existen tablas rígidas ni filas uniformes. Cada documento BSON es flexible y auto-contenido, permitiendo iterar y evolucionar los modelos sin alterar toda la base de datos ni provocar downtime.'
  },
  {
    id: 2,
    modulo: 1,
    moduloNombre: 'Fundamentos NoSQL y Arquitectura BSON',
    tituloDesafio: 'Mapeo Conceptual: Tablas a Colecciones y Filas a Documentos',
    premisa: 'Un desarrollador junior proveniente de SQL busca en la consola de MongoDB el comando equivalente a CREATE TABLE robots e INSERT INTO robots (modelo, estado) VALUES ("Dron-1", "ACTIVO"). ¿Cuál es la equivalencia conceptual y el comando nativo correspondiente en MongoDB?',
    codigoContexto: '// En SQL:\n// Tabla: robots | Fila: ("Dron-1", "ACTIVO")\n// ¿Cuál es el comando idiomático en MongoDB?',
    opciones: [
      {
        id: 'm1-c4',
        nombre: 'Colección y Documento BSON (db.robots.insertOne)',
        tipo: 'instruction_set',
        descripcion: 'Las Tablas equivalen a Colecciones, y las Filas a Documentos BSON insertados con db.robots.insertOne().',
        iconoPixelArt: 'crystal',
        codigoSnippet: 'db.robots.insertOne({\n  modelo: "Dron-1",\n  estado: "ACTIVO"\n});'
      },
      {
        id: 'm1-c5',
        nombre: 'Tabla Virtual con Driver ODBC SQL',
        tipo: 'core_processor',
        descripcion: 'Fuerza a MongoDB a crear tablas relacionales tradicionales con stored procedures relacionales.',
        iconoPixelArt: 'microchip'
      },
      {
        id: 'm1-c6',
        nombre: 'Archivo CSV Plano de Filas Rígidas',
        tipo: 'storage_controller',
        descripcion: 'Guarda cada robot como una línea de texto plano delimitada por comas sin estructura jerárquica.',
        iconoPixelArt: 'storage_controller' as any
      }
    ],
    solucion: ['m1-c4'],
    pistaError: {
      mensaje: 'En MongoDB no existen tablas ni filas. Se agrupan documentos BSON dentro de colecciones usando insertOne().',
      tipoAnimacion: 'BSON_TYPE_MISMATCH',
      detallesTecnicos: 'La jerarquía en MongoDB es: Base de Datos -> Colecciones (Tablas) -> Documentos BSON (Filas/Registros).',
      recomendacionDoc: 'MongoDB Docs: Mapping SQL Concepts to MongoDB.'
    },
    explicacionAcierto: '¡Exacto! En MongoDB las tablas se denominan Colecciones y las filas son Documentos BSON. El método estándar de inserción individual es db.collection.insertOne().'
  },
  {
    id: 3,
    modulo: 1,
    moduloNombre: 'Fundamentos NoSQL y Arquitectura BSON',
    tituloDesafio: 'Embeber vs Referenciar: La Eliminación de JOINs Relacionales',
    premisa: 'En una base de datos relacional SQL, para asociar un robot con sus 3 subsistemas (batería, propulsor y sensor óptico) se crea una tabla separada "subsistemas" vinculada por claves foráneas y unida con sentencias JOIN. En MongoDB, ¿cuál es el principio de modelado recomendado cuando los subsistemas siempre se leen y actualizan junto con el robot?',
    codigoContexto: '// Principio de diseño NoSQL:\n// "Los datos que se consultan juntos, se almacenan juntos en el mismo documento"',
    opciones: [
      {
        id: 'm1-c7',
        nombre: 'Documentos Embebidos (Subdocumentos en el mismo BSON)',
        tipo: 'instruction_set',
        descripcion: 'Guarda los subsistemas como subdocumentos dentro del documento del robot, resolviendo toda la lectura en un solo acceso a disco sin JOINs.',
        iconoPixelArt: 'pipeline',
        codigoSnippet: '{\n  modelo: "Dron-Scout",\n  sensores: [\n    { tipo: "LIDAR", rango: 100 },\n    { tipo: "Térmico", resolucion: "4K" }\n  ]\n}'
      },
      {
        id: 'm1-c8',
        nombre: 'Normalización Rígida con Múltiples JOINs Foráneos',
        tipo: 'core_processor',
        descripcion: 'Separa cada subsistema en 5 colecciones diminutas requiriendo múltiples uniones cruzadas lentas.',
        iconoPixelArt: 'microchip'
      },
      {
        id: 'm1-c9',
        nombre: 'String Concatenado No Estructurado',
        tipo: 'memory_bus',
        descripcion: 'Concatena los datos en un texto plano "LIDAR-100;Termico-4K" perdiendo la capacidad de indexar o consultar propiedades.',
        iconoPixelArt: 'ram'
      }
    ],
    solucion: ['m1-c7'],
    pistaError: {
      mensaje: 'La regla fundamental del modelado NoSQL es: datos que se acceden juntos deben almacenarse juntos embebidos en el mismo documento.',
      tipoAnimacion: 'COLLSCAN_OVERHEAT',
      detallesTecnicos: 'Los JOINs relacionales en bases de datos distribuidas generan latencia y sobrecarga de red. Embeber subdocumentos permite lecturas y escrituras atómicas en una sola operación.',
      recomendacionDoc: 'MongoDB Manual: Embedded Documents vs Normalized References.'
    },
    explicacionAcierto: '¡Excelente! Al embeber subdocumentos, MongoDB recupera el robot y todos sus componentes en una sola lectura atómica y rápida de disco, erradicando los lentos JOINs de SQL.'
  },
  {
    id: 4,
    modulo: 1,
    moduloNombre: 'Fundamentos NoSQL y Arquitectura BSON',
    tituloDesafio: 'BSON (Binary JSON): Tipos Ricos y Recorrido de Memoria',
    premisa: 'El sensor de telemetría intentó guardar la fecha de calibración (Date) y un identificador binario crudo usando texto plano JSON estándar. JSON solo soporta texto plano, números y booleanos sin tipos de fecha nativos ni binarios. ¿Por qué MongoDB utiliza BSON en lugar de texto plano JSON?',
    codigoContexto: '// JSON estándar:\n{ "fecha": "2026-10-27T00:00:00Z" } // ¡Es solo texto String, no tiene operaciones de fecha!\n// BSON de MongoDB:\n{ fecha: ISODate("2026-10-27T00:00:00Z"), _id: ObjectId("...") } // Tipos ricos',
    opciones: [
      {
        id: 'm1-c10',
        nombre: 'Serializador Binario BSON (Binary JSON con Tipos Ricos)',
        tipo: 'instruction_set',
        descripcion: 'Codifica los documentos en formato binario de alta velocidad, añadiendo soporte nativo para Date, ObjectId, BinData y Decimal128.',
        iconoPixelArt: 'crystal',
        codigoSnippet: '// BSON incluye encabezados de longitud para saltar campos rápidamente en disco'
      },
      {
        id: 'm1-c11',
        nombre: 'Compresor ZIP de Archivos JSON',
        tipo: 'storage_controller',
        descripcion: 'Comprime archivos de texto plano JSON pero sigue perdiendo los tipos de datos enriquecidos.',
        iconoPixelArt: 'storage_controller' as any
      },
      {
        id: 'm1-c12',
        nombre: 'Parser XML de Texto ASCII',
        tipo: 'memory_bus',
        descripcion: 'Reemplaza JSON por documentos XML de texto con etiquetas de cierre pesadas.',
        iconoPixelArt: 'ram'
      }
    ],
    solucion: ['m1-c10'],
    pistaError: {
      mensaje: 'JSON estándar carece de tipos esenciales como fechas, identificadores únicos y enteros de 64 bits. BSON es binario y soporta tipos enriquecidos.',
      tipoAnimacion: 'BSON_TYPE_MISMATCH',
      detallesTecnicos: 'BSON almacena la longitud en bytes de cada campo al inicio, permitiendo a WiredTiger recorrer y saltar campos en memoria sin parsear todo el documento.',
      recomendacionDoc: 'BSON Specification: bsonspec.org.'
    },
    explicacionAcierto: '¡Correcto! BSON (Binary JSON) es el formato nativo de MongoDB: ofrece serialización binaria ultrarrápida y tipos indispensables como Date, ObjectId y Decimal128.'
  },
  {
    id: 5,
    modulo: 1,
    moduloNombre: 'Fundamentos NoSQL y Arquitectura BSON',
    tituloDesafio: 'Anatomía del ObjectId de 12 Bytes y Timestamp Embebido',
    premisa: 'Cada nuevo robot ensamblado necesita una clave primaria única (_id). Un desarrollador junior pregunta si debe configurar un contador autoincremental (AUTO_INCREMENT) como en SQL. ¿Qué componente nativo genera MongoDB por defecto para identificar cada documento de forma descentralizada?',
    codigoContexto: 'const robotId = new mongoose.Types.ObjectId("65dfa2b1f81c9a0012345678");\n// ¿Cómo se componen sus 12 bytes internos?',
    opciones: [
      {
        id: 'm1-c13',
        nombre: 'Generador ObjectId de 12 Bytes (Con Timestamp Epoch)',
        tipo: 'instruction_set',
        descripcion: 'Genera un identificador universal único de 12 bytes (4 bytes timestamp epoch, 5 bytes máquina/proceso y 3 bytes contador) generado en el cliente sin cuellos de botella de red.',
        iconoPixelArt: 'crystal',
        codigoSnippet: 'const fechaCreacion = robotId.getTimestamp(); // Extrae fecha sin campos extra'
      },
      {
        id: 'm1-c14',
        nombre: 'Contador Centralizado AUTO_INCREMENT Relacional',
        tipo: 'core_processor',
        descripcion: 'Bloquea un registro central en cada inserción para generar números enteros consecutivos (1, 2, 3...).',
        iconoPixelArt: 'microchip'
      },
      {
        id: 'm1-c15',
        nombre: 'String Aleatorio Corto (Math.random)',
        tipo: 'memory_bus',
        descripcion: 'Genera 4 letras al azar provocando colisiones masivas de duplicados al escalar.',
        iconoPixelArt: 'ram'
      }
    ],
    solucion: ['m1-c13'],
    pistaError: {
      mensaje: 'En sistemas distribuidos, AUTO_INCREMENT genera bloqueos y fallos de escala. MongoDB utiliza ObjectId de 12 bytes.',
      tipoAnimacion: 'BSON_TYPE_MISMATCH',
      detallesTecnicos: 'Los 12 bytes de ObjectId se dividen en: 4 bytes timestamp Unix epoch, 5 bytes identificador de proceso/host, y 3 bytes contador incremental.',
      recomendacionDoc: 'MongoDB Manual: The _id Field & ObjectId Structure.'
    },
    explicacionAcierto: '¡Exacto! El ObjectId de 12 bytes asegura unicidad global sin coordinación de servidor y permite consultar la fecha exacta de creación mediante robotId.getTimestamp().'
  },
  {
    id: 6,
    modulo: 1,
    moduloNombre: 'Fundamentos NoSQL y Arquitectura BSON',
    tituloDesafio: 'Límite Crítico BSON de 16MB y Manejo de Binarios Grandes (GridFS)',
    premisa: 'El robot registra telemetría de vuelo en un solo documento continuo. Tras 24 horas de vuelo, el controlador arroja BSONObjException: object size exceeds limit. ¿Qué componente soluciona el fallo de superar el límite de tamaño por documento de MongoDB?',
    codigoContexto: '// Error en log:\nMongoServerError: BSONObj size: 16793600 (0x1004000) is larger than max BSON: 16777216',
    opciones: [
      {
        id: 'm1-c16',
        nombre: 'GridFS Partition Unit',
        tipo: 'storage_controller',
        descripcion: 'Segmenta archivos o datos binarios mayores a 16MB en chunks estándar de 255KB divididos en dos colecciones (fs.files / fs.chunks).',
        iconoPixelArt: 'storage_controller' as any,
        codigoSnippet: 'const bucket = new mongoose.mongo.GridFSBucket(db);'
      },
      {
        id: 'm1-c17',
        nombre: 'BSON Overdrive Resistor',
        tipo: 'core_processor',
        descripcion: 'Intenta forzar a WiredTiger a aceptar documentos de 64MB modificando mongodb.conf.',
        iconoPixelArt: 'microchip'
      },
      {
        id: 'm1-c18',
        nombre: 'JSON Serialization Relay',
        tipo: 'memory_bus',
        descripcion: 'Convierte el documento BSON a texto JSON crudo plano para saltarse los límites binarios.',
        iconoPixelArt: 'ram'
      }
    ],
    solucion: ['m1-c16'],
    pistaError: {
      mensaje: 'El límite estricto de documento BSON en MongoDB es 16MB. No se puede eludir en memoria de página.',
      tipoAnimacion: 'BUFFER_16MB_OVERFLOW',
      detallesTecnicos: 'WiredTiger asigna páginas de memoria optimizadas para max 16MB. Superar 16777216 bytes exige GridFS o el Subset Pattern.',
      recomendacionDoc: 'Manual MongoDB: GridFS & Document Size Limits.'
    },
    explicacionAcierto: 'GridFS divide automáticamente los payloads grandes en documentos chunk de 255KB, evitando la saturación del buffer de 16MB.'
  },
  {
    id: 7,
    modulo: 1,
    moduloNombre: 'Fundamentos NoSQL y Arquitectura BSON',
    tituloDesafio: 'Inmutabilidad del Campo Primario _id',
    premisa: 'Un script de recalibración intenta cambiar el _id de un androide existente en la base de datos y detiene el clúster con error de inmutabilidad.',
    codigoContexto: 'await RobotModel.updateOne({ _id: oldId }, { $set: { _id: newId } });',
    opciones: [
      {
        id: 'm1-c19',
        nombre: 'Document Re-Instantiation & Delete Protocol',
        tipo: 'instruction_set',
        descripcion: 'Inserta un nuevo documento con el nuevo _id y elimina atómicamente el documento viejo.',
        iconoPixelArt: 'pipeline',
        codigoSnippet: 'const doc = await Robot.findById(oldId).lean();\nawait Robot.create({ ...doc, _id: newId });\nawait Robot.deleteOne({ _id: oldId });'
      },
      {
        id: 'm1-c20',
        nombre: 'Force Field Overwrite Bypass',
        tipo: 'core_processor',
        descripcion: 'Agrega { bypassDocumentValidation: true, strict: false } para mutar el _id.',
        iconoPixelArt: 'microchip'
      },
      {
        id: 'm1-c21',
        nombre: 'WiredTiger Raw Pointer Hack',
        tipo: 'memory_bus',
        descripcion: 'Intenta modificar el puntero en memoria de la clave primaria.',
        iconoPixelArt: 'ram'
      }
    ],
    solucion: ['m1-c19'],
    pistaError: {
      mensaje: 'El campo _id es estrictamente inmutable en MongoDB una vez que el documento ha sido persistido.',
      tipoAnimacion: 'DATA_CORRUPTION_NO_SET',
      detallesTecnicos: 'El motor B-Tree de WiredTiger usa _id como clave clúster primaria inmutable. No se puede actualizar con $set.',
      recomendacionDoc: 'MongoDB Docs: The _id Field Inmutability.'
    },
    explicacionAcierto: 'Para cambiar el identificador primario de un documento es obligatorio clonarlo con el nuevo ID y purgar el anterior.'
  },
  {
    id: 8,
    modulo: 1,
    moduloNombre: 'Fundamentos NoSQL y Arquitectura BSON',
    tituloDesafio: 'Almacenamiento de Fechas y Zona Horaria (UTC 64-Bit)',
    premisa: 'Los robots en diferentes bases estelares registran eventos. Al guardar new Date(), el ingeniero nota que las horas no coinciden con su hora local de Buenos Aires (UTC-3). ¿Cómo almacena MongoDB las fechas en BSON?',
    opciones: [
      {
        id: 'm1-c22',
        nombre: 'UTC Milliseconds Epoch Clock (64-Bit)',
        tipo: 'instruction_set',
        descripcion: 'BSON Date guarda milisegundos de 64-bit desde Unix Epoch en UTC puro sin zona horaria.',
        iconoPixelArt: 'crystal',
        codigoSnippet: '// BSON Type 9 (Date): UTC milliseconds since 1970-01-01'
      },
      {
        id: 'm1-c23',
        nombre: 'Local String Time Converter',
        tipo: 'memory_bus',
        descripcion: 'Fuerza a MongoDB a guardar strings con el timezone local "YYYY-MM-DD GMT-3".',
        iconoPixelArt: 'ram'
      },
      {
        id: 'm1-c24',
        nombre: 'Timezone Compensator Offset',
        tipo: 'flux_capacitor',
        descripcion: 'Resta 3 horas fijas al reloj de la base de datos de forma global.',
        iconoPixelArt: 'capacitor'
      }
    ],
    solucion: ['m1-c22'],
    pistaError: {
      mensaje: 'BSON Date almacena un entero de 64 bits en UTC. La zona horaria local debe ser manejada en la capa de presentación/aplicación.',
      tipoAnimacion: 'BSON_TYPE_MISMATCH',
      detallesTecnicos: 'Guardar fechas como Strings impide comparaciones de rango $gte/$lte eficientes e indexables por fecha.',
      recomendacionDoc: 'MongoDB Manual: Date BSON Type.'
    },
    explicacionAcierto: 'MongoDB almacena siempre BSON Date en UTC canónico; la conversión a zona horaria del usuario corresponde a la capa de UI o a $dateToString en agregación.'
  },
  {
    id: 9,
    modulo: 1,
    moduloNombre: 'Fundamentos NoSQL y Arquitectura BSON',
    tituloDesafio: 'Sobrecarga de Nombres de Campos en BSON',
    premisa: 'El robot almacena 50 millones de micro-lecturas. El tamaño en disco es gigantesco debido a nombres de campo como "temperaturaDelModuloCentralDeNavegacion". ¿Por qué ocurre esto en BSON?',
    opciones: [
      {
        id: 'm1-c25',
        nombre: 'Key Name Compactor Protocol',
        tipo: 'memory_bus',
        descripcion: 'BSON repite las claves completas en cada documento. Se deben abreviar campos en colecciones masivas.',
        iconoPixelArt: 'ram',
        codigoSnippet: '// { t_mod: 45.2 } en vez de { temperaturaDelModuloCentralDeNavegacion: 45.2 }'
      },
      {
        id: 'm1-c26',
        nombre: 'Global Schema Key Dictionary',
        tipo: 'storage_controller',
        descripcion: 'MongoDB crea un diccionario global automático y reemplaza los nombres por 1 byte en BSON.',
        iconoPixelArt: 'storage_controller' as any
      },
      {
        id: 'm1-c27',
        nombre: 'WiredTiger Key Deletion Pulse',
        tipo: 'core_processor',
        descripcion: 'Elimina las claves y guarda solo valores en arrays posicionales.',
        iconoPixelArt: 'microchip'
      }
    ],
    solucion: ['m1-c25'],
    pistaError: {
      mensaje: 'A diferencia de las tablas SQL con esquema fijo, cada documento BSON serializa el nombre del campo completo en cada registro.',
      tipoAnimacion: 'BUFFER_16MB_OVERFLOW',
      detallesTecnicos: 'Nombres largos repetidos en millones de documentos saturan el working set en RAM de WiredTiger y espacio en disco.',
      recomendacionDoc: 'MongoDB Performance: Field Name Length Impact.'
    },
    explicacionAcierto: 'En colecciones de alto volumen, nombres de campos cortos (o aliases en Mongoose) reducen drásticamente el tamaño en RAM y disco.'
  },
  {
    id: 10,
    modulo: 1,
    moduloNombre: 'Fundamentos NoSQL y Arquitectura BSON',
    tituloDesafio: 'Validación Estricta de Strings UTF-8 en BSON',
    premisa: 'El sensor cuántico intenta almacenar secuencias de bytes crudas no válidas en un campo de texto String y la base de datos rechaza el documento.',
    opciones: [
      {
        id: 'm1-c28',
        nombre: 'BSON BinData Subtype Unit',
        tipo: 'storage_controller',
        descripcion: 'Utiliza el tipo BSON BinData (subtipo 0x00 genérico o 0x04 UUID) para payloads binarios crudos.',
        iconoPixelArt: 'storage_controller' as any,
        codigoSnippet: '{ telemetryRaw: new Buffer.from([0xFF, 0x00, 0xFE]) } // BinData'
      },
      {
        id: 'm1-c29',
        nombre: 'ASCII Lossy Converter',
        tipo: 'instruction_set',
        descripcion: 'Reemplaza los caracteres no UTF-8 con signos de interrogación.',
        iconoPixelArt: 'diode'
      },
      {
        id: 'm1-c30',
        nombre: 'Regex Encoding Wrapper',
        tipo: 'memory_bus',
        descripcion: 'Envuelve los bytes crudos dentro de un objeto RegExp BSON.',
        iconoPixelArt: 'ram'
      }
    ],
    solucion: ['m1-c28'],
    pistaError: {
      mensaje: 'BSON Strings exigen obligatoriamente codificación UTF-8 válida. Bytes arbitrarios deben guardarse como BinData.',
      tipoAnimacion: 'BSON_TYPE_MISMATCH',
      detallesTecnicos: 'Intentar guardar bytes inválidos en BSON String arroja error UTF-8 validation failed en el driver nativo.',
      recomendacionDoc: 'MongoDB Docs: BSON Types - BinData.'
    },
    explicacionAcierto: 'El tipo BSON BinData está optimizado para buffers binarios, firmas criptográficas y blobs sin restricciones de codificación de texto.'
  },
  {
    id: 11,
    modulo: 1,
    moduloNombre: 'Fundamentos NoSQL y Arquitectura BSON',
    tituloDesafio: 'Precisión Financiera y Balance Cuántico (BSON Decimal128)',
    premisa: 'El robot gestiona transferencias de créditos energéticos de alta precisión. El tipo Number (Double IEEE 754) está causando desajustes de centavos flotantes (0.1 + 0.2 !== 0.3). ¿Qué tipo BSON resuelve la precisión exacta?',
    opciones: [
      {
        id: 'm1-c31',
        nombre: 'BSON Decimal128 Micro-Bus',
        tipo: 'instruction_set',
        descripcion: 'Implementa el estándar IEEE 754-2008 Decimal128 de 34 dígitos decimales para moneda.',
        iconoPixelArt: 'pipeline',
        codigoSnippet: '{ balance: { $type: "decimal" } } // mongoose.Schema.Types.Decimal128'
      },
      {
        id: 'm1-c32',
        nombre: 'Double Float Multiplier',
        tipo: 'core_processor',
        descripcion: 'Multiplica por 1.000000001 en cada lectura para compensar el error flotante.',
        iconoPixelArt: 'microchip'
      },
      {
        id: 'm1-c33',
        nombre: 'String Text Buffer',
        tipo: 'memory_bus',
        descripcion: 'Guarda todos los saldos como Strings sin validación ni soporte aritmético nativo.',
        iconoPixelArt: 'ram'
      }
    ],
    solucion: ['m1-c31'],
    pistaError: {
      mensaje: 'Los números de punto flotante Double tienen imprecisión binaria. El uso de Strings bloquea operaciones aritméticas atómicas.',
      tipoAnimacion: 'BSON_TYPE_MISMATCH',
      detallesTecnicos: 'BSON Decimal128 maneja aritmética de punto decimal exacto con 128 bits de precisión sin redondeo binario erróneo.',
      recomendacionDoc: 'MongoDB Manual: Model Monetary Data (Decimal128).'
    },
    explicacionAcierto: 'Decimal128 es el estándar oficial de MongoDB para finanzas y precisión exacta de magnitudes físicas.'
  },
  {
    id: 12,
    modulo: 1,
    moduloNombre: 'Fundamentos NoSQL y Arquitectura BSON',
    tituloDesafio: 'Límite de Anidamiento de Subdocumentos (100 Niveles)',
    premisa: 'El subsistema de diagnósticos crea estructuras de árbol recursivas dentro de un solo documento. WiredTiger detiene la inserción con error de recursión. ¿Cuál es el límite oficial de profundidad de BSON?',
    opciones: [
      {
        id: 'm1-c34',
        nombre: 'Tree Nesting Limit (100 Levels Regulator)',
        tipo: 'instruction_set',
        descripcion: 'Aplica aplanado o referencias porque BSON tiene un límite de anidación de 100 niveles.',
        iconoPixelArt: 'diode',
        codigoSnippet: '// MongoDB límite estructural: 100 niveles de profundidad máxima'
      },
      {
        id: 'm1-c35',
        nombre: 'Infinite Stack Booster',
        tipo: 'flux_capacitor',
        descripcion: 'Configura MongoDB para admitir 10,000 subdocumentos embebidos recursivos.',
        iconoPixelArt: 'capacitor'
      },
      {
        id: 'm1-c36',
        nombre: 'Binary Serializer Nullifier',
        tipo: 'memory_bus',
        descripcion: 'Convierte el árbol en arrays tridimensionales desestructurados sin control.',
        iconoPixelArt: 'ram'
      }
    ],
    solucion: ['m1-c34'],
    pistaError: {
      mensaje: 'BSON impone un límite estricto de 100 niveles de profundidad en documentos embebidos para evitar stack overflow.',
      tipoAnimacion: 'UNBOUNDED_ARRAY_FATAL',
      detallesTecnicos: 'Alcanzar el nivel 100 produce error de parseo en el motor BSON C++. Se debe modelar con Referencias o Ancestor Array.',
      recomendacionDoc: 'MongoDB Specs: Document Nesting Depth.'
    },
    explicacionAcierto: 'El estándar BSON limita el anidamiento a 100 niveles. Modelar jerarquías profundas requiere patrones de árbol (Ancestors/Materialized Paths).'
  },
  {
    id: 13,
    modulo: 1,
    moduloNombre: 'Fundamentos NoSQL y Arquitectura BSON',
    tituloDesafio: 'Capped Collection para Telemetría FIFO Circular',
    premisa: 'La caja negra del androide debe almacenar exactamente los últimos 5,000 registros de sensores, sobreescribiendo automáticamente los más viejos sin necesidad de cron jobs ni borrados lentos.',
    opciones: [
      {
        id: 'm1-c37',
        nombre: 'Capped Collection Controller (Circular FIFO)',
        tipo: 'storage_controller',
        descripcion: 'Colección de tamaño fijo en disco con inserción ultra-rápida y reciclaje circular automático.',
        iconoPixelArt: 'storage_controller' as any,
        codigoSnippet: 'db.createCollection("telemetria", { capped: true, size: 5242880, max: 5000 });'
      },
      {
        id: 'm1-c38',
        nombre: 'Manual Delete Hook Pulse',
        tipo: 'instruction_set',
        descripcion: 'Ejecuta deleteOne() cada vez que se hace un insert() comparando fechas.',
        iconoPixelArt: 'crystal'
      },
      {
        id: 'm1-c39',
        nombre: 'TTL Auto-Sweep Module',
        tipo: 'flux_capacitor',
        descripcion: 'Aplica TTL de 1 segundo para intentar que el hilo de fondo limpie los documentos de inmediato.',
        iconoPixelArt: 'capacitor'
      }
    ],
    solucion: ['m1-c37'],
    pistaError: {
      mensaje: 'El hilo de TTL corre cada 60 segundos y no garantiza límite exacto de cantidad ni preservación estricta de orden natural.',
      tipoAnimacion: 'COLLSCAN_OVERHEAT',
      detallesTecnicos: 'Las Capped Collections mantienen orden de inserción natural preservado en disco sin fragmentación ni necesidad de indexar _id.',
      recomendacionDoc: 'Manual MongoDB: Capped Collections.'
    },
    explicacionAcierto: 'Capped Collections garantiza orden circular FIFO nativo a nivel de disco con máximo rendimiento y sin sobrecarga de delete.'
  },
  {
    id: 14,
    modulo: 1,
    moduloNombre: 'Fundamentos NoSQL y Arquitectura BSON',
    tituloDesafio: 'Agotamiento de Tickets en WiredTiger (Concurrencia)',
    premisa: 'Durante un asalto de robots, el servidor MongoDB colapsa con latencias de 10 segundos. Los logs indican: "WiredTiger read tickets exhausted". ¿Qué significa este estado?',
    opciones: [
      {
        id: 'm1-c40',
        nombre: 'Concurrency Ticket Throttle & Query Optimizer',
        tipo: 'core_processor',
        descripcion: 'Indica saturación de los 128 tickets concurrentes de lectura por operaciones lentas bloqueantes (COLLSCANs).',
        iconoPixelArt: 'microchip',
        codigoSnippet: 'db.serverStatus().wiredTiger.concurrentTransactions'
      },
      {
        id: 'm1-c41',
        nombre: 'Ticket License Multiplier',
        tipo: 'flux_capacitor',
        descripcion: 'Se debe renovar la licencia comercial de MongoDB para tener más tickets.',
        iconoPixelArt: 'capacitor'
      },
      {
        id: 'm1-c42',
        nombre: 'Connection Pool Increaser (to 50,000)',
        tipo: 'memory_bus',
        descripcion: 'Abre 50,000 conexiones cliente para que cada una tenga su propio ticket.',
        iconoPixelArt: 'ram'
      }
    ],
    solucion: ['m1-c40'],
    pistaError: {
      mensaje: 'WiredTiger tiene un pool por defecto de 128 tickets concurrentes. Abrir más conexiones empeora el encolamiento si las queries son lentas.',
      tipoAnimacion: 'COLLSCAN_OVERHEAT',
      detallesTecnicos: 'Queries sin índice retienen los tickets de lectura en disco durante segundos, bloqueando todas las demás peticiones entrantes.',
      recomendacionDoc: 'MongoDB WiredTiger Diagnostics: concurrentTransactions.'
    },
    explicacionAcierto: 'Optimizar las queries lentas libera los tickets de WiredTiger en milisegundos, erradicando el cuello de botella de concurrencia.'
  },
  {
    id: 15,
    modulo: 1,
    moduloNombre: 'Fundamentos NoSQL y Arquitectura BSON',
    tituloDesafio: 'UUID Nativo vs String UUID (16 vs 36 Bytes)',
    premisa: 'El sistema de identificación de drones genera UUID v4. Al almacenarlos como String ocupan 36 bytes por documento. ¿Cómo se almacena de forma óptima en BSON?',
    opciones: [
      {
        id: 'm1-c43',
        nombre: 'BSON UUID Binary 0x04 Subtype',
        tipo: 'instruction_set',
        descripcion: 'Almacena el UUID como BinData subtipo 4 ocupando solo 16 bytes exactos en disco y RAM.',
        iconoPixelArt: 'crystal',
        codigoSnippet: '{ droneId: new mongoose.Types.UUID() } // 16 bytes exactos'
      },
      {
        id: 'm1-c44',
        nombre: 'Base64 String Compressor',
        tipo: 'memory_bus',
        descripcion: 'Codifica el string UUID en Base64 para reducirlo a 24 caracteres.',
        iconoPixelArt: 'ram'
      },
      {
        id: 'm1-c45',
        nombre: 'BigInt Multiplier',
        tipo: 'core_processor',
        descripcion: 'Convierte el UUID eliminando los guiones a un número Double.',
        iconoPixelArt: 'microchip'
      }
    ],
    solucion: ['m1-c43'],
    pistaError: {
      mensaje: 'Un UUID como String ocupa 36 bytes; en BinData Subtipo 4 ocupa solo 16 bytes, ahorrando más del 55% de memoria en índices.',
      tipoAnimacion: 'BUFFER_16MB_OVERFLOW',
      detallesTecnicos: 'En colecciones de 10 millones de docs, la diferencia de tamaño de índice entre String y BinData UUID representa gigabytes de RAM de working set.',
      recomendacionDoc: 'MongoDB Drivers: BSON Binary Subtype 4.'
    },
    explicacionAcierto: 'BinData Subtipo 4 reduce el tamaño del UUID a 16 bytes puros, acelerando las búsquedas y el tamaño de los índices B-Tree.'
  },
  {
    id: 16,
    modulo: 1,
    moduloNombre: 'Fundamentos NoSQL y Arquitectura BSON',
    tituloDesafio: 'Compresión de Bloques en WiredTiger',
    premisa: 'El almacenamiento del hangar de androides está al 95% de capacidad. Se necesita reducir el espacio de disco en reposo sin perder rendimiento crítico de lectura. ¿Qué algoritmo de compresión viene por defecto?',
    opciones: [
      {
        id: 'm1-c46',
        nombre: 'Snappy Compressor Core (Default Balanced)',
        tipo: 'core_processor',
        descripcion: 'Snappy ofrece el mejor balance entre bajo consumo de CPU y alto throughput de compresión de bloques.',
        iconoPixelArt: 'microchip',
        codigoSnippet: 'storage.wiredTiger.collectionConfig.blockCompressor: "snappy"'
      },
      {
        id: 'm1-c47',
        nombre: 'Raw Uncompressed Fast Pipe',
        tipo: 'flux_capacitor',
        descripcion: 'Desactiva la compresión ("none") para que ocupe el triple de espacio en disco.',
        iconoPixelArt: 'capacitor'
      },
      {
        id: 'm1-c48',
        nombre: 'LZMA Extreme Archival Unit',
        tipo: 'storage_controller',
        descripcion: 'Usa LZMA ultra-pesado bloqueando la CPU del servidor en cada lectura.',
        iconoPixelArt: 'storage_controller' as any
      }
    ],
    solucion: ['m1-c46'],
    pistaError: {
      mensaje: 'Snappy es el compresor por defecto de colecciones en WiredTiger por su equilibrio óptimo; zlib se usa para mayor compresión con más CPU.',
      tipoAnimacion: 'BUFFER_16MB_OVERFLOW',
      detallesTecnicos: 'WiredTiger comprime datos en bloques en disco y los descomprime en memoria RAM de página de manera transparente.',
      recomendacionDoc: 'MongoDB Docs: WiredTiger Compression Options.'
    },
    explicacionAcierto: 'Snappy mantiene los ciclos de CPU bajos mientras ahorra entre 50% y 70% de espacio en disco frente a datos sin comprimir.'
  },
  {
    id: 17,
    modulo: 1,
    moduloNombre: 'Fundamentos NoSQL y Arquitectura BSON',
    tituloDesafio: 'Tipo BSON Int32 vs Long Int64 en JavaScript',
    premisa: 'En Node.js/Mongoose, un desarrollador guarda un contador de 5,000,000,000 (5 mil millones). El número supera el rango de 32 bits y se corrompe si se guarda como Int32. ¿Qué tipo BSON se requiere?',
    opciones: [
      {
        id: 'm1-c49',
        nombre: 'BSON Long (Int64) Processor',
        tipo: 'core_processor',
        descripcion: 'Almacena enteros de 64 bits con signo (-2^63 a 2^63-1) usando Long de BSON o BigInt.',
        iconoPixelArt: 'microchip',
        codigoSnippet: '{ counter: mongoose.mongo.Long.fromString("5000000000") }'
      },
      {
        id: 'm1-c50',
        nombre: 'Int32 Bit Truncator',
        tipo: 'instruction_set',
        descripcion: 'Trunca el número a 2,147,483,647 perdiendo la diferencia.',
        iconoPixelArt: 'diode'
      },
      {
        id: 'm1-c51',
        nombre: 'Binary Hex String Shift',
        tipo: 'memory_bus',
        descripcion: 'Convierte el número a binario crudo sin esquema numérico.',
        iconoPixelArt: 'ram'
      }
    ],
    solucion: ['m1-c49'],
    pistaError: {
      mensaje: 'Int32 tiene un valor máximo de 2,147,483,647. Valores superiores causan desbordamiento numérico si no se guardan como BSON Long (Int64).',
      tipoAnimacion: 'BSON_TYPE_MISMATCH',
      detallesTecnicos: 'JavaScript Number nativo es float de 64 bits; para enteros puros mayores a 32 bits en BSON se debe usar Long o BigInt.',
      recomendacionDoc: 'MongoDB Node Driver: BSON Long Data Type.'
    },
    explicacionAcierto: 'BSON Long (Int64) maneja de forma segura valores astronómicos de telemetría y contadores de alto tráfico sin pérdida de precisión.'
  }
];
