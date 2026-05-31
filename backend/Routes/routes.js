import AuthRoute from "./auth/admin.js";
import Dashboardroute from "./dashboard/hospital.js";
import Patientsroute from "./dashboard/patients.js";

export function manageroutes(app){
    app.use('/auth',AuthRoute(app))
    app.use('/dashboard',Dashboardroute(app))
    app.use('/patient',Patientsroute(app))

}