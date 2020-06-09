const passport = require('passport');
const { Strategy: JwtStrategy, ExtractJwt } = require('passport-jwt');

const Company = require('./company');

const { JWT_KEY } = process.env;

passport.use(
  new JwtStrategy(
    {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: JWT_KEY,
    },
    async (payload, done) => {
      try {
        const company = await Company.findByPk(payload.id);
        if (!company) {
          return done(null, false);
        }
        done(null, company);
      } catch (err) {
        done(err, false);
      }
    }
  )
);
