import jwt from 'jsonwebtoken'

export function signJWT(username,role,displayname){
    const jwtToken = jwt.sign({
        username:`${username}`,
        roleType:`${role}`,
        displayname:`${displayname}`
    },`${process.env.JWT_SECRET}`,{ expiresIn: '12h' })
    return jwtToken
}

export function verifyJWT(tokenJwt){
    const decodedValue=jwt.verify(tokenJwt,`${process.env.JWT_SECRET}`)
    return decodedValue
}

