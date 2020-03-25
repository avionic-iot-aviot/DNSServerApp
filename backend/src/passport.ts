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
         async (req: any, username: string, password: string, done: any) => {
            username = username.trim().toLocaleLowerCase();
            let userSearch: IUser = {
                username
            }
            const _user = await userStore.findBy(userSearch, false);
            if (_user.length != 0) {
                const user: IUser = _user[0];
                if (username === user.username && authHelper.validPassword(password, user.password)) {
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