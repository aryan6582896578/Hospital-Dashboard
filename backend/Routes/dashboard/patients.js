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
                    const patientprofile = await pool.query(`SELECT * FROM patients WHERE hospitalname=$1 AND patientid = $2`,[req.query.hospitalname,req.query.patientid])
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
                            const patientprofile = await pool.query(`SELECT * FROM patients WHERE hospitalname = $1 AND patientid = $2`,[req.query.hospitalname,req.query.patientid])
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

    router.post('/addconsultation/:patientid', checkJwt, async (req, res) => {
        const patientid = req.params.patientid;
        const {hospitalname,pastmedicalhistory,personalhistory,medications,paymentamount,paymentstatus,paymentnote} = req.body;
        const consultationid = crypto.randomUUID();

        if (req.validUser && req.roleType === "doctor" && patientid && hospitalname) {
            const client = await pool.connect();
            try {
                const hasAccess = await client.query(`SELECT * FROM hospitalinfo WHERE name = $2 AND $1 = ANY(doctorlist)`,[req.username, hospitalname]);
                if (hasAccess.rowCount !== 1) {
                    return res.json({ status: "invalidUser" });
                }
                    await client.query("BEGIN");
                    await client.query( `INSERT INTO consultations(consultationid,patientid,hospitalname,pastmedicalhistory,personalhistory,paymentamount,paymentstatus,paymentnote,doctorname,paymentupdatedby) VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)`,
                    [consultationid,patientid,hospitalname,pastmedicalhistory,personalhistory,paymentamount,paymentstatus,paymentnote,req.username,req.username]
                );

                if (Array.isArray(medications)) {
                    for (const medication of medications) {
                        await client.query(`INSERT INTO consultation_medications(medicationid,consultationid,medicinename,duration,dosage,timing,notes) VALUES($1,$2,$3,$4,$5,$6,$7)`,
                            [crypto.randomUUID(),consultationid,medication.medicinename,medication.duration,medication.dosage,medication.timing,medication.notes]);
                    }
                }

                await client.query("COMMIT");

                return res.json({status: "consultationCreated"});
            } catch (error) {
                try {
                    await client.query("ROLLBACK");
                } catch {}

                console.log("error in creating consultation", error);

                return res.json({status: "consultationNotCreated"});
            } finally {
                client.release();
            }
        }else{
            return res.json({status:"invalidRequest"})
        }
    });
    router.get('/getpaitentconsultation',checkJwt, async(req, res) => {

        if(req.validUser){
            if(req.roleType==="admin"){
                try {
                            const consultations = await pool.query(
                                `SELECT c.*,

                                        json_build_object(
                                            'patientid', p.patientid,
                                            'fullname', p.fullname,
                                            'gender', p.gender,
                                            'age', p.age,
                                            'dob', p.dob,
                                            'phonenumber', p.phonenumber,
                                            'address', p.address,
                                            'bloodgroup', p.bloodgroup,
                                            'allergies', p.allergies,
                                            'chronicconditions', p.chronicconditions,
                                            'notes', p.notes,
                                            'emergencycontactname', p.emergencycontactname,
                                            'emergencycontactnumber', p.emergencycontactnumber
                                        ) AS patient,

                                        COALESCE(
                                            json_agg(
                                                json_build_object(
                                                    'medicationid', m.medicationid,
                                                    'medicinename', m.medicinename,
                                                    'duration', m.duration,
                                                    'dosage', m.dosage,
                                                    'timing', m.timing,
                                                    'notes', m.notes
                                                )
                                            ) FILTER (WHERE m.medicationid IS NOT NULL),
                                            '[]'
                                        ) AS medications

                                    FROM consultations c

                                    INNER JOIN patients p
                                        ON c.patientid = p.patientid

                                    LEFT JOIN consultation_medications m
                                        ON c.consultationid = m.consultationid

                                    WHERE c.hospitalname = $1
                                    AND c.patientid = $2

                                    GROUP BY
                                        c.consultationid,
                                        p.patientid

                                    ORDER BY c.createdat DESC;`,
                                [req.query.hospitalname, req.query.patientid]
                            );

                    res.json({consultationDataPatient: consultations.rows});
                } catch (error) {
                    res.json({status:"unableToGetConsultation"})
                    console.log("error in getting patient consultation admin")
                } 
            }else{
                try {
                    const hasAccess = await pool.query(`SELECT * FROM hospitalinfo WHERE name=$2 AND ($1 = ANY(doctorlist) OR $1 = ANY(nurselist))`,[req.username,req.query.hospitalname]);
                    if(hasAccess.rowCount===1){
                        try {
                            const consultations = await pool.query(
                                `SELECT c.*,

                                        json_build_object(
                                            'patientid', p.patientid,
                                            'fullname', p.fullname,
                                            'gender', p.gender,
                                            'age', p.age,
                                            'dob', p.dob,
                                            'phonenumber', p.phonenumber,
                                            'address', p.address,
                                            'bloodgroup', p.bloodgroup,
                                            'allergies', p.allergies,
                                            'chronicconditions', p.chronicconditions,
                                            'notes', p.notes,
                                            'emergencycontactname', p.emergencycontactname,
                                            'emergencycontactnumber', p.emergencycontactnumber
                                        ) AS patient,

                                        COALESCE(
                                            json_agg(
                                                json_build_object(
                                                    'medicationid', m.medicationid,
                                                    'medicinename', m.medicinename,
                                                    'duration', m.duration,
                                                    'dosage', m.dosage,
                                                    'timing', m.timing,
                                                    'notes', m.notes
                                                )
                                            ) FILTER (WHERE m.medicationid IS NOT NULL),
                                            '[]'
                                        ) AS medications

                                    FROM consultations c

                                    INNER JOIN patients p
                                        ON c.patientid = p.patientid

                                    LEFT JOIN consultation_medications m
                                        ON c.consultationid = m.consultationid

                                    WHERE c.hospitalname = $1
                                    AND c.patientid = $2

                                    GROUP BY
                                        c.consultationid,
                                        p.patientid

                                    ORDER BY c.createdat DESC;`,
                                [req.query.hospitalname, req.query.patientid]
                            );
                            
                            
                            res.json({consultationDataPatient: consultations.rows});
                        } catch (error) {
                            res.json({status:"unableToGetConsultation"})
                            console.log("error in getting patient consultation",error)
                        }
                    }
                } catch (error) {
                    console.log("error in get patient consultation",error)
                }
            }  
        }else{
            res.json({status:"invalidUser"})
        }
    
    })
    router.post('/updatepaymentconsultation', checkJwt, async (req, res) => {
        const {paymentamount,paymentstatus,paymentnote,hospitalname,consultationid,patientid} = req.body;

        if (req.validUser && (req.roleType === "doctor" || req.roleType === "nurse") && patientid && hospitalname) {
            try {
                const hasAccess = await pool.query(`SELECT * FROM hospitalinfo WHERE name = $2 AND ($1 = ANY(doctorlist) OR $1 = ANY(nurselist))`,[req.username, hospitalname]);
                if (hasAccess.rowCount !== 1) {
                    return res.json({ status: "invalidUser" });
                }
                const updatePayment = await pool.query(`UPDATE consultations SET paymentamount=$1,paymentstatus=$2,paymentnote=$3,paymentupdatedat=CURRENT_TIMESTAMP,paymentupdatedby=$4 WHERE consultationid=$5  `,
                    [paymentamount,paymentstatus,paymentnote,req.username,consultationid]
                )
                if(updatePayment.rowCount===1){
                    return res.json({status:"updatedPayment"})
                }

            } catch (error) {
                console.log(error);
                
                return res.json({status: "updatedNotPayment"});
            }
        }else{            
            return res.json({status:"invalidRequest"})
        }
    });

    router.get('/getallconsultations',checkJwt, async(req, res) => {
        if(req.validUser){
            if(req.roleType==="admin"){
                try {
                    const consultations = await pool.query(
                        `SELECT
                            c.*,

                            json_build_object(
                                'patientid', p.patientid,
                                'fullname', p.fullname,
                                'gender', p.gender,
                                'age', p.age,
                                'dob', p.dob,
                                'phonenumber', p.phonenumber,
                                'address', p.address,
                                'bloodgroup', p.bloodgroup,
                                'allergies', p.allergies,
                                'chronicconditions', p.chronicconditions,
                                'notes', p.notes,
                                'emergencycontactname', p.emergencycontactname,
                                'emergencycontactnumber', p.emergencycontactnumber
                            ) AS patient,

                            COALESCE(
                                json_agg(
                                    json_build_object(
                                        'medicationid', m.medicationid,
                                        'medicinename', m.medicinename,
                                        'duration', m.duration,
                                        'dosage', m.dosage,
                                        'timing', m.timing,
                                        'notes', m.notes
                                    )
                                ) FILTER (WHERE m.medicationid IS NOT NULL),
                                '[]'
                            ) AS medications

                        FROM consultations c

                        INNER JOIN patients p
                            ON c.patientid = p.patientid

                        LEFT JOIN consultation_medications m
                            ON c.consultationid = m.consultationid

                        WHERE c.hospitalname = $1

                        GROUP BY
                            c.consultationid,
                            p.patientid

                        ORDER BY
                            (c.paymentstatus = 'paid'),
                            c.createdat DESC 
                        LIMIT 10;`,
                        [req.query.hospitalname]
                    );

                    res.json({consultationDataAll: consultations.rows});
                } catch (error) {
                    res.json({status:"unableToGetConsultation"})
                    console.log("error in getting patient consultation admin")
                } 
            }else if(req.roleType==="doctor"){
                try {
                    const hasAccess = await pool.query(`SELECT * FROM hospitalinfo WHERE name=$2 AND $1 = ANY(doctorlist)`,[req.username,req.query.hospitalname]);
                    if(hasAccess.rowCount===1){
                        try {
                        const consultations = await pool.query(
                            `SELECT
                                c.*,

                                json_build_object(
                                    'patientid', p.patientid,
                                    'fullname', p.fullname,
                                    'gender', p.gender,
                                    'age', p.age,
                                    'dob', p.dob,
                                    'phonenumber', p.phonenumber,
                                    'address', p.address,
                                    'bloodgroup', p.bloodgroup,
                                    'allergies', p.allergies,
                                    'chronicconditions', p.chronicconditions,
                                    'notes', p.notes,
                                    'emergencycontactname', p.emergencycontactname,
                                    'emergencycontactnumber', p.emergencycontactnumber
                                ) AS patient,

                                COALESCE(
                                    json_agg(
                                        json_build_object(
                                            'medicationid', m.medicationid,
                                            'medicinename', m.medicinename,
                                            'duration', m.duration,
                                            'dosage', m.dosage,
                                            'timing', m.timing,
                                            'notes', m.notes
                                        )
                                    ) FILTER (WHERE m.medicationid IS NOT NULL),
                                    '[]'
                                ) AS medications

                            FROM consultations c

                            INNER JOIN patients p
                                ON c.patientid = p.patientid

                            LEFT JOIN consultation_medications m
                                ON c.consultationid = m.consultationid

                            WHERE c.hospitalname = $1

                            GROUP BY
                                c.consultationid,
                                p.patientid

                            ORDER BY
                                (c.paymentstatus = 'paid'),
                                c.createdat DESC
                                LIMIT 10;`,
                            [req.query.hospitalname]
                        );
                            res.json({consultationDataAll: consultations.rows});
                        } catch (error) {
                            res.json({status:"unableToGetConsultation"})
                            console.log("error in getting patient consultation",error)
                        }
                    }
                } catch (error) {
                    console.log("error in get patient consultation",error)
                }
            }else if(req.roleType==="nurse"){
                try {
                    const hasAccess = await pool.query(`SELECT * FROM hospitalinfo WHERE name=$2 AND $1 = ANY(nurselist)`,[req.username,req.query.hospitalname]);
                    if(hasAccess.rowCount===1){
                        try {
                            const consultations = await pool.query(
                                `SELECT
                                    c.*,

                                    json_build_object(
                                        'patientid', p.patientid,
                                        'fullname', p.fullname,
                                        'gender', p.gender,
                                        'age', p.age,
                                        'dob', p.dob,
                                        'phonenumber', p.phonenumber,
                                        'address', p.address,
                                        'bloodgroup', p.bloodgroup,
                                        'allergies', p.allergies,
                                        'chronicconditions', p.chronicconditions,
                                        'notes', p.notes,
                                        'emergencycontactname', p.emergencycontactname,
                                        'emergencycontactnumber', p.emergencycontactnumber
                                    ) AS patient,

                                    COALESCE(
                                        json_agg(
                                            json_build_object(
                                                'medicationid', m.medicationid,
                                                'medicinename', m.medicinename,
                                                'duration', m.duration,
                                                'dosage', m.dosage,
                                                'timing', m.timing,
                                                'notes', m.notes
                                            )
                                        ) FILTER (WHERE m.medicationid IS NOT NULL),
                                        '[]'
                                    ) AS medications

                                FROM consultations c

                                INNER JOIN patients p
                                    ON c.patientid = p.patientid

                                LEFT JOIN consultation_medications m
                                    ON c.consultationid = m.consultationid

                                WHERE c.hospitalname = $1
                                AND c.paymentstatus = 'notpaid'

                                GROUP BY
                                    c.consultationid,
                                    p.patientid

                                ORDER BY c.createdat DESC
                                LIMIT 10;`,
                                [req.query.hospitalname]
                            );
                            res.json({consultationDataAll: consultations.rows});
                        } catch (error) {
                            res.json({status:"unableToGetConsultation"})
                            console.log("error in getting patient consultation",error)
                        }
                    }
                } catch (error) {
                    console.log("error in get patient consultation",error)
                }
            }  
        }else{
            res.json({status:"invalidUser"})
        }
    
    })

    return router;
}