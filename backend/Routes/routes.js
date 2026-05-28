import AuthRoute from "./auth/admin.js";
import Dashboardroute from "./dashboard/hospital.js";

export function manageroutes(app){
    app.use('/auth',AuthRoute(app))
    app.use('/dashboard',Dashboardroute(app))

}