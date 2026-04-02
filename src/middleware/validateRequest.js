export const validateRequest=(schema)=>{

    //above function is created for taking schema as an argument and returning a middleware function that will validate the request body against the provided schema, if the validation fails it will return a 400 status code with the error message, if the validation is successful it will call the next middleware function in the stack.  
    return (req,res,next)=>{

        const result=schema.safeParse(req.body)// It checks actual request body with the schema and returns an object with success property which is true if validation is successful and false if validation fails, it also contains error property which has the details of the validation errors if validation fails.

        if(!result.success){
            const flatErrors = result.error.issues.map(issue => issue.message)
            return res.status(400).json({success:false, errors:flatErrors})
        }

        next()
    }

}