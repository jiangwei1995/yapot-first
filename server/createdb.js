var server = require('./server');
var ds = server.dataSources.mysql;
//var lbTables = ['Member', 'Token','Journalism','HomeBanner','Advantage','AboutBanner','Medium'];
var lbTables = ['Journalism'];

ds.automigrate(lbTables, function(er) {
  if (er) throw er;
  console.log('Loopback tables [' + lbTables + '] created in ', ds.adapter.name);
  ds.disconnect();
});
