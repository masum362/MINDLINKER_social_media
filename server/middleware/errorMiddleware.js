// Error Middleware | Next function

const errorMiddleware = ( err , req, res , nex) => {
    const defaultError = {
        statusCode : 404,
        sucess:"Falied",
        message:err
    };

    if(err?.name ==="ValidationError"){
        defaultError.statusCode = 404;
        defaultError.message =Object.values(err , errors).map((el) => el.message).join(',');
    }


    // duplicate error
    if(err.code && err.code === 11000){
        defaultError.statusCode = 404;
        defaultError.message = `${Object.values(err.keyValue)} field has to be unique!`
    }
    

    res.status(defaultError.statusCode).json({
        sucess:defaultError.sucess,
        message:defaultError.message
    })

}

export default errorMiddleware;