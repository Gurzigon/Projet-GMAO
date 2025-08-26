const errorHandler = (err, req, res, next) => {
    if (res.headersSent) {
        return next(err);
    }
    console.error(err);
    const status = err.status || 500;
    const message = err.message || 'Une erreur est survenue sur le serveur';
    const details = err.details || undefined;
    res.status(status).json({
        message,
        details,
    });
};
export default errorHandler;
