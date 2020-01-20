const db=require('./connection')

function indexModel()
{
    this.registerUser=(userDetails)=>{
     return new Promise((resolve,reject)=>{
         db.collection('register').find().toArray((err,result)=>{
             var regid
             
             if(result.length>0)
             {
                 regid=result[0].regid
                 for(let i=1;i<result.length;i++)
                 {
                     if(regid<result[i].regid)
                     regid=result[i].regid
                 }
             }
             else 
             regid=0

             userDetails.role='user'
             userDetails.status=parseInt(0)
             userDetails.regid=regid+1

             db.collection('register').insertOne(userDetails,(err,result)=>{
                 err ? reject(err) : resolve(result);
             })
         })
     })   
    }

    this.userLogin=(email,password)=>{
        return new Promise((resolve,reject)=>{
            var userDetails={}
            userDetails.email=email
            userDetails.password=password
            userDetails.status=1
            db.collection('register').find(userDetails).toArray((err,result)=>{
                err ? reject(err) : resolve(result);			
            })
        })	
}


 this.fetchAll=(collection_name)=>{
        return new Promise((resolve,reject)=>{
            db.collection(collection_name).find().toArray((err,result)=>{
                err ? reject(err) : resolve(result);			
            })
        })	
}


this.fetchSubCategory=(catnm)=>{
        return new Promise((resolve,reject)=>{
            db.collection("subcategory").find({'catnm':catnm}).toArray((err,result)=>{
                err ? reject(err) : resolve(result);			
            })
        })	
}

this.fetchlocation=(scnm)=>{
    return new Promise((resolve,reject)=>{
        db.collection("searchlocation").find({'subcategory':scnm}).toArray((err,result)=>{
            err ? reject(err) : resolve(result);			
        })
    })	
}


this.fetchlocality=(c)=>{
    return new Promise((resolve,reject)=>{
        db.collection("location").find({'City':c}).toArray((err,result)=>{
            err ? reject(err) : resolve(result);			
        })
    })	
}


this.verifyuser=(uid)=>{
    return new Promise((resolve,reject)=>{
        db.collection('register').update({'email':uid},{$set:{'status':1}},(err,result)=>{
            err ? reject(err) : resolve(result);

        })
    })
}


this.fetchlocationnew=(localitynm,scnm)=>{
    return new Promise((resolve,reject)=>{
        db.collection("searchlocation").find({'subcategory':scnm,'locality':localitynm,'s':1}).toArray((err,result)=>{
            err ? reject(err) : resolve(result);			
        })
    })	
}

}

  
module.exports=new indexModel()
