const handleErrors = (err, req, res, next) => {
    console.error(err.stack);

    if (process.env.NODE_ENV === 'production') {
        return res.status(500).json({ error: 'Something went wrong!' });
    }

    res.status(500).json({
        error: err.message,
        stack: err.stack
    });
};

module.exports = handleErrors;
