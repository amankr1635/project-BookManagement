const aws = require("aws-sdk")
aws.config.update({
  
    accessKeyId:"AKIAY3L35MCRZNIRGT6N",
    secretAccessKey:"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",
    region:"ap-south-1"
  })



    let uploadFile= async ( file) =>{
        return new Promise( function(resolve, reject) {
         // this function will upload file to aws and return the link
         let s3= new aws.S3({apiVersion: '2006-03-01'}); // we will be using the s3 service of aws
     
         var uploadParams= {
             ACL: "public-read",
             Bucket: "classroom-training-bucket",  //HERE
             Key: "BookManagement/" + file.originalname, //HERE 
             Body: file.buffer
         }
     
     
         s3.upload( uploadParams, function (err, data ){
             if(err) {
                 return reject({"error": err})
             }
             console.log(data)
             console.log("file uploaded succesfully")
             return resolve(data.Location)
         })
     
         // let data= await s3.upload( uploadParams)
         // if( data) return data.Location
         // else return "there is an error"
     
        })
     }
     
let awsUpload = async function(req, res){
     
    try{
        let files= req.files
        if(files && files.length>0){
            //upload to s3 and get the uploaded link
            // res.send the link back to frontend/postman
            let uploadedFileURL= await uploadFile( files[0] )
            res.status(201).send({msg: "file uploaded succesfully", data: uploadedFileURL})
        }
        else{
            res.status(400).send({ msg: "No file found" })
        }
        
    }
    catch(err){
        res.status(500).send({msg: err})
    }
    
}
//module.exports.awsUpload = awsUpload


















// try{
// let uploadFiles=  (file)=>{
//     return new Promise(function(resolve,reject){
//      let s3 = new aws.S3({apiVersion: '2006-03-01'})

//      var uploadparams = {
//       ACL : "public-read",
//       Bucket : "ABAA-bucket",
//       Key : "BookMangement/" + file.originalname,
//       Body : file.buffer
//      }
    
//      s3.upload(uploadparams,function(err,data){
//       if(err) return reject({"error":err})
      
//       console.log(data)
//       console.log("file uploaded successfully")
//       return resolve(data.Location)
//      })

//     })
//     }

//     let files=req.files;
//     if(files && files.length>0){
//      let uploadedFileUrl = await uploadFiles(files[0])
//       return res.status(201).send({status:true, message:"File Uploaded Successfully", data: uploadedFileUrl})
//     }
//     else{
//       return res.status(400).send({status:false,message:"Please Enter file"})
//     }
// // }
// // catch(err){
// //     return res.status(500).send({error:err.message})
// // }
// }

//     
