import express from 'express'
import { signJWT, verifyJWT } from '../../utils/managejwt.js'
import { pool, query } from '../../Database/db.js'
const router = express.Router({ mergeParams: true })


export default function Dashboardroute(app){
    async function checkJwt(req, res, next) {
        try {
            const validToken = verifyJWT(req.cookies.tokenJwt);
            if (validToken) {
            req.validUser = true;
            req.roleType = validToken.roleType
            req.username = validToken.username
            req.displayname=validToken.displayname
            } else {
            req.validUser = false;
            }
        } catch (error) {
            console.log("no cookie jwtcheck");
        }
        next();
    }
    router.get('/listhospital',checkJwt, async(req, res) => {

        if(req.validUser){
            try {
                const getHospitalList = await pool.query(`SELECT * FROM hospitalinfo WHERE $1 = 'admin' OR $1 = ANY(doctorlist) OR $1 = ANY(nurselist)`,[req.username]);
                    if(getHospitalList){
                        res.json({userdata:getHospitalList.rows})
                    }else{
                        res.json({status:"unableToGetHospitalList"})
                    }
                } catch (error) {
                    console.log("error in admin portal trying to list hospital",error)
                }
                
        }else{
            res.json({status:"invalidUser"})
        }
    
    })
    return router;

}