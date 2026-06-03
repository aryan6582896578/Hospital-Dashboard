import express from 'express'
import { signJWT, verifyJWT } from '../../utils/managejwt.js'
import { pool, query } from '../../Database/db.js'
const router = express.Router({ mergeParams: true })

export default function authroute(app){
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

    router.post('/login',checkJwt, async(req, res) => {
        const username = req.body.username
        const password= req.body.password
        if(req.validUser){
            res.json({ status: "userValid" });
        }else{
            console.log("trying to login with username: ",username)
            const getUserinfo = await pool.query('SELECT * FROM userinfo WHERE username=$1',[`${username}`]);
            
            if(getUserinfo.rows[0]){
                if(password===getUserinfo.rows[0].password){
                    const tokenJwt = signJWT(username,getUserinfo.rows[0].role,getUserinfo.rows[0].displayname)
                    console.log(getUserinfo.rows[0].username , "logged in")
                    res.cookie('tokenJwt',`${tokenJwt}`,{
                        httpOnly: true,
                        secure: process.env.ENV_TYPE === 'production',
                        sameSite: process.env.ENV_TYPE === 'production' ? 'None' : 'Lax',
                        maxAge: 1000*60*60*22
                    })
                    res.cookie('tokenJwtCheck',`yes`,{
                        maxAge: 1000*60*60*22
                    })
                    res.json({ status: "userValid" });
                }else{
                    console.log("Failed - trying to login with username: ",username)
                    res.clearCookie('tokenJwt')
                    res.clearCookie('tokenJwtCheck')
                    res.json({ status: "userInvalid" });
                }
            }else{
                res.clearCookie('tokenJwt')
                res.clearCookie('tokenJwtCheck')
                res.json({ status: "invalidData" });
            }
        }
    
    })
    router.get('/verify',checkJwt, async(req, res) => {
        if(req.validUser){
            res.json({ status: "userValid",roleType:req.roleType,username:req.username,displayname:req.displayname });
        }else{
            res.json({ status: "userInvalid" });
        }
    })
    router.get('/logout',checkJwt, async(req, res) => {
        res.clearCookie('tokenJwtCheck')
        res.clearCookie('tokenJwt')
        res.json({status:"logout"})
    })
    router.post('/admin/adduser',checkJwt, async(req, res) => {
        const username = req.body.username
        const displayname = req.body.displayName
        const password= req.body.password
        const roleType=req.body.roleType

        if(req.validUser){
            
            if(username&&displayname&&password&&roleType){
                try {
                    const saveUserinfo = await pool.query('INSERT INTO userinfo(username,password,role,displayname) VALUES ($1,$2,$3,$4) RETURNING * ',
                        [`${username}`,`${password}`,`${roleType}`,`${displayname}`]);
                    if(saveUserinfo.rows[0]){
                        res.json({status:"userCreated"})
                    }
                } catch (error) {
                    res.json({status:"unableToCreateUser"})
                    console.log("oops not able to save user")
                    console.log("error in admin portal trying to add user",error)
                }
                
            }else{
                res.json({status:"missingData"})
            }
        }else{
            res.json({status:"invalidUser"})
        }
    })

    router.get('/admin/listuser',checkJwt, async(req, res) => {
        if(req.validUser && req.roleType==="admin"){
            try {
                const getUserList = await pool.query('SELECT * FROM userinfo WHERE NOT username=($1)',['admin']);
                    if(getUserList){
                        res.json({userdata:getUserList.rows})
                    }else{
                        res.json({status:"unableToGetUserList"})
                    }
                } catch (error) {
                    console.log("error in admin portal trying to list user",error)
                }
                
            
        }else{
            res.json({status:"invalidUser"})
        }
    
    })
    router.post('/admin/updateuser',checkJwt, async(req, res) => {
        const username = req.body.username
        const displayname = req.body.displayName
        const password=req.body.password
        if(req.validUser && req.roleType==="admin"){
            console.log(username,displayname,password)
            if(username&&displayname&&password){
                try {
                    const savehospitalinfo = await pool.query('UPDATE userinfo SET displayname=$2,password=$3  WHERE username=$1 ',
                        [username,displayname,password]);
                    if(savehospitalinfo){
                        res.json({status:"userUpdated"})
                    }
                } catch (error) {
                    res.json({status:"unableToUpdateUser"})
                    console.log("oops not able to update user")
                    console.log("error in admin portal trying to update user",error)
                }
                
            }else{
                res.json({status:"missingData"})
            }
        }else{
            res.json({status:"invalidUser"})
        }
    }) 

    router.post('/admin/addhospital',checkJwt, async(req, res) => {
        const name = req.body.name
        const displayname = req.body.displayName
        const doctorList=req.body.doctorList
        const nurseList=req.body.nurseList 
        if(req.validUser && req.roleType==="admin"){
            console.log(name,displayname,doctorList,nurseList)
            if(name&&displayname){
                try {
                    const savehospitalinfo = await pool.query('INSERT INTO hospitalinfo(name,displayname,doctorList,nurseList) VALUES ($1,$2,$3,$4) RETURNING * ',
                        [`${name}`,`${displayname}`,doctorList,nurseList]);
                    if(savehospitalinfo.rows[0]){
                        res.json({status:"hospitalCreated"})
                    }
                } catch (error) {
                    res.json({status:"unableToCreateHospital"})
                    console.log("oops not able to save hospital")
                    console.log("error in admin portal trying to add hospital",error)
                }
                
            }else{
                res.json({status:"missingData"})
            }
        }else{
            res.json({status:"invalidUser"})
        }
    
    })
    router.get('/admin/listhospital',checkJwt, async(req, res) => {

        if(req.validUser && req.roleType==="admin"){
            try {
                const getHospitalList = await pool.query('SELECT * FROM hospitalinfo');
                    if(getHospitalList){
                        res.json({hospitalData:getHospitalList.rows})
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
    router.post('/admin/updatehospital',checkJwt, async(req, res) => {
        const name = req.body.name
        const displayname = req.body.displayName
        const doctorList=req.body.doctorList
        const nurseList=req.body.nurseList 
        if(req.validUser && req.roleType==="admin"){
            console.log(name,displayname,doctorList,nurseList)
            if(name&&displayname){
                try {
                    const savehospitalinfo = await pool.query('UPDATE hospitalinfo SET name=$1,displayname=$2,doctorList=$3,nurseList=$4  WHERE name=$1 ',
                        [`${name}`,`${displayname}`,doctorList,nurseList]);
                    if(savehospitalinfo){
                        res.json({status:"hospitalUpdated"})
                    }
                } catch (error) {
                    res.json({status:"unableToUpdateHospital"})
                    console.log("oops not able to update hospital")
                    console.log("error in admin portal trying to update hospital",error)
                }
                
            }else{
                res.json({status:"missingData"})
            }
        }else{
            res.json({status:"invalidUser"})
        }
    
    })    
    return router;
}