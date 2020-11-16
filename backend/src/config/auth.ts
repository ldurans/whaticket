export default {
<<<<<<< HEAD
  secret: "mysecret",
  expiresIn: "3d", // "15m",
  refreshSecret: "myanothersecret",
=======
  secret: process.env.JWT_SECRET || "mysecret",
  expiresIn: "15m",
  refreshSecret: process.env.JWT_REFRESH_SECRET || "myanothersecret",
>>>>>>> 766cb70f0c33f9534aebc0a77958bc350f472129
  refreshExpiresIn: "7d"
};
