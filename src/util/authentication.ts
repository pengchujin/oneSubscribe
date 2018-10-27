
import { sign, verify } from "jsonwebtoken";
import * as config from "../../config";
import { validationError } from "./errors";
import { User } from "../entities/user";

  function extractJwt(jwt) {
    const parts = (jwt || "").split(" ");
    if (parts.length !== 2) {
      return null;
    }
    try {
      return verify(parts[1], config.JWT_SECRET);
    } catch (err) {
      return null;
    }
  }
  
  export async function fetchUser(db, jwt) {
    const jwtObject = extractJwt(jwt);
    if (!(jwtObject && typeof jwtObject === "object" && jwtObject.id)) {
      return null;
    }
    const repository = db.getRepository(User);
    return await repository.findOne({ id: jwtObject.id });
  }
  
  export async function ensureUser(db, jwt) {
    const user = await fetchUser(db, jwt);
    if (!user) {
      throw validationError({
        jwt: ["请先登录!"]
      });
    }
    return user;
  }
