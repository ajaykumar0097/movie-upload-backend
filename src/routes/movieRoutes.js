import express from 'express';


const router=express.Router()

router.get("/",(req,res)=>{
    res.json({"message":"Hello i am get"})
})
router.post("/",(req,res)=>{
    res.json({"message":"Hello i am post"})
})

router.put("/",(req,res)=>{
    res.json({"message":"Hello i am put"})
})

router.delete("/",(req,res)=>{
    res.json({"message":"Hello i am delete"})
})

export default router;