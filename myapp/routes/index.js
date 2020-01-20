const express = require('express');
const url=require('url');
const cryptoapi=require('./cryptoapi')
const sendMyMail=require('./mailapi')
const locationapi=require('./locationapi')
const indexModel=require('../model/indexModel');
const router = express.Router();

/*Middleware to check user details in cookie */
var mycunm=undefined
var mycpass=undefined
router.use('/login',(req,res,next)=>{
  if(req.cookies.mycunm!=undefined)
  {
    mycunm=req.cookies.mycunm
    mycpass=cryptoapi.decrypt(req.cookies.mycpass)
  }
  else {
  mycunm=""
  mycpass=""
  }
  next()

});

/*GET home page */
router.get('/',(req,res,next)=>{
  indexModel.fetchAll('category').then((result)=>{
    res.render('index',{'clist':result});
  }).catch((err)=>{
    console.log(err)
  })
});


router.get('/showsubcat',(req,res,next)=>{
  const catnm=url.parse(req.url,true).query.cnm
  indexModel.fetchSubCategory(catnm).then((result)=>{
    console.log(result)
    res.render('showsubcat',{'catnm':catnm,'sclist':result});
  }).catch((err)=>{
    console.log(err)
  });
});


router.get('/showlocation',(req,res,next)=>{
  const scnm=url.parse(req.url,true).query.scnm
  const statelist=locationapi.fetchstate()
  indexModel.fetchlocation(scnm).then((result)=>{
  		console.log(result)
      res.render('showlocation',{'scnm':scnm,'locationlist':result,'statelist':statelist});
  }).catch((err)=>{
      console.log(err)
  })
});

router.get('/fetchcity',function(req, res, next) {
  var s=url.parse(req.url,true).query.s
  var citylist=locationapi.fetchcity(s)
   res.json({'citylist':citylist})
})


router.get('/fetchlocality',function(req, res, next) {
  var c=url.parse(req.url,true).query.c
  indexModel.fetchlocality(c).then((result)=>{
    	res.json(result)
  }).catch((err)=>{	
  	console.log(err)
  })
})


router.get('/fetchlocation',function(req, res, next) {
  var obj=url.parse(req.url,true).query
  indexModel.fetchlocationnew(obj.localitynm,obj.scnm).then((result)=>{
  			var tbl_str=""	
		for(let row of result) {
tbl_str+="<table class='table table-bordered' height='100px'><tr><td  rowspan='3' width='30%'><img src='../locationicon/"+row.file1nm+"' height='100' width='100' /></td><td><b>Title : </b>"+row.title+"</td> </tr><tr><td><b>Description : </b>"+row.description+"</td></tr><tr><td><b>Address : </b>"+row.address+"</td></tr></table><hr>"
}
			

  	res.json({'tbl_str':tbl_str})
  
  }).catch((err)=>{	
  	console.log(err)
  })
})



/* GET home page. */
router.get('/',(req, res, next)=> {
  res.render('index');
});

router.get('/about',(req, res, next)=> {
  res.render('about');
});

router.get('/contact',(req, res, next)=> {
  res.render('contact');
});

router.get('/service',(req, res, next) =>{
  res.render('service');
});

router.get('/register',(req,res,next) =>{
  res.render('register',{'output':''});
});

router.post('/register',(req,res,next)=>{
  var userDetails=req.body
  indexModel.registerUser(userDetails).then((result)=>{
    sendMyMail(userDetails.email,userDetails.password,()=>{
      res.render('register',{'output':'User registered successfully'});
    })
  }).catch((err)=>{
    console.log(err)

  })
});

router.get('/verifyuser',(req,res,next)=>{
  var uid=url.parse(req.url,true).query.uid
  indexModel.verifyuser(uid).then((result)=>{
   console.log("user verified")
   res.redirect('/login')
  }).catch((err)=>{
    console.log(err)
  })
})

router.get('/login',(req,res,next)=>{
  res.render('login',{'mycunm':mycunm,'mycpass':mycpass,'output':''});
});
router.post('/login',(req,res,next)=>{
  indexModel.userLogin(req.body.email,req.body.password).then((result)=>{
    if(result.length>0)
    {
      /* store user details in session */
      req.session.sunm=result[0].email
      req.session.srole=result[0].role
      
      /*store user details in cokies */
      if(req.body.chk!=undefined)
      {
        res.cookie("mycunm",req.body.email,{'maxAge':3600000})
        res.cookie("mycpass",cryptoapi.encrypt(req.body.password),{'maxAge':3600000})
      }
       
   
      if(result[0].role=='user')
      res.redirect('/users')
      if(result[0].role=='admin')
      res.redirect('/admin')
    }

    else 
    res.render('login',{'output':'login failed, please try again...'})
 }).catch((err)=>{
   console.log(err)
 })
});
router.get('/logout',(req,res,next)=>{
  req.session.destroy()
  res.redirect('/login')
});
module.exports = router;
