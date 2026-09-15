import jwt from 'jsonwebtoken';
export function authenticate(req,res,next){
  const token=req.cookies.token || req.headers.authorization?.replace('Bearer ','');
  if(!token) return res.status(401).json({message:'Authentication required'});
  try{ req.user=jwt.verify(token,process.env.JWT_SECRET); next(); }
  catch{return res.status(401).json({message:'Invalid or expired session'});}
}
export const authorize=(...roles)=>(req,res,next)=>roles.includes(req.user.role)?next():res.status(403).json({message:'Insufficient permissions'});
export function errorHandler(err,req,res,next){
  console.error(err); res.status(err.status||500).json({message:err.status?err.message:'Unexpected server error'});
}
