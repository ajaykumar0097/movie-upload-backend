import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js';
import { addWatchlist, removeFromWatchList, updateWatchlistItem } from '../controllers/watchlistController.js';
import { validateRequest } from '../middleware/validateRequest.js';
import { adddToWatchlistSchema } from '../validators/watchlistValidator.js';

const router=express.Router()

//Add a authmiddleware to protect the route and ensure only authenticated users can access it, it will verify the JWT token and extract the user information to associate the watchlist item with the correct user.After implementing the authMiddleware, you can use it in the route like this:
// router.post("/",authMiddleware,addWatchlist) It will run the authMiddleware before executing the addWatchlist controller, ensuring that only authenticated users can add items to their watchlist.

router.use(authMiddleware)  //we need pass something to this authMiddle to continue to the next otherwise it will not execute the addWatchlist controller, we can pass a dummy function to it like this: router.use(authMiddleware, (req, res, next) => { next() }) This way the authMiddleware will execute and then call the next function to continue to the addWatchlist controller.

router.post("/",validateRequest(adddToWatchlistSchema),addWatchlist)

// router.post("/login",login)
// router.post("/logout",logout)

//delete a watchlist item, we can get the userId from the authMiddleware and the movieId from the request body to identify which watchlist item to delete, we can use the prisma client to delete the watchlist item from the database.

router.delete("/:id",removeFromWatchList)  //it is recommended that provide id of the watchlist item to delete in the url parameter instead of the request body, it is a common practice to use url parameters for identifying resources to perform actions like delete or update, so we can access the id in the controller using req.params.id

router.put("/:id",updateWatchlistItem)  //we can also use put method to delete the watchlist item, it is a common practice to use put method for update and delete operations, but it is not a strict rule, you can choose either delete or put method based on your preference and the conventions you follow in your API design.

export default router;