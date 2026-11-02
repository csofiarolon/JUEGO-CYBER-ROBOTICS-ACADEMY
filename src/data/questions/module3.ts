import { RawModuleQuestion } from '../../types/game';

export const module3Questions: RawModuleQuestion[] = [
  {
    id: 35,
    modulo: 3,
    moduloNombre: 'Pipelines de Agregación',
    tituloDesafio: 'Optimización de Etapa Temprana: $match Primero',
    premisa: 'El pipeline de telemetría analiza 10 millones de robots pero tarda 45 segundos. Un junior colocó $project y $sort antes de $match, forzando un escaneo de toda la colección en memoria. ¿Cuál es la corrección arquitectónica?',
    codigoContexto: '// Pipeline Lento:\n[\n  { $project: { sector: 1, energy: 1 } },\n  { $sort: { energy: -1 } },\n  { $match: { sector: "OMEGA" } } // ERROR: Match tardío\n]',
    opciones: [
      {
        id: 'm3-c1',
        nombre: 'Early Index Filter Stage (Early $match)',
        tipo: 'pipeline',
        descripcion: 'Coloca $match en la primera etapa para filtrar con índices B-Tree antes de cualquier transformación.',
        iconoPixelArt: 'pipeline',
        codigoSnippet: '[\n  { $match: { sector: "OMEGA" } }, // Usa índice IXSCAN inmediato\n  { $sort: { energy: -1 } },\n  { $project: { sector: 1, energy: 1 } }\n]'
      },
      {
        id: 'm3-c2',
        nombre: 'RAM Buffer Boost Shifter',
        tipo: 'memory_bus',
        descripcion: 'Duplica la memoria RAM del servidor para que el ordenamiento de 10 millones entre en caché.',
        iconoPixelArt: 'ram'
      },
      {
        id: 'm3-c3',
        nombre: 'Terminal $out Redirector',
        tipo: 'storage_controller',
        descripcion: 'Vuelca los datos a un archivo temporal sin ordenamiento.',
        iconoPixelArt: 'storage_controller' as any
      }
    ],
    solucion: ['m3-c1'],
    pistaError: {
      mensaje: '$match y $sort al inicio del pipeline pueden usar índices; tras un $project o $unwind, los índices se pierden y requieren escaneos lineales.',
      tipoAnimacion: 'PIPELINE_STALL_ORDER',
      detallesTecnicos: 'El optimizador de consultas de agregación solo puede usar índices B-Tree si el stage inicial es $match o $sort.',
      recomendacionDoc: 'MongoDB Docs: Aggregation Pipeline Optimization.'
    },
    explicacionAcierto: 'Posicionar $match como primera etapa reduce drásticamente el conjunto de datos aprovechando índices B-Tree de alta velocidad.'
  },
  {
    id: 36,
    modulo: 3,
    moduloNombre: 'Pipelines de Agregación',
    tituloDesafio: 'Métricas Globales con $group y _id Null',
    premisa: 'El comandante de flota necesita calcular el promedio total de energía y el conteo de todos los androides activos en una sola métrica agregada sin agrupar por categorías. ¿Qué clave _id se utiliza en $group?',
    opciones: [
      {
        id: 'm3-c4',
        nombre: 'Global Accumulator Stage (_id: null)',
        tipo: 'instruction_set',
        descripcion: 'Asignar _id: null agrupa la totalidad de los documentos entrantes en un único resultado consolidado.',
        iconoPixelArt: 'crystal',
        codigoSnippet: '{\n  $group: {\n    _id: null,\n    avgEnergy: { $avg: "$energy" },\n    totalRobots: { $sum: 1 }\n  }\n}'
      },
      {
        id: 'm3-c5',
        nombre: 'Dynamic ObjectId Hash Group',
        tipo: 'core_processor',
        descripcion: 'Agrupa por _id: "$_id" generando un grupo separado por cada androide individual.',
        iconoPixelArt: 'microchip'
      },
      {
        id: 'm3-c6',
        nombre: 'Empty Object Group (_id: {})',
        tipo: 'memory_bus',
        descripcion: 'Pasa un objeto vacío que arroja error de parseo en el motor de agregación.',
        iconoPixelArt: 'ram'
      }
    ],
    solucion: ['m3-c4'],
    pistaError: {
      mensaje: 'Para calcular agregaciones globales sobre toda la colección, el discriminador _id del stage $group debe ser obligatoriamente null.',
      tipoAnimacion: 'PIPELINE_STALL_ORDER',
      detallesTecnicos: '`_id: null` indica al acumulador de etapas que colapse todo el stream de entrada en un único documento de salida.',
      recomendacionDoc: 'MongoDB Manual: $group accumulator expressions.'
    },
    explicacionAcierto: '_id: null en $group colapsa todos los documentos de entrada en una sola salida global con acumuladores como $sum y $avg.'
  },
  {
    id: 37,
    modulo: 3,
    moduloNombre: 'Pipelines de Agregación',
    tituloDesafio: 'Límite de Memoria RAM de 100MB por Etapa',
    premisa: 'Una etapa $group compleja colapsa con el error: "PlanExecutor error during aggregation: QueryExceededMemoryLimitNoDiskUseAllowed: Exceeded memory limit of 104857600 bytes". ¿Cómo se autoriza el uso de disco temporal?',
    opciones: [
      {
        id: 'm3-c7',
        nombre: 'Disk Spill Overdrive ({ allowDiskUse: true })',
        tipo: 'storage_controller',
        descripcion: 'Permite que las etapas de agregación desborden a archivos temporales en disco cuando superan los 100MB de RAM.',
        iconoPixelArt: 'storage_controller' as any,
        codigoSnippet: 'await Robot.aggregate(pipeline).allowDiskUse(true);'
      },
      {
        id: 'm3-c8',
        nombre: 'Chunk Memory Truncator',
        tipo: 'core_processor',
        descripcion: 'Descarta la mitad de los datos para no superar los 100MB de límite.',
        iconoPixelArt: 'microchip'
      },
      {
        id: 'm3-c9',
        nombre: 'Virtual V8 Heap Resizer',
        tipo: 'memory_bus',
        descripcion: 'Aumenta el flag --max-old-space-size de Node.js esperando que cambie la RAM del servidor MongoDB.',
        iconoPixelArt: 'ram'
      }
    ],
    solucion: ['m3-c7'],
    pistaError: {
      mensaje: 'Cada etapa de agregación tiene un tope rígido de 100MB de RAM en el servidor MongoDB para no asfixiar el working set.',
      tipoAnimacion: 'BUFFER_16MB_OVERFLOW',
      detallesTecnicos: '`allowDiskUse: true` autoriza al ejecutor de agregaciones a crear archivos temporales en el directorio dbPath para clasificaciones masivas.',
      recomendacionDoc: 'MongoDB Aggregation: Memory Restrictions & allowDiskUse.'
    },
    explicacionAcierto: 'allowDiskUse(true) desbloquea la barrera de 100MB de RAM permitiendo procesar pipelines masivos mediante almacenamiento temporal en disco.'
  },
  {
    id: 38,
    modulo: 3,
    moduloNombre: 'Pipelines de Agregación',
    tituloDesafio: 'Left Outer Join Eficiente con $lookup',
    premisa: 'Se necesita enriquecer cada robot con la información de su "Módulo Central" almacenado en la colección "core_modules". ¿Qué etapa ejecuta este join documental eficiente?',
    opciones: [
      {
        id: 'm3-c10',
        nombre: 'Correlated $lookup Stage Linker',
        tipo: 'pipeline',
        descripcion: 'Realiza un left outer join conectando localField ("coreId") con foreignField ("_id") hacia la colección "core_modules".',
        iconoPixelArt: 'pipeline',
        codigoSnippet: '{\n  $lookup: {\n    from: "core_modules",\n    localField: "coreId",\n    foreignField: "_id",\n    as: "coreDetails"\n  }\n}'
      },
      {
        id: 'm3-c11',
        nombre: 'Client-Side Promise.all Populate Map',
        tipo: 'core_processor',
        descripcion: 'Descarga 50,000 robots y hace un findById() individual en bucle por cada uno.',
        iconoPixelArt: 'microchip'
      },
      {
        id: 'm3-c12',
        nombre: 'SQL Inner Join Wrapper',
        tipo: 'memory_bus',
        descripcion: 'Intenta inyectar comandos SELECT ... INNER JOIN en el socket.',
        iconoPixelArt: 'ram'
      }
    ],
    solucion: ['m3-c10'],
    pistaError: {
      mensaje: 'Hacer queries separadas en Node.js dentro de bucles crea el problema N+1 y destruye la latencia del clúster.',
      tipoAnimacion: 'COLLSCAN_OVERHEAT',
      detallesTecnicos: '$lookup ejecuta la unión directamente en el motor de base de datos devolviendo los documentos relacionados dentro de un array.',
      recomendacionDoc: 'MongoDB Operators: $lookup aggregation stage.'
    },
    explicacionAcierto: '$lookup realiza la correlación documental en una sola consulta de base de datos con alto rendimiento.'
  },
  {
    id: 39,
    modulo: 3,
    moduloNombre: 'Pipelines de Agregación',
    tituloDesafio: 'Preservación de Vacíos en $unwind',
    premisa: 'Un pipeline descompone el array de "armasSecundarias" de los robots con $unwind. De pronto, el reporte excluye a 4,000 androides que no tenían armas secundarias instaladas. ¿Qué opción evita perderlos?',
    opciones: [
      {
        id: 'm3-c13',
        nombre: 'Preserve Empty Arrays Bus (preserveNullAndEmptyArrays)',
        tipo: 'instruction_set',
        descripcion: 'Preserva en el flujo de salida los documentos cuyo array esté vacío, ausente o sea nulo.',
        iconoPixelArt: 'crystal',
        codigoSnippet: '{\n  $unwind: {\n    path: "$armasSecundarias",\n    preserveNullAndEmptyArrays: true\n  }\n}'
      },
      {
        id: 'm3-c14',
        nombre: 'Default Dummy Weapon Injector',
        tipo: 'core_processor',
        descripcion: 'Inserta armas ficticias "DUMMY" en todos los robots antes de ejecutar el pipeline.',
        iconoPixelArt: 'microchip'
      },
      {
        id: 'm3-c15',
        nombre: 'Basic String Syntax $unwind: "$armas"',
        tipo: 'memory_bus',
        descripcion: 'Usa la sintaxis simple de string que descarta documentos sin elementos por diseño.',
        iconoPixelArt: 'ram'
      }
    ],
    solucion: ['m3-c13'],
    pistaError: {
      mensaje: 'Por defecto, $unwind descarta cualquier documento donde el campo sea null, no exista o sea un array vacío [].',
      tipoAnimacion: 'PIPELINE_STALL_ORDER',
      detallesTecnicos: 'Activar `preserveNullAndEmptyArrays: true` emula un LEFT OUTER JOIN donde los registros sin elementos secundarios continúan con valor null.',
      recomendacionDoc: 'MongoDB Operators: $unwind preserveNullAndEmptyArrays.'
    },
    explicacionAcierto: 'preserveNullAndEmptyArrays: true evita la pérdida accidental de documentos que no posean elementos en el array de destino.'
  },
  {
    id: 40,
    modulo: 3,
    moduloNombre: 'Pipelines de Agregación',
    tituloDesafio: 'Analítica Multifacética en Paralelo: $facet',
    premisa: 'El panel de control debe devolver simultáneamente en una sola llamada: la página actual de 20 robots ordenados, el conteo total para paginación y la distribución por modelo. ¿Qué stage orquesta esto?',
    opciones: [
      {
        id: 'm3-c16',
        nombre: 'Multi-Stream Facet Reactor ($facet)',
        tipo: 'pipeline',
        descripcion: 'Ejecuta múltiples sub-pipelines de agregación en paralelo sobre el mismo conjunto de documentos filtrados.',
        iconoPixelArt: 'pipeline',
        codigoSnippet: '{\n  $facet: {\n    "paginatedResults": [{ $skip: 0 }, { $limit: 20 }],\n    "totalCount": [{ $count: "count" }],\n    "byModel": [{ $sortByCount: "$model" }]\n  }\n}'
      },
      {
        id: 'm3-c17',
        nombre: 'Three Independent Queries Shifter',
        tipo: 'memory_bus',
        descripcion: 'Lanza 3 queries de red independientes triplicando el tiempo de procesamiento.',
        iconoPixelArt: 'ram'
      },
      {
        id: 'm3-c18',
        nombre: 'Client-Side Array Slicer Relay',
        tipo: 'core_processor',
        descripcion: 'Descarga toda la base de datos completa de 2 millones de registros y usa array.slice(0, 20) en Node.',
        iconoPixelArt: 'microchip'
      }
    ],
    solucion: ['m3-c16'],
    pistaError: {
      mensaje: 'Descargar toda la colección a Node satura la memoria del backend. Tres consultas separadas duplican el trabajo de filtrado.',
      tipoAnimacion: 'BUFFER_16MB_OVERFLOW',
      detallesTecnicos: '$facet procesa múltiples dimensiones analíticas independientes dentro del motor C++ de MongoDB en un único viaje de red.',
      recomendacionDoc: 'MongoDB Manual: $facet aggregation stage.'
    },
    explicacionAcierto: '$facet permite resolver paginación, contadores y categorizaciones complejas de forma concurrente en una sola ejecución.'
  },
  {
    id: 41,
    modulo: 3,
    moduloNombre: 'Pipelines de Agregación',
    tituloDesafio: 'Preservación de Campos: $addFields vs $project',
    premisa: 'El robot tiene 40 campos de telemetría. Un desarrollador usó $project para agregar el campo calculado "eficiencia = energía / masa", pero al hacerlo desaparecieron los otros 39 campos del documento.',
    opciones: [
      {
        id: 'm3-c19',
        nombre: 'Non-Destructive Enricher ($addFields / $set)',
        tipo: 'instruction_set',
        descripcion: 'Agrega o sobreescribe campos específicos sin descartar el resto de los campos existentes en el documento.',
        iconoPixelArt: 'crystal',
        codigoSnippet: '{\n  $addFields: {\n    eficiencia: { $divide: ["$energia", "$masa"] }\n  }\n}'
      },
      {
        id: 'm3-c20',
        nombre: 'Explicit 40-Field Projection Bus',
        tipo: 'core_processor',
        descripcion: 'Escribe a mano campo1: 1, campo2: 1... hasta los 40 campos en el $project.',
        iconoPixelArt: 'microchip'
      },
      {
        id: 'm3-c21',
        nombre: 'Exclusion Projection Collision ($project { other: 0 })',
        tipo: 'memory_bus',
        descripcion: 'Mezcla inclusiones y exclusiones en $project causando error de sintaxis.',
        iconoPixelArt: 'ram'
      }
    ],
    solucion: ['m3-c19'],
    pistaError: {
      mensaje: '$project opera por inclusión estricta: todo campo que no esté explícitamente listado como : 1 es suprimido del resultado final.',
      tipoAnimacion: 'DATA_CORRUPTION_NO_SET',
      detallesTecnicos: '$addFields (y su alias $set en pipelines) conserva transparentemente todas las propiedades originales agregando solo las nuevas.',
      recomendacionDoc: 'MongoDB Operators: $addFields vs $project.'
    },
    explicacionAcierto: '$addFields enriquece el documento con cálculos derivados sin el riesgo de purgar los datos preexistentes.'
  },
  {
    id: 42,
    modulo: 3,
    moduloNombre: 'Pipelines de Agregación',
    tituloDesafio: 'Lógica Condicional con $cond y $switch',
    premisa: 'Se necesita categorizar el estado de amenaza del androide en "CRITICAL" si la temperatura > 100, "WARNING" si > 70, y "NORMAL" en cualquier otro caso. ¿Qué operador condicional resuelve múltiples ramas?',
    opciones: [
      {
        id: 'm3-c22',
        nombre: 'Multi-Branch Switch Evaluator ($switch)',
        tipo: 'instruction_set',
        descripcion: 'Evalúa una serie de expresiones booleanas tipo case/then con un valor por defecto seguro.',
        iconoPixelArt: 'pipeline',
        codigoSnippet: '{\n  $switch: {\n    branches: [\n      { case: { $gt: ["$temp", 100] }, then: "CRITICAL" },\n      { case: { $gt: ["$temp", 70] }, then: "WARNING" }\n    ],\n    default: "NORMAL"\n  }\n}'
      },
      {
        id: 'm3-c23',
        nombre: 'JavaScript Eval Trigger ($where)',
        tipo: 'core_processor',
        descripcion: 'Inyecta código eval() síncrono que apaga el motor de optimización JIT.',
        iconoPixelArt: 'microchip'
      },
      {
        id: 'm3-c24',
        nombre: 'Triple Ternary Nested String',
        tipo: 'memory_bus',
        descripcion: 'Escribe un string con ternarios de JS puro esperando que MongoDB lo interprete.',
        iconoPixelArt: 'ram'
      }
    ],
    solucion: ['m3-c22'],
    pistaError: {
      mensaje: 'Anidar múltiples $cond produce código ilegible y propenso a errores. $switch es el operador idiomático para múltiples bifurcaciones.',
      tipoAnimacion: 'PIPELINE_STALL_ORDER',
      detallesTecnicos: '$switch ejecuta de forma optimizada en C++ evaluando las ramas en orden estricto de cortocircuito booleano.',
      recomendacionDoc: 'MongoDB Manual: $switch aggregation operator.'
    },
    explicacionAcierto: '$switch ofrece una sintaxis limpia y declarativa para evaluar múltiples condiciones en pipelines sin recursión desordenada.'
  },
  {
    id: 43,
    modulo: 3,
    moduloNombre: 'Pipelines de Agregación',
    tituloDesafio: 'Segmentación en Rangos con $bucket',
    premisa: 'El taller debe generar un histograma de los niveles de blindaje de 10,000 androides en rangos específicos: [0 a 25), [25 a 50), [50 a 75), y [75 a 100]. ¿Qué etapa agrupa por límites exactos?',
    opciones: [
      {
        id: 'm3-c25',
        nombre: 'Boundary Histogram Classifier ($bucket)',
        tipo: 'pipeline',
        descripcion: 'Categoriza los documentos en buckets basados en límites específicos definidos en boundaries: [0, 25, 50, 75, 100].',
        iconoPixelArt: 'pipeline',
        codigoSnippet: '{\n  $bucket: {\n    groupBy: "$blindaje",\n    boundaries: [0, 25, 50, 75, 100],\n    default: "OVERCHARGE",\n    output: { count: { $sum: 1 } }\n  }\n}'
      },
      {
        id: 'm3-c26',
        nombre: 'Manual Multiple $match Loops',
        tipo: 'core_processor',
        descripcion: 'Ejecuta cuatro queries $match separadas con rangos $gte y $lt.',
        iconoPixelArt: 'microchip'
      },
      {
        id: 'm3-c27',
        nombre: 'Array Modulo Hash Shifter',
        tipo: 'memory_bus',
        descripcion: 'Aplica operador residuo % 25 en memoria de cliente.',
        iconoPixelArt: 'ram'
      }
    ],
    solucion: ['m3-c25'],
    pistaError: {
      mensaje: 'Hacer múltiples consultas $match obliga a reescanear la colección 4 veces en lugar de clasificar en una sola pasada con $bucket.',
      tipoAnimacion: 'COLLSCAN_OVERHEAT',
      detallesTecnicos: '$bucket particiona el stream de documentos de acuerdo con límites de intervalos matemáticos continuos en una sola pasada.',
      recomendacionDoc: 'MongoDB Aggregation: $bucket stage.'
    },
    explicacionAcierto: '$bucket clasifica streams de datos en intervalos numéricos predefinidos en una sola pasada de alto rendimiento.'
  },
  {
    id: 44,
    modulo: 3,
    moduloNombre: 'Pipelines de Agregación',
    tituloDesafio: 'Filtrado de Arrays sin $unwind: $filter',
    premisa: 'Cada androide tiene un array con 50 sensores. Se necesita obtener el documento completo pero manteniendo en el array únicamente los sensores activos (status: "ONLINE"), sin deconstruir el documento con $unwind.',
    opciones: [
      {
        id: 'm3-c28',
        nombre: 'Internal Array Filter Stage ($filter)',
        tipo: 'instruction_set',
        descripcion: 'Filtra un array interno evaluando cada elemento mediante la variable de contexto $$this.',
        iconoPixelArt: 'crystal',
        codigoSnippet: '{\n  $project: {\n    nombre: 1,\n    sensoresOnline: {\n      $filter: {\n        input: "$sensores",\n        as: "sensor",\n        cond: { $eq: ["$$sensor.status", "ONLINE"] }\n      }\n    }\n  }\n}'
      },
      {
        id: 'm3-c29',
        nombre: 'Deconstruct & Regroup Heavy Cycle',
        tipo: 'pipeline',
        descripcion: 'Usa $unwind -> $match -> $group que multiplica por 50 el número de documentos intermedios.',
        iconoPixelArt: 'pipeline'
      },
      {
        id: 'm3-c30',
        nombre: 'Client-Side Array Array.filter() Pull',
        tipo: 'memory_bus',
        descripcion: 'Descarga los arrays completos por la red para filtrarlos en el navegador.',
        iconoPixelArt: 'ram'
      }
    ],
    solucion: ['m3-c28'],
    pistaError: {
      mensaje: '$unwind seguido de $match y $group genera millones de documentos intermedios saturando la RAM innecesariamente.',
      tipoAnimacion: 'PIPELINE_STALL_ORDER',
      detallesTecnicos: '$filter opera directamente sobre el array embebido en memoria de registro sin alterar la cardinalidad de documentos del pipeline.',
      recomendacionDoc: 'MongoDB Operators: $filter array expression.'
    },
    explicacionAcierto: '$filter procesa arrays internos conservando la estructura de los documentos sin la sobrecarga de multiplicar registros con $unwind.'
  },
  {
    id: 45,
    modulo: 3,
    moduloNombre: 'Pipelines de Agregación',
    tituloDesafio: 'Transformación y Reducción: $map y $reduce',
    premisa: 'Se necesita calcular el peso total de todos los componentes de un robot sumando el subcampo "weightKg" de su array interno "parts", en una sola expresión sin usar $unwind.',
    opciones: [
      {
        id: 'm3-c31',
        nombre: 'Array Accumulator Operator ($reduce)',
        tipo: 'instruction_set',
        descripcion: 'Aplica una función acumuladora iterativa sobre cada elemento del array usando $$value y $$this.',
        iconoPixelArt: 'pipeline',
        codigoSnippet: '{\n  $project: {\n    totalWeight: {\n      $reduce: {\n        input: "$parts",\n        initialValue: 0,\n        in: { $add: ["$$value", "$$this.weightKg"] }\n      }\n    }\n  }\n}'
      },
      {
        id: 'm3-c32',
        nombre: 'External Loop Accumulator',
        tipo: 'core_processor',
        descripcion: 'Itera con un while en Node.js sobre los documentos de la colección.',
        iconoPixelArt: 'microchip'
      },
      {
        id: 'm3-c33',
        nombre: 'Math.sum Javascript Eval Trap',
        tipo: 'memory_bus',
        descripcion: 'Usa una llamada a Math.sum de JavaScript plano no reconocida por BSON.',
        iconoPixelArt: 'ram'
      }
    ],
    solucion: ['m3-c31'],
    pistaError: {
      mensaje: '$reduce permite consolidar arrays internos en un valor escalar directamente en la fase de proyección sin alterar la estructura del flujo.',
      tipoAnimacion: 'PIPELINE_STALL_ORDER',
      detallesTecnicos: '$reduce utiliza las variables internas $$value (acumulador) y $$this (elemento actual) calculadas en tiempo real en C++.',
      recomendacionDoc: 'MongoDB Aggregation: $reduce expression.'
    },
    explicacionAcierto: '$reduce calcula acumulaciones directamente sobre arrays embebidos manteniendo el rendimiento óptimo del pipeline.'
  },
  {
    id: 46,
    modulo: 3,
    moduloNombre: 'Pipelines de Agregación',
    tituloDesafio: 'Agrupación Temporal con $dateTrunc',
    premisa: 'El sistema de telemetría necesita agrupar 500,000 logs de diagnóstico por hora calendario exacta (truncando minutos y segundos) para calcular picos de consumo.',
    opciones: [
      {
        id: 'm3-c34',
        nombre: 'Calendar Date Truncator ($dateTrunc)',
        tipo: 'instruction_set',
        descripcion: 'Trunca fechas al inicio de una unidad temporal precisa (hour, day, week) preservando el tipo BSON Date.',
        iconoPixelArt: 'crystal',
        codigoSnippet: '{\n  $group: {\n    _id: { $dateTrunc: { date: "$timestamp", unit: "hour" } },\n    totalEvents: { $sum: 1 }\n  }\n}'
      },
      {
        id: 'm3-c35',
        nombre: 'String Substring Date Splitter',
        tipo: 'memory_bus',
        descripcion: 'Convierte la fecha a string y recorta caracteres con substr perdiendo índices y tipado.',
        iconoPixelArt: 'ram'
      },
      {
        id: 'm3-c36',
        nombre: 'Modulo Arithmetic Milliseconds Math',
        tipo: 'core_processor',
        descripcion: 'Resta milisegundos calculando timestamp % 3600000 manualmente.',
        iconoPixelArt: 'microchip'
      }
    ],
    solucion: ['m3-c34'],
    pistaError: {
      mensaje: 'Manipular fechas como strings o con aritmética de milisegundos ignora cambios de horario, años bisiestos y zonas horarias.',
      tipoAnimacion: 'BSON_TYPE_MISMATCH',
      detallesTecnicos: '$dateTrunc maneja de forma precisa la geometría del calendario y mantiene el tipo nativo Date para etapas subsecuentes.',
      recomendacionDoc: 'MongoDB Operators: $dateTrunc.'
    },
    explicacionAcierto: '$dateTrunc permite consolidar streams temporales por hora, día o mes conservando la integridad de fechas BSON.'
  },
  {
    id: 47,
    modulo: 3,
    moduloNombre: 'Pipelines de Agregación',
    tituloDesafio: 'Vistas Materializadas Incrementales: $merge vs $out',
    premisa: 'El hangar actualiza un resumen nocturno con el estado de 2 millones de androides. Un script usó $out, lo que provocó que durante 30 segundos la colección de destino se borrara por completo (drop) mientras recalculaba.',
    opciones: [
      {
        id: 'm3-c37',
        nombre: 'Non-Destructive Materializer ($merge)',
        tipo: 'storage_controller',
        descripcion: 'Combina incrementalmente los resultados en la colección de destino mediante upsert sin vaciar los datos existentes.',
        iconoPixelArt: 'storage_controller' as any,
        codigoSnippet: '{\n  $merge: {\n    into: "daily_robot_stats",\n    whenMatched: "merge",\n    whenNotMatched: "insert"\n  }\n}'
      },
      {
        id: 'm3-c38',
        nombre: 'Collection Dropper ($out)',
        tipo: 'core_processor',
        descripcion: 'Reemplaza y borra de raíz la colección destino entera en cada ejecución.',
        iconoPixelArt: 'microchip'
      },
      {
        id: 'm3-c39',
        nombre: 'JSON Export/Import Cron Pipe',
        tipo: 'memory_bus',
        descripcion: 'Vuelca a un archivo .json local y lo reimporta con mongoimport.',
        iconoPixelArt: 'ram'
      }
    ],
    solucion: ['m3-c37'],
    pistaError: {
      mensaje: '$out elimina completamente la colección de destino antes de insertar, provocando caídas de servicio (downtime).',
      tipoAnimacion: 'DATA_CORRUPTION_NO_SET',
      detallesTecnicos: '$merge soporta combinaciones granulares atómicas (whenMatched: merge/replace/fail) en colecciones sharded y réplicas sin downtime.',
      recomendacionDoc: 'MongoDB Aggregation: $merge stage.'
    },
    explicacionAcierto: '$merge actualiza incrementalmente colecciones de reportes sin borrar la información previa ni interrumpir a los lectores.'
  },
  {
    id: 48,
    modulo: 3,
    moduloNombre: 'Pipelines de Agregación',
    tituloDesafio: 'Optimización Top-N: $sort con $limit Inmediato',
    premisa: 'Se busca el ranking de los 5 robots con mayor blindaje de entre 500,000 unidades. Si el $limit no está contiguo al $sort, MongoDB ordena los 500,000 registros completos en disco.',
    opciones: [
      {
        id: 'm3-c40',
        nombre: 'Top-N Priority Queue Optimizer ($sort + $limit)',
        tipo: 'pipeline',
        descripcion: 'Al colocar $limit inmediatamente después de $sort, el motor usa un árbol acotado en memoria de solo 5 elementos.',
        iconoPixelArt: 'pipeline',
        codigoSnippet: '[\n  { $sort: { blindaje: -1 } },\n  { $limit: 5 } // Habilita la optimización Top-N en memoria interna\n]'
      },
      {
        id: 'm3-c41',
        nombre: 'Disconnected Intermediate Stage ($sort -> $project -> $limit)',
        tipo: 'core_processor',
        descripcion: 'Pone un $project intermedio que desactiva la optimización automática Top-N.',
        iconoPixelArt: 'microchip'
      },
      {
        id: 'm3-c42',
        nombre: 'Full Scan Memory Flusher',
        tipo: 'memory_bus',
        descripcion: 'Ejecuta un $sort global sin límite y recorta los 5 primeros en el cliente de Node.',
        iconoPixelArt: 'ram'
      }
    ],
    solucion: ['m3-c40'],
    pistaError: {
      mensaje: 'Intercalar etapas no triviales entre $sort y $limit deshabilita la optimización Top-N, obligando a ordenar millones de registros.',
      tipoAnimacion: 'PIPELINE_STALL_ORDER',
      detallesTecnicos: 'Cuando $sort está seguido inmediatamente de $limit, MongoDB solo retiene N elementos en un heap binario en RAM.',
      recomendacionDoc: 'MongoDB Docs: Aggregation Pipeline Optimization (Sort and Limit).'
    },
    explicacionAcierto: 'La secuencia $sort + $limit adyacente activa la optimización Top-N reduciendo la complejidad de memoria de O(M) a O(N).'
  },
  {
    id: 49,
    modulo: 3,
    moduloNombre: 'Pipelines de Agregación',
    tituloDesafio: 'Funciones de Ventana: $setWindowFields',
    premisa: 'Se necesita calcular el promedio móvil de velocidad (Moving Average) de los últimos 3 registros temporales de cada robot y su ranking relativo de aceleración dentro de su sector sin salir del motor.',
    opciones: [
      {
        id: 'm3-c43',
        nombre: 'Windowing Analytical Engine ($setWindowFields)',
        tipo: 'instruction_set',
        descripcion: 'Calcula agregaciones sobre particiones ordenadas de documentos con ventanas deslizantes sin colapsar registros.',
        iconoPixelArt: 'crystal',
        codigoSnippet: '{\n  $setWindowFields: {\n    partitionBy: "$sector",\n    sortBy: { timestamp: 1 },\n    output: {\n      movingAvg: {\n        $avg: "$velocidad",\n        window: { documents: [-2, "current"] }\n      }\n    }\n  }\n}'
      },
      {
        id: 'm3-c44',
        nombre: 'Self-Join Recursive $lookup Loop',
        tipo: 'pipeline',
        descripcion: 'Hace que cada documento ejecute un $lookup sobre la misma colección para buscar sus vecinos.',
        iconoPixelArt: 'pipeline'
      },
      {
        id: 'm3-c45',
        nombre: 'Node.js In-Memory Sliding Window Buffer',
        tipo: 'memory_bus',
        descripcion: 'Descarga cientos de miles de registros a la memoria de la aplicación para calcular medias móviles.',
        iconoPixelArt: 'ram'
      }
    ],
    solucion: ['m3-c43'],
    pistaError: {
      mensaje: 'Calcular promedios móviles con autouniones ($lookup) o en la app degrada exponencialmente la latencia.',
      tipoAnimacion: 'PIPELINE_STALL_ORDER',
      detallesTecnicos: '$setWindowFields introduce funciones de ventana analíticas nativas (equivalente a OVER (PARTITION BY ...)) sin colapsar las filas.',
      recomendacionDoc: 'MongoDB Aggregation: $setWindowFields.'
    },
    explicacionAcierto: '$setWindowFields calcula métricas analíticas complejas como promedios móviles y rankings sobre streams ordenados de forma nativa.'
  },
  {
    id: 50,
    modulo: 3,
    moduloNombre: 'Pipelines de Agregación',
    tituloDesafio: 'Promoción de Subdocumentos con $replaceRoot',
    premisa: 'Tras un $lookup sobre la especificación técnica de la CPU del robot, el resultado queda anidado en "cpuSpec". Se necesita que ese subdocumento se convierta en el documento raíz de la respuesta.',
    opciones: [
      {
        id: 'm3-c46',
        nombre: 'Root Re-Synthesizer ($replaceRoot / $replaceWith)',
        tipo: 'instruction_set',
        descripcion: 'Reemplaza el documento de nivel superior por el subdocumento especificado en newRoot.',
        iconoPixelArt: 'pipeline',
        codigoSnippet: '{\n  $replaceRoot: {\n    newRoot: "$cpuSpec"\n  }\n}'
      },
      {
        id: 'm3-c47',
        nombre: 'Manual 50-Field Project Remap',
        tipo: 'core_processor',
        descripcion: 'Copia manualmente cada propiedad del subdocumento a la raíz con $project.',
        iconoPixelArt: 'microchip'
      },
      {
        id: 'm3-c48',
        nombre: 'Pointer Dereference Hack',
        tipo: 'memory_bus',
        descripcion: 'Usa sintaxis C++ no admitida en la capa BSON.',
        iconoPixelArt: 'ram'
      }
    ],
    solucion: ['m3-c46'],
    pistaError: {
      mensaje: 'Reescribir manualmente cada propiedad en $project es costoso y se rompe si el subdocumento añade propiedades dinámicas.',
      tipoAnimacion: 'SCHEMA_VALIDATION_BLOCKED',
      detallesTecnicos: '$replaceRoot eleva un subdocumento embebido a nivel raíz reemplazando el objeto principal de manera instantánea.',
      recomendacionDoc: 'MongoDB Aggregation: $replaceRoot stage.'
    },
    explicacionAcierto: '$replaceRoot simplifica arquitecturas donde el payload requerido se encuentra anidado tras agregaciones o uniones documentales.'
  },
  {
    id: 51,
    modulo: 3,
    moduloNombre: 'Pipelines de Agregación',
    tituloDesafio: 'Sobrecarga de Código JS: Riesgo de $function',
    premisa: 'Un desarrollador implementó una función matemática compleja usando $function con JavaScript nativo en un pipeline de 1 millón de registros. El uso de CPU llegó al 100% y el throughput cayó un 98%. ¿Por qué?',
    opciones: [
      {
        id: 'm3-c49',
        nombre: 'Native Aggregation Operator Replacement',
        tipo: 'core_processor',
        descripcion: '$function apaga la optimización nativa C++, ejecuta un intérprete V8 aislado y serializa datos documento por documento.',
        iconoPixelArt: 'microchip',
        codigoSnippet: '// Reemplazar $function JS con operadores matemáticos nativos de MongoDB ($add, $multiply, $pow)'
      },
      {
        id: 'm3-c50',
        nombre: 'V8 JIT Warmup Trigger',
        tipo: 'flux_capacitor',
        descripcion: 'Ejecuta un bucle dummy para calentar el compilador JIT del motor de JavaScript.',
        iconoPixelArt: 'capacitor'
      },
      {
        id: 'm3-c51',
        nombre: 'JavaScript Worker Multiplier',
        tipo: 'memory_bus',
        descripcion: 'Abre 1,000 hilos de Node.js paralelos para enviar la función JS al clúster.',
        iconoPixelArt: 'ram'
      }
    ],
    solucion: ['m3-c49'],
    pistaError: {
      mensaje: 'Inyectar código JavaScript con $function o $accumulator desactiva el motor de optimización C++ interno de WiredTiger.',
      tipoAnimacion: 'COLLSCAN_OVERHEAT',
      detallesTecnicos: 'El paso de contexto entre el ejecutor C++ y el motor JavaScript V8 genera un overhead masivo de serialización BSON.',
      recomendacionDoc: 'MongoDB Manual: $function performance warnings.'
    },
    explicacionAcierto: 'Los operadores nativos de agregación de MongoDB se ejecutan en código nativo C++ de alta velocidad sin la sobrecarga del motor JS.'
  }
];

