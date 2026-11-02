import { RawModuleQuestion } from '../../types/game';

export const module4Questions: RawModuleQuestion[] = [
  {
    id: 52,
    modulo: 4,
    moduloNombre: 'Schemas y Modelos Mongoose',
    tituloDesafio: 'Peticiones Congeladas por Bloqueo en pre("save")',
    premisa: 'El robot queda en un estado zombi indefinido al guardarse. La petición HTTP nunca responde y el servidor se queda sin memoria. Un middleware pre("save") no usó async ni llamó a next().',
    codigoContexto: '// Middleware defectuoso:\nRobotSchema.pre("save", function(next) {\n  this.recalibratedAt = new Date();\n  // ERROR: Olvidó invocar next() y no retornó una Promise\n});',
    opciones: [
      {
        id: 'm4-c1',
        nombre: 'Async Middleware Resolver (or next() Dispatcher)',
        tipo: 'instruction_set',
        descripcion: 'Transforma la función a async o invoca explícitamente next() al culminar la tarea.',
        iconoPixelArt: 'crystal',
        codigoSnippet: 'RobotSchema.pre("save", async function() {\n  this.recalibratedAt = new Date();\n  // Resolver la Promise avanza automáticamente\n});'
      },
      {
        id: 'm4-c2',
        nombre: 'Infinite Timeout Extender',
        tipo: 'flux_capacitor',
        descripcion: 'Aumenta el timeout de Express a 24 horas para esperar la respuesta.',
        iconoPixelArt: 'capacitor'
      },
      {
        id: 'm4-c3',
        nombre: 'Arrow Function Context Stripper',
        tipo: 'core_processor',
        descripcion: 'Cambia a una arrow function () => {} perdiendo la referencia a this.',
        iconoPixelArt: 'microchip'
      }
    ],
    solucion: ['m4-c1'],
    pistaError: {
      mensaje: 'En los middlewares de Mongoose, olvidar llamar a next() o no retornar una promesa deja la cadena de hooks congelada para siempre.',
      tipoAnimacion: 'SCHEMA_VALIDATION_BLOCKED',
      detallesTecnicos: 'Mongoose espera la resolución de la promesa retornada o la ejecución de next() para continuar el ciclo de persistencia.',
      recomendacionDoc: 'Mongoose Docs: Middleware (pre and post hooks).'
    },
    explicacionAcierto: 'Los hooks pre deben o invocar next() o retornar una Promise resuelta para no bloquear el flujo de ejecución.'
  },
  {
    id: 53,
    modulo: 4,
    moduloNombre: 'Schemas y Modelos Mongoose',
    tituloDesafio: 'Omisión de Hooks en findOneAndUpdate y updateMany',
    premisa: 'Un hook pre("save") cifra la clave de acceso del robot. Al actualizar la contraseña con findOneAndUpdate, la clave se guardó en texto plano sin cifrar. ¿Por qué se omitió el hook?',
    codigoContexto: 'await Robot.findOneAndUpdate({ _id }, { password: "plain_password" });',
    opciones: [
      {
        id: 'm4-c4',
        nombre: 'Query Middleware Alignment (or Document save() Protocol)',
        tipo: 'instruction_set',
        descripcion: 'findOneAndUpdate es una query de base de datos directa y NO dispara los middleware de documento save().',
        iconoPixelArt: 'pipeline',
        codigoSnippet: '// Opción A: pre("findOneAndUpdate") usando this.getUpdate()\n// Opción B: doc = await Robot.findById(); doc.password = "x"; await doc.save();'
      },
      {
        id: 'm4-c5',
        nombre: 'Global Save Hook Force Flag',
        tipo: 'core_processor',
        descripcion: 'Agrega { forceDocumentHooks: true } inventando una opción no existente.',
        iconoPixelArt: 'microchip'
      },
      {
        id: 'm4-c6',
        nombre: 'Disable Strict Mode Relay',
        tipo: 'memory_bus',
        descripcion: 'Pone strict: false en el esquema para que ignore el cifrado.',
        iconoPixelArt: 'ram'
      }
    ],
    solucion: ['m4-c4'],
    pistaError: {
      mensaje: 'Mongoose diferencia entre Document Middleware (`save`, `validate`) y Query Middleware (`find`, `updateOne`, `findOneAndUpdate`).',
      tipoAnimacion: 'DATA_CORRUPTION_NO_SET',
      detallesTecnicos: '`findOneAndUpdate` se envía directo a MongoDB como un comando atómico y no instancia el documento, omitiendo los hooks pre("save").',
      recomendacionDoc: 'Mongoose Documentation: Document vs Query Middleware.'
    },
    explicacionAcierto: 'Para disparar validaciones y hooks de documento se debe cargar el documento y llamar a doc.save(), o definir un hook pre("findOneAndUpdate").'
  },
  {
    id: 54,
    modulo: 4,
    moduloNombre: 'Schemas y Modelos Mongoose',
    tituloDesafio: 'Validación Desactivada por Defecto en Updates',
    premisa: 'El esquema define que el nivel de armadura debe ser mínimo 0 y máximo 100. Sin embargo, un updateOne logró guardar armadura: -999 sin arrojar ningún error de validación. ¿Qué opción falta?',
    codigoContexto: 'await Robot.findOneAndUpdate(\n  { _id },\n  { $set: { armadura: -999 } }\n  // Falta activar la validación\n);',
    opciones: [
      {
        id: 'm4-c7',
        nombre: 'Update Validation Gate ({ runValidators: true })',
        tipo: 'instruction_set',
        descripcion: 'Fuerza a Mongoose a ejecutar las validaciones del Schema durante las operaciones de actualización.',
        iconoPixelArt: 'crystal',
        codigoSnippet: '{ runValidators: true }'
      },
      {
        id: 'm4-c8',
        nombre: 'Strict Schema Bypass Bus',
        tipo: 'core_processor',
        descripcion: 'Usa { strict: "throw" } asumiendo que valida rangos numéricos.',
        iconoPixelArt: 'microchip'
      },
      {
        id: 'm4-c9',
        nombre: 'Manual Pre-Check If Clause',
        tipo: 'memory_bus',
        descripcion: 'Valida manualmente con ifs en cada controlador de la API.',
        iconoPixelArt: 'ram'
      }
    ],
    solucion: ['m4-c7'],
    pistaError: {
      mensaje: 'Por razones históricas de rendimiento, Mongoose NO ejecuta los validadores de esquema en update/findOneAndUpdate a menos que se configure explícitamente.',
      tipoAnimacion: 'SCHEMA_VALIDATION_BLOCKED',
      detallesTecnicos: 'Configurar `{ runValidators: true }` hace que Mongoose verifique min, max, enum y validadores custom sobre los campos incluidos en el update.',
      recomendacionDoc: 'Mongoose Documentation: Validation on Update.'
    },
    explicacionAcierto: 'runValidators: true asegura que las reglas de integridad del Schema se respeten incluso en actualizaciones directas.'
  },
  {
    id: 55,
    modulo: 4,
    moduloNombre: 'Schemas y Modelos Mongoose',
    tituloDesafio: 'Aceleración de Consultas de Lectura con .lean()',
    premisa: 'El endpoint de telemetría devuelve 5,000 robots en un reporte de solo lectura. El consumo de RAM en Node.js se dispara a 1.2GB y tarda 4 segundos en serializar. ¿Cómo se optimiza para recibir objetos JS planos?',
    opciones: [
      {
        id: 'm4-c10',
        nombre: 'POJO Fast Query Stripper (.lean())',
        tipo: 'core_processor',
        descripcion: 'Evita la instanciación de documentos pesados de Mongoose devolviendo objetos JavaScript planos (POJO).',
        iconoPixelArt: 'microchip',
        codigoSnippet: 'const robots = await Robot.find({ status: "ACTIVE" }).lean();'
      },
      {
        id: 'm4-c11',
        nombre: 'JSON.parse(JSON.stringify()) Loop',
        tipo: 'memory_bus',
        descripcion: 'Serializa y deserializa con JSON.stringify empeorando el consumo de CPU.',
        iconoPixelArt: 'ram'
      },
      {
        id: 'm4-c12',
        nombre: 'V8 Garbage Collection Forcer',
        tipo: 'flux_capacitor',
        descripcion: 'Invoca global.gc() tras cada lectura deteniendo el Event Loop.',
        iconoPixelArt: 'capacitor'
      }
    ],
    solucion: ['m4-c10'],
    pistaError: {
      mensaje: 'Los documentos Mongoose completos incluyen métodos, getters, seguimiento de estado interno $isModified y middleware, pesando 10x más que un objeto plano.',
      tipoAnimacion: 'BUFFER_16MB_OVERFLOW',
      detallesTecnicos: '`.lean()` se salta la hidratación de Mongoose Document, reduciendo el consumo de RAM hasta un 80% y acelerando el rendimiento x5.',
      recomendacionDoc: 'Mongoose Tutorials: Faster Mongoose Queries with Lean.'
    },
    explicacionAcierto: 'lean() devuelve Plain Old JavaScript Objects (POJOs), ideal para lecturas masivas y serializaciones JSON a alta velocidad.'
  },
  {
    id: 56,
    modulo: 4,
    moduloNombre: 'Schemas y Modelos Mongoose',
    tituloDesafio: 'Serialización de Virtuals en toJSON',
    premisa: 'Se define un campo virtual "potenciaKW" que calcula la conversión de energía. Al enviar el robot por res.json(robot), el campo virtual no aparece en la respuesta al cliente. ¿Qué opción del Schema lo habilita?',
    codigoContexto: 'RobotSchema.virtual("potenciaKW").get(function() { return this.energia * 1.34; });',
    opciones: [
      {
        id: 'm4-c13',
        nombre: 'Virtual Serialization Config ({ virtuals: true })',
        tipo: 'instruction_set',
        descripcion: 'Configura las opciones toJSON y toObject del Schema para incluir getters virtuales al transformar a JSON.',
        iconoPixelArt: 'crystal',
        codigoSnippet: 'RobotSchema.set("toJSON", { virtuals: true });\nRobotSchema.set("toObject", { virtuals: true });'
      },
      {
        id: 'm4-c14',
        nombre: 'Physical Database Column Persister',
        tipo: 'storage_controller',
        descripcion: 'Copia el cálculo en disco ocupando almacenamiento duplicado.',
        iconoPixelArt: 'storage_controller' as any
      },
      {
        id: 'm4-c15',
        nombre: 'Manual Response Object Cloner',
        tipo: 'memory_bus',
        descripcion: 'Agrega res.json({ ...robot._doc, potenciaKW: robot.potenciaKW }) a mano en cada ruta.',
        iconoPixelArt: 'ram'
      }
    ],
    solucion: ['m4-c13'],
    pistaError: {
      mensaje: 'Por defecto, Mongoose excluye los campos virtuales de toJSON() y toObject() para evitar sobrecargas inesperadas.',
      tipoAnimacion: 'SCHEMA_VALIDATION_BLOCKED',
      detallesTecnicos: 'Activar `{ virtuals: true }` en las opciones de serialización del esquema incluye automáticamente las propiedades calculadas.',
      recomendacionDoc: 'Mongoose Guide: Virtuals in toJSON.'
    },
    explicacionAcierto: 'Configurar toJSON: { virtuals: true } expone automáticamente los campos calculados virtuales en las respuestas de la API.'
  },
  {
    id: 57,
    modulo: 4,
    moduloNombre: 'Schemas y Modelos Mongoose',
    tituloDesafio: 'Validadores Personalizados Asíncronos',
    premisa: 'Al crear un nuevo robot se debe validar contra el servicio de la Flota Estelar que su código de identificación no esté dado de baja en una lista negra externa. ¿Cómo se declara este validador?',
    opciones: [
      {
        id: 'm4-c16',
        nombre: 'Async Custom Validator Module',
        tipo: 'instruction_set',
        descripcion: 'Define una propiedad validate en el SchemaType con una función asíncrona que retorna boolean.',
        iconoPixelArt: 'pipeline',
        codigoSnippet: 'serialNumber: {\n  type: String,\n  validate: {\n    validator: async function(val) {\n      return !(await FleetService.isBlacklisted(val));\n    },\n    message: "El serial {VALUE} está en la lista negra."\n  }\n}'
      },
      {
        id: 'm4-c17',
        nombre: 'Sync Loop While Lock',
        tipo: 'core_processor',
        descripcion: 'Hace una llamada síncrona bloqueando todo el hilo principal de Node.',
        iconoPixelArt: 'microchip'
      },
      {
        id: 'm4-c18',
        nombre: 'Try/Catch Route Handler Hook',
        tipo: 'memory_bus',
        descripcion: 'Pone la validación únicamente en el controlador de Express sin proteger el modelo.',
        iconoPixelArt: 'ram'
      }
    ],
    solucion: ['m4-c16'],
    pistaError: {
      mensaje: 'Validar en el Schema garantiza integridad sin importar desde dónde se invoque el modelo (APIs, scripts, crons, workers).',
      tipoAnimacion: 'SCHEMA_VALIDATION_BLOCKED',
      detallesTecnicos: 'Los validadores asíncronos en Mongoose retornan una promesa que resuelve a true (válido) o false (inválido).',
      recomendacionDoc: 'Mongoose Guide: Custom Async Validators.'
    },
    explicacionAcierto: 'Los validadores asíncronos del Schema protegen la lógica de negocio a nivel de modelo de forma centralizada y segura.'
  },
  {
    id: 58,
    modulo: 4,
    moduloNombre: 'Schemas y Modelos Mongoose',
    tituloDesafio: 'Polimorfismo con Discriminadores de Mongoose',
    premisa: 'El taller fabrica dos tipos de androides: "CombatRobot" (con campo blindajePesado) y "ScoutRobot" (con campo sensorCamuflaje). Ambos deben compartir la colección base "robots" con un único discriminador.',
    opciones: [
      {
        id: 'm4-c19',
        nombre: 'Schema Discriminator Gateway',
        tipo: 'instruction_set',
        descripcion: 'Extiende el modelo base creando subtipos polimórficos que residen en la misma colección compartida.',
        iconoPixelArt: 'crystal',
        codigoSnippet: 'const BaseRobot = mongoose.model("Robot", BaseSchema);\nconst CombatRobot = BaseRobot.discriminator("Combat", CombatSchema);'
      },
      {
        id: 'm4-c20',
        nombre: 'Mixed Loose Schema Anti-Pattern',
        tipo: 'core_processor',
        descripcion: 'Usa Schema.Types.Mixed deshabilitando todo el tipado y validación de campos.',
        iconoPixelArt: 'microchip'
      },
      {
        id: 'm4-c21',
        nombre: 'Separate Dual Collections Shifter',
        tipo: 'storage_controller',
        descripcion: 'Crea dos colecciones totalmente separadas impidiendo búsquedas polimórficas unificadas.',
        iconoPixelArt: 'storage_controller' as any
      }
    ],
    solucion: ['m4-c19'],
    pistaError: {
      mensaje: 'Los discriminadores son la forma nativa de Mongoose para herencia de esquemas y almacenamiento polimórfico en una sola colección.',
      tipoAnimacion: 'SCHEMA_VALIDATION_BLOCKED',
      detallesTecnicos: 'Mongoose añade automáticamente una clave `__t` (tipo de discriminador) para hidratar el documento en la clase correcta.',
      recomendacionDoc: 'Mongoose Documentation: Discriminators.'
    },
    explicacionAcierto: 'Los discriminadores permiten compartir la misma colección y campos comunes mientras se mantienen esquemas estrictos por subtipo.'
  },
  {
    id: 59,
    modulo: 4,
    moduloNombre: 'Schemas y Modelos Mongoose',
    tituloDesafio: 'Diferencia Crítica: Subdocumentos vs Nested Paths',
    premisa: 'Al definir una pieza del robot como un nuevo Schema ({ name: String }), Mongoose le genera automáticamente un campo _id propio y maneja validación independiente. ¿Cómo se define como subdocumento vs un objeto anidado plano?',
    opciones: [
      {
        id: 'm4-c22',
        nombre: 'Explicit Subdocument Schema Definition',
        tipo: 'instruction_set',
        descripcion: 'Asignar una instancia de Schema genera un subdocumento real con ciclo de vida, _id y validación aislada.',
        iconoPixelArt: 'pipeline',
        codigoSnippet: 'const PartSchema = new mongoose.Schema({ name: String });\nconst RobotSchema = new mongoose.Schema({ part: PartSchema });'
      },
      {
        id: 'm4-c23',
        nombre: 'Plain Object Nesting Shifter',
        tipo: 'memory_bus',
        descripcion: 'Usar { part: { name: String } } crea un nested path simple sin _id ni hooks propios.',
        iconoPixelArt: 'ram'
      },
      {
        id: 'm4-c24',
        nombre: 'BSON Untyped Array Relay',
        tipo: 'core_processor',
        descripcion: 'Usa un array sin tipo [Object] deshabilitando el motor de esquema.',
        iconoPixelArt: 'microchip'
      }
    ],
    solucion: ['m4-c22'],
    pistaError: {
      mensaje: 'Un objeto plano `{ name: String }` es solo una ruta anidada (nested path); pasar una instancia de `new Schema(...)` crea un subdocumento con _id y middleware propio.',
      tipoAnimacion: 'BSON_TYPE_MISMATCH',
      detallesTecnicos: 'Los subdocumentos heredan capacidades completas de documento como `doc.ownerDocument()` y métodos de guardado específicos.',
      recomendacionDoc: 'Mongoose Subdocuments vs Nested Paths.'
    },
    explicacionAcierto: 'Los subdocumentos con su propio Schema permiten encapsular reglas de validación, sub-hooks y claves primarias independientes.'
  },
  {
    id: 60,
    modulo: 4,
    moduloNombre: 'Schemas y Modelos Mongoose',
    tituloDesafio: 'Populado Profundo (Deep Populate)',
    premisa: 'Se necesita consultar el robot, poblar su "piloto", y dentro del piloto poblar su "gremio" de pertenencia en una sola llamada declarativa.',
    opciones: [
      {
        id: 'm4-c25',
        nombre: 'Recursive Deep Populate Controller',
        tipo: 'instruction_set',
        descripcion: 'Anida la propiedad populate dentro del objeto de opciones para resolver relaciones multinivel.',
        iconoPixelArt: 'crystal',
        codigoSnippet: 'await Robot.findById(id).populate({\n  path: "pilot",\n  populate: { path: "guild" }\n});'
      },
      {
        id: 'm4-c26',
        nombre: 'Dot Notation Populate Trap (.populate("pilot.guild"))',
        tipo: 'core_processor',
        descripcion: 'Usa la sintaxis antigua con punto que no permite configurar opciones del segundo nivel.',
        iconoPixelArt: 'microchip'
      },
      {
        id: 'm4-c27',
        nombre: 'Iterative For-Loop Query Cascade',
        tipo: 'memory_bus',
        descripcion: 'Ejecuta queries sucesivas en bucle multiplicando las conexiones TCP.',
        iconoPixelArt: 'ram'
      }
    ],
    solucion: ['m4-c25'],
    pistaError: {
      mensaje: 'Anidar la opción populate permite estructurar consultas profundas y seleccionar campos específicos en cada nivel.',
      tipoAnimacion: 'PIPELINE_STALL_ORDER',
      detallesTecnicos: 'Mongoose agrupa internamente los ObjectIds encontrados en cada nivel y ejecuta consultas `$in` eficientes para evitar el problema N+1.',
      recomendacionDoc: 'Mongoose Docs: Deep Populate across multiple levels.'
    },
    explicacionAcierto: 'El populate anidado resuelve jerarquías de referencias complejas manteniendo consultas optimizadas por lotes.'
  },
  {
    id: 61,
    modulo: 4,
    moduloNombre: 'Schemas y Modelos Mongoose',
    tituloDesafio: 'Middleware de Captura de Claves Duplicadas (E11000)',
    premisa: 'Cuando un robot intenta registrar un serial ya existente, MongoDB lanza el error crudo MongoServerError E11000. Se necesita transformar este error en un mensaje amigable HTTP 409 antes de que llegue a Express.',
    opciones: [
      {
        id: 'm4-c28',
        nombre: 'Error-Handling Post Middleware Hook',
        tipo: 'instruction_set',
        descripcion: 'Usa un post hook especial con 3 argumentos (error, doc, next) para interceptar y formatear excepciones del Schema.',
        iconoPixelArt: 'pipeline',
        codigoSnippet: 'RobotSchema.post("save", function(error, doc, next) {\n  if (error.code === 11000) {\n    next(new ConflictError("El número de serie ya está en uso."));\n  } else {\n    next(error);\n  }\n});'
      },
      {
        id: 'm4-c29',
        nombre: 'Silent Error Suppressor',
        tipo: 'core_processor',
        descripcion: 'Captura el error y llama a next() vacío para fingir que se guardó correctamente.',
        iconoPixelArt: 'microchip'
      },
      {
        id: 'm4-c30',
        nombre: 'Drop Duplicate Index Override',
        tipo: 'storage_controller',
        descripcion: 'Borra el índice único para permitir robots duplicados en la base.',
        iconoPixelArt: 'storage_controller' as any
      }
    ],
    solucion: ['m4-c28'],
    pistaError: {
      mensaje: 'Mongoose soporta middleware de manejo de errores declarando una firma de función de 3 parámetros: `function(error, doc, next)`.',
      tipoAnimacion: 'SCHEMA_VALIDATION_BLOCKED',
      detallesTecnicos: 'Este middleware se ejecuta de forma inmediata cuando ocurre un fallo en save o validate, permitiendo traducir códigos nativos de Mongo.',
      recomendacionDoc: 'Mongoose Guide: Error Handling Middleware.'
    },
    explicacionAcierto: 'El middleware de error post("save") centraliza el control de excepciones como E11000 manteniendo los controladores de ruta limpios.'
  },
  {
    id: 62,
    modulo: 4,
    moduloNombre: 'Schemas y Modelos Mongoose',
    tituloDesafio: 'Métodos Estáticos vs Métodos de Instancia',
    premisa: 'El desarrollador necesita una función para buscar androides por sector y nivel mínimo de batería (Robot.findByFleetAndBattery), invocable directamente sobre el Modelo en lugar de sobre un androide particular.',
    opciones: [
      {
        id: 'm4-c31',
        nombre: 'Static Model Method Unit (schema.statics)',
        tipo: 'instruction_set',
        descripcion: 'Define funciones adjuntas al Modelo global mediante schema.statics para lógica de búsqueda y queries personalizadas.',
        iconoPixelArt: 'crystal',
        codigoSnippet: 'RobotSchema.statics.findByFleetAndBattery = function(fleet, minBat) {\n  return this.find({ fleet, battery: { $gte: minBat } });\n};'
      },
      {
        id: 'm4-c32',
        nombre: 'Instance Method Trap (schema.methods)',
        tipo: 'core_processor',
        descripcion: 'Usa schema.methods que solo existe en instancias individuales creadas con new Robot().',
        iconoPixelArt: 'microchip'
      },
      {
        id: 'm4-c33',
        nombre: 'Global Window Variable Injector',
        tipo: 'memory_bus',
        descripcion: 'Guarda la función en globalThis.findByFleet de Node.js.',
        iconoPixelArt: 'ram'
      }
    ],
    solucion: ['m4-c31'],
    pistaError: {
      mensaje: '`schema.methods` opera sobre instancias (`robotInstance.saludar()`); para invocar operaciones sobre el Modelo global (`Robot.buscar()`) se usa `schema.statics`.',
      tipoAnimacion: 'SCHEMA_VALIDATION_BLOCKED',
      detallesTecnicos: 'En un método estático, `this` se refiere directamente al Modelo Mongoose compilado.',
      recomendacionDoc: 'Mongoose Documentation: Statics vs Methods.'
    },
    explicacionAcierto: 'schema.statics extiende las capacidades de consulta del modelo central encapsulando lógica de acceso a datos reutilizable.'
  },
  {
    id: 63,
    modulo: 4,
    moduloNombre: 'Schemas y Modelos Mongoose',
    tituloDesafio: 'Encadenamiento Fluido con Query Helpers',
    premisa: 'Se busca poder encadenar filtros reutilizables como Robot.find().byStatus("ACTIVE").bySector("EPSILON") de forma limpia y legible.',
    opciones: [
      {
        id: 'm4-c34',
        nombre: 'Chainable Query Helper (schema.query)',
        tipo: 'instruction_set',
        descripcion: 'Extiende el cursor de Mongoose Query para permitir encadenar condiciones de búsqueda fluidas.',
        iconoPixelArt: 'pipeline',
        codigoSnippet: 'RobotSchema.query.byStatus = function(status) {\n  return this.where({ status });\n};'
      },
      {
        id: 'm4-c35',
        nombre: 'Prototype Monkey-Patch',
        tipo: 'core_processor',
        descripcion: 'Modifica Object.prototype en tiempo de ejecución.',
        iconoPixelArt: 'microchip'
      },
      {
        id: 'm4-c36',
        nombre: 'Nested Function Callback Wrapper',
        tipo: 'memory_bus',
        descripcion: 'Crea 10 funciones envolventes anidadas con callbacks.',
        iconoPixelArt: 'ram'
      }
    ],
    solucion: ['m4-c34'],
    pistaError: {
      mensaje: 'Query Helpers permiten añadir métodos directamente a la cadena de queries de Mongoose (`Model.find().miHelper()`).',
      tipoAnimacion: 'PIPELINE_STALL_ORDER',
      detallesTecnicos: 'Los query helpers retornan `this` (la propia query), posibilitando un DSL fluido y reutilizable en toda la aplicación.',
      recomendacionDoc: 'Mongoose Guide: Query Helpers.'
    },
    explicacionAcierto: 'schema.query aporta una API fluida y declarativa para modularizar filtros de consulta recurrentes.'
  },
  {
    id: 64,
    modulo: 4,
    moduloNombre: 'Schemas y Modelos Mongoose',
    tituloDesafio: 'Timestamps Automáticos en Mongoose',
    premisa: 'El androide requiere auditoría estricta de fecha de ensamblaje (createdAt) y última calibración (updatedAt) sin tener que instanciar manualmente new Date() en cada guardado.',
    opciones: [
      {
        id: 'm4-c37',
        nombre: 'Native Schema Timestamps Option ({ timestamps: true })',
        tipo: 'instruction_set',
        descripcion: 'Activa la gestión automática de createdAt y updatedAt en cada operación save y update.',
        iconoPixelArt: 'crystal',
        codigoSnippet: 'const RobotSchema = new mongoose.Schema({ name: String }, { timestamps: true });'
      },
      {
        id: 'm4-c38',
        nombre: 'Manual Pre-Save Date Clock',
        tipo: 'memory_bus',
        descripcion: 'Escribe a mano un pre("save") que se olvida de actualizarse en updateOne.',
        iconoPixelArt: 'ram'
      },
      {
        id: 'm4-c39',
        nombre: 'Database Cron Clock Poller',
        tipo: 'flux_capacitor',
        descripcion: 'Corre un cron cada minuto que actualiza fechas al azar.',
        iconoPixelArt: 'capacitor'
      }
    ],
    solucion: ['m4-c37'],
    pistaError: {
      mensaje: 'Manejar timestamps de forma manual en pre("save") falla en operaciones directas como updateOne o findOneAndUpdate.',
      tipoAnimacion: 'DATA_CORRUPTION_NO_SET',
      detallesTecnicos: '`{ timestamps: true }` inyecta automáticamente createdAt y actualiza updatedAt tanto en Document save como en Query updates.',
      recomendacionDoc: 'Mongoose Schema Options: timestamps.'
    },
    explicacionAcierto: 'La opción timestamps: true garantiza coherencia temporal auditada en todas las mutaciones del modelo.'
  },
  {
    id: 65,
    modulo: 4,
    moduloNombre: 'Schemas y Modelos Mongoose',
    tituloDesafio: 'Normalización de Datos con Setters en Schema',
    premisa: 'Los operarios introducen el indicativo de llamada del androide con espacios y mezclas de mayúsculas ("  r2-d2  "). Debe persistirse siempre en mayúsculas y sin espacios ("R2-D2") de forma transparente.',
    opciones: [
      {
        id: 'm4-c40',
        nombre: 'Schema Setter Pipeline (trim & uppercase)',
        tipo: 'instruction_set',
        descripcion: 'Configura modificadores de tipo setter y trim en la definición del campo para sanitizar automáticamente antes de persistir.',
        iconoPixelArt: 'crystal',
        codigoSnippet: 'callsign: {\n  type: String,\n  trim: true,\n  uppercase: true // o .set(v => v.trim().toUpperCase())\n}'
      },
      {
        id: 'm4-c41',
        nombre: 'Database Regex Trigger Hack',
        tipo: 'core_processor',
        descripcion: 'Crea una expresión regular de búsqueda que intenta mutar los datos en el disco.',
        iconoPixelArt: 'microchip'
      },
      {
        id: 'm4-c42',
        nombre: 'Frontend Input Mask Only',
        tipo: 'memory_bus',
        descripcion: 'Confía ciegamente en que el frontend siempre enviará el dato limpio sin sanitizar el backend.',
        iconoPixelArt: 'ram'
      }
    ],
    solucion: ['m4-c40'],
    pistaError: {
      mensaje: 'Confiar en el frontend para sanitizar datos genera inconsistencias ante scripts o APIs externas.',
      tipoAnimacion: 'SCHEMA_VALIDATION_BLOCKED',
      detallesTecnicos: 'Los setters de Mongoose interceptan la asignación de valor y aplican transformaciones de forma determinista antes de guardar.',
      recomendacionDoc: 'Mongoose SchemaTypes: Getters and Setters.'
    },
    explicacionAcierto: 'Los setters en el Schema garantizan que los datos se normalicen uniformemente sin importar la fuente de entrada.'
  },
  {
    id: 66,
    modulo: 4,
    moduloNombre: 'Schemas y Modelos Mongoose',
    tituloDesafio: 'Saturación del Pool de Conexiones en Microservicios',
    premisa: 'El clúster de microservicios de androides agota todas las conexiones de MongoDB arrojando: "MongoServerSelectionError: connection pool exhausted". ¿Qué opciones de conexión regulan el tamaño del pool?',
    opciones: [
      {
        id: 'm4-c43',
        nombre: 'Connection Pool Governor (maxPoolSize / minPoolSize)',
        tipo: 'storage_controller',
        descripcion: 'Establece el número máximo de sockets TCP abiertos concurrentes por proceso (default 100).',
        iconoPixelArt: 'storage_controller' as any,
        codigoSnippet: 'await mongoose.connect(uri, {\n  maxPoolSize: 50,\n  minPoolSize: 10,\n  serverSelectionTimeoutMS: 5000\n});'
      },
      {
        id: 'm4-c44',
        nombre: 'Single Socket Lock (maxPoolSize: 1)',
        tipo: 'core_processor',
        descripcion: 'Fuerza a todas las peticiones a encolarse en un único socket TCP serial.',
        iconoPixelArt: 'microchip'
      },
      {
        id: 'm4-c45',
        nombre: 'Unbounded Socket Spawner (maxPoolSize: 999999)',
        tipo: 'memory_bus',
        descripcion: 'Permite abrir conexiones ilimitadas hasta agotar los file descriptors del sistema operativo.',
        iconoPixelArt: 'ram'
      }
    ],
    solucion: ['m4-c43'],
    pistaError: {
      mensaje: 'Un pool demasiado grande satura los descriptores de archivo y la memoria del servidor de base de datos; uno muy pequeño encola peticiones.',
      tipoAnimacion: 'COLLSCAN_OVERHEAT',
      detallesTecnicos: '`maxPoolSize` define el límite de conexiones concurrentes en el driver nativo de Node.js, reusando sockets de forma eficiente.',
      recomendacionDoc: 'MongoDB Drivers: Connection Pool Configuration.'
    },
    explicacionAcierto: 'Calibrar maxPoolSize y minPoolSize optimiza la latencia y la reutilización de sockets sin colapsar el motor MongoDB.'
  },
  {
    id: 67,
    modulo: 4,
    moduloNombre: 'Schemas y Modelos Mongoose',
    tituloDesafio: 'Modularidad Transversal con Mongoose Plugins',
    premisa: 'Se requiere dotar a 15 esquemas de robots distintos con borrado lógico (soft-delete con campo isDeleted y método restore()). ¿Cómo se encapsula para no duplicar código en cada archivo?',
    opciones: [
      {
        id: 'm4-c46',
        nombre: 'Mongoose Schema Plugin Architecture (schema.plugin)',
        tipo: 'instruction_set',
        descripcion: 'Empaqueta campos, métodos y middleware en una función reutilizable aplicable a múltiples esquemas.',
        iconoPixelArt: 'crystal',
        codigoSnippet: 'function softDeletePlugin(schema) {\n  schema.add({ isDeleted: { type: Boolean, default: false } });\n  schema.pre("find", function() { this.where({ isDeleted: false }); });\n}\nRobotSchema.plugin(softDeletePlugin);'
      },
      {
        id: 'm4-c47',
        nombre: 'Copy-Paste Code Duplicator',
        tipo: 'memory_bus',
        descripcion: 'Copia y pega las 50 líneas de código en los 15 archivos a mano.',
        iconoPixelArt: 'ram'
      },
      {
        id: 'm4-c48',
        nombre: 'Global Model Interceptor Trap',
        tipo: 'core_processor',
        descripcion: 'Intenta interceptar mongoose.Model a nivel de librería nativa.',
        iconoPixelArt: 'microchip'
      }
    ],
    solucion: ['m4-c46'],
    pistaError: {
      mensaje: 'Duplicar lógica en múltiples esquemas viola el principio DRY y causa pesadillas de mantenimiento.',
      tipoAnimacion: 'SCHEMA_VALIDATION_BLOCKED',
      detallesTecnicos: 'El sistema de plugins de Mongoose permite inyectar campos, métodos estáticos y hooks transversales de forma modular y testeable.',
      recomendacionDoc: 'Mongoose Documentation: Plugins.'
    },
    explicacionAcierto: 'Los plugins de Mongoose desacoplan y reutilizan lógica transversal como auditoría, borrado lógico y versionado.'
  },
  {
    id: 68,
    modulo: 4,
    moduloNombre: 'Schemas y Modelos Mongoose',
    tituloDesafio: 'Diccionarios Dinámicos con SchemaType Map',
    premisa: 'El androide tiene calibraciones variables de sensores según el planeta donde opera. Las claves son dinámicas ("marte_temp", "luna_gravedad") pero todos los valores deben ser números estrictos.',
    opciones: [
      {
        id: 'm4-c49',
        nombre: 'Mongoose Map Type with Strict Value (type: Map, of: Number)',
        tipo: 'instruction_set',
        descripcion: 'Almacena claves arbitrarias en un BSON Object manteniendo validación de tipo estricta para todos los valores.',
        iconoPixelArt: 'pipeline',
        codigoSnippet: 'sensorSettings: {\n  type: Map,\n  of: Number // Claves dinámicas pero valores estrictamente números\n}'
      },
      {
        id: 'm4-c50',
        nombre: 'Schema.Types.Mixed Total Anarchy',
        tipo: 'core_processor',
        descripcion: 'Usa Mixed perdiendo la validación de que los valores sean números.',
        iconoPixelArt: 'microchip'
      },
      {
        id: 'm4-c51',
        nombre: 'Stringified JSON Blob Field',
        tipo: 'memory_bus',
        descripcion: 'Guarda un string plano serializado que no se puede consultar con operadores de MongoDB.',
        iconoPixelArt: 'ram'
      }
    ],
    solucion: ['m4-c49'],
    pistaError: {
      mensaje: 'El uso de Mixed desactiva las validaciones. SchemaType Map permite nombres de clave dinámicos con valores fuertemente tipados.',
      tipoAnimacion: 'BSON_TYPE_MISMATCH',
      detallesTecnicos: 'Mongoose Maps mapean a objetos BSON nativos y proveen métodos `.get()` y `.set()` con validación automática de Schema.',
      recomendacionDoc: 'Mongoose SchemaTypes: Map.'
    },
    explicacionAcierto: 'SchemaType Map ofrece la flexibilidad de claves dinámicas con la seguridad y validación de tipos estrictos.'
  }
];

