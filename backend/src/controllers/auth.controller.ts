import { Request, Response } from "express";
import { asyncHandler } from "../middlewares/asyncHandler.middleware";
import { loginService, registerService } from "../services/auth.service";
import { clearJwtAuthCookie, setJwtAuthCookie } from "../utils/cookie";
import { HTTPSTATUS } from "../config/http.config";
import { loginSchema, registerSchema } from "../validators/auth.validator";

export const registerController = asyncHandler(
  async (req: Request, res: Response) => {
    const body = registerSchema.parse(req.body);

    const user = await registerService(body);
    const userId = user.id;

    return setJwtAuthCookie({ // fonction qui génère un token JWT et le stocke dans un cookie
      res,
      userId,
    })
      .status(HTTPSTATUS.CREATED)
      .json({
        message: "User created & login successfully",
        user,
      });
  }
);

export const loginController = asyncHandler(
  async (req: Request, res: Response) => {
    const body = loginSchema.parse(req.body);

    const user = await loginService(body);
    const userId = user.id;
    return setJwtAuthCookie({
      res, 
      userId,
    }) // envoie du cookie avec le token JWT
      .status(HTTPSTATUS.OK)
      .json({
        message: "User login successfully",
        user,
      });
  }
);

export const logoutController = asyncHandler(
  async (req: Request, res: Response) => {
    return clearJwtAuthCookie(res).status(HTTPSTATUS.OK).json({
      message: "User logout successfully",
    }); // supprime le cookie en envoyant une réponse avec un cookie vide 
  }
);

export const authStatusController = asyncHandler(
  async (req: Request, res: Response) => {
    const user = req.user; // req.user est défini par passport après la vérification du token JWT
    return res.status(HTTPSTATUS.OK).json({
      message: "Authenticated User",
      user,
    });
  }
);