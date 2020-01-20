const db=require('./connection')

function userModel()
{
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

    this.fetchlocality=(c)=>{
         return new Promise((resolve,reject)=>{
			 console.log(c)
             db.collection("location").find({'city':c}).toArray((err,result)=>{
                 err ? reject(err) : resolve(result);
                 
             })
         })
    }
    
	this.addlocation=(locationdetails,file1nm,file2nm,file3nm,file4nm,uid)=>{
		return new Promise((resolve,reject)=>{
 			db.collection('searchlocation').find().toArray((err,result)=>{
 					var locationid
 					if(result.length>0)
 					{
 						locationid=result[0].locationid
 						for(let i=1;i<result.length;i++)
 						{
 						 if(locationid<result[i].locationid)
 						 		locationid=result[i].locationid
 						}
 					}
 					else
 						locationid=0
 		
 					locationdetails.locationid=locationid+1
 					locationdetails.file1nm=file1nm
 					locationdetails.file2nm=file2nm
 					locationdetails.file3nm=file3nm			
					 locationdetails.file4nm=file4nm
					 locationdetails.s=0
 					locationdetails.uid=uid
 							
 					db.collection('searchlocation').insertOne(locationdetails,(err,result)=>{
 						err ? reject(err) : resolve(result);	
 					})
 			})
 			
 			
 		})			
	}
}


module.exports=new userModel()