import jwt from 'jsonwebtoken';

export const generateJWT = (userId, email) => {
  const payload = { userId, email }

  return new Promise((resolve, reject) => {
    jwt.sign(payload, process.env.SECRET_JWT_SEED, {
      expiresIn: '1h'
    }, (err, token) => {
      if (err) {
        reject(err);
      } else {
        resolve(token);
      }
    })
  });
}
