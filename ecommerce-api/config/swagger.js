const swaggerJSDoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Ecommerce API',
      version: '1.0.0',
      description: 'API documentation for the Ecommerce platform',
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Development server',
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        Address: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            full_name: { type: 'string' },
            phone_number: { type: 'string' },
            street_address: { type: 'string' },
            city: { type: 'string' },
            district: { type: 'string' },
            ward: { type: 'string' },
            postal_code: { type: 'string' },
            address_type: { type: 'string', enum: ['home', 'office'] },
            created_at: { type: 'string', format: 'date-time' },
            updated_at: { type: 'string', format: 'date-time' },
          }
        },
        User: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            username: { type: 'string' },
            full_name: { type: 'string' },
            email: { type: 'string', format: 'email' },
            phone_number: { type: 'string' },
            gender: { type: 'string', enum: ['male', 'female', 'other'] },
            date_of_birth: { type: 'string', format: 'date' },
            avatar: { type: 'string' },
            is_active: { type: 'boolean' },
            is_valid_email: { type: 'boolean' },
            last_login: { type: 'string', format: 'date-time' },
            role: { type: 'string', enum: ['user', 'admin'] },
            created_at: { type: 'string', format: 'date-time' },
            updated_at: { type: 'string', format: 'date-time' }
          }
        },
        ProductSpecification: {
          type: 'object',
          properties: {
            id: {
              type: 'integer',
              description: 'ID của thông số kỹ thuật'
            },
            spec_name: {
              type: 'string',
              description: 'Tên của thông số kỹ thuật'
            },
            spec_value: {
              type: 'string',
              description: 'Giá trị của thông số kỹ thuật'
            },
            spec_group: {
              type: 'string',
              description: 'Nhóm của thông số kỹ thuật (Laptop, Bàn phím, Màn hình,...)'
            },
            created_at: {
              type: 'string',
              format: 'date-time',
              description: 'Ngày tạo thông số kỹ thuật'
            },
            updated_at: {
              type: 'string',
              format: 'date-time',
              description: 'Ngày cập nhật thông số kỹ thuật'
            }
          }
        },
        Review: {
          type: 'object',
          properties: {
            reviewer_name: { type: 'string' },
            rating: { type: 'number', format: 'float' },
            comment: { type: 'string' },
            date: { type: 'string', format: 'date-time' }
          }
        },
        ProductVariant: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            product_id: { type: 'integer' },
            variant_name: { type: 'string' },
            color: { type: 'string' },
            size: { type: 'string' },
            price: { type: 'number' },
            stock: { type: 'integer' },
            sku: { type: 'string' },
            weight: { type: 'number' },
            dimensions: {
              type: 'object',
              properties: {
                length: { type: 'number' },
                width: { type: 'number' },
                height: { type: 'number' }
              }
            },
            created_at: { type: 'string', format: 'date-time' },
            updated_at: { type: 'string', format: 'date-time' }
          }
        },
        Product: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            name: { type: 'string' },
            description: { type: 'string' },
            category_id: { type: 'integer' },
            discount_percentage: { type: 'number' },
            brand: { type: 'string' },
            thumbnail: { type: 'string' },
            images: {                    
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  image_url: { type: 'string' }
                }
              }
            },
            
            reviews: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  reviewer_name: { type: 'string' },
                  rating: { type: 'number' },
                  comment: { type: 'string' },
                  date: { type: 'string', format: 'date-time' }
                }
              }
            },
            created_at: { type: 'string', format: 'date-time' },
            updated_at: { type: 'string', format: 'date-time' },
            categoryDetail: {
              type: 'object',
              properties: {
                id: { type: 'integer' },
                name: { type: 'string' }
              }
            },
            ProductVariantWithCategory: {
              type: 'object',
              properties: {
                id: { type: 'integer' },
                product_id: { type: 'integer' },
                variant_name: { type: 'string' },
                color: { type: 'string' },
                size: { type: 'string' },
                price: { type: 'number' },
                stock: { type: 'integer' },
                sku: { type: 'string' },
                weight: { type: 'number' },
                dimensions: {
                  type: 'object',
                  properties: {
                    length: { type: 'number' },
                    width: { type: 'number' },
                    height: { type: 'number' }
                  }
                },
                Product: {
                  type: 'object',
                  properties: {
                    category_id: { type: 'integer' }
                  }
                }
              }
            },
            variants: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  id: { type: 'integer' },
                  variant_name: { type: 'string' },
                  color: { type: 'string' },
                  size: { type: 'string' },
                  price: { type: 'number' },
                  stock: { type: 'integer' },
                  sku: { type: 'string' },
                  weight: { type: 'number' },
                  dimensions: {
                    type: 'object',
                    properties: {
                      length: { type: 'number' },
                      width: { type: 'number' },
                      height: { type: 'number' }
                    }
                  }
                }
              }
            }
          }
        }
      }
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ['./routes/*.js'],
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = swaggerSpec;
