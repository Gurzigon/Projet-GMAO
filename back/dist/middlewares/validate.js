export const validate = (schema, property = 'body') => {
    return (req, _res, next) => {
        const { error, value } = schema.validate(req[property], { abortEarly: false });
        if (error) {
            return next(error);
        }
        // Assigne les valeurs validées (utile si le schéma transforme les données)
        req[property] = value;
        next();
    };
};
