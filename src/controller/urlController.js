const urlModel = require("../models/url")
const { nanoid } = require('nanoid')
const redis = require("redis")
const { promisify } = require("util");

const isvalid = function (value) {
    if (typeof value == undefined || typeof value == null) { return false }
    if (typeof value == 'string' && value.trim().length == 0) { return false }
    return true

}

const re = /(http|ftp|https):\/\/[\w-]+(\.[\w-]+)+([\w.,@?^=%&amp;:\/~+#-]*[\w@?^=%&amp;\/~+#-])?/

const redisClient = redis.createClient(
    16368,
    "redis-16368.c15.us-east-1-2.ec2.cloud.redislabs.com",
    { no_ready_check: true }
);
redisClient.auth("Y52LH5DG1XbiVCkNC2G65MvOFswvQCRQ", function (err) {
    if (err) throw err.message;
});

redisClient.on("connect", async function () {
    console.log("Connected to Redis..");
});

const SET_ASYNC = promisify(redisClient.SET).bind(redisClient);
const GET_ASYNC = promisify(redisClient.GET).bind(redisClient);


const posturl = async function (req, res) {


    try {
        if (Object.keys(req.body).length == 0) {
            return res.status(400).send({ Status: false, msg: "Provide input" })
        }

        let longUrl = req.body.longUrl
        let urlMain = longUrl.trim()
        
        if (!isvalid(longUrl)) {
            return res.status(400).send({ Status: false, ERROR: "Please provide a url field and enter url" })
        }
       
        if (!re.test(longUrl)) { return res.status(400).send({ Status: false, msg: "Please provide a valid url" }) }
        
        let cachedUrlData = await GET_ASYNC(urlMain)
        if(cachedUrlData){return res.status(200).send({Status:true , Data: JSON.parse(cachedUrlData)})}
        console.log(cachedUrlData)
       

        const urlCode = nanoid() //unique
        const short = urlCode.toLowerCase()

        shortUrl = 'localhost:3000/' + short
        data = { longUrl: longUrl, shortUrl: shortUrl, urlCode: urlCode }

        let urlData = await urlModel.create(data)

        let seturl = await SET_ASYNC(short,urlMain) 
        
        console.log(seturl)
        await SET_ASYNC(urlMain,JSON.stringify(urlData),"EX",30) 


        return res.status(201).send({ Status: true, msg: urlData })

    } catch (err) {
        return res.status(500).send({ Status: false, ERROR: err.message })
    }



}



const redUrl = async function (req, res) {
    try {
        let urlCode = req.params.urlCode.toLowerCase().trim()
        const cahcedLongUrl = await GET_ASYNC(urlCode)
        console.log(cahcedLongUrl)

        if(cahcedLongUrl){return res.status(302).redirect(cahcedLongUrl)}

        let correctUrlcode = await urlModel.findOne({ urlCode: urlCode })
        if (!correctUrlcode) {
            return res.status(404).send({ Status: false, msg: "URL not found. Please enter correct url code" })
        }
        else {
            return res.status(302).redirect(correctUrlcode.longUrl)
        }

    } catch (err) {

        return res.status(500).send({ Status: false, ERROR: err.message })
    }

}

module.exports.posturl = posturl
module.exports.redUrl = redUrl