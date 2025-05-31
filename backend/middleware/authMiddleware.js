// import 'dotenv/config';
// import jwt from 'jsonwebtoken';


// export const authMiddleware = (req, res, next) => {
//   const authHeader = req.headers.authorization;
//   if (!authHeader) return res.status(401).json({ message: 'Token tidak ditemukan' });
//   const token = authHeader.split(' ')[1];

//   try {
//   // authMiddleware.js
//     const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
//     req.userId = decoded.id;        

//     next();
//   } catch {
//     return res.status(401).json({ message: 'Token tidak valid atau kadaluarsa' });
//   }
// };

// export default authMiddleware

import 'dotenv/config';
import jwt from 'jsonwebtoken';

export const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ message: 'Token tidak ditemukan' });
  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    req.userId = decoded.userId;  // Fixed: changed from decoded.id to decoded.userId
    next();
  } catch {
    return res.status(401).json({ message: 'Token tidak valid atau kadaluarsa' });
  }
};

export default authMiddleware;