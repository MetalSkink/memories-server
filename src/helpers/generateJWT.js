import jwt from 'jsonwebtoken';

export const generateJWT = (userId, email) => {
  token = jwt.sign({
    email: email,
    id: userId,
  }, process.env.SECRET_JWT_SEED, {
    expiresIn: '1h',
  })
  return token;
}

