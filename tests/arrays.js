import { gql2jsonSchema } from '../src';

describe('conversion of arrays in graphql schemas', () => {
  test('basic functionality', () => {
    const jsonSchema = gql2jsonSchema(/* GraphQL */ `
      type Document {
        tags: [String]
      }
    `);
    expect(jsonSchema.properties).toEqual({
      tags: { type: 'array', nullable: true, items: { type: 'string', nullable: true } },
    });
  });
  test('finds descriptions', () => {
    const jsonSchema = gql2jsonSchema(/* GraphQL */ `
      "a random document"
      type Document {
        "helps you find it"
        tags: [String]
      }
    `);
    expect(jsonSchema.description).toBe('a random document');
    expect(jsonSchema.properties.tags.description).toBe('helps you find it');
  });
  test('detects nullability', () => {
    expect(
      gql2jsonSchema(/* GraphQL */ `
        type Document {
          tags: [String!]!
        }
      `).properties
    ).toEqual({
      tags: { type: 'array', nullable: false, items: { type: 'string', nullable: false } },
    });
    expect(
      gql2jsonSchema(/* GraphQL */ `
        type Document {
          tags: [String!]
        }
      `).properties
    ).toEqual({
      tags: { type: 'array', nullable: true, items: { type: 'string', nullable: false } },
    });
    expect(
      gql2jsonSchema(/* GraphQL */ `
        type Document {
          tags: [String]!
        }
      `).properties
    ).toEqual({
      tags: { type: 'array', nullable: false, items: { type: 'string', nullable: true } },
    });
  });
});
