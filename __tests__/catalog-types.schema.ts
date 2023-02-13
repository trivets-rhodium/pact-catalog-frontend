import { validateSchemaJson } from '../lib/catalog-types.schema';

const schema = `
{
  "$id": "https://catalog.carbon-transparency.com/data-model-extension/@wwf/water-footprint/0.6.1/schema.json",
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "title": "WWF Water Tootprint Data Model Extension",
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

test('schema.json validation test', () => {
  window.alert = jest.fn();
  expect(validateSchemaJson(schema)).toBe(true);
});
