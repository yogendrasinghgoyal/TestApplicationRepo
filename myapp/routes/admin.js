const express = require('express');
const url=require('url');
const path=require('path')
const adminModel=require('../model/adminModel');
const router = express.Router();


/* Middleware function to check user*/
router.use((req,res,next)=>{
    if(req.session.sunm==undefined || req.session.srole!='admin')
    {
        console.log("Invalid user please login first,ID tracking")
        res.redirect('/login')
    }
    next()
}) 


/* Middleware function to fetch category list */
var clist
router.use('/addsubcat',(req,res,next)=>{
    adminModel.fetchAll("category").then((result)=>{
        //console.log(result)
        clist=result
        next()
    }).catch((err)=>{
        console.log(err)
    })
})

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.render('adminhome',{'sunm':req.session.sunm});
});

router.get('/manageusers', function(req,res,next) {
adminModel.fetchuser().then((result)=>{
    //console.log(result)
    res.render('manageusers',{'sunm':req.session.sunm,'result':result});
}).catch((err)=>{
    console.log(err)
})
});

router.get('/manageuserstatus', function(req,res,next){
    var sDetails=url.parse(req.url,true).query
    adminModel.manageuserstatus(sDetails).then((result)=>{
        res.redirect('/admin/manageusers')
    }).catch((err)=>{
        console.log(err)
    })
});

router.get('/addcat', function(req,res,next) {
res.render('addcat',{ 'sunm':req.session.sunm,'output':''});
});
router.post('/addcat',function(req,res,next) {
    var catnm=req.body.catnm
    var caticon=req.files.caticon
    var caticonnm=caticon.name
    var caticondes=path.join(__dirname,"../public/caticon",caticonnm)
    caticon.mv(caticondes)
    adminModel.addcat(catnm,caticonnm).then((result)=>{
        res.render('addcat',{'sunm':req.session.sunm,'output':'Category added successfully'})
    }).catch((err)=>{
        console.log(err)
    })
});

router.get('/addsubcat',function(req,res,next) {
    res.render('addsubcat',{'sunm':req.session.sunm,'clist':clist,'output':''});
    });
    router.post('/addsubcat',function(req,res,next) {
        var catnm=req.body.catnm
        var subcatnm=req.body.subcatnm
        var caticon=req.files.caticon
        var caticonnm=caticon.name
        var caticondes=path.join(__dirname,"../public/subcaticon",caticonnm)
        caticon.mv(caticondes)

        adminModel.addsubcat(catnm,subcatnm ,caticonnm).then((result)=>{
            res.render('addsubcat',{'sunm':req.session.sunm,'clist':clist,'output':' Sub Category added successfully'})
        }).catch((err)=>{
            console.log(err)
        })
    });


    router.get('/cpassadmin', function(req,res,next) {
        res.render('cpassadmin',{'sunm':req.session.sunm ,'output':''});
    });

    router.post('/cpassadmin', function(req,res,next) {
        adminModel.cpassadmin(req.body).then((result)=>{
            if(result.length>0)
            {
                if(req.body.npass==req.body.cnpass)
                  {
                      adminModel.updatepassword(req.body).then((result)=>{
                          res.render('cpassadmin',{'sunm':req.session.sunm,'output':'password changed successfully...'});

                      }).catch((err)=>{
                          console.log(err)
                      })                      
                  }
                  else
                  res.render('cpassadmin',{'sunm':req.session.sunm,'output':'New and Confirm new password mismatch, Please try again'})
                }
                else
                res.render('cpassadmin',{'sunm':req.session.sunm,'output':'Invalid old password, Please try again'});
        }).catch((err)=>{
           console.log(err)
        })
             

            
        
    });

module.exports = router;
