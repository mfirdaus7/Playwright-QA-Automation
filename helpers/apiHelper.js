const Ajv = require("ajv");

const ajv = new Ajv();

function validateSchema(schema, data) {
  const validate = ajv.compile(schema);
  const isValid = validate(data);

  if (!isValid) {
    console.log("Schema validation errors:", validate.errors);
  }

  return isValid;
}

module.exports = { validateSchema };
