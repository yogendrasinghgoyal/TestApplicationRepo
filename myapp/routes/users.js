const express = require('express');
const router = express.Router();
const url =require('url');
const path=require('path')
const locationapi=require('./locationapi')
const userModel=require('../model/userModel')


/*Middleware function to check user */

router.use((req,res,next)=>{
  if(req.session.sunm==undefined || req.session.srole!='user')
  {
    console.log("Invalid user please login first,ID tracking")
    res.redirect('/login')
  }
  next()
})


/*Middleware function to fetch category */
var clist
var statelist
router.use('/addlocation',(req,res,next)=>{
  userModel.fetchAll('category').then((result)=>{
    clist=result
    statelist=locationapi.fetchstate()
    next()
  }).catch((err)=>{
    console.log(err)
  })
})

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.render('userhome',{'sunm':req.session.sunm});
});

router.get('/addlocation', function(req,res,next){
  res.render('addlocation', {'sunm':req.session.sunm,'clist':clist,'statelist':statelist,'output':''});
});

router.post('/addlocation', function(req,res,next){
    var file1=req.files.file1
    var file1nm=Date()+'-'+file1.name
    var file1des=path.join(__dirname,"../public/locationicon",file1nm)
    file1.mv(file1des)
  
    if(req.files.file2!=undefined)
    {
      var file2=req.files.file2
      var file2nm=Date()+'-'+file2.name
        var file2des=path.join(__dirname,"../public/locationicon",file2nm)
       file2.mv(file2des)
    }
    else
      var file2nm="mylogo.png"
      
    if(req.files.file3!=undefined)
    {
      var file3=req.files.file3
      var file3nm=Date()+'-'+file3.name
        var file3des=path.join(__dirname,"../public/locationicon",file3nm)
       file3.mv(file3des)
    }
    else
      var file3nm="mylogo.png"
      
    if(req.files.file4!=undefined)
    {
      var file4=req.files.file4
      var file4nm=Date()+'-'+file4.name
        var file4des=path.join(__dirname,"../public/locationicon",file4nm)
       file4.mv(file4des)
    }
    else
      var file4nm="mylogo.png"		
    userModel.addlocation(req.body,file1nm,file2nm,file3nm,file4nm,req.session.sunm).then((result)=>{
      res.render('addlocation',{'sunm':req.session.sunm,'clist':clist,'statelist':statelist,'output':'Location added successfully'});		
    }).catch((err)=>{
      console.log(err)
    })
  });

  
router.get('/fetchSubCategory', function(req,res,next){
  var cnm=url.parse(req.url,true).query.cnm
  userModel.fetchSubCategory(cnm).then((result)=>{
    res.json(result)
  }).catch((err)=>{
    console.log(err)
  })
})

router.get('/fetchcity', function(req,res,next){
  var s=url.parse(req.url,true).query.s
  var citylist=locationapi.fetchcity(s)
  res.json({'citylist':citylist})
})

router.get('/fetchlocality', function(req,res,next){
  var c=url.parse(req.url,true).query.c
  console.log(c)
  userModel.fetchlocality(c).then((result)=>{
   res.json(result)
  }).catch((err)=>{
    console.log(err)
  })

})


module.exports = router;
