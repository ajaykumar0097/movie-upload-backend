import { prisma } from "../config/db.js";

export const addWatchlist=async(req,res)=>{
    const {movieId,status,rating,notes}=req.body;

    //we can get the userId from the authMiddleware which will attach the user information to the request object after verifying the JWT token, so we can access it like this: req.user.id  to associate the watchlist item with the correct user.
    const userId=req.user.id;

    //Verify movie exists in the database

    const movie=await prisma.movie.findUnique({
        where:{id:movieId}
    })

    if(!movie){
        return res.status(404).json({message:"Movie not found"})
    }

    //Check if the movie is already in the user's watchlist
    const existingInWatchlist=await prisma.watchlistItem.findUnique({
        where:{userId_movieId:{userId,movieId}}
    })

    if(existingInWatchlist){
        return res.status(400).json({message:"Movie already in watchlist"})
    }

    //Add the movie to the user's watchlist
    const watchlistItem=await prisma.watchlistItem.create({
        data:{
            userId,
            movieId,
            status:status || "PLANNED",
            rating,
            notes
        }
    })

    return res.status(201).json({
        status:"success",
        data:{
            watchlistItem
        }
    })
}

export const removeFromWatchList =async(req,res)=>{

    const {id}=req.params

    //Find the watchlist item to delete in database is present or not

    const watchlistItem=await  prisma.watchlistItem.findUnique({
        where:{id:id}
    })

    if(!watchlistItem){
        return res.status(404).json({error:"Watchlist item not found"})
    }

    //Ensure only owner can delete the watchlist item, we can compare the userId from the authMiddleware with the userId of the watchlist item to ensure that only the owner can delete it.

    if(watchlistItem.userId!==req.user.id){
        return res.status(403).json({error:"Forbidden, you can only delete your own watchlist items"})
    }

    //Delete the watchlist item from the database
    await prisma.watchlistItem.delete({
        where:{id:id}
    })

    return res.status(200).json({message:"Watchlist item deleted successfully"})
}

export const updateWatchlistItem=async(req,res)=>{
    const {id}=req.params
    const {status,rating,notes}=req.body
    //Find the watchlist item to update in database is present or not

    const watchlistItem=await  prisma.watchlistItem.findUnique({
        where:{id:id}
    })
    
    if(!watchlistItem){
        return res.status(404).json({error:"Watchlist item not found"})
    }

    //Ensure only owner can update the watchlist item
    if(watchlistItem.userId!==req.user.id){
        return res.status(403).json({error:"Forbidden, you can only update your own watchlist items"})
    }

    //Update the watchlist item in the database
    const updatedWatchlistItem=await prisma.watchlistItem.update({
        where:{id:id},
        data:{
            status,
            rating,
            notes
        }
    })

    return res.status(200).json({
        status:"success",
        data:{
            updatedWatchlistItem
        }
    })
}   