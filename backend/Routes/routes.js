import AuthRoute from "./auth/login.js";

export function manageroutes(app){
    app.use('/auth',AuthRoute(app))

}