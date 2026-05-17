import jwt from 'jsonwebtoken'

export function signJWT(username){
    const jwtToken = jwt.sign({
        username:`${username}`
    },`${process.env.JWT_SECRET}`,{ expiresIn: '12h' })
    return jwtToken
}

export function verifyJWT(tokenJwt){
    const decodedValue=jwt.verify(tokenJwt,`${process.env.JWT_SECRET}`)
    return decodedValue
}