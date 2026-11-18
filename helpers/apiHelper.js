const Ajv = require("ajv");

const ajv = new Ajv();

function validateSchema(schema, data) {
  const validate = ajv.compile(schema);
  return validate(data);
}

function getValidationErrors(schema, data) {
  const validate = ajv.compile(schema);
  validate(data);

  return validate.errors || [];
}

module.exports = {
  validateSchema,
  getValidationErrors,
};
