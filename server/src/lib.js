import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';
export const prisma = new PrismaClient();
export const signToken = user => jwt.sign({id:user.id,role:user.role}, process.env.JWT_SECRET, {expiresIn:'7d'});
export const cookieOptions = {httpOnly:true,sameSite:'lax',secure:process.env.NODE_ENV==='production',maxAge:7*86400000};
