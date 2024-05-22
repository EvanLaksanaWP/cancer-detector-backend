class PredictionError extends Error {
    constructor(message, statusCode = 400) {
        super(message);
        this.statusCode = statusCode;
        this.name = 'PredictionError';
    }
}

module.exports = PredictionError;