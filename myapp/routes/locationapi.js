const indianCitiesDatabase=require('indian-cities-database')
function locationapi()
{
    this.fetchstate=()=>{
        var cities = indianCitiesDatabase.cities
        var state=[]
        for(let row of cities)
        {
            if(state.length==0)
            state.push(row.state)
            else
            {
                let flag=0
                for(let s of state)
                {
                    if(row.state==s)
                    flag=1
                }
                if(flag==0)
                {
                    if(row.state[0]!="")
                    state.push(row.state)
                }
            }
        }
        return state
    }
    this.fetchcity=(s)=>{
        var cities = indianCitiesDatabase.cities
        var city=[]
        for(let row of cities)
        {
            if(row.state==s)
            city.push(row.city)
        }
        return city

    }
}

module.exports=new locationapi()