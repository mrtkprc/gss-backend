const mongoose = require('mongoose');

module.exports = () => {
  mongoose.connect("mongodb://omer_recep:ORKebru15@ds111993.mlab.com:11993/gss_sensor_records",{useNewUrlParser:true});
  mongoose.connection.on('open',() => {
     console.log('MongoDB: Connected');
  });
  mongoose.connection.on('error',(err) => {
     console.log('MongoDB: Err',err);
  });
};