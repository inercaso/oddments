const path = require('path');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Oddments API',
      version: '1.0.0',
      description:
        'CRUD API for the Oddments curiosity cabinet app.\n\n' +
        'Get a token first: **GET /token** (or POST with a body). ' +
        'Then click **Authorize** and paste it.',
    },
    servers: [{ url: 'http://localhost:3001' }],
    components: {
      securitySchemes: {
        bearerAuth: { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
      },
      schemas: {
        Curiosity: {
          type: 'object',
          properties: {
            id:          { type: 'string', example: 'c1' },
            title:       { type: 'string', example: 'Train ticket from Iași' },
            description: { type: 'string' },
            image:       { type: 'string', description: 'Data URI or URL' },
            mood:        { type: 'string', enum: ['nostalgic','cozy','dreamy','melancholic','chaotic','mysterious','tender'] },
            category:    { type: 'string', enum: ['objects','memories','quotes','music','places','internet','photos'] },
            tags:        { type: 'array', items: { type: 'string' } },
            collection:  { type: 'string', nullable: true },
            favorite:    { type: 'boolean' },
            added:       { type: 'string', format: 'date', example: '2025-08-14' },
          },
        },
        CuriosityInput: {
          type: 'object',
          required: ['title'],
          properties: {
            title:       { type: 'string' },
            description: { type: 'string', default: '' },
            image:       { type: 'string', default: '' },
            mood:        { type: 'string', default: 'cozy' },
            category:    { type: 'string', default: 'objects' },
            tags:        { type: 'array', items: { type: 'string' }, default: [] },
            collection:  { type: 'string', nullable: true },
            favorite:    { type: 'boolean', default: false },
          },
        },
        Collection: {
          type: 'object',
          properties: {
            id:    { type: 'string', example: 'col1' },
            name:  { type: 'string', example: 'Things from elsewhere' },
            color: { type: 'string', example: '#3C3F4A' },
            emoji: { type: 'string', example: '✦' },
            note:  { type: 'string' },
            pinned: { type: 'boolean' },
            count:  { type: 'integer', description: 'Number of curiosities in this collection' },
          },
        },
        CollectionInput: {
          type: 'object',
          required: ['name'],
          properties: {
            name:   { type: 'string' },
            color:  { type: 'string', default: '#a8842c' },
            emoji:  { type: 'string', default: '✦' },
            note:   { type: 'string', default: '' },
            pinned: { type: 'boolean', default: false },
          },
        },
        TokenResponse: {
          type: 'object',
          properties: {
            token:       { type: 'string' },
            role:        { type: 'string' },
            permissions: { type: 'array', items: { type: 'string' } },
            expiresIn:   { type: 'integer', example: 60 },
          },
        },
        PaginatedCuriosities: {
          type: 'object',
          properties: {
            data:  { type: 'array', items: { '$ref': '#/components/schemas/Curiosity' } },
            total: { type: 'integer' },
            skip:  { type: 'integer' },
            limit: { type: 'integer' },
          },
        },
        PaginatedCollections: {
          type: 'object',
          properties: {
            data:  { type: 'array', items: { '$ref': '#/components/schemas/Collection' } },
            total: { type: 'integer' },
            skip:  { type: 'integer' },
            limit: { type: 'integer' },
          },
        },
        Error: {
          type: 'object',
          properties: { error: { type: 'string' } },
        },
      },
    },
    security: [{ bearerAuth: [] }],
  },
  apis: [path.join(__dirname, 'routes', '*.js')],
};

function setupSwagger(app) {
  const spec = swaggerJsdoc(options);
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(spec, { explorer: true }));
  app.get('/api-docs.json', (_req, res) => res.json(spec));
}

module.exports = { setupSwagger };
