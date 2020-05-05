/// <reference types="express" />

// Add RequestValidation Interface on to Express's Request Interface.
declare namespace Express {
  interface Request extends Context {}
}

interface Context {
  context: any;
}
