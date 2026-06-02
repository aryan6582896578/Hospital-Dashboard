import express from 'express'
import crypto from "crypto";
import { signJWT, verifyJWT } from '../../utils/managejwt.js'
import { pool, query } from '../../Database/db.js'
const router = express.Router({ mergeParams: true })


export default function Patientsroute(app){
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
            console.log("no cookie jwtcheck in patient route");
        }
        next();
    }

    router.post('/addpatient',checkJwt, async(req, res) => {
        const patientid = crypto.randomUUID();
        const fullname = req.body.fullname;
        const gender = req.body.gender;
        const age = req.body.age || null;
        const dob = req.body.dob || null;
        const phonenumber= req.body.phonenumber || null;
        const address= req.body.address || null;
        const bloodgroup=req.body.bloodgroup || null;
        const allergies=req.body.allergies || null;
        const chronicconditions=req.body.chronicconditions || null; 
        const notes=req.body.notes || null;
        const emergencycontactname=req.body.emergencycontactname || null;
        const emergencycontactnumber=req.body.emergencycontactnumber || null;
        const createdby = req.username;
        const lastupdatedby = req.username;
        const hospitalname = req.body.hospitalname;

        if(req.validUser && hospitalname && fullname){
            try {
                const hasAccess = await pool.query(`SELECT * FROM hospitalinfo WHERE name=$2 AND ($1 = ANY(doctorlist) OR $1 = ANY(nurselist))`,[req.username,hospitalname]);
                if(hasAccess.rowCount===1){
                    try {
                        const addPatient = await pool.query(`INSERT INTO patients(patientid,fullname,gender,age,dob,phonenumber,address,bloodgroup,allergies,chronicconditions,notes,emergencycontactname,
                            emergencycontactnumber,createdby,lastupdatedby,hospitalname) 
                            VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16) RETURNING *`,
                        [patientid,fullname,gender,age,dob,phonenumber,address,bloodgroup,allergies,chronicconditions,notes,emergencycontactname,emergencycontactnumber,createdby,lastupdatedby,hospitalname])
                        
                        if(addPatient.rows[0]){
                            res.json({status:"patientCreated"})
                        }else{
                            res.json({status:"patientNotCreated"})
                        } 
                    } catch (error) {
                        console.log("error in adding patient",error)
                    }
                }
            } catch (error) {
                onsole.log("error in add patient",error)
            }

        
        }else{
            res.json({status:"invalidUser"})
        }
    })
    router.get('/getpaitentlist',checkJwt, async(req, res) => {

        if(req.validUser){
            if(req.roleType==="admin"){
                try {
                    const patientlist = await pool.query(`SELECT * FROM patients WHERE hospitalname=$1`,[req.query.hospitalname])
                    if(patientlist.rows){
                        res.json({patientlist:patientlist.rows})
                    }else{
                        res.json({status:"unableToGetPatientList"})
                    } 
                } catch (error) {
                    res.json({status:"unableToGetPatientList"})
                    console.log("error in getting patient list admin")
                } 
            }else{
                try {
                    const hasAccess = await pool.query(`SELECT * FROM hospitalinfo WHERE name=$2 AND ($1 = ANY(doctorlist) OR $1 = ANY(nurselist))`,[req.username,req.query.hospitalname]);
                    if(hasAccess.rowCount===1){
                        try {
                            const patientlist = await pool.query(`SELECT * FROM patients WHERE hospitalname=$1`,[req.query.hospitalname])
                            if(patientlist.rows){
                                res.json({patientlist:patientlist.rows})
                            }else{
                                res.json({status:"unableToGetPatientList"})
                            } 
                        } catch (error) {
                            res.json({status:"unableToGetPatientList"})
                            console.log("error in getting patient list",error)
                        }
                    }
                } catch (error) {
                    console.log("error in get patient",error)
                }
            }  
        }else{
            res.json({status:"invalidUser"})
        }
    
    })
    router.get('/getpaitentprofile',checkJwt, async(req, res) => {
        
        if(req.validUser){
            if(req.roleType==="admin"){
                try {
                    const patientprofile = await pool.query(`SELECT * FROM patients WHERE hospitalname=$1 AND patientid = $2`,[req.query.hospitalname,req.query.patientname])
                    if(patientprofile.rows){
                        res.json({patientProfile:patientprofile.rows})
                    }else{
                        res.json({status:"unableToGetPatientProfile"})
                    } 
                } catch (error) {
                    res.json({status:"unableToGetPatientProfile"})
                    console.log("error in getting patient profile admin")
                } 
            }else{
                try {
                    const hasAccess = await pool.query(`SELECT * FROM hospitalinfo WHERE name=$2 AND ($1 = ANY(doctorlist) OR $1 = ANY(nurselist))`,[req.username,req.query.hospitalname]);
                    if(hasAccess.rowCount===1){
                        try {
                            const patientprofile = await pool.query(`SELECT * FROM patients WHERE hospitalname = $1 AND patientid = $2`,[req.query.hospitalname,req.query.patientname])
                            if(patientprofile.rows){
                                res.json({patientProfile:patientprofile.rows})
                            }else{
                                res.json({status:"unableToGetPatientProfile"})
                            } 
                        } catch (error) {
                            res.json({status:"unableToGetPatientProfile"})
                            console.log("error in getting patient profile",error)
                        }
                    }
                } catch (error) {
                    console.log("error in get patient profile",error)
                }
            }  
        }else{
            res.json({status:"invalidUser"})
        }
    
    })
    router.post('/editpatient/:patientid',checkJwt, async(req, res) => {
        const patientid = req.params.patientid;
        const { fullname, gender, age, dob, phonenumber, address, bloodgroup, allergies, chronicconditions, notes, emergencycontactname, emergencycontactnumber, hospitalname } = req.body;
        const lastupdatedby = req.username;
        if(req.validUser && hospitalname && fullname && patientid && req.roleType==="doctor" ){
            try {
                const hasAccess = await pool.query(`SELECT * FROM hospitalinfo WHERE name=$2 AND ($1 = ANY(doctorlist) OR $1 = ANY(nurselist))`,[req.username,hospitalname]);
                if(hasAccess.rowCount===1){
                    const validPatient = await pool.query( `SELECT 1 FROM patients WHERE patientid = $1`,[patientid]);
                    if(validPatient.rowCount ===1){
                        const updatePatient = await pool.query( `UPDATE patients SET fullname = $1, gender = $2, age = $3, dob = $4, phonenumber = $5, address = $6, bloodgroup = $7, allergies = $8, 
                            chronicconditions = $9, notes = $10, emergencycontactname = $11, emergencycontactnumber = $12, lastupdatedby = $13,updated_at = CURRENT_TIMESTAMP WHERE patientid = $14 RETURNING *`, 
                            [ fullname || null, gender || null, age || null, dob || null, phonenumber || null, address || null, bloodgroup || null, allergies || null, 
                                chronicconditions || null, notes || null, emergencycontactname || null, emergencycontactnumber || null, lastupdatedby, patientid ] );
                        if(updatePatient.rowCount===1){
                            res.json({status:"patientUpdated"})
                        }else{
                            res.json({status:"unableToEditPatient"})
                        }
                    }else{
                        res.json({status:"invalidPatient"})
                    }
                }else{
                    res.json({status:"invalidUser"})
                }
            } catch (error) {
                onsole.log("error in add patient",error)
            }

        
        }else{
            res.json({status:"invalidRequest"})
        }
    })

    return router;
}