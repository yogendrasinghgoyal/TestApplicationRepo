const crypto = require('crypto');

function cryptoapi()
{
	this.encrypt=(data)=>{
		var mykey = crypto.createCipher('aes-128-cbc', 'mypassword');
		var mystr = mykey.update(data, 'utf8', 'hex')
		mystr += mykey.final('hex');
		return mystr
	}
	this.decrypt=(encdata)=>{
		var mykey = crypto.createDecipher('aes-128-cbc', 'mypassword');
		var mystr = mykey.update(encdata, 'hex', 'utf8')	
		mystr += mykey.final('utf8');
		return mystr
	}
}


module.exports=new cryptoapi()

