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
                if(req.roleType==='admin'){
                    const getHospitalList = await pool.query(`SELECT * FROM hospitalinfo `);
                    if(getHospitalList.rows){
                        res.json({hospitalData:getHospitalList.rows})
                    }else{
                        res.json({status:"unableToGetHospitalList"})
                    }
                }else{
                    const getHospitalList = await pool.query(`SELECT * FROM hospitalinfo WHERE $1 = ANY(doctorlist) OR $1 = ANY(nurselist)`,[req.username]);
                    if(getHospitalList.rows){
                        res.json({hospitalData:getHospitalList.rows})
                    }else{
                        res.json({status:"unableToGetHospitalList"})
                    }
                }

                } catch (error) {
                    console.log("error in admin portal trying to list hospital",error)
                }
                
        }else{
            res.json({status:"invalidUser"})
        }
    
    })
    router.get('/gethospital',checkJwt, async(req, res) => {

        if(req.validUser){
            if(req.roleType==='admin'){
                const getHospitalData= await pool.query(`SELECT * FROM hospitalinfo WHERE name=$1 `,[req.query.hospitalname])
                if(getHospitalData.rows[0]){
                    res.json({status:"validUser",type:"admin",hospitalData:getHospitalData.rows})
                }else{
                    res.json({status:"invalidHospital"})
                }
            }else if(req.roleType==='doctor'){
                try {
                    const getHospitalData= await pool.query(`SELECT * FROM hospitalinfo WHERE name=$1 AND $2 = ANY(doctorlist) OR  $2 = ANY(nurselist)`,[req.query.hospitalname,req.username])
                    if(getHospitalData.rows[0]){
                        res.json({status:"validUser",type:"doctor",hospitalData:getHospitalData.rows})
                    }else{
                        res.json({status:"invalidHospital"})
                    }
                } catch (error) {
                        console.log("error in dashboard hospital page",error)
                }
            }else if(req.roleType==="nurse"){
                try {
                    console.log(req.query.hospitalname,req.username,req.roleType )
                    const getHospitalData= await pool.query(`SELECT * FROM hospitalinfo WHERE name=$1 AND $2 = ANY(nurselist)`,[req.query.hospitalname,req.username])
                    if(getHospitalData.rows[0]){
                        res.json({status:"validUser",type:"nurse",hospitalData:getHospitalData.rows})
                    }else{
                        res.json({status:"invalidHospital"})
                     }
                } catch (error) {
                        console.log("error in dashboard hospital page",error)
                }      
            }

                
        }else{
            res.json({status:"invalidUser"})
        }
    
    })
    return router;
// CURRENT_TIMESTAMP postgress auto fills it YYYY-MM-DD for dob
}