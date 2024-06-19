const asyncHandler = func => async (req, res, next) => {
    return Promise.resolve(func(req, res, next)).catch( error => next(error));
}


export  {asyncHandler};