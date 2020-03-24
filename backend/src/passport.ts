const localStrategy = require('passport-local').Strategy;
import { IUser } from '../src/interfaces/interfaces';
import UserStore from './stores/userStore';
const userStore = new UserStore();
import AuthHelper from './shared/authHelper';
const authHelper = new AuthHelper();

export function setupStrategies(passport: any): void {

    passport.serializeUser(function (user: any, done: any) {
        done(null, user.id);
    });

    passport.deserializeUser(function (id: any, done: any) {
        userStore.findById(id)
            .then(function (user: any) {
                done(null, user);
            })
            .catch(function (err: any) {
                done(err, null);
            });
    });

    passport.use('local-login', new localStrategy({
        usernameField: 'username',
        passwordField: 'password',
        passReqToCallback: true,
    },
         async (req: any, email: string, password: string, done: any) => {
            email = email.trim().toLocaleLowerCase();
            let userSearch: IUser = {
                email
            }
            const _user = await userStore.findBy(userSearch, false);
            if (_user.length != 0) {
                const user: IUser = _user[0];
                if (email === user.email && authHelper.validPassword(password, user.password)) {
                    return done(null, user, { message: 'Successfully Login' });
                } else {
                    return done(null, false, { message: 'Incorrect Password.' });
                }
            } else {
                return done(null, false, { message: 'Incorrect Username.' });
            }
            
        }),
    );
}