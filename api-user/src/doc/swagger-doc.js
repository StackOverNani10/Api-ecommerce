
//Documentacion E-commerce Api User

//Schemas
/**
 * @swagger
 * components:
 *  schemas:
 *    User: 
 *      type: object
 *      properties:
 *        nombre:
 *          type: string
 *          description: the user name  
 *        apellido:
 *          type: string
 *          description: the user surname
 *        correo:
 *          type: string
 *          format: email
 *          description: the user email
 *        clave:
 *          type: string
 *          description: the user password
 *        confirmaClave:
 *          type: string
 *          description: the user password confirmation
 *      required:
 *        - nombre
 *        - apellido
 *        - correo
 *        - clave
 *        - confirmaClave
 *      example:
 *        nombre: Fran
 *        apellido: Perez Hernan
 *        correo: FranPerez@email.com
 *        clave: Fran123
 *        confirmaClave: Fran123
 */

/**
 * @swagger
 * components:
 *  schemas:
 *    Update User: 
 *      type: object
 *      properties:
 *        nombre:
 *          type: string
 *          description: the user new name  
 *        apellido:
 *          type: string
 *          description: the user new surname
 *        correo:
 *          type: string
 *          format: email
 *          description: the user new email
 *      example:
 *        nombre: Fran Ana 
 *        apellido: Pérez Hernan
 *        correo: FranAPerez@email.com
 */

/**
 * @swagger
 * components:
 *  schemas:
 *    LogIn: 
 *      type: object
 *      properties:
 *        correo:
 *          type: string
 *          format: email
 *          description: the user email
 *        clave:
 *          type: string
 *          description: the user password
 *      required:
 *        - correo
 *        - clave
 *      example:
 *        correo: FranAPerez@email.com
 *        clave: Fran123
 */

/**
 * @swagger
 * components:
 *  schemas:
 *    Change Password: 
 *      type: object
 *      properties:
 *        oldPassword:
 *          type: string
 *          description: the user old password
 *        newPassword:
 *          type: string
 *          description: the user new password
 *      required:
 *        - oldPassword
 *        - newPassword
 *      example:
 *        oldPassword: Fran123
 *        newPassword: FranPerez123
 */

/**
 * @swagger
 * components:
 *  securitySchemes:
 *    Verify Token: 
 *      type: http
 *      scheme: bearer
 *      bearerFormat: JWT
 *      required:
 *        - strToken
 *      example:
 *        strToken: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MzQ0MzM5Y2NmYWMyZTBmOGY2ODIxNTEiLCJjb3JyZW8iOiJGcmFuUGVyZXpAZW1haWwuY29tIiwiaWF0IjoxNjY1NDU2MDk5LCJleHAiOjE2NjU0NTk2OTl9.MsfVh89dLgx8UqgX-bNfitIyGej21eX4c0sTv3G7Vf0
 */

//Post create a new user
/**
 * @swagger
 * /api/usuario:
 *  post:
 *    summary: create a new user
 *    tags: [User]
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            $ref: '#/components/schemas/User'
 *    responses:
 *      200:
 *        description: new user created!
 */

//Get return all users
/**
 * @swagger
 * /api/usuario:
 *  get:
 *    summary: return all users
 *    tags: [User]
 *    responses:
 *      200:
 *        description: all users
 *        content:
 *          application/json:
 *            schema:
 *              type: array
 *              items:
 *                $ref: '#/components/schemas/User'
 */

//Put update name, surname and/or email of one user
/**
 * @swagger
 * /api/usuario/{id}:
 *  put:
 *    summary: update name, surname and/or email of one user 
 *    tags: [Update User]
 *    parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: string
 *        required: true
 *        description: the user id
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            $ref: '#/components/schemas/Update User'
 *    responses:
 *      200:
 *        description: successful user update!
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              $ref: '#/components/schemas/Update User' 
 *      404:
 *        description: user not found
 */

//Delete a user
/**
 * @swagger
 * /api/usuario/deleteAccount/{id}:
 *  delete:
 *    summary: delete a user 
 *    tags: [User]
 *    parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: string
 *        required: true
 *        description: the user id
 *    responses:
 *      200:
 *        description: user deleted
 *      404:
 *        description: user not found
 */

//Post LogIn
/**
 * @swagger
 * /api/usuario/login:
 *  post:
 *    summary: LogIn
 *    tags: [LogIn]
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            $ref: '#/components/schemas/LogIn'
 *    responses:
 *      200:
 *        description: successful LogIn!
 */

//Put Change Passsword
/**
 * @swagger
 * /api/usuario/changePassword/{id}:
 *  put:
 *    summary: Change Passsword 
 *    tags: [Change Password]
 *    parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: string
 *        required: true
 *        description: the user id
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            $ref: '#/components/schemas/Change Password'
 *    responses:
 *      200:
 *        description: successful password update! 
 *      404:
 *        description: user not found
 */

//Get user by token
/**
 * @swagger
 * /api/usuario/verify:
 *  get:
 *    summary: return the user by token
 *    tags: [Verify Token]
 *    parameters:
 *      - in: header
 *        name: Token
 *        schema:
 *          type: string
 *        required: true
 *        description: the user token
 *    responses:
 *      200:
 *        description: user authenticate
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              $ref: '#/components/securitySchemes/Verify Token'
 *      404:
 *        description: user not found
 */