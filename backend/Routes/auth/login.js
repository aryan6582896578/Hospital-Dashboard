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
            const getUserinfo = await pool.query('SELECT * FROM userinfo WHERE username=$1',[`${username}`]);
            
            if(getUserinfo.rows[0]){
                if(password===getUserinfo.rows[0].password){
                    const tokenJwt = signJWT(username,getUserinfo.rows[0].role,getUserinfo.rows[0].displayname)

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

    return router;
}