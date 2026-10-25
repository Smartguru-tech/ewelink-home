const express = require('express');
const eWeLink = require('ewelink-api');
const app = express();
app.use(express.json());
app.use(express.static('public'));

const MY_EMAIL = "archassangiwa@gmail.com";
const MY_PASSWORD = "Giwa@123";
let conn;
async function getConn(){
 if(conn) return conn;
 conn = new eWeLink({email: MY_EMAIL, password: MY_PASSWORD, region: "eu"});
 await conn.getCredentials();
 return conn;
}
app.get('/api/devices', async (req,res)=>{
 try{
  let c=await getConn(); let d=await c.getDevices();
  res.json(d.map(x=>({id:x.deviceid, name:x.name, online:x.online})));
 }catch(e){ res.json({error:e.message}); }
});
app.post('/api/device/:id/:action', async (req,res)=>{
 let c=await getConn(); await c.setDevicePowerState(req.params.id, req.params.action);
 res.json({ok:true});
});
app.listen(3000, ()=>console.log("Running"));
