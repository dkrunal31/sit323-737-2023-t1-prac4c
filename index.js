
//Variable declaration is over
const express = require("express");
const res = require("express/lib/response");
const app = express();
const cors = require('cors');
const { hashSync, compareSync } = require('bcrypt');
const UserModel = require('./config/database');
const jwt = require('jsonwebtoken');
const passport = require('passport');


// Register middleware
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors());
app.use(passport.initialize());

require('./config/passport')
//MyRef1.1
app.post('/register', (req, res) => {
    const user = new UserModel({
        username: req.body.username,
        password: hashSync(req.body.password, 10)
    })
    user.save().then(user => {
        res.send({
            success: true,
            message: "User Successfully Created",
            user: {
                id: user._id,
                username: user.username
            }
        })

    }).catch(err => {
        res.send({
            success: false,
            message:"Something wrong",
            error: err
        })
    })
})

app.post('/login', (req, res) => {
    UserModel.findOne({ username: req.body.username }).then(user => {
//No user found-MyRef2.2
        if (!user) {
            return res.status(401).send({
                success: false,
                message:"User Not Found"
            })
        }


//When Password is Incorrect- Section 2.3MyRef
        if (!compareSync(req.body.password, user.password)) {
            return res.status(401).send({
                success: false,
                message: "Password Incorrect"
            })
        }

        const payload = {
            username: user.username,
            id: user._id
        }

        const token = jwt.sign(payload, "Krunal_Hemnani", { expiresIn: "1d" })
        return res.status(200).send({
            success: true,
            message: "You have loged-IN",
            token: "Bearer"+token
        })
    })
})

const {transports, createLogger, format} = require('winston');
    const logger = createLogger({
        format: format.combine(
            format.timestamp(),
            format.json()
        ),
        defaultMeta: {service: 'user-service'},
        transports: [
            new transports.Console(),
            new transports.File({ filename: 'error.log', level: 'error'}),
            new transports.File({ filename: 'info.log', level:'info'}),
        ],
    });

if(process.env.NODE_ENV !== 'production'){//MyRef3.2
    logger.add(new transports.Console({
        format: format.combine(
            format.timestamp(),
            format.json()
        ),
    }));
}

//Additon Calculator
const add= (n1,n2) => {
    return n1+n2;
}

//Substraction Calculator
const subtract= (n1,n2) => {
    return n1-n2;
}

//Multiplication Calculator
const multiply= (n1,n2) => {
    return n1*n2;
}

//Division Calculator
const divide= (n1,n2) => {
    return n1/n2;
}

// Check and throw error
function checknan(n1,n2) {
    if(isNaN(n1)){ 
        logger.error("Incorrect defined-n1");
        throw new Error("Incorrect defined-n2");
    }
    if(isNaN(n2)){
        logger.error("Incorrect defined-n1");
        throw new Error("Incorrect defined-n2");
    }
    if (n1 === NaN ||n2 === NaN) {
        console.log()
        logger.error("Parsing error");
        throw new Error("Parsing Error");
    }
}

//New Section for Passport- MyRef5


//Addition Part-MyRef 6.1 
app.get("/add", passport.authenticate('jwt', { session: false }), (req,res)=>{
    try{
        const n1= parseFloat(req.query.n1);
        const n2= parseFloat(req.query.n2);
        logger.info(`Addition Requested`); 
        //Call Function
        checknan(n1,n2);
        logger.info(`Doing Addition ${n1} + ${n2}`);
        
        const result = add(n1,n2);
        logger.info(`Final ${result}`);
        res.status(200).json({statuscode:200, data: result });
    } catch(error) {
        console.log(error)
        res.status(500).json({statuscode:500, msg: error.toString() })
    }
});



// Substraction Part-MyRef6.2
app.get("/subtract", passport.authenticate('jwt', { session: false }), (req,res)=>{
    try{
        const n1= parseFloat(req.query.n1);
        const n2= parseFloat(req.query.n2);
        logger.info(`New Substraction requested`);

        checknan(n1,n2);
        logger.info(`Doing Substraction- ${n1} - ${n2}`);
          
        const result = subtract(n1,n2);
        logger.info(`Final- ${result}`);
        res.status(200).json({statuscode:200, data: result });
    } catch(error) {
        console.log(error)
        res.status(500).json({statuscode:500, msg: error.toString() })
    }
});


//Multiplication Part-MyRef 6.3
app.get("/Multiplication", passport.authenticate('jwt', { session: false }), (req,res)=>{
    try{

        const n1= parseFloat(req.query.n1);
        const n2= parseFloat(req.query.n2);
        logger.info(`Multiplication Requested`);

        checknan(n1,n2);
        logger.info(`Doing multiplication- ${n1} * ${n2}`);
        
        const result = multiply(n1,n2);
        logger.info(`Final- ${result}`);
        res.status(200).json({statuscode:200, data: result });
    } catch(error) {

        console.log(error)
        res.status(500).json({statuscode:500, msg: error.toString() })
    }
});



//Division Part-MyRef 6.4
app.get("/divide", passport.authenticate('jwt', { session: false }), (req,res)=>{
    try{

        const n1= parseFloat(req.query.n1);
        const n2= parseFloat(req.query.n2);
        logger.info(`Division Requested`);

        checknan(n1,n2);

        if (n1 == 0 || n2 == 0) {
            console.log()
            logger.error("Not Defined");
            throw new Error("Not Defined");
        }
        logger.info(`Doing Devision- ${n1} * ${n2}`);

        const result = divide(n1,n2);
        logger.info(`Final- ${result}`);
        res.status(200).json({statuscode:200, data: result });
    } catch(error) {

        console.log(error)
        res.status(500).json({statuscode:500, msg: error.toString() })
    }
});

// As mentioned in previous week's Task, I have to use new ports everytime for new Tasks
app.listen(1000, () => console.log("Listening to port 1000"));




// Please ignore the term 'MyRef' as it is just for my reference while writing and understanding code so that it is sorted for me