import { RawModuleQuestion } from '../../types/game';

export const module2Questions: RawModuleQuestion[] = [
  {
    id: 18,
    modulo: 2,
    moduloNombre: 'CRUD Atómico y Operadores de Actualización',
    tituloDesafio: 'Peligro de Sobreescritura Total sin $set',
    premisa: 'Un script junior intentó actualizar la versión de firmware del robot pasando un objeto directo sin operador $set. Como resultado, todos los demás campos (sensores, calibración, armas) desaparecieron. ¿Qué operador previene este desastre?',
    codigoContexto: '// Bug detectado en producción:\nawait RobotModel.collection.updateOne(\n  { _id: robotId },\n  { firmware: "2.4.0" } // ERROR: sintaxis de reemplazo accidental\n);',
    opciones: [
      {
        id: 'm2-c1',
        nombre: 'Atomic $set Injection Core',
        tipo: 'instruction_set',
        descripcion: 'Modifica únicamente las claves especificadas manteniendo intactos todos los demás campos existentes.',
        iconoPixelArt: 'crystal',
        codigoSnippet: '{ $set: { firmware: "2.4.0" } }'
      },
      {
        id: 'm2-c2',
        nombre: 'Full Document Replace Override',
        tipo: 'core_processor',
        descripcion: 'Usa replaceOne() asumiendo que es normal borrar los datos no incluidos.',
        iconoPixelArt: 'microchip'
      },
      {
        id: 'm2-c3',
        nombre: 'Virtual Field Patch Bus',
        tipo: 'memory_bus',
        descripcion: 'Define una propiedad virtual que ignora la persistencia en disco.',
        iconoPixelArt: 'ram'
      }
    ],
    solucion: ['m2-c1'],
    pistaError: {
      mensaje: 'En MongoDB, actualizar sin un operador como $set reemplaza o corrompe la estructura del documento.',
      tipoAnimacion: 'DATA_CORRUPTION_NO_SET',
      detallesTecnicos: 'El operador $set aísla la mutación a los campos especificados a nivel de BSON, preservando los demás datos sin sobreescritura accidental.',
      recomendacionDoc: 'MongoDB Operators: $set update modifier.'
    },
    explicacionAcierto: 'El operador $set modifica selectivamente los campos designados sin alterar el resto de propiedades del documento.'
  },
  {
    id: 19,
    modulo: 2,
    moduloNombre: 'CRUD Atómico y Operadores de Actualización',
    tituloDesafio: 'Condición de Carrera en Contador de Energía',
    premisa: 'Dos procesos concurrentes leen el nivel de batería (100%), restan 5% en memoria y guardan el resultado con save(). Ambos leyeron 100% al mismo tiempo, resultando en 95% en vez de 90%. ¿Cómo se resuelve de forma atómica?',
    codigoContexto: '// Código con Race Condition:\nconst r = await Robot.findById(id);\nr.battery -= 5;\nawait r.save();',
    opciones: [
      {
        id: 'm2-c4',
        nombre: 'Atomic $inc Flux Resistor',
        tipo: 'instruction_set',
        descripcion: 'Modifica el valor numérico directamente en el motor de base de datos de manera indivisible y atómica.',
        iconoPixelArt: 'crystal',
        codigoSnippet: 'await Robot.updateOne({ _id: id }, { $inc: { battery: -5 } });'
      },
      {
        id: 'm2-c5',
        nombre: 'Async Delay Compensator',
        tipo: 'flux_capacitor',
        descripcion: 'Agrega un setTimeout de 100ms antes del save() para esperar que el otro termine.',
        iconoPixelArt: 'capacitor'
      },
      {
        id: 'm2-c6',
        nombre: 'Local Memory Mutex Lock',
        tipo: 'core_processor',
        descripcion: 'Bloquea el hilo único de Node.js con un ciclo while síncrono infinito.',
        iconoPixelArt: 'microchip'
      }
    ],
    solucion: ['m2-c4'],
    pistaError: {
      mensaje: 'El patrón Leer-Modificar-Escribir en Node.js provoca condiciones de carrera graves bajo concurrencia. $inc es atómico a nivel de almacenamiento.',
      tipoAnimacion: 'TRANSACTION_ABORT',
      detallesTecnicos: 'El operador $inc aplica el delta directamente en la página de WiredTiger sin pasar el estado intermedio por la red ni el hilo de la app.',
      recomendacionDoc: 'MongoDB Manual: $inc Field Update Operator.'
    },
    explicacionAcierto: '$inc incrementa o decrementa números de forma atómica en el motor, neutralizando por completo condiciones de carrera concurrentes.'
  },
  {
    id: 20,
    modulo: 2,
    moduloNombre: 'CRUD Atómico y Operadores de Actualización',
    tituloDesafio: 'Array Acotado en Documento: $slice y $push',
    premisa: 'El robot guarda un log de incidentes en un array interno pero no debe superar nunca los últimos 10 elementos para no desbordar el documento. ¿Qué combinación de modificadores lo logra en un solo update atómico?',
    opciones: [
      {
        id: 'm2-c7',
        nombre: 'Bounded $push + $slice (-10) Array Unit',
        tipo: 'instruction_set',
        descripcion: 'Añade el nuevo elemento y recorta atómicamente el array manteniendo solo los últimos 10 items.',
        iconoPixelArt: 'pipeline',
        codigoSnippet: '{ $push: { logs: { $each: [newLog], $slice: -10 } } }'
      },
      {
        id: 'm2-c8',
        nombre: 'Unbounded $push Array Stuffer',
        tipo: 'core_processor',
        descripcion: 'Empuja elementos indefinidamente con $push simple sin límite.',
        iconoPixelArt: 'microchip'
      },
      {
        id: 'm2-c9',
        nombre: 'Manual Array Splice & Save',
        tipo: 'memory_bus',
        descripcion: 'Lee el array en Node.js, ejecuta logs.splice(0, 1) y reescribe todo el array.',
        iconoPixelArt: 'ram'
      }
    ],
    solucion: ['m2-c7'],
    pistaError: {
      mensaje: 'Empujar arrays sin $slice genera el antipatrón de crecimiento desmedido de arrays (Unbounded Array), degradando el rendimiento de WiredTiger.',
      tipoAnimacion: 'UNBOUNDED_ARRAY_FATAL',
      detallesTecnicos: '$push combinado con $each y $slice negativo preserva un tamaño de ventana fija estrictamente dentro del motor de base de datos.',
      recomendacionDoc: 'MongoDB Manual: $slice Modifier in $push.'
    },
    explicacionAcierto: '$slice negativo dentro de $push asegura que el array actúe como un buffer circular acotado de tamaño predecible.'
  },
  {
    id: 21,
    modulo: 2,
    moduloNombre: 'CRUD Atómico y Operadores de Actualización',
    tituloDesafio: 'Garantía de Unicidad en Arrays: $addToSet',
    premisa: 'El robot instala módulos de combate. Si se envía dos veces la orden de instalar "LASER_CANNON", no deben crearse entradas duplicadas en el array installedModules. ¿Qué operador atómico asegura elementos únicos?',
    opciones: [
      {
        id: 'm2-c10',
        nombre: 'Unique Set Assembler ($addToSet)',
        tipo: 'instruction_set',
        descripcion: 'Inserta el valor en el array únicamente si no existe previamente una coincidencia exacta.',
        iconoPixelArt: 'crystal',
        codigoSnippet: 'await Robot.updateOne({ _id }, { $addToSet: { modules: "LASER_CANNON" } });'
      },
      {
        id: 'm2-c11',
        nombre: 'Duplicating $push Repeater',
        tipo: 'core_processor',
        descripcion: 'Usa $push esperando que Mongoose filtre duplicados por arte de magia.',
        iconoPixelArt: 'microchip'
      },
      {
        id: 'm2-c12',
        nombre: 'Client-Side Array Filter Pipe',
        tipo: 'memory_bus',
        descripcion: 'Descarga el array, ejecuta array.includes() y lo vuelve a guardar.',
        iconoPixelArt: 'ram'
      }
    ],
    solucion: ['m2-c10'],
    pistaError: {
      mensaje: '$push inserta siempre elementos nuevos sin verificar si ya existían, duplicando entradas en el array.',
      tipoAnimacion: 'UNBOUNDED_ARRAY_FATAL',
      detallesTecnicos: '$addToSet trata el array como un conjunto matemático disjunto; si el elemento existe, la operación es un no-op atómico limpio.',
      recomendacionDoc: 'MongoDB Operators: $addToSet array modifier.'
    },
    explicacionAcierto: '$addToSet garantiza idempotencia atómica al agregar elementos a arrays sin duplicaciones accidentales.'
  },
  {
    id: 22,
    modulo: 2,
    moduloNombre: 'CRUD Atómico y Operadores de Actualización',
    tituloDesafio: 'Desinstalación Precisa con $pull',
    premisa: 'Un chip defectuoso con serial "ERR_CHIP_99" debe ser expulsado inmediatamente de la lista subdocumental de componentes instalados del robot. ¿Qué operador ejecuta esta purga en un solo comando?',
    opciones: [
      {
        id: 'm2-c13',
        nombre: 'Atomic $pull Component Purger',
        tipo: 'instruction_set',
        descripcion: 'Elimina todos los elementos del array que coincidan con la condición especificada.',
        iconoPixelArt: 'pipeline',
        codigoSnippet: '{ $pull: { components: { serial: "ERR_CHIP_99" } } }'
      },
      {
        id: 'm2-c14',
        nombre: '$unset Positional Nullifier',
        tipo: 'core_processor',
        descripcion: 'Usa $unset para convertir el elemento en null dejando un hueco corrupto en el array.',
        iconoPixelArt: 'microchip'
      },
      {
        id: 'm2-c15',
        nombre: 'Array Clear & Re-Insert Pulse',
        tipo: 'storage_controller',
        descripcion: 'Vacía el array completo con $set: { components: [] } y reinserta los buenos.',
        iconoPixelArt: 'storage_controller' as any
      }
    ],
    solucion: ['m2-c13'],
    pistaError: {
      mensaje: 'Usar $unset en un array no reduce su longitud: deja el elemento como null en la posición original.',
      tipoAnimacion: 'DATA_CORRUPTION_NO_SET',
      detallesTecnicos: '$pull remueve físicamente los elementos y reacomoda el tamaño del array en la estructura de página BSON.',
      recomendacionDoc: 'MongoDB Manual: $pull Array Update Operator.'
    },
    explicacionAcierto: '$pull elimina de forma limpia y atómica los subdocumentos que cumplen con la condición de filtrado.'
  },
  {
    id: 23,
    modulo: 2,
    moduloNombre: 'CRUD Atómico y Operadores de Actualización',
    tituloDesafio: 'Retorno del Documento Modificado en findOneAndUpdate',
    premisa: 'Al calibrar un reactor con findOneAndUpdate, el HUD muestra la telemetría vieja desactualizada en lugar del nuevo valor recién guardado. ¿Qué opción de configuración falta?',
    codigoContexto: 'const updatedRobot = await Robot.findOneAndUpdate(\n  { _id },\n  { $set: { status: "ACTIVE" } }\n  // Falta una opción crucial aquí...\n);',
    opciones: [
      {
        id: 'm2-c16',
        nombre: 'Return New Document Trigger ({ new: true })',
        tipo: 'instruction_set',
        descripcion: 'Instruye a Mongoose/MongoDB para retornar el documento resultante DESPUÉS de la actualización.',
        iconoPixelArt: 'crystal',
        codigoSnippet: '{ new: true } // o en driver nativo: { returnDocument: "after" }'
      },
      {
        id: 'm2-c17',
        nombre: 'Double Query Latency Shifter',
        tipo: 'memory_bus',
        descripcion: 'Ejecuta findById() inmediatamente después para forzar una segunda consulta.',
        iconoPixelArt: 'ram'
      },
      {
        id: 'm2-c18',
        nombre: 'Client-Side State Faker',
        tipo: 'core_processor',
        descripcion: 'Modifica el objeto en memoria de Node.js asumiendo que la base de datos no falló.',
        iconoPixelArt: 'microchip'
      }
    ],
    solucion: ['m2-c16'],
    pistaError: {
      mensaje: 'Por defecto, findOneAndUpdate() devuelve el documento original en el estado PREVIO a la mutación.',
      tipoAnimacion: 'DATA_CORRUPTION_NO_SET',
      detallesTecnicos: 'Configurar `{ new: true }` en Mongoose (o `{ returnDocument: "after" }` en MongoDB nativo) retorna el snapshot post-actualización.',
      recomendacionDoc: 'Mongoose Docs: Model.findOneAndUpdate options.'
    },
    explicacionAcierto: '{ new: true } asegura que el cliente reciba el estado actualizado resultante de la transacción en un único viaje de red.'
  },
  {
    id: 24,
    modulo: 2,
    moduloNombre: 'CRUD Atómico y Operadores de Actualización',
    tituloDesafio: 'Control de Concurrencia Optimista (OCC)',
    premisa: 'Dos ingenieros editan simultáneamente la configuración de armamento de un robot. La última actualización sobreescribe silenciosamente los cambios del primero (Lost Update). ¿Qué mecanismo nativo de Mongoose evita esto?',
    opciones: [
      {
        id: 'm2-c19',
        nombre: 'Optimistic Concurrency Control Key (__v & versionKey)',
        tipo: 'instruction_set',
        descripcion: 'Verifica que __v coincida antes de guardar; si otro proceso modificó el documento, arroja VersionError.',
        iconoPixelArt: 'crystal',
        codigoSnippet: 'schema.set("optimisticConcurrency", true); // Valida __v en save()'
      },
      {
        id: 'm2-c20',
        nombre: 'Global Table Locking Relay',
        tipo: 'core_processor',
        descripcion: 'Bloquea toda la base de datos para que solo un usuario a la vez pueda enviar peticiones.',
        iconoPixelArt: 'microchip'
      },
      {
        id: 'm2-c21',
        nombre: 'Ignore Overwrite Flag',
        tipo: 'flux_capacitor',
        descripcion: 'Desactiva versionKey por completo para que gane quien guarde último.',
        iconoPixelArt: 'capacitor'
      }
    ],
    solucion: ['m2-c19'],
    pistaError: {
      mensaje: 'El versionKey (__v) de Mongoose fue diseñado específicamente para detectar colisiones de actualización concurrente en arrays y documentos.',
      tipoAnimacion: 'TRANSACTION_ABORT',
      detallesTecnicos: 'Al activar optimisticConcurrency, Mongoose incluye automáticamente la condición `{ _id, __v: doc.__v }` en la query de guardado.',
      recomendacionDoc: 'Mongoose Documentation: Optimistic Concurrency Control.'
    },
    explicacionAcierto: 'El control de concurrencia optimista previene el problema del "Lost Update" lanzando un VersionError cuando detecta mutaciones concurrentes.'
  },
  {
    id: 25,
    modulo: 2,
    moduloNombre: 'CRUD Atómico y Operadores de Actualización',
    tituloDesafio: 'Durabilidad Máxima: Write Concern Majority',
    premisa: 'El nodo primario del hangar sufre un corte eléctrico justo después de responder un write exitoso. Al promoverse el secundario, los datos del nuevo robot no existían. ¿Qué Write Concern garantiza que se haya replicado?',
    opciones: [
      {
        id: 'm2-c22',
        nombre: 'Write Concern Majority & Journal Unit',
        tipo: 'storage_controller',
        descripcion: 'Exige confirmación de la mayoría de nodos del replica set y persistencia en el Journal en disco.',
        iconoPixelArt: 'storage_controller' as any,
        codigoSnippet: '{ writeConcern: { w: "majority", j: true, wtimeout: 5000 } }'
      },
      {
        id: 'm2-c23',
        nombre: 'Fire-And-Forget (w: 0) Pipe',
        tipo: 'flux_capacitor',
        descripcion: 'Envía los datos sin esperar ninguna confirmación de red.',
        iconoPixelArt: 'capacitor'
      },
      {
        id: 'm2-c24',
        nombre: 'Local Memory Cache Only (w: 1, j: false)',
        tipo: 'memory_bus',
        descripcion: 'Confirma apenas esté en la RAM del primario sin esperar al journal ni a los nodos secundarios.',
        iconoPixelArt: 'ram'
      }
    ],
    solucion: ['m2-c22'],
    pistaError: {
      mensaje: 'Con w: 1, si el primario se apaga antes de replicar a los secundarios, los datos se pierden en un Rollback.',
      tipoAnimacion: 'TRANSACTION_ABORT',
      detallesTecnicos: 'w: "majority" asegura que más del 50% de los nodos con voto hayan registrado la operación en memoria, impidiendo rollbacks si el primario cae.',
      recomendacionDoc: 'MongoDB Manual: Write Concern Levels.'
    },
    explicacionAcierto: 'Write Concern majority con journaling activo garantiza resistencia absoluta frente a fallos y failovers en el clúster.'
  },
  {
    id: 26,
    modulo: 2,
    moduloNombre: 'CRUD Atómico y Operadores de Actualización',
    tituloDesafio: 'Transacciones ACID Multi-Documento',
    premisa: 'El robot transfiere 500MW de energía de la "Batería A" a la "Batería B". Un fallo de red a mitad del proceso no debe permitir que la energía desaparezca en el vacío cuántico. ¿Cómo se orquesta?',
    opciones: [
      {
        id: 'm2-c25',
        nombre: 'Session ACID Transaction Bus',
        tipo: 'instruction_set',
        descripcion: 'Encapsula ambas operaciones en una sesión atómica con withTransaction() y rollback automático ante errores.',
        iconoPixelArt: 'pipeline',
        codigoSnippet: 'const session = await mongoose.startSession();\nawait session.withTransaction(async () => {\n  await BatA.updateOne({ $inc: { mw: -500 } }, { session });\n  await BatB.updateOne({ $inc: { mw: 500 } }, { session });\n});'
      },
      {
        id: 'm2-c26',
        nombre: 'Try/Catch Manual Rollback Shifter',
        tipo: 'core_processor',
        descripcion: 'Ejecuta las dos llamadas normales y si la segunda falla, intenta mandar un update inverso manualmente.',
        iconoPixelArt: 'microchip'
      },
      {
        id: 'm2-c27',
        nombre: 'Single-Node In-Memory Semaphore',
        tipo: 'memory_bus',
        descripcion: 'Crea una variable booleana let isTransferring = true en el servidor web.',
        iconoPixelArt: 'ram'
      }
    ],
    solucion: ['m2-c25'],
    pistaError: {
      mensaje: 'Si el servidor web se reinicia a mitad de un rollback manual, la base de datos queda corrupta. Se requiere una transacción ACID real.',
      tipoAnimacion: 'TRANSACTION_ABORT',
      detallesTecnicos: 'MongoDB soporta transacciones multi-documento desde 4.0 en Replica Sets usando sesiones y el protocolo de Two-Phase Commit interno.',
      recomendacionDoc: 'MongoDB Documentation: Multi-Document Transactions.'
    },
    explicacionAcierto: 'Las transacciones con sesiones garantizan atomicidad total: o ambas baterías se actualizan con éxito, o se descarta todo cambio.'
  },
  {
    id: 27,
    modulo: 2,
    moduloNombre: 'CRUD Atómico y Operadores de Actualización',
    tituloDesafio: 'Inicialización Condicional en Upsert: $setOnInsert',
    premisa: 'Se registra un robot mediante un upsert. Si el robot ya existe, solo se debe actualizar su timestamp de última señal. Si es nuevo y se inserta por primera vez, se debe inicializar su fecha de fabricación y código de serie inmutable.',
    opciones: [
      {
        id: 'm2-c28',
        nombre: 'Conditional Init Gate ($setOnInsert)',
        tipo: 'instruction_set',
        descripcion: 'Aplica valores únicamente si la operación resulta en la inserción de un nuevo documento (upsert: true).',
        iconoPixelArt: 'crystal',
        codigoSnippet: '{\n  $set: { lastPing: new Date() },\n  $setOnInsert: { serial: "SN-900", builtAt: new Date() }\n}'
      },
      {
        id: 'm2-c29',
        nombre: 'Overwriting Force Init ($set)',
        tipo: 'core_processor',
        descripcion: 'Usa $set para sobreescribir el serial en cada ping recurrente.',
        iconoPixelArt: 'microchip'
      },
      {
        id: 'm2-c30',
        nombre: 'Pre-Query Find Check Trap',
        tipo: 'memory_bus',
        descripcion: 'Hace un findOne(), si no está hace create(), si está hace update(), generando condiciones de carrera.',
        iconoPixelArt: 'ram'
      }
    ],
    solucion: ['m2-c28'],
    pistaError: {
      mensaje: 'Usar $set reescribe el campo en cada actualización. Usar $setOnInsert evita sobreescrituras si el documento ya existía.',
      tipoAnimacion: 'DATA_CORRUPTION_NO_SET',
      detallesTecnicos: '$setOnInsert es ignorado por completo por el motor si el filtro de búsqueda encuentra un documento preexistente.',
      recomendacionDoc: 'MongoDB Manual: $setOnInsert Operator.'
    },
    explicacionAcierto: '$setOnInsert permite inicializar propiedades maestras de forma atómica únicamente al dar de alta un documento por primera vez.'
  },
  {
    id: 28,
    modulo: 2,
    moduloNombre: 'CRUD Atómico y Operadores de Actualización',
    tituloDesafio: 'Operador Posicional Filtrado con arrayFilters',
    premisa: 'El robot tiene 20 actuadores mecánicos en un array. Se necesita incrementar la potencia (+10) solo en aquellos actuadores cuyo estado sea "CALIBRATING", sin tocar los que están "IDLE" ni "OFFLINE".',
    codigoContexto: '// Esquema: actuators: [{ id: 1, status: "IDLE", power: 50 }, ...]',
    opciones: [
      {
        id: 'm2-c31',
        nombre: 'ArrayFilters Positional Injector ($[elem])',
        tipo: 'instruction_set',
        descripcion: 'Aplica la actualización exclusivamente a los elementos del array que satisfacen el filtro del identificador.',
        iconoPixelArt: 'pipeline',
        codigoSnippet: 'await Robot.updateOne(\n  { _id },\n  { $inc: { "actuators.$[act].power": 10 } },\n  { arrayFilters: [{ "act.status": "CALIBRATING" }] }\n);'
      },
      {
        id: 'm2-c32',
        nombre: 'First-Match Positional Operator ($)',
        tipo: 'core_processor',
        descripcion: 'Usa "actuators.$.power" que solo actualiza el primer actuador que coincida en vez de todos.',
        iconoPixelArt: 'microchip'
      },
      {
        id: 'm2-c33',
        nombre: 'Loop Iterate Array Pull & Push',
        tipo: 'memory_bus',
        descripcion: 'Descarga todo el array a Node, itera con forEach y reescribe la lista completa.',
        iconoPixelArt: 'ram'
      }
    ],
    solucion: ['m2-c31'],
    pistaError: {
      mensaje: 'El operador posicional simple "$" solo actualiza el PRIMER elemento coincidente del array. Para actualizar múltiples elementos condicionales se requiere arrayFilters.',
      tipoAnimacion: 'PIPELINE_STALL_ORDER',
      detallesTecnicos: 'El operador "$[<identifier>]" junto a `arrayFilters` permite mutaciones masivas granulares dentro de subdocumentos en un solo update atómico.',
      recomendacionDoc: 'MongoDB Update Operators: $[] and arrayFilters.'
    },
    explicacionAcierto: 'arrayFilters permite modificar quirúrgicamente múltiples elementos de un array que cumplan criterios específicos en una sola operación.'
  },
  {
    id: 29,
    modulo: 2,
    moduloNombre: 'CRUD Atómico y Operadores de Actualización',
    tituloDesafio: 'Límites Numéricos Atómicos con $min y $max',
    premisa: 'El sensor térmico registra la temperatura récord más alta alcanzada por el robot. Si la lectura actual (85°C) es menor que el récord guardado (92°C), no debe cambiar. Si es mayor (98°C), debe actualizarse al nuevo récord de forma atómica.',
    opciones: [
      {
        id: 'm2-c34',
        nombre: 'Atomic $max Boundary Regulator',
        tipo: 'instruction_set',
        descripcion: 'Actualiza el campo únicamente si el valor proporcionado es mayor que el valor existente en el documento.',
        iconoPixelArt: 'crystal',
        codigoSnippet: '{ $max: { peakTemperature: currentTemp } }'
      },
      {
        id: 'm2-c35',
        nombre: 'Math.max() Client Memory Comparator',
        tipo: 'core_processor',
        descripcion: 'Descarga el documento, calcula Math.max en JavaScript y hace save().',
        iconoPixelArt: 'microchip'
      },
      {
        id: 'm2-c36',
        nombre: 'Unconditional $set Overwrite',
        tipo: 'flux_capacitor',
        descripcion: 'Sobreescribe el campo siempre con la última lectura sin importar si es más baja.',
        iconoPixelArt: 'capacitor'
      }
    ],
    solucion: ['m2-c34'],
    pistaError: {
      mensaje: 'Calcular el máximo en el cliente produce condiciones de carrera si dos lecturas compiten simultáneamente.',
      tipoAnimacion: 'DATA_CORRUPTION_NO_SET',
      detallesTecnicos: '$max y $min comparan y persisten el valor límite directamente en la página de disco de forma atómica.',
      recomendacionDoc: 'MongoDB Operators: $max and $min update operators.'
    },
    explicacionAcierto: '$max garantiza que el campo solo se actualice si el nuevo valor supera el registro histórico actual de forma atómica.'
  },
  {
    id: 30,
    modulo: 2,
    moduloNombre: 'CRUD Atómico y Operadores de Actualización',
    tituloDesafio: 'Eliminación Limpia de Campos con $unset',
    premisa: 'Se retira el módulo obsoleto "antenaAnalogica" del esquema del robot. Asignar { antenaAnalogica: null } mantiene el campo ocupando bytes en cada documento BSON. ¿Cómo se remueve por completo?',
    opciones: [
      {
        id: 'm2-c37',
        nombre: 'BSON Field Eraser ($unset)',
        tipo: 'instruction_set',
        descripcion: 'Remueve físicamente la clave y su valor del documento BSON liberando espacio.',
        iconoPixelArt: 'diode',
        codigoSnippet: 'await Robot.updateMany({}, { $unset: { antenaAnalogica: "" } });'
      },
      {
        id: 'm2-c38',
        nombre: 'Null Pointer Assign ($set: null)',
        tipo: 'core_processor',
        descripcion: 'Asigna null manteniendo el tipo BSON Null y el nombre del campo en disco.',
        iconoPixelArt: 'microchip'
      },
      {
        id: 'm2-c39',
        nombre: 'Undefined JS Field Deletion',
        tipo: 'memory_bus',
        descripcion: 'Pasa { antenaAnalogica: undefined } que Mongoose frecuentemente ignora por defecto.',
        iconoPixelArt: 'ram'
      }
    ],
    solucion: ['m2-c37'],
    pistaError: {
      mensaje: 'Setear un campo en null o string vacío no lo borra: crea un campo con tipo BSON Null (tipo 10) que consume memoria e indexación.',
      tipoAnimacion: 'BUFFER_16MB_OVERFLOW',
      detallesTecnicos: '$unset elimina completamente la entrada de la clave en la tabla de campos BSON del documento.',
      recomendacionDoc: 'MongoDB Manual: $unset Field Operator.'
    },
    explicacionAcierto: '$unset purga por completo el campo del documento BSON sin dejar residuos de tipos nulos en disco.'
  },
  {
    id: 31,
    modulo: 2,
    moduloNombre: 'CRUD Atómico y Operadores de Actualización',
    tituloDesafio: 'Operaciones en Lote: bulkWrite Unordered',
    premisa: 'El taller necesita aplicar 50,000 operaciones mixtas (inserciones, actualizaciones y borrados). Si la operación #42 falla por clave duplicada, las restantes 49,958 no deben abortarse. ¿Qué modo se requiere?',
    opciones: [
      {
        id: 'm2-c40',
        nombre: 'Unordered Bulk Execution Unit ({ ordered: false })',
        tipo: 'storage_controller',
        descripcion: 'Ejecuta operaciones en paralelo sin detenerse ante fallos individuales y reporta todos los errores al final.',
        iconoPixelArt: 'storage_controller' as any,
        codigoSnippet: 'await Robot.bulkWrite(operations, { ordered: false });'
      },
      {
        id: 'm2-c41',
        nombre: 'Ordered Serial Pipeline ({ ordered: true })',
        tipo: 'instruction_set',
        descripcion: 'Detiene inmediatamente la ejecución en la primera operación que arroja error.',
        iconoPixelArt: 'pipeline'
      },
      {
        id: 'm2-c42',
        nombre: 'Sequential Promise.all Loop',
        tipo: 'core_processor',
        descripcion: 'Envía 50,000 peticiones de red simultáneas colapsando el pool de conexiones.',
        iconoPixelArt: 'microchip'
      }
    ],
    solucion: ['m2-c40'],
    pistaError: {
      mensaje: 'Por defecto, bulkWrite es ordenado (`ordered: true`), lo que aborta el lote completo en el instante en que una sola operación falla.',
      tipoAnimacion: 'PIPELINE_STALL_ORDER',
      detallesTecnicos: '`ordered: false` permite a MongoDB reordenar y paralelizar escrituras entre shards, procesando todo el lote y recolectando writeErrors individuales.',
      recomendacionDoc: 'MongoDB Manual: db.collection.bulkWrite() ordered parameter.'
    },
    explicacionAcierto: '{ ordered: false } maximiza el rendimiento y permite procesar todas las operaciones independientes sin bloqueos en cadena.'
  },
  {
    id: 32,
    modulo: 2,
    moduloNombre: 'CRUD Atómico y Operadores de Actualización',
    tituloDesafio: 'Patrón Compare-And-Swap (CAS) para Reserva de Bahías',
    premisa: 'Tres robots intentan acoplarse simultáneamente a la "Bahía de Carga 01" que tiene status: "VACANT". Solo uno debe conseguirla, sin recurrir a locks pesados de base de datos. ¿Qué query atómica lo logra?',
    opciones: [
      {
        id: 'm2-c43',
        nombre: 'Compare-And-Swap Atomic Filter Bus',
        tipo: 'instruction_set',
        descripcion: 'Incluye la condición de disponibilidad en el filtro del findOneAndUpdate. Solo quien encuentre "VACANT" muta el estado.',
        iconoPixelArt: 'crystal',
        codigoSnippet: 'const slot = await Bay.findOneAndUpdate(\n  { _id: "BAY_01", status: "VACANT" },\n  { $set: { status: "OCCUPIED", robotId } },\n  { new: true }\n);'
      },
      {
        id: 'm2-c44',
        nombre: 'Blind Overwrite Injector',
        tipo: 'core_processor',
        descripcion: 'Ejecuta updateOne({ _id: "BAY_01" }, { $set: { robotId } }) sin chequear status.',
        iconoPixelArt: 'microchip'
      },
      {
        id: 'm2-c45',
        nombre: 'Read First, If/Else Client Check',
        tipo: 'memory_bus',
        descripcion: 'Consulta el status en una query previa y luego decide si hace update.',
        iconoPixelArt: 'ram'
      }
    ],
    solucion: ['m2-c43'],
    pistaError: {
      mensaje: 'Consultar el estado y luego actualizar en dos llamadas separadas permite que otro proceso ocupe la bahía en el intervalo intermedio.',
      tipoAnimacion: 'TRANSACTION_ABORT',
      detallesTecnicos: 'El filtro `{ status: "VACANT" }` actúa como candado atómico en la mutación. Si devuelve null, significa que otro proceso ganó la carrera.',
      recomendacionDoc: 'MongoDB Patterns: Two-Phase Commits and Compare-and-Swap.'
    },
    explicacionAcierto: 'El patrón Compare-And-Swap resuelve asignaciones de recursos concurrentes en un único comando atómico sin sobrecarga.'
  },
  {
    id: 33,
    modulo: 2,
    moduloNombre: 'CRUD Atómico y Operadores de Actualización',
    tituloDesafio: 'Actualizaciones con Pipelines de Agregación en updateOne',
    premisa: 'Se necesita actualizar el campo "saludTotal" de un androide sumando los valores de sus campos internos "blindaje" y "escudo" en un solo paso atómico en la base de datos sin leerlos a Node.js.',
    opciones: [
      {
        id: 'm2-c46',
        nombre: 'Aggregation Pipeline Update Array',
        tipo: 'instruction_set',
        descripcion: 'Pasa un array de etapas como segundo argumento de updateOne() permitiendo referenciar campos del propio documento con "$".',
        iconoPixelArt: 'pipeline',
        codigoSnippet: 'await Robot.updateOne(\n  { _id },\n  [\n    { $set: { saludTotal: { $add: ["$blindaje", "$escudo"] } } }\n  ]\n);'
      },
      {
        id: 'm2-c47',
        nombre: 'Standard $set Literal String Trap',
        tipo: 'core_processor',
        descripcion: 'Usa { $set: { saludTotal: "$blindaje" + "$escudo" } } que guarda un string literal plano.',
        iconoPixelArt: 'microchip'
      },
      {
        id: 'm2-c48',
        nombre: 'WiredTiger Native C++ Script Trigger',
        tipo: 'memory_bus',
        descripcion: 'Inyecta código binario C++ compilado en el socket.',
        iconoPixelArt: 'ram'
      }
    ],
    solucion: ['m2-c46'],
    pistaError: {
      mensaje: 'El $set convencional no permite referenciar otros campos del mismo documento; para calcular campos a partir de otros se requiere la sintaxis de pipeline (array []).',
      tipoAnimacion: 'PIPELINE_STALL_ORDER',
      detallesTecnicos: 'Desde MongoDB 4.2, pasar un array en la sección de actualización habilita etapas de agregación como $set, $unset y $replaceRoot en updates atómicos.',
      recomendacionDoc: 'MongoDB Manual: Updates with Aggregation Pipeline.'
    },
    explicacionAcierto: 'Los updates con pipeline de agregación permiten computar campos basados en otros campos del mismo documento en una sola escritura atómica.'
  },
  {
    id: 34,
    modulo: 2,
    moduloNombre: 'CRUD Atómico y Operadores de Actualización',
    tituloDesafio: 'Read Concern Snapshot en Transacciones',
    premisa: 'Un proceso de auditoría cuántica ejecuta lecturas en múltiples colecciones dentro de una transacción. Necesita asegurar que no verá lecturas fantasmas ni datos sucios de transacciones no confirmadas. ¿Qué nivel de Read Concern es obligatorio?',
    opciones: [
      {
        id: 'm2-c49',
        nombre: 'Read Concern Snapshot Isolator',
        tipo: 'storage_controller',
        descripcion: 'Garantiza que la sesión lea un snapshot congelado y consistente de los datos confirmado en mayoría.',
        iconoPixelArt: 'storage_controller' as any,
        codigoSnippet: 'session.startTransaction({ readConcern: { level: "snapshot" } });'
      },
      {
        id: 'm2-c50',
        nombre: 'Read Concern Local (Dirty Read Risk)',
        tipo: 'memory_bus',
        descripcion: 'Lee datos de la memoria local del nodo sin importar si se cancelan luego.',
        iconoPixelArt: 'ram'
      },
      {
        id: 'm2-c51',
        nombre: 'Read Concern Linearizable Slowdown',
        tipo: 'flux_capacitor',
        descripcion: 'Forza a todos los nodos del planeta a detenerse en cada lectura de la transacción.',
        iconoPixelArt: 'capacitor'
      }
    ],
    solucion: ['m2-c49'],
    pistaError: {
      mensaje: 'Las transacciones multi-documento de MongoDB requieren aislamiento Snapshot para cumplir con la semántica ACID estricta.',
      tipoAnimacion: 'TRANSACTION_ABORT',
      detallesTecnicos: 'Read Concern snapshot provee aislamiento de transacciones de snapshot isolation, impidiendo lecturas no repetibles y dirty reads.',
      recomendacionDoc: 'MongoDB Architecture: Read Concern snapshot.'
    },
    explicacionAcierto: 'Read Concern snapshot garantiza una vista consistente en el tiempo para todas las lecturas dentro de una transacción.'
  }
];

