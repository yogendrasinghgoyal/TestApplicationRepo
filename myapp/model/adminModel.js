const db=require('./connection') 


function adminModel()
{
    this.fetchAll=(collection_name)=>{
        return new Promise((resolve,reject)=>{
            db.collection(collection_name).find().toArray((err,result)=>{
                err ? reject(err) : resolve(result);
            })
        })
    }
    this.fetchuser=()=>{
        return new Promise((resolve,reject)=>{
            db.collection('register').find({'role':'user'}).toArray((err,result)=>{
                err ? reject(err) : resolve(result);

            })
        })
    }

    this.cpassadmin=(cpassdetails)=>{
        return new Promise((resolve,reject)=>{
            db.collection('register').find({'email': cpassdetails.email,'password': cpassdetails.opass}).toArray((err,result)=>{
                err ? reject(err) : resolve(result);
            })
        })
    }

    this.updatepassword=(cpassdetails)=>{
        return new Promise((resolve,reject)=>{
            db.collection('register').update({'email':cpassdetails.email},{$set:{'password':cpassdetails.cnpass}},(err,result)=>{
                err ? reject(err) : resolve(result);
                
            })
        })
    }
    this.manageuserstatus=(sDetails)=>{
    console.log(sDetails)
        if(sDetails.s=='unblock')
        {
            return new Promise((resolve,reject)=>{
            db.collection('register').update({'regid':parseInt(sDetails.regid)},{$set:{'status':1}},(err,result)=>{
                    err ? reject(err) : resolve(result)

                })
            })
        }
        else if(sDetails.s=='block')
        {
         return new Promise((resolve,reject)=>{
            db.collection('register').update({'regid':parseInt(sDetails.regid)},{$set:{'status':0}},(err,result)=>{
                 err ? reject(err) : resolve(result);
             })
         })   
        }
        else
        {
            return new Promise((resolve,reject)=>{
                db.collection('register').remove({'regid':parseInt(sDetails.regid)},(err,result)=>{
                   err ? reject(err) : resolve(result);
                })

                
            })
        }
    }
    this.addcat=(catnm,caticonnm)=>{
        return new Promise((resolve,reject)=>{
            db.collection('category').find().toArray((err,result)=>{
                var catid
                console.log(result.reqid)
                if(result.length>0)
                {
                    catid=result[0].catid
                    for(let i=1;i<result.length;i++)
                    {
                        if(catid<result[i].catid)
                        catid=result[i].catid
                    }
                }
                else
                catid=0

                cDetails={}
                cDetails.catid=catid+1
                cDetails.catnm=catnm
                cDetails.caticonnm=caticonnm
                
                
                db.collection('category').insertOne(cDetails,(err,result)=>{
                    err ? reject(err) : resolve(result);
                })
            })
        })
    }
    this.addsubcat=(catnm,subcatnm,caticonnm)=>{
        return new Promise((resolve,reject)=>{
            db.collection('subcategory').find().toArray((err,result)=>{
                var subcatid
                if(result.length>0)
                {
                    subcatid=result[0].subcatid
                    for(let i=1;i<result.length;i++)
                    {
                        if(subcatid<result[i].subcatid)
                        subcatid=result[i].subcatid
                    }
                }
                else
                subcatid=0

                scDetails={}
                scDetails.subcatid=subcatid+1
                scDetails.subcatnm=subcatnm
                scDetails.catnm=catnm
                scDetails.subcaticonnm=caticonnm
                
                
                db.collection('subcategory').insertOne(scDetails,(err,result)=>{
                    err ? reject(err) : resolve(result);
                })
            })
        })
    }
}


module.exports=new adminModel()
