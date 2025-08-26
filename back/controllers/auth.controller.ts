import argon2 from "argon2";
import type { NextFunction, Request, Response } from "express";
import jwt, { type SignOptions } from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Créer un utilisateur
export const createUser = async(
    req: Request,
    res: Response,
    next:NextFunction
) => {

    const { firstname, lastname, email, password, serviceId, roleId, validation_code} = req.body;

    try {
        // Je vérifie que l'utilisateur n'existe pas déjà en bdd
        const existing = await prisma.user.findUnique({ where: { email } });

        if (existing) {
        res.status(400).json({ message: "Email déjà utilisé." })
        return
        };

        // Je hash le mot de passe
         const hashedPassword = await argon2.hash(password);

        //  Je crée l'utilisateur en bdd
        const newUser = await prisma.user.create({
            data: {
                firstname,
                lastname,
                email,
                password : hashedPassword,
                serviceId,
                roleId,
                validation_code
            },           
        });
        res.status(201).json({user: newUser})
    } catch (error) {
        next(error)
    }
};


// Se connecter
export const login = async(
    req: Request,
    res: Response,
    _next: NextFunction
) => {
    // Je récupère les données saisies dans le formulaire
    const {email, password} = req.body;

    if (!email || !password) {
      console.log("[LOGIN] Requête sans email ou password");
    return res.status(400).json({ message: "Email et mot de passe requis." });
    }

    try {
        const user = await prisma.user.findUnique({
            where: { email },
            include: { role: true },
        });

        if (!user) return res.status(401).json({ message: "Email ou mot de passe invalide." });

        const passwordValid = await argon2.verify(user.password, password);
        if (!passwordValid) return res.status(401).json({ message: "Email ou mot de passe invalide." });

        const { password: _, ...userWithoutPassword } = user;

        const payload = { id: user.id, email: user.email, roleId: user.roleId };

       
        const options: SignOptions = {
          expiresIn: "1h", 
        };

        // Vérifie que JWT_SECRET existe
        if (!process.env.JWT_SECRET) {
          throw new Error("JWT_SECRET non défini dans les variables d'environnement");
        }

        // Générer le token JWT
        const token = jwt.sign(payload, process.env.JWT_SECRET, options);
        res.cookie("token", token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "strict",
          maxAge: 24 * 60 * 60 * 1000
        });
       
        return res.status(200).json({ user: userWithoutPassword });        
        
    } catch (error) {
        console.error("Erreur login:", error);
        res.status(500).json({ message: "Erreur serveur." });
    }
};

// Récupérer l'utilisateur en cours
export const getMe = async (req: Request, res: Response): Promise<void> => {
 
  try {
    const token = req.cookies.token;
    if (!token) {
      res.status(401).json({ message: "Token invalide." });
      return;
    }

    if (!process.env.JWT_SECRET) throw new Error("JWT_SECRET non défini");

    const decoded = jwt.verify(token, process.env.JWT_SECRET) as { id: number };

    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
    });

    if (!user) {
      res.status(401).json({ message: "Utilisateur introuvable." });
      return;
    }

    res.json(user);
  } catch (error) {
    console.error("Erreur getMe:", error);
    res.status(500).json({ message: "Erreur serveur." });
  }
};

// Se déconnecter
export const logout = (_req: Request, res: Response): void => {
  res.cookie("token", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production", 
    sameSite: "strict",
    maxAge: 0, 
  });

  res.status(200).json({ message: "Déconnexion réussie" });
};