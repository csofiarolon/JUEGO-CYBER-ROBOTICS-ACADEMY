import { RawModuleQuestion } from '../../types/game';

export const module5Questions: RawModuleQuestion[] = [
  {
    id: 69,
    modulo: 5,
    moduloNombre: 'Modelado de Datos: Embebido vs Referencias',
    tituloDesafio: 'Patrón de División de Documento (Document Split)',
    premisa: 'El androide tiene un perfil con datos básicos de 200 bytes consultados 10,000 veces por segundo, y un manual técnico binario de 14MB consultado una vez al mes. Embeber ambos en el mismo documento satura la memoria RAM del clúster.',
    opciones: [
      {
        id: 'm5-c1',
        nombre: 'Document Split Architectural Pattern',
        tipo: 'storage_controller',
        descripcion: 'Separa el documento en dos colecciones: "robots" (datos livianos en RAM) y "robot_manuals" (payloads pesados por referencia).',
        iconoPixelArt: 'storage_controller' as any,
        codigoSnippet: '// Colección 1: Robot (200B) -> Colección 2: RobotManual (14MB referenciado)'
      },
      {
        id: 'm5-c2',
        nombre: 'Single Megadocument Embedder',
        tipo: 'core_processor',
        descripcion: 'Mantiene los 14MB embebidos forzando a WiredTiger a cargar 14MB en RAM en cada lectura del perfil.',
        iconoPixelArt: 'microchip'
      },
      {
        id: 'm5-c3',
        nombre: 'Base64 In-Memory String Compressor',
        tipo: 'memory_bus',
        descripcion: 'Convierte el binario a Base64 haciendo que ocupe un 33% más de espacio.',
        iconoPixelArt: 'ram'
      }
    ],
    solucion: ['m5-c1'],
    pistaError: {
      mensaje: 'Cargar campos masivos y de bajo uso en el mismo documento contamina la memoria caché de WiredTiger y expulsa documentos activos.',
      tipoAnimacion: 'BUFFER_16MB_OVERFLOW',
      detallesTecnicos: 'El patrón Document Split separa campos de alta frecuencia y poco peso de aquellos pesados y de baja frecuencia para proteger el Working Set.',
      recomendacionDoc: 'MongoDB Design Patterns: Document Split Pattern.'
    },
    explicacionAcierto: 'El patrón Document Split preserva la memoria de trabajo cargando únicamente la información de alta demanda en el working set.'
  },
  {
    id: 70,
    modulo: 5,
    moduloNombre: 'Modelado de Datos: Embebido vs Referencias',
    tituloDesafio: '1:N Acotado vs 1:N No Acotado (Unbounded)',
    premisa: 'Un robot tiene 3 baterías (1:N acotado conocido) pero emite 10,000,000 de lecturas de sensores a lo largo de su vida útil (1:N no acotado). ¿Cómo se modela cada una?',
    opciones: [
      {
        id: 'm5-c4',
        nombre: 'Hybrid Model (Embed Bounded, Parent-Reference Unbounded)',
        tipo: 'instruction_set',
        descripcion: 'Embebe el array de 3 baterías en el documento del robot, y referencia el robotId como clave foránea en cada lectura de sensor.',
        iconoPixelArt: 'crystal',
        codigoSnippet: '// Robot: { baterias: [...] } // 1:N Acotado (Embed)\n// SensorLog: { robotId: ObjectId, valor: 42 } // 1:N No Acotado (Referencia al Padre)'
      },
      {
        id: 'm5-c5',
        nombre: 'Embed Everything Megachip',
        tipo: 'core_processor',
        descripcion: 'Embebe los 10 millones de lecturas en un array gigante dentro del documento del robot.',
        iconoPixelArt: 'microchip'
      },
      {
        id: 'm5-c6',
        nombre: 'Reference Everything SQL Normalizer',
        tipo: 'memory_bus',
        descripcion: 'Crea una tabla y colección separada para cada campo individual requiriendo 15 joins para leer un robot.',
        iconoPixelArt: 'ram'
      }
    ],
    solucion: ['m5-c4'],
    pistaError: {
      mensaje: 'Embeber arrays no acotados causará fatalmente el error de 16MB. Referenciar todo requiere múltiples roundtrips innecesarios.',
      tipoAnimacion: 'UNBOUNDED_ARRAY_FATAL',
      detallesTecnicos: 'Regla de oro de MongoDB: 1:Pocos se embebe para lectura atómica en una pasada; 1:Muchos / 1:Infinito se modela con referencia al padre.',
      recomendacionDoc: 'MongoDB Data Modeling: 1-to-N Relationships.'
    },
    explicacionAcierto: 'Embeber estructuras acotadas y referenciar eventos infinitos al padre es el pilar de un modelado documental escalable.'
  },
  {
    id: 71,
    modulo: 5,
    moduloNombre: 'Modelado de Datos: Embebido vs Referencias',
    tituloDesafio: 'El Peligro del Antipatrón de Array Infinito',
    premisa: 'El androide guarda sus órdenes de misión en un array interno. Tras 2 años de operaciones, las actualizaciones updateOne tardan 800ms y fragmentan el disco. ¿Por qué ocurre esta degradación?',
    opciones: [
      {
        id: 'm5-c7',
        nombre: 'Document Relocation & Reallocation Throttler',
        tipo: 'storage_controller',
        descripcion: 'A medida que el array crece y excede la página preasignada en disco, WiredTiger debe reubicar físicamente el documento completo.',
        iconoPixelArt: 'storage_controller' as any,
        codigoSnippet: '// Antipatrón Unbounded Array: produce reasignación de memoria continua y fragmentación'
      },
      {
        id: 'm5-c8',
        nombre: 'Cosmic Ray Hard Drive Eraser',
        tipo: 'flux_capacitor',
        descripcion: 'La radiación espacial ralentiza los arrays de JavaScript.',
        iconoPixelArt: 'capacitor'
      },
      {
        id: 'm5-c9',
        nombre: 'Index Inversion Paradox',
        tipo: 'core_processor',
        descripcion: 'Los índices dejan de funcionar cuando un array tiene más de 5 elementos.',
        iconoPixelArt: 'microchip'
      }
    ],
    solucion: ['m5-c7'],
    pistaError: {
      mensaje: 'Documentos en continuo crecimiento obligan a reasignar memoria, fragmentan las páginas de disco y alcanzan eventualmente el límite de 16MB.',
      tipoAnimacion: 'UNBOUNDED_ARRAY_FATAL',
      detallesTecnicos: 'El crecimiento dinámico sin tope de arrays en documentos individuales es el antipatrón más costoso en sistemas MongoDB.',
      recomendacionDoc: 'MongoDB Anti-Patterns: Massive Arrays.'
    },
    explicacionAcierto: 'Evitar arrays infinitos previene la continua reasignación de memoria y la saturación del motor de almacenamiento.'
  },
  {
    id: 72,
    modulo: 5,
    moduloNombre: 'Modelado de Datos: Embebido vs Referencias',
    tituloDesafio: 'Patrón de Subconjunto (Subset Pattern)',
    premisa: 'Un robot de servicio tiene un historial de 50,000 reparaciones. En la interfaz web del hangar, el 99% de las consultas de los ingenieros solo miran las últimas 5 reparaciones más recientes. ¿Cómo se diseña?',
    opciones: [
      {
        id: 'm5-c10',
        nombre: 'Subset Pattern Cache Unit',
        tipo: 'instruction_set',
        descripcion: 'Almacena un array con las 5 reparaciones más recientes en el documento principal del robot, y la totalidad en una colección histórica "repairs".',
        iconoPixelArt: 'crystal',
        codigoSnippet: '// Robot: { recentRepairs: [ /* max 5 */ ] }\n// Repairs Collection: almacena los 50,000 registros completos'
      },
      {
        id: 'm5-c11',
        nombre: 'Fetch-All 50,000 Array Pipe',
        tipo: 'memory_bus',
        descripcion: 'Carga las 50,000 reparaciones por la red y hace repairs.slice(0, 5) en el navegador.',
        iconoPixelArt: 'ram'
      },
      {
        id: 'm5-c12',
        nombre: 'Purge Old History Eraser',
        tipo: 'storage_controller',
        descripcion: 'Borra las 49,995 reparaciones viejas para que nadie pueda ver el histórico jamás.',
        iconoPixelArt: 'storage_controller' as any
      }
    ],
    solucion: ['m5-c10'],
    pistaError: {
      mensaje: 'Descargar 50,000 registros cuando solo se muestran 5 satura ancho de banda y memoria.',
      tipoAnimacion: 'BUFFER_16MB_OVERFLOW',
      detallesTecnicos: 'El patrón Subset resuelve el compromiso de acceso: datos inmediatos embebidos en el documento maestro, archivo histórico desacoplado en colección referenciada.',
      recomendacionDoc: 'MongoDB Design Patterns: The Subset Pattern.'
    },
    explicacionAcierto: 'El Subset Pattern mantiene los documentos principales ligeros y acelera la carga de pantallas que solo requieren datos recientes.'
  },
  {
    id: 73,
    modulo: 5,
    moduloNombre: 'Modelado de Datos: Embebido vs Referencias',
    tituloDesafio: 'Patrón de Referencia Extendida (Extended Reference)',
    premisa: 'Cada robot está asignado a una "Estación Espacial". La consulta del robot necesita mostrar el nombre de la estación y su galaxia. Hacer $lookup o populate continuo en miles de llamadas añade latencia indeseada.',
    opciones: [
      {
        id: 'm5-c13',
        nombre: 'Extended Reference Caching Core',
        tipo: 'instruction_set',
        descripcion: 'Copia (desnormaliza) los 2 o 3 campos invariables de la estación dentro del documento del robot junto con su ObjectId referenciado.',
        iconoPixelArt: 'pipeline',
        codigoSnippet: 'station: {\n  _id: stationId,\n  name: "Deep Space 9",\n  galaxy: "Alpha Quadrant"\n}'
      },
      {
        id: 'm5-c14',
        nombre: 'Strict SQL Foreign Key Only',
        tipo: 'core_processor',
        descripcion: 'Guarda solo el ObjectId puro forzando un JOIN en cada lectura de la vista.',
        iconoPixelArt: 'microchip'
      },
      {
        id: 'm5-c15',
        nombre: 'Full Station Clone Embedder',
        tipo: 'memory_bus',
        descripcion: 'Copia los 500 campos de la estación espacial completa dentro de cada robot.',
        iconoPixelArt: 'ram'
      }
    ],
    solucion: ['m5-c13'],
    pistaError: {
      mensaje: 'Copiar todo el documento genera duplicación masiva. Dejar solo el ID obliga a un JOIN en cada render.',
      tipoAnimacion: 'PIPELINE_STALL_ORDER',
      detallesTecnicos: 'El patrón de Referencia Extendida duplica selectivamente campos de solo lectura o poco mutables para evitar consultas cruzadas.',
      recomendacionDoc: 'MongoDB Patterns: The Extended Reference Pattern.'
    },
    explicacionAcierto: 'La Referencia Extendida elimina consultas secundarias copiando campos clave de lectura sin duplicar entidades completas.'
  },
  {
    id: 74,
    modulo: 5,
    moduloNombre: 'Modelado de Datos: Embebido vs Referencias',
    tituloDesafio: 'Patrón de Cubetas (Bucket Pattern) para Series Temporales',
    premisa: 'El sensor de voltaje del robot genera una lectura cada segundo (86,400 por día). Crear 86,400 documentos diarios satura los índices de fecha; meter las 86,400 en un solo array desborda los 16MB.',
    opciones: [
      {
        id: 'm5-c16',
        nombre: 'Hourly Bucket Time-Series Assembler',
        tipo: 'storage_controller',
        descripcion: 'Agrupa lecturas en cubetas fijas (ej. 1 documento por robot por hora conteniendo 3,600 lecturas y metadatos agregados).',
        iconoPixelArt: 'storage_controller' as any,
        codigoSnippet: '{\n  robotId: id,\n  hour: ISODate("2026-10-26T20:00:00Z"),\n  count: 3600,\n  readings: [ { sec: 0, v: 220 }, ... ]\n}'
      },
      {
        id: 'm5-c17',
        nombre: 'One Document Per Millisecond Flooder',
        tipo: 'core_processor',
        descripcion: 'Crea 86 millones de documentos individuales con un índice cada uno.',
        iconoPixelArt: 'microchip'
      },
      {
        id: 'm5-c18',
        nombre: 'Infinite Document Monster',
        tipo: 'memory_bus',
        descripcion: 'Guarda todos los años de la vida del robot en un único documento de 500MB.',
        iconoPixelArt: 'ram'
      }
    ],
    solucion: ['m5-c16'],
    pistaError: {
      mensaje: 'Crear un documento por segundo hace explotar el tamaño de los índices B-Tree en RAM. Un documento único excede 16MB.',
      tipoAnimacion: 'COLLSCAN_OVERHEAT',
      detallesTecnicos: 'El Bucket Pattern consolida intervalos regulares de series temporales en cubetas predecibles, maximizando la compresión y la eficiencia de índices.',
      recomendacionDoc: 'MongoDB Design Patterns: The Bucket Pattern.'
    },
    explicacionAcierto: 'El Bucket Pattern reduce drásticamente el tamaño del índice y mejora la compresión en disco agrupando métricas por ventanas de tiempo.'
  },
  {
    id: 75,
    modulo: 5,
    moduloNombre: 'Modelado de Datos: Embebido vs Referencias',
    tituloDesafio: 'Patrón de Atributos (Attribute Pattern)',
    premisa: 'El catálogo del hangar almacena 5,000 modelos de androides. Cada modelo tiene especificaciones únicas y dispares (voltaje, torsión, visión nocturna, camuflaje, etc.). Crear un índice para cada campo agota el límite de 64 índices por colección.',
    opciones: [
      {
        id: 'm5-c19',
        nombre: 'Key-Value Attribute Pattern Bus',
        tipo: 'instruction_set',
        descripcion: 'Estructura las especificaciones dinámicas como un array de pares clave/valor con un solo índice multikey compuesto.',
        iconoPixelArt: 'pipeline',
        codigoSnippet: 'specs: [\n  { k: "voltaje", v: 220 },\n  { k: "camuflaje", v: "óptico" }\n]\n// Índice único: db.robots.createIndex({ "specs.k": 1, "specs.v": 1 })'
      },
      {
        id: 'm5-c20',
        nombre: '64 Separate Sparsely Populated Fields',
        tipo: 'core_processor',
        descripcion: 'Crea 300 columnas separadas en el documento y llena la colección de campos nulos.',
        iconoPixelArt: 'microchip'
      },
      {
        id: 'm5-c21',
        nombre: 'Regex Text Search Everything',
        tipo: 'memory_bus',
        descripcion: 'Une todas las propiedades en una sola cadena de texto no indexada.',
        iconoPixelArt: 'ram'
      }
    ],
    solucion: ['m5-c19'],
    pistaError: {
      mensaje: 'MongoDB limita las colecciones a un máximo estricto de 64 índices. Campos dispares sin normalizar agotan este límite rápidamente.',
      tipoAnimacion: 'COLLSCAN_OVERHEAT',
      detallesTecnicos: 'El patrón de Atributos transforma campos heterogéneos en un array homogéneo `{ k, v }`, permitiendo indexar cientos de atributos con un solo índice.',
      recomendacionDoc: 'MongoDB Design Patterns: The Attribute Pattern.'
    },
    explicacionAcierto: 'El Attribute Pattern indexa especificaciones heterogéneas con un único índice multikey compuesto sin saturar el límite de índices.'
  },
  {
    id: 76,
    modulo: 5,
    moduloNombre: 'Modelado de Datos: Embebido vs Referencias',
    tituloDesafio: 'Patrón de Versionado de Esquema (Schema Versioning)',
    premisa: 'La flota tiene 1 millón de androides con el esquema V1. El nuevo firmware V2 cambia la estructura de armas. Detener el sistema para migrar 1 millón de documentos en una ventana de mantenimiento es inaceptable.',
    opciones: [
      {
        id: 'm5-c22',
        nombre: 'Schema Versioning Pattern (schema_version: 2)',
        tipo: 'instruction_set',
        descripcion: 'Incluye un campo versionador en el documento. La aplicación maneja documentos V1 y V2 concurrentemente, migrando bajo demanda al leer/escribir.',
        iconoPixelArt: 'crystal',
        codigoSnippet: '{\n  _id: id,\n  schemaVersion: 2,\n  weapons: [ /* nuevo formato V2 */ ]\n}'
      },
      {
        id: 'm5-c23',
        nombre: 'Offline Hard Stop DB Migration',
        tipo: 'core_processor',
        descripcion: 'Apaga la base de datos durante 12 horas para correr un script de migración masivo.',
        iconoPixelArt: 'microchip'
      },
      {
        id: 'm5-c24',
        nombre: 'Ignore Schema Version Crashes',
        tipo: 'memory_bus',
        descripcion: 'Lanza el nuevo código esperando que no exploten los documentos viejos.',
        iconoPixelArt: 'ram'
      }
    ],
    solucion: ['m5-c22'],
    pistaError: {
      mensaje: 'Las migraciones masivas offline provocan downtime. En bases de datos NoSQL, el versionado de esquema permite evolución continua sin paradas de servicio.',
      tipoAnimacion: 'SCHEMA_VALIDATION_BLOCKED',
      detallesTecnicos: 'El Schema Versioning Pattern permite que el código backend detecte `schemaVersion` y transforme el objeto al vuelo o al guardarlo.',
      recomendacionDoc: 'MongoDB Patterns: The Schema Versioning Pattern.'
    },
    explicacionAcierto: 'El Schema Versioning Pattern posibilita migraciones de datos progresivas con cero downtime en entornos de alta disponibilidad.'
  },
  {
    id: 77,
    modulo: 5,
    moduloNombre: 'Modelado de Datos: Embebido vs Referencias',
    tituloDesafio: 'Modelado de Árboles: Patrón de Ancestros (Ancestors Array)',
    premisa: 'La jerarquía militar de comando de androides tiene múltiples niveles: Comandante -> Capitán -> Sargento -> Unidad. Se necesita consultar en un solo paso todos los subordinados de un Comandante sin recursiones infinitas.',
    opciones: [
      {
        id: 'm5-c25',
        nombre: 'Array of Ancestors Tree Architecture',
        tipo: 'instruction_set',
        descripcion: 'Cada androide guarda un array con los ObjectIds de todos sus ancestros directos e indirectos indexado con un índice multikey.',
        iconoPixelArt: 'pipeline',
        codigoSnippet: '{\n  _id: "SOLDIER_9",\n  parent: "SGT_3",\n  ancestors: ["CMD_1", "CPT_2", "SGT_3"]\n}\n// Búsqueda instantánea: db.robots.find({ ancestors: "CMD_1" })'
      },
      {
        id: 'm5-c26',
        nombre: 'Parent-Only Recursive Loop ($graphLookup Heavy)',
        tipo: 'core_processor',
        descripcion: 'Guarda solo el padre inmediato forzando a la app a hacer 10 queries anidadas para saber quién está bajo el comandante.',
        iconoPixelArt: 'microchip'
      },
      {
        id: 'm5-c27',
        nombre: 'Single Hierarchical JSON Monolith',
        tipo: 'memory_bus',
        descripcion: 'Embebe a todo el ejército dentro del documento del comandante superando el límite de 100 niveles.',
        iconoPixelArt: 'ram'
      }
    ],
    solucion: ['m5-c25'],
    pistaError: {
      mensaje: 'Guardar solo el padre directo requiere recursión costosa en la base. Guardar el árbol entero embebido viola límites de tamaño y anidación.',
      tipoAnimacion: 'UNBOUNDED_ARRAY_FATAL',
      detallesTecnicos: 'El patrón Array of Ancestors permite encontrar todos los descendientes de un nodo en un solo query indexado de alta velocidad.',
      recomendacionDoc: 'MongoDB Tree Structures: Array of Ancestors.'
    },
    explicacionAcierto: 'El Array de Ancestros optimiza las consultas jerárquicas en una sola lectura B-Tree sin requerir recursiones de múltiples niveles.'
  },
  {
    id: 78,
    modulo: 5,
    moduloNombre: 'Modelado de Datos: Embebido vs Referencias',
    tituloDesafio: 'Modelado de Árboles: Rutas Materializadas (Materialized Paths)',
    premisa: 'Se necesita consultar androides por rama de fabricación usando búsquedas de prefijo jerárquico como "/hangar/alpha/sector_b/". ¿Qué patrón representa la ruta como un string indexable?',
    opciones: [
      {
        id: 'm5-c28',
        nombre: 'Materialized Paths String Indexer',
        tipo: 'instruction_set',
        descripcion: 'Almacena la ruta completa como un string delimitado por barras con un índice B-Tree para consultas con expresiones regulares ancladas (^).',
        iconoPixelArt: 'crystal',
        codigoSnippet: '{\n  _id: "CHIP_4",\n  path: "/hangar_1/chasis_a/cpu_01/"\n}\n// Query: db.chips.find({ path: /^\\/hangar_1\\/chasis_a\\// })'
      },
      {
        id: 'm5-c29',
        nombre: 'Unanchored Wildcard Search',
        tipo: 'core_processor',
        descripcion: 'Usa regex sin ancla /.*hangar.*/ que fuerza un COLLSCAN completo.',
        iconoPixelArt: 'microchip'
      },
      {
        id: 'm5-c30',
        nombre: 'Random Hash Graph Node',
        tipo: 'memory_bus',
        descripcion: 'Genera números aleatorios que pierden la relación de jerarquía.',
        iconoPixelArt: 'ram'
      }
    ],
    solucion: ['m5-c28'],
    pistaError: {
      mensaje: 'Las rutas materializadas con regex ancladas al inicio (^) pueden utilizar índices B-Tree estándar para búsquedas de subárbol completas.',
      tipoAnimacion: 'COLLSCAN_OVERHEAT',
      detallesTecnicos: 'MongoDB optimiza las búsquedas con expresiones regulares que comienzan con prefijos literales `^` convirtiéndolas en un escaneo de rango en el índice B-Tree.',
      recomendacionDoc: 'MongoDB Manual: Model Tree Structures with Materialized Paths.'
    },
    explicacionAcierto: 'Materialized Paths permite búsquedas de ramas enteras de un árbol en un solo escaneo de rango B-Tree eficiente.'
  },
  {
    id: 79,
    modulo: 5,
    moduloNombre: 'Modelado de Datos: Embebido vs Referencias',
    tituloDesafio: 'Patrón de Valores Atípicos (Outlier Pattern)',
    premisa: 'El 99.9% de los robots tienen menos de 10 amigos en su red social cibernética. Sin embargo, el "Robot Emperador" tiene 2,000,000 de amigos. Rediseñar el esquema entero de amigos para todos por culpa de un solo caso rompe la eficiencia general.',
    opciones: [
      {
        id: 'm5-c31',
        nombre: 'Outlier Pattern Exception Flag (has_overflow: true)',
        tipo: 'instruction_set',
        descripcion: 'Embebe el array para la inmensa mayoría normal, y activa una bandera has_overflow en los casos extremos para derivar el resto a una colección auxiliar.',
        iconoPixelArt: 'crystal',
        codigoSnippet: '{\n  _id: "EMPEROR_BOT",\n  has_overflow: true,\n  friends: [ /* primeros 1,000 */ ]\n  // El restante 1,999,000 reside en "robot_friends_overflow"\n}'
      },
      {
        id: 'm5-c32',
        nombre: 'Force Unbounded Array Crash',
        tipo: 'core_processor',
        descripcion: 'Deja que el documento del robot crezca hasta sobrepasar los 16MB y crashee el servidor.',
        iconoPixelArt: 'microchip'
      },
      {
        id: 'm5-c33',
        nombre: 'Global Normalization Overhaul',
        tipo: 'memory_bus',
        descripcion: 'Castiga al 99.9% de los usuarios normales obligándolos a hacer consultas complejas por culpa del caso aislado.',
        iconoPixelArt: 'ram'
      }
    ],
    solucion: ['m5-c31'],
    pistaError: {
      mensaje: 'Optimizar toda la arquitectura en base a un valor extremo degrada el caso habitual. El Outlier Pattern aísla la anomalía sin perjudicar al resto.',
      tipoAnimacion: 'UNBOUNDED_ARRAY_FATAL',
      detallesTecnicos: 'El Outlier Pattern detecta cuando un documento sobrepasa un umbral y desvía los excedentes a una colección desbordada preservando el caso común.',
      recomendacionDoc: 'MongoDB Design Patterns: The Outlier Pattern.'
    },
    explicacionAcierto: 'El Outlier Pattern maximiza el rendimiento del 99% de casos típicos mientras maneja de forma segura las excepciones estadísticas.'
  },
  {
    id: 80,
    modulo: 5,
    moduloNombre: 'Modelado de Datos: Embebido vs Referencias',
    tituloDesafio: 'Patrón de Cómputo Previo (Computed Pattern)',
    premisa: 'La tabla de clasificación de batalla calcula el daño total infligido sumando 1,000 combates por robot. Hacer esta suma con $group cada vez que un usuario abre la tabla ralentiza la base de datos a 15 RPS.',
    opciones: [
      {
        id: 'm5-c34',
        nombre: 'Pre-Computed Field Accumulator',
        tipo: 'instruction_set',
        descripcion: 'Mantiene un campo precalculado "totalDamageDealt" en el documento del robot que se incrementa con $inc al registrar cada combate.',
        iconoPixelArt: 'pipeline',
        codigoSnippet: 'await Robot.updateOne({ _id: robotId }, { $inc: { totalDamageDealt: damageDelta } });'
      },
      {
        id: 'm5-c35',
        nombre: 'Real-Time Full Aggregate on Every Request',
        tipo: 'core_processor',
        descripcion: 'Ejecuta un $group sobre 5 millones de combates en cada carga de página.',
        iconoPixelArt: 'microchip'
      },
      {
        id: 'm5-c36',
        nombre: 'Client-Side LocalStorage Math',
        tipo: 'memory_bus',
        descripcion: 'Calcula el daño total en el navegador del usuario permitiendo trampas.',
        iconoPixelArt: 'ram'
      }
    ],
    solucion: ['m5-c34'],
    pistaError: {
      mensaje: 'Recalcular agregaciones pesadas en lecturas frecuentes colapsa el CPU. Calcular en la escritura mediante $inc reduce la lectura a O(1).',
      tipoAnimacion: 'COLLSCAN_OVERHEAT',
      detallesTecnicos: 'El Computed Pattern traslada la carga computacional desde la lectura repetitiva hacia la escritura infrecuente.',
      recomendacionDoc: 'MongoDB Design Patterns: The Computed Pattern.'
    },
    explicacionAcierto: 'El Computed Pattern optimiza drásticamente sistemas de alta lectura manteniendo campos calculados acumulativos mediante $inc.'
  },
  {
    id: 81,
    modulo: 5,
    moduloNombre: 'Modelado de Datos: Embebido vs Referencias',
    tituloDesafio: 'Peligros de Referencia Bidireccional (Two-Way Referencing)',
    premisa: 'El robot guarda el ID de su hangar ({ hangarId: ObjectId }), y el hangar guarda el array de todos sus robots ({ robots: [ObjectId] }). Al transferir un robot de hangar, la transacción se interrumpió y los documentos quedaron en contradicción.',
    opciones: [
      {
        id: 'm5-c37',
        nombre: 'Single-Source of Truth Unidirectional Reference',
        tipo: 'instruction_set',
        descripcion: 'Almacena la relación en una única dirección (referencia en el robot al hangar) y consulta con un simple find({ hangarId }).',
        iconoPixelArt: 'crystal',
        codigoSnippet: '// En Robot: { hangarId: ObjectId }\n// En Hangar: NO duplicar el array de robots'
      },
      {
        id: 'm5-c38',
        nombre: 'Manual Cross-Sync Poller',
        tipo: 'core_processor',
        descripcion: 'Crea un cron job cada 5 segundos que intente reparar las discrepancias.',
        iconoPixelArt: 'microchip'
      },
      {
        id: 'm5-c39',
        nombre: 'Ignore Desync Anarchy',
        tipo: 'memory_bus',
        descripcion: 'Acepta que un robot figure como habitante de 2 hangares al mismo tiempo.',
        iconoPixelArt: 'ram'
      }
    ],
    solucion: ['m5-c37'],
    pistaError: {
      mensaje: 'Mantener referencias bidireccionales sin transacciones atómicas produce estados inconsistentes y arrays no acotados.',
      tipoAnimacion: 'DATA_CORRUPTION_NO_SET',
      detallesTecnicos: 'El Two-Way Referencing añade sobrecarga de sincronización en cada mutación. La referencia unidireccional indexada elimina la redundancia.',
      recomendacionDoc: 'MongoDB Manual: Model One-to-Many Relationships.'
    },
    explicacionAcierto: 'La referencia unidireccional establece una única fuente de la verdad evitando contradicciones e inconsistencias relacionales.'
  },
  {
    id: 82,
    modulo: 5,
    moduloNombre: 'Modelado de Datos: Embebido vs Referencias',
    tituloDesafio: 'Tradeoff de Rendimiento: Read-Heavy vs Write-Heavy',
    premisa: 'Un sistema de telemetría de combate tiene 1,000 escrituras por segundo y solo 1 lectura por hora. El arquitecto desnormalizó 15 colecciones dentro de cada documento, provocando que cada una de las 1,000 escrituras deba actualizar 15 sitios distintos.',
    opciones: [
      {
        id: 'm5-c40',
        nombre: 'Write-Optimized Normalized Architecture',
        tipo: 'storage_controller',
        descripcion: 'En cargas Write-Heavy se normaliza para escrituras rápidas y atómicas; la desnormalización solo conviene en arquitecturas Read-Heavy.',
        iconoPixelArt: 'storage_controller' as any,
        codigoSnippet: '// Write-Heavy: Escrituras directas en colecciones normalizadas sin sobrecarga de propagación'
      },
      {
        id: 'm5-c41',
        nombre: 'Massive Fan-Out Distributed Update',
        tipo: 'core_processor',
        descripcion: 'Mantiene las 15 desnormalizaciones bloqueando el clúster con 15,000 updates por segundo.',
        iconoPixelArt: 'microchip'
      },
      {
        id: 'm5-c42',
        nombre: 'Drop Write Concerns (w: 0) to Hide Cost',
        tipo: 'flux_capacitor',
        descripcion: 'Usa escrituras no reconocidas perdiendo datos ante cualquier falla.',
        iconoPixelArt: 'capacitor'
      }
    ],
    solucion: ['m5-c40'],
    pistaError: {
      mensaje: 'La desnormalización es una optimización para acelerar lecturas. Aplicarla en sistemas dominados por la escritura crea un cuello de botella brutal.',
      tipoAnimacion: 'COLLSCAN_OVERHEAT',
      detallesTecnicos: 'El diseño del modelo debe regirse por la relación Lectura/Escritura (Read/Write ratio): normalizar para escribir rápido, denormalizar para leer rápido.',
      recomendacionDoc: 'MongoDB Architecture: Workload-Driven Modeling.'
    },
    explicacionAcierto: 'Diseñar el modelo respetando el perfil de carga (Write-Heavy vs Read-Heavy) previene cuellos de botella por propagación de actualizaciones.'
  },
  {
    id: 83,
    modulo: 5,
    moduloNombre: 'Modelado de Datos: Embebido vs Referencias',
    tituloDesafio: 'Patrón Polimórfico (Polymorphic Pattern)',
    premisa: 'El hangar almacena diferentes entidades mecánicas: Drones, Androides, Tanques y Baterías Estáticas. Comparten 5 atributos comunes pero cada uno tiene 20 campos particulares. ¿Cómo se unifica en una colección?',
    opciones: [
      {
        id: 'm5-c43',
        nombre: 'Polymorphic Schema Pattern (entity_type descriptor)',
        tipo: 'instruction_set',
        descripcion: 'Almacena todas las entidades en la misma colección con un campo descriptor de tipo para consultas transversales y específicas.',
        iconoPixelArt: 'crystal',
        codigoSnippet: '{\n  _id: id,\n  entityType: "DRONE", // "ANDROID" | "TANK" | "BATTERY"\n  status: "ACTIVE",\n  // Campos específicos según entityType\n}'
      },
      {
        id: 'm5-c44',
        nombre: 'Four Siloed Database Engines',
        tipo: 'storage_controller',
        descripcion: 'Instala 4 servidores de bases de datos diferentes para cada entidad.',
        iconoPixelArt: 'storage_controller' as any
      },
      {
        id: 'm5-c45',
        nombre: 'Strict SQL Table Flattening',
        tipo: 'core_processor',
        descripcion: 'Crea una tabla con 200 columnas vacías donde el 95% de los campos son null.',
        iconoPixelArt: 'microchip'
      }
    ],
    solucion: ['m5-c43'],
    pistaError: {
      mensaje: 'Separar entidades similares en colecciones estancas impide realizar inventarios globales y añade complejidad.',
      tipoAnimacion: 'SCHEMA_VALIDATION_BLOCKED',
      detallesTecnicos: 'El Polymorphic Pattern aprovecha la flexibilidad de esquema de MongoDB para almacenar familias de objetos con forma variable en una misma colección.',
      recomendacionDoc: 'MongoDB Design Patterns: The Polymorphic Pattern.'
    },
    explicacionAcierto: 'El Patrón Polimórfico unifica entidades heterogéneas bajo una estructura compartida facilitando consultas integrales.'
  },
  {
    id: 84,
    modulo: 5,
    moduloNombre: 'Modelado de Datos: Embebido vs Referencias',
    tituloDesafio: 'Anti-Patrón: Grandes Documentos con Bajas Modificaciones',
    premisa: 'El robot contiene un array de 100 subdocumentos de 10KB cada uno (1MB total). Cada 100ms se actualiza un contador de 4 bytes en uno de esos subdocumentos. En cada actualización, WiredTiger escribe el bloque de compresión entero.',
    opciones: [
      {
        id: 'm5-c46',
        nombre: 'Decoupled Hot-Cold Field Separation',
        tipo: 'storage_controller',
        descripcion: 'Extrae los campos de alta frecuencia de escritura ("hot data") a una colección ligera separada de los datos estáticos ("cold data").',
        iconoPixelArt: 'storage_controller' as any,
        codigoSnippet: '// Colección HotData: { robotId, counter } (escritura ultra rápida en página de 64 bytes)'
      },
      {
        id: 'm5-c47',
        nombre: 'Keep Bulky Megadocument Rewrite',
        tipo: 'core_processor',
        descripcion: 'Sigue reescribiendo el bloque comprimido de 1MB 10 veces por segundo destruyendo el I/O.',
        iconoPixelArt: 'microchip'
      },
      {
        id: 'm5-c48',
        nombre: 'Disable Compression Completely',
        tipo: 'flux_capacitor',
        descripcion: 'Desactiva la compresión de disco para que ocupe aún más espacio.',
        iconoPixelArt: 'capacitor'
      }
    ],
    solucion: ['m5-c46'],
    pistaError: {
      mensaje: 'Reescribir continuamente documentos voluminosos para mutar contadores diminutos causa amplificación de escritura en disco (Write Amplification).',
      tipoAnimacion: 'BUFFER_16MB_OVERFLOW',
      detallesTecnicos: 'Separar datos calientes (hot data) de datos fríos (cold data) reduce la tasa de compresión y descompresión de bloques en WiredTiger.',
      recomendacionDoc: 'MongoDB Performance: Write Amplification and Document Size.'
    },
    explicacionAcierto: 'Desacoplar campos de alta frecuencia de escritura previene la amplificación de I/O en disco y optimiza la memoria de página.'
  }
];

