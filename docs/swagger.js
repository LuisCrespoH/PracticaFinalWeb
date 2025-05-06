const swaggerJsdoc = require("swagger-jsdoc");

const options = {
    definition: {
        openapi: "3.0.3",
        info: {
            title: "API de Gestión de Usuarios",
            version: "1.0.0",
            description: "API para gestionar usuarios, validación de códigos, actualización de datos y más.",
            license: {
                name: "MIT",
                url: "https://spdx.org/licenses/MIT.html",
            },
            contact: {
                name: "TuNombre",
                url: "https://tusitio.com",
                email: "tucorreo@tusitio.com",
            },
        },
        servers: [
            {
                url: "http://localhost:3000",
            },
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: "http",
                    scheme: "bearer"
                },
            },
            schemas: {
                user: {
                    type: "object",
                    required: ["email", "name", "role", "status"],
                    properties: {
                        email: { type: "string" },
                        name: { type: "string" },
                        surnames: { type: "string" },
                        nif: { type: "string" },
                        role: { type: "string" },
                        status: { type: "string" },
                    },
                },
                cliente: {
                    type: "object",
                    required: ["name", "cif", "address", "usuario"],
                    properties: {
                        name: { type: "string" },
                        cif: { type: "string" },
                        address: {
                            type: "object",
                            properties: {
                                street: { type: "string" },
                                number: { type: "integer" },
                                postal: { type: "integer" },
                                city: { type: "string" },
                                province: { type: "string" },
                            },
                        },
                        usuario: { type: "string", description: "ID del usuario asociado al cliente" },
                        company: {
                            type: "object",
                            properties: {
                                name: { type: "string" },
                                cif: { type: "string" },
                                street: { type: "string" },
                                number: { type: "integer" },
                                postal: { type: "integer" },
                                city: { type: "string" },
                                province: { type: "string" },
                                url: { type: "string" },
                                logo: { type: "string" },
                            },
                        },
                    },
                },
                project: {
                    type: "object",
                    required: ["name", "projectCode", "email", "address", "code", "userId", "clientId"],
                    properties: {
                        name: { type: "string" },
                        projectCode: { type: "string" },
                        email: { type: "string" },
                        address: {
                            type: "object",
                            properties: {
                                street: { type: "string" },
                                number: { type: "integer" },
                                postal: { type: "integer" },
                                city: { type: "string" },
                                province: { type: "string" },
                            },
                        },
                        code: { type: "string" },
                        userId: { type: "string", description: "ID del usuario asociado al proyecto" },
                        clientId: { type: "string", description: "ID del cliente asociado al proyecto" },
                    },
                },
                DeliveryNote: {
                    type: "object",
                    required: ["userId", "clientId", "projectId", "format", "workdate"],
                    properties: {
                      userId: {
                        type: "string",
                        description: "ID del usuario que crea el albarán",
                        example: "607f1f77bcf86cd799439011",
                      },
                      clientId: {
                        type: "string",
                        description: "ID del cliente asociado al albarán",
                        example: "607f1f77bcf86cd799439012",
                      },
                      projectId: {
                        type: "string",
                        description: "ID del proyecto asociado al albarán",
                        example: "607f1f77bcf86cd799439013",
                      },
                      format: {
                        type: "string",
                        description: "El formato del albarán, 'material' o 'hours'",
                        enum: ["material", "hours"],
                        example: "hours",
                      },
                      material: {
                        type: "string",
                        description: "Descripción del material (solo si el formato es 'material')",
                        example: "Material A",
                      },
                      hours: {
                        type: "number",
                        description: "Número de horas (solo si el formato es 'hours')",
                        example: 8,
                      },
                      description: {
                        type: "string",
                        description: "Descripción del albarán",
                        example: "Trabajo realizado en el proyecto",
                      },
                      workdate: {
                        type: "string",
                        format: "date",
                        description: "Fecha de trabajo del albarán",
                        example: "2025-05-06",
                      },
                      sign: {
                        type: "string",
                        description: "Firma del cliente (opcional)",
                        example: "/path/to/sign",
                      },
                      pdf: {
                        type: "string",
                        description: "Ruta del archivo PDF generado",
                        example: "/path/to/pdf",
                      },
                      pending: {
                        type: "boolean",
                        description: "Estado del albarán (pendiente o no)",
                        example: true,
                      },
                    },
                },            
            },
        },
        paths: {
            "/api/auth/register": {
                post: {
                    summary: "Registra un nuevo usuario",
                    tags: ["users"],
                    requestBody: {
                        required: true,
                        content: {
                            "application/json": {
                                schema: {
                                    $ref: "#/components/schemas/user",
                                },
                            },
                        },
                    },
                    responses: {
                        200: {
                            description: "Usuario registrado con éxito",
                            content: {
                                "application/json": {
                                    schema: {
                                        type: "object",
                                        properties: {
                                            token: { type: "string" },
                                            user: { $ref: "#/components/schemas/user" },
                                        },
                                    },
                                },
                            },
                        },
                        409: {
                            description: "Correo electrónico ya registrado",
                        },
                        default: {
                            description: "Error al registrar usuario",
                        },
                    },
                },
            },
            "/api/auth/login": {
                post: {
                    summary: "Inicia sesión de usuario",
                    tags: ["users"],
                    requestBody: {
                        required: true,
                        content: {
                            "application/json": {
                                schema: {
                                    type: "object",
                                    properties: {
                                        email: { type: "string" },
                                        password: { type: "string" },
                                    },
                                },
                            },
                        },
                    },
                    responses: {
                        200: {
                            description: "Inicio de sesión exitoso",
                            content: {
                                "application/json": {
                                    schema: {
                                        type: "object",
                                        properties: {
                                            token: { type: "string" },
                                            user: { $ref: "#/components/schemas/user" },
                                        },
                                    },
                                },
                            },
                        },
                        401: {
                            description: "Contraseña incorrecta o usuario no encontrado",
                        },
                        default: {
                            description: "Error al iniciar sesión",
                        },
                    },
                },
            },
            "/api/auth/validation": {
                post: {
                    summary: "Verifica el código de validación",
                    tags: ["users"],
                    requestBody: {
                        required: true,
                        content: {
                            "application/json": {
                                schema: {
                                    type: "object",
                                    properties: {
                                        code: { type: "string", minlength: 6, maxlength: 6 },
                                    },
                                },
                            },
                        },
                    },
                    responses: {
                        200: {
                            description: "Código validado correctamente",
                        },
                        400: {
                            description: "Código inválido",
                        },
                        403: {
                            description: "Máximo de intentos alcanzados",
                        },
                        default: {
                            description: "Error al validar código",
                        },
                    },
                },
            },
            "/api/auth/update": {
                put: {
                    summary: "Actualiza los datos personales del usuario",
                    tags: ["users"],
                    requestBody: {
                        required: true,
                        content: {
                            "application/json": {
                                schema: {
                                    type: "object",
                                    properties: {
                                        name: { type: "string" },
                                        surnames: { type: "string" },
                                        nif: { type: "string" },
                                    },
                                },
                            },
                        },
                    },
                    responses: {
                        200: {
                            description: "Datos actualizados con éxito",
                        },
                        404: {
                            description: "Usuario no encontrado",
                        },
                        default: {
                            description: "Error al actualizar datos",
                        },
                    },
                },
            },
            "/api/auth/company": {
                patch: {
                    summary: "Actualiza la información de la empresa del usuario",
                    tags: ["users"],
                    requestBody: {
                        required: true,
                        content: {
                            "application/json": {
                                schema: {
                                    type: "object",
                                    properties: {
                                        company: { 
                                            type: "object",
                                            properties: {
                                                name: { type: "string" },
                                                cif: { type: "string" },
                                                street: { type: "string" },
                                                number: { type: "integer" },
                                                postal: { type: "integer" },
                                                city: { type: "string" },
                                                province: { type: "string" },
                                                url: { type: "string" },
                                                logo: { type: "string" },
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    },
                    responses: {
                        200: {
                            description: "Información de la empresa actualizada con éxito",
                        },
                        404: {
                            description: "Usuario no encontrado",
                        },
                        default: {
                            description: "Error al actualizar información de la empresa",
                        },
                    },
                },
            },
            "/api/auth/profile": {
                get: {
                    summary: "Obtiene el perfil del usuario autenticado",
                    tags: ["users"],
                    responses: {
                        200: {
                            description: "Perfil del usuario obtenido con éxito",
                            content: {
                                "application/json": {
                                    schema: {
                                        $ref: "#/components/schemas/user",
                                    },
                                },
                            },
                        },
                        404: {
                            description: "Usuario no encontrado",
                        },
                        default: {
                            description: "Error al obtener el perfil del usuario",
                        },
                    },
                },
            },
            "/api/auth/delete": {
                delete: {
                    summary: "Elimina el usuario (soft o hard delete)",
                    tags: ["users"],
                    responses: {
                        200: {
                            description: "Usuario eliminado con éxito",
                        },
                        404: {
                            description: "Usuario no encontrado",
                        },
                        default: {
                            description: "Error al eliminar usuario",
                        },
                    },
                },
            },
            "/api/auth/upload-image": {
                post: {
                    summary: "Sube la imagen del logo de la empresa",
                    tags: ["users"],
                    requestBody: {
                        required: true,
                        content: {
                            "multipart/form-data": {
                                schema: {
                                    type: "object",
                                    properties: {
                                        file: { type: "string", format: "binary" }
                                    }
                                }
                            }
                        }
                    },
                    responses: {
                        200: {
                            description: "Imagen subida con éxito",
                            content: {
                                "application/json": {
                                    schema: {
                                        type: "object",
                                        properties: {
                                            company: { $ref: "#/components/schemas/user" },
                                        }
                                    }
                                }
                            }
                        },
                        400: {
                            description: "No se ha subido ningún archivo",
                        },
                        500: {
                            description: "Error al subir la imagen",
                        },
                    },
                },
            },
            "/api/clients": {
                get: {
                    summary: "Obtiene todos los clientes del usuario",
                    tags: ["clientes"],
                    responses: {
                        200: {
                            description: "Clientes obtenidos con éxito",
                            content: {
                                "application/json": {
                                    schema: {
                                        type: "array",
                                        items: {
                                            $ref: "#/components/schemas/cliente",
                                        },
                                    },
                                },
                            },
                        },
                        404: {
                            description: "No se encontraron clientes",
                        },
                        default: {
                            description: "Error al obtener los clientes",
                        },
                    },
                },
                post: {
                    summary: "Crea un nuevo cliente",
                    tags: ["clientes"],
                    requestBody: {
                        required: true,
                        content: {
                            "application/json": {
                                schema: {
                                    $ref: "#/components/schemas/cliente",
                                },
                            },
                        },
                    },
                    responses: {
                        201: {
                            description: "Cliente creado con éxito",
                            content: {
                                "application/json": {
                                    schema: {
                                        $ref: "#/components/schemas/cliente",
                                    },
                                },
                            },
                        },
                        400: {
                            description: "Cliente ya existe",
                        },
                        default: {
                            description: "Error al crear el cliente",
                        },
                    },
                },
            },
            "/api/clients/{id}": {
                get: {
                    summary: "Obtiene un cliente por ID",
                    tags: ["clientes"],
                    parameters: [
                        {
                            name: "id",
                            in: "path",
                            required: true,
                            schema: {
                                type: "string",
                            },
                        },
                    ],
                    responses: {
                        200: {
                            description: "Cliente encontrado",
                            content: {
                                "application/json": {
                                    schema: {
                                        $ref: "#/components/schemas/cliente",
                                    },
                                },
                            },
                        },
                        404: {
                            description: "Cliente no encontrado",
                        },
                        default: {
                            description: "Error al obtener el cliente",
                        },
                    },
                },
                put: {
                    summary: "Actualiza un cliente por ID",
                    tags: ["clientes"],
                    parameters: [
                        {
                            name: "id",
                            in: "path",
                            required: true,
                            schema: {
                                type: "string",
                            },
                        },
                    ],
                    requestBody: {
                        required: true,
                        content: {
                            "application/json": {
                                schema: {
                                    $ref: "#/components/schemas/cliente",
                                },
                            },
                        },
                    },
                    responses: {
                        200: {
                            description: "Cliente actualizado con éxito",
                            content: {
                                "application/json": {
                                    schema: {
                                        $ref: "#/components/schemas/cliente",
                                    },
                                },
                            },
                        },
                        404: {
                            description: "Cliente no encontrado",
                        },
                        default: {
                            description: "Error al actualizar el cliente",
                        },
                    },
                },
                delete: {
                    summary: "Elimina un cliente por ID ",
                    tags: ["clientes"],
                    parameters: [
                        {
                            name: "id",
                            in: "path",
                            required: true,
                            schema: {
                                type: "string",
                            },
                        },
                    ],
                    responses: {
                        200: {
                            description: "Cliente archivado (soft delete) con éxito",
                        },
                        404: {
                            description: "Cliente no encontrado",
                        },
                        default: {
                            description: "Error al eliminar el cliente",
                        },
                    },
                },
            },
            "/api/clients/soft/{id}": {
                delete: {
                    summary: "Realiza un soft delete de un cliente por ID",
                    tags: ["clientes"],
                    parameters: [
                        {
                            name: "id",
                            in: "path",
                            required: true,
                            schema: {
                                type: "string",
                            },
                        },
                    ],
                    responses: {
                        200: {
                            description: "Cliente eliminado permanentemente",
                        },
                        404: {
                            description: "Cliente no encontrado",
                        },
                        default: {
                            description: "Error al eliminar permanentemente el cliente",
                        },
                    },
                },
            },
            "/api/clients/restore/{id}": {
                patch: {
                    summary: "Restaura un cliente archivado (soft delete)",
                    tags: ["clientes"],
                    parameters: [
                        {
                            name: "id",
                            in: "path",
                            required: true,
                            schema: {
                                type: "string",
                            },
                        },
                    ],
                    responses: {
                        200: {
                            description: "Cliente restaurado con éxito",
                        },
                        404: {
                            description: "Cliente no encontrado",
                        },
                        default: {
                            description: "Error al restaurar el cliente",
                        },
                    },
                },
            },
            "/api/clients/archived": {
                get: {
                    summary: "Obtiene los clientes archivados del usuario",
                    tags: ["clientes"],
                    responses: {
                        200: {
                            description: "Clientes archivados obtenidos con éxito",
                            content: {
                                "application/json": {
                                    schema: {
                                        type: "array",
                                        items: {
                                            $ref: "#/components/schemas/cliente",
                                        },
                                    },
                                },
                            },
                        },
                        404: {
                            description: "No se encontraron clientes archivados",
                        },
                        default: {
                            description: "Error al obtener los clientes archivados",
                        },
                    },
                },
            },
            "/api/projects": {
                post: {
                    summary: "Crea un nuevo proyecto",
                    tags: ["proyectos"],
                    requestBody: {
                        required: true,
                        content: {
                            "application/json": {
                                schema: {
                                    $ref: "#/components/schemas/project",
                                },
                            },
                        },
                    },
                    responses: {
                        201: {
                            description: "Proyecto creado con éxito",
                            content: {
                                "application/json": {
                                    schema: {
                                        $ref: "#/components/schemas/project",
                                    },
                                },
                            },
                        },
                        400: {
                            description: "Ya existe un proyecto con el mismo código para este usuario y cliente",
                        },
                        404: {
                            description: "Cliente no encontrado",
                        },
                        default: {
                            description: "Error al crear el proyecto",
                        },
                    },
                },
            },
            "/api/projects/{id}": {
                put: {
                    summary: "Actualiza la información de un proyecto por ID",
                    tags: ["proyectos"],
                    parameters: [
                        {
                            name: "id",
                            in: "path",
                            required: true,
                            schema: {
                                type: "string",
                            },
                        },
                    ],
                    requestBody: {
                        required: true,
                        content: {
                            "application/json": {
                                schema: {
                                    $ref: "#/components/schemas/project",
                                },
                            },
                        },
                    },
                    responses: {
                        200: {
                            description: "Proyecto actualizado con éxito",
                            content: {
                                "application/json": {
                                    schema: {
                                        $ref: "#/components/schemas/project",
                                    },
                                },
                            },
                        },
                        404: {
                            description: "Proyecto no encontrado o no autorizado",
                        },
                        default: {
                            description: "Error al actualizar el proyecto",
                        },
                    },
                },
            },
            "/api/projects": {
                get: {
                    summary: "Obtiene todos los proyectos del usuario",
                    tags: ["proyectos"],
                    responses: {
                        200: {
                            description: "Proyectos obtenidos con éxito",
                            content: {
                                "application/json": {
                                    schema: {
                                        type: "array",
                                        items: {
                                            $ref: "#/components/schemas/project",
                                        },
                                    },
                                },
                            },
                        },
                        default: {
                            description: "Error al obtener los proyectos",
                        },
                    },
                },
            },
            "/api/projects/{id}": {
                get: {
                    summary: "Obtiene un proyecto por ID",
                    tags: ["proyectos"],
                    parameters: [
                        {
                            name: "id",
                            in: "path",
                            required: true,
                            schema: {
                                type: "string",
                            },
                        },
                    ],
                    responses: {
                        200: {
                            description: "Proyecto encontrado",
                            content: {
                                "application/json": {
                                    schema: {
                                        $ref: "#/components/schemas/project",
                                    },
                                },
                            },
                        },
                        404: {
                            description: "Proyecto no encontrado o no autorizado",
                        },
                        default: {
                            description: "Error al obtener el proyecto",
                        },
                    },
                },
            },
            "/api/projects/soft/{id}": {
                delete: {
                    summary: "Realiza un soft delete de un proyecto por ID",
                    tags: ["proyectos"],
                    parameters: [
                        {
                            name: "id",
                            in: "path",
                            required: true,
                            schema: {
                                type: "string",
                            },
                        },
                    ],
                    responses: {
                        200: {
                            description: "Proyecto archivado con éxito",
                        },
                        404: {
                            description: "Proyecto no encontrado",
                        },
                        default: {
                            description: "Error al archivar el proyecto",
                        },
                    },
                },
            },
            "/api/projects/{id}": {
                delete: {
                    summary: "Elimina un proyecto permanentemente",
                    tags: ["proyectos"],
                    parameters: [
                        {
                            name: "id",
                            in: "path",
                            required: true,
                            schema: {
                                type: "string",
                            },
                        },
                    ],
                    responses: {
                        200: {
                            description: "Proyecto eliminado con éxito",
                        },
                        404: {
                            description: "Proyecto no encontrado",
                        },
                        default: {
                            description: "Error al eliminar el proyecto",
                        },
                    },
                },
            },
            "/api/projects/archived": {
                get: {
                    summary: "Obtiene los proyectos archivados (soft delete)",
                    tags: ["proyectos"],
                    responses: {
                        200: {
                            description: "Proyectos archivados obtenidos con éxito",
                            content: {
                                "application/json": {
                                    schema: {
                                        type: "array",
                                        items: {
                                            $ref: "#/components/schemas/project",
                                        },
                                    },
                                },
                            },
                        },
                        default: {
                            description: "Error al obtener los proyectos archivados",
                        },
                    },
                },
            },
            "/api/projects/restore/{id}": {
                patch: {
                    summary: "Restaura un proyecto archivado",
                    tags: ["proyectos"],
                    parameters: [
                        {
                            name: "id",
                            in: "path",
                            required: true,
                            schema: {
                                type: "string",
                            },
                        },
                    ],
                    responses: {
                        200: {
                            description: "Proyecto restaurado con éxito",
                        },
                        404: {
                            description: "Proyecto no encontrado",
                        },
                        default: {
                            description: "Error al restaurar el proyecto",
                        },
                    },
                },
            },
            "/deliverynotes": {
                post: {
                    summary: "Crear un nuevo albarán",
                    tags: ["DeliveryNote"],
                    security: [{ bearerAuth: [] }],
                    requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                        schema: {
                            $ref: "#/components/schemas/DeliveryNote",
                        },
                        },
                    },
                    },
                    responses: {
                    201: {
                        description: "Albarán creado con éxito",
                        content: {
                        "application/json": {
                            schema: {
                            $ref: "#/components/schemas/DeliveryNote",
                            },
                        },
                        },
                    },
                    400: {
                        description: "Solicitud incorrecta",
                    },
                    404: {
                        description: "Cliente no encontrado",
                    },
                    403: {
                        description: "No tienes permiso para crear un albarán para este cliente",
                    },
                    500: {
                        description: "Error al crear el albarán",
                    },
                    },
                },
                },
            "/deliverynotes": {
                get: {
                    summary: "Listar todos los albaranes del usuario autenticado",
                    tags: ["DeliveryNote"],
                    security: [{ bearerAuth: [] }],
                    responses: {
                        200: {
                            description: "Lista de albaranes",
                            content: {
                            "application/json": {
                                type: "array",
                                items: {
                                $ref: "#/components/schemas/DeliveryNote",
                                },
                            },
                            },
                        },
                        500: {
                            description: "Error al obtener los albaranes",
                        },
                    },
                },
            },
            "/deliverynotes/{id}": {
                get: {
                    summary: "Mostrar un albarán por su ID",
                    tags: ["DeliveryNote"],
                    security: [{ bearerAuth: [] }],
                    parameters: [
                    {
                        name: "id",
                        in: "path",
                        required: true,
                        description: "ID del albarán",
                        schema: {
                        type: "string",
                        },
                    },
                    ],
                    responses: {
                    200: {
                        description: "Albarán encontrado",
                        content: {
                        "application/json": {
                            $ref: "#/components/schemas/DeliveryNote",
                        },
                        },
                    },
                    404: {
                        description: "Albarán no encontrado",
                    },
                    500: {
                        description: "Error al mostrar el albarán",
                    },
                    },
                },
            },
            "/deliverynotes/pdf/{id}": {
                get: {
                    summary: "Generar un PDF del albarán",
                    tags: ["DeliveryNote"],
                    security: [{ bearerAuth: [] }],
                    parameters: [
                    {
                        name: "id",
                        in: "path",
                        required: true,
                        description: "ID del albarán",
                        schema: {
                        type: "string",
                        },
                    },
                    ],
                    responses: {
                        200: {
                            description: "PDF generado con éxito",
                            content: {
                            "application/pdf": {},
                            },
                        },
                        404: {
                            description: "Albarán no encontrado",
                        },
                        403: {
                            description: "No tienes permiso para ver este albarán",
                        },
                        500: {
                            description: "Error al generar el PDF",
                        },
                    },
                    
                },
            },
        },
    },
    apis: ["./routes/*.js"], // Ruta donde se encuentran tus rutas
};

module.exports = swaggerJsdoc(options);
