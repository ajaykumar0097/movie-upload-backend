import z from "zod";


const adddToWatchlistSchema=z.object({
    movieId:z.string().uuid(),
    status:z.enum(["PLANNED","WATCHING","COMPLETED",  "DROPPED"],{error:()=>({
        message:"Status must be one of PLANNED, WATCHING, COMPLETED, DROPPED "
    })}).optional(),
    rating:z.coerce.number().int("Rating must be an integer").min(1,"Rating must be at least 1").max(10,"Rating must be at most 10").optional(),
    notes:z.string().max(500,"Notes must be at most 500 characters").optional() 
})

export {adddToWatchlistSchema}