import { pool } from "../db.js";

export async function runDb(){
    try {
        console.log("Creating userinfo tables")
        await pool.query(`
            CREATE TABLE IF NOT EXISTS userinfo (
            username VARCHAR(20) NOT NULL UNIQUE PRIMARY KEY,
            password VARCHAR(50) NOT NULL,
            role VARCHAR(20) NOT NULL,
            displayname VARCHAR(20) NOT NULL,
            created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL
            )
        `)
        console.log("created usersinfo table")
    } catch (error) {
        console.log("error is creating userinfo table",error)
    }
    try {
        console.log("Creating hospitalinfo tables")
        await pool.query(`
            CREATE TABLE IF NOT EXISTS hospitalinfo (
            name VARCHAR(30) NOT NULL UNIQUE PRIMARY KEY,
            displayname VARCHAR(20) NOT NULL,
            doctorList TEXT[] DEFAULT '{}',
            nurseList TEXT[] DEFAULT '{}',
            created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL
            )
        `)
        console.log("created hospitalinfo table")
    } catch (error) {
        console.log("error is creating hospitalinfo table",error)
    }
    try {
        console.log("Creating patients tables")
        await pool.query(`
            CREATE TABLE IF NOT EXISTS patients (
                patientid VARCHAR(50) PRIMARY KEY,
                fullname VARCHAR(100) NOT NULL,
                gender VARCHAR(20) NOT NULL,
                age INTEGER ,
                dob DATE,
                phonenumber VARCHAR(20),
                address TEXT,
                bloodgroup VARCHAR(15),
                allergies TEXT,
                chronicconditions TEXT,
                notes TEXT,
                emergencycontactname VARCHAR(100),
                emergencycontactnumber VARCHAR(50),
                createdby VARCHAR(20) NOT NULL,
                lastupdatedby VARCHAR(20) NOT NULL,
                created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
                updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
                isdeleted BOOLEAN DEFAULT FALSE,
                hospitalname VARCHAR(30) NOT NULL,
                profileurl TEXT
            )
        `)
        console.log("created patients table")
    } catch (error) {
        console.log("error is creating patients table",error)
    }
}