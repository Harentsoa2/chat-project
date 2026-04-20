import { UserDocument } from "../models/user.model";

// defois _id n'est pas reconnu dans le code, alors on le met en any pour éviter les erreurs de typescript

declare global {
  namespace Express {
    interface User extends UserDocument {
      _id?: any;
    }
  }
}

