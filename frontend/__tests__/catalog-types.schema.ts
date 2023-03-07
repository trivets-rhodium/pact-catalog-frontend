import { validateSchemaJson } from '../lib/catalog-types.schema';

const validSchemaJson = `
{
  "$id": "https://catalog.carbon-transparency.com/data-model-extension/@wwf/water-footprint/0.6.1/schema.json",
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "title": "WWF Water Footprint Extension",
  "type": "object",
  "properties": {
    "propertyOne": {
      "type": "string",
      "description": "The description of the first property."
    },
    "propertyTwo": {
      "type": "string",
      "description": "The description of the second property."
    },
    "propertyThree": {
      "description": "The description of the third property.",
      "type": "integer",
      "minimum": 0
    }
  }
}
`;

test('Test valid schema.json', () => {
  window.alert = jest.fn();
  expect(validateSchemaJson(validSchemaJson).validSchemaJson).toBe(true);
});

const invalidSchemaJson = `
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "title": "WWF Water Footprint Extension",
  "type": "object",
  "foo": "bar"
}
`;

test('Test invalid schema.json', () => {
  window.alert = jest.fn();
  expect(validateSchemaJson(validSchemaJson).validSchemaJson).toBe(false);
});
