import {Router} from 'express';
import bcrypt from 'bcryptjs';
import {z} from 'zod';
import {prisma,signToken,cookieOptions} from '../lib.js';
import {authenticate} from '../middleware.js';
const router=Router();
const credentials=z.object({email:z.string().email().transform(v=>v.toLowerCase()),password:z.string().min(8)});
router.post('/register',async(req,res,next)=>{try{
  const data=credentials.extend({name:z.string().min(2).max(60)}).parse(req.body);
  if(await prisma.user.findUnique({where:{email:data.email}})) return res.status(409).json({message:'Email already registered'});
  const user=await prisma.user.create({data:{...data,password:await bcrypt.hash(data.password,12)}});
  res.status(201).cookie('token',signToken(user),cookieOptions).json({user:{id:user.id,name:user.name,email:user.email,role:user.role}});
}catch(e){e.status=e.name==='ZodError'?400:500;next(e)}});
router.post('/login',async(req,res,next)=>{try{
  const data=credentials.parse(req.body); const user=await prisma.user.findUnique({where:{email:data.email}});
  if(!user||!await bcrypt.compare(data.password,user.password)) return res.status(401).json({message:'Invalid email or password'});
  res.cookie('token',signToken(user),cookieOptions).json({user:{id:user.id,name:user.name,email:user.email,role:user.role}});
}catch(e){e.status=e.name==='ZodError'?400:500;next(e)}});
router.post('/logout',(req,res)=>res.clearCookie('token').status(204).end());
router.get('/me',authenticate,async(req,res)=>{const {password,...user}=await prisma.user.findUnique({where:{id:req.user.id}});res.json({user})});
export default router;
