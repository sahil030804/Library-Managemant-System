const validate = (schema) => {
    return async (req, res, next) => {
      try {
        await schema.validateAsync(req.body, { abortEarly: false });
        next();
      } catch (error) {
        const errorMessage = await error.details.map((detail) => detail.message);
        res.status(400).json({ error: errorMessage });
      }
    };
  };
  
  export default { validate };
  