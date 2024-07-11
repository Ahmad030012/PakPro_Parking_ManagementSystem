const express = require('express');
const cors = require('cors');
const { Client } = require('pg');

const PORT = 3000;
const app = express();

const client = new Client({
    user: 'postgres',
    host: 'localhost',
    database: 'ParkPro',
    password: 'Abdullah16',
    port: 5432,
});

client.connect().then(() => {
    console.log('Connected to Database.');
}).catch((err) => {
    console.log('Error Connecting Database:', err);
});

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

let globalOwnerId;
let globalSpaceId;
let globalParkingLotId;
let globalmemberid;

app.post('/carPark', async (req, res) => {
    try {
        const { userName, userPhoneNumber, userAddress, parkingLotId, carRegistrationNumber, carColor, carType, membershipid } = req.body;
        const ownerid = await generateUniqueID('C', 'carowner', 'ownerid');

        let query, values;

        
        if (membershipid) {
            query = `INSERT INTO carowner(ownerid, ownername, contactno, address, membershipid) VALUES($1, $2, $3, $4, $5)`;
            values = [ownerid, userName, userPhoneNumber, userAddress, membershipid];
        } else {
            query = `INSERT INTO carowner(ownerid, ownername, contactno, address) VALUES($1, $2, $3, $4)`;
            values = [ownerid, userName, userPhoneNumber, userAddress];
        }

        try {
            await client.query(query, values);
        } catch (error) {
            console.error('Error inserting car owner data: ', error);
            return res.status(500).send('Error inserting car owner data.');
        }

        const query1 = `INSERT INTO car(regno, cartype, ownerid, color, contactno) VALUES($1, $2, $3, $4, $5)`;
        const values1 = [carRegistrationNumber, carType, ownerid, carColor, userPhoneNumber];
        
        try {
            await client.query(query1, values1);
        } catch (error) {
            console.error('Error inserting car data: ', error);
            return res.status(500).send('Error inserting car data.');
        }

        const spaceid = await generateSpaceId();
        const parkspacequery = `INSERT INTO parkspace(spaceid, baserate, lotid) VALUES($1, $2, $3)`;
        const parkspacevalues = [spaceid, 50, parkingLotId];
        
        try {
            await client.query(parkspacequery, parkspacevalues);
        } catch (error) {
            console.error('Error inserting park space data: ', error);
            return res.status(500).send('Error inserting park space data.');
        }

        globalOwnerId = ownerid;
        globalSpaceId = spaceid;
        globalParkingLotId = parkingLotId;

        res.send('Data Inserted Successfully');
    } catch (error) {
        console.error('Unexpected error: ', error);
        res.status(500).send('Unexpected error occurred.');
    }
});

app.post('/',async (req,res)=>{
    
})

app.post('/membership', async (req, res) => {
    try {
        const { membershipType } = req.body;
        let prefix;
        switch (membershipType) {
            case 'platinum':
                prefix = 'PL';
                break;
            case 'gold':
                prefix = 'GL';
                break;
            case 'silver':
                prefix = 'SL';
                break;
            default:
                return res.status(400).send('Invalid membership type.');
        }
        const memberid = await generateUniqueID(prefix, 'membership', 'membershipid', 5);
        const memberquery = `INSERT INTO membership(membershipid, startdate, enddate, membershiptype) VALUES ($1, CURRENT_DATE, CURRENT_DATE + INTERVAL '5 years', $2)`;
        const membervalues = [memberid, membershipType];
        await client.query(memberquery, membervalues);
        globalmemberid = memberid;
        res.send('Data Inserted Successfully');
    } catch (error) {
        console.error('Error inserting data: ', error);
        res.status(500).send('Error inserting data.');
    }
});

app.get('/memberdata', async (req, res) => {
    try {
        if (!globalmemberid) {
            return res.status(400).send('Membership ID not set.');
        }
        const memberquery = `SELECT * FROM membership WHERE membershipid = $1`;
        const membervalues = [globalmemberid];
        const memberres = await client.query(memberquery, membervalues);

        const responseData = {
            membership: memberres.rows
        };

        res.json(responseData);
    } catch (error) {
        console.error('Error getting data: ', error);
        res.status(500).send('Error Getting Data');
    }
});

app.get('/getParkDetails', async (req, res) => {
    try {
        const carownerquery = `SELECT * FROM carowner WHERE ownerid = $1`;
        const carownervalues = [globalOwnerId];
        const carownerres = await client.query(carownerquery, carownervalues);

        const carquery = `SELECT * FROM car WHERE ownerid = $1`;
        const carvalues = [globalOwnerId];
        const carres = await client.query(carquery, carvalues);

        const responseData = {
            carowner: carownerres.rows,
            car: carres.rows,
            spaceid: globalSpaceId,
            lotid: globalParkingLotId
        };

        res.json(responseData);
    } catch (error) {
        console.error('Error getting data: ', error);
        res.status(500).send('Error Getting Data');
    }
});

async function generateUniqueID(prefix, tableName, columnName, idLength = 4) {
    let id;
    do {
        const randomDigits = Math.floor(Math.random() * Math.pow(10, idLength - prefix.length));
        id = prefix + randomDigits.toString().padStart(idLength - prefix.length, '0');
    } while (!(await isIDUnique(tableName, columnName, id)));
    return id;
}

async function generateSpaceId() {
    let id;
    do {
        const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        const randomLetter = letters.charAt(Math.floor(Math.random() * letters.length));
        const randomDigits = Math.floor(Math.random() * 1000);
        id = randomLetter + randomDigits.toString().padStart(3, '0');
    } while (!(await isIDUnique('parkspace', 'spaceid', id)));
    return id;
}

async function isIDUnique(tableName, columnName, id) {
    try {
        const query = `SELECT EXISTS (SELECT 1 FROM ${tableName} WHERE ${columnName} = $1) AS exists`;
        const result = await client.query(query, [id]);
        const exists = result.rows[0].exists;
        return !exists;
    } catch (error) {
        console.error(`Error checking ${columnName} uniqueness:`, error);
        throw error;
    }
}

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
