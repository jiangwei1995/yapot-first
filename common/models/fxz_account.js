module.exports = function(Fxz_account) {
    var async = require('async');
    var _ = require('lodash');
    var moment = require('moment');
    //var nodexlsx = require('node-xlsx');

    Fxz_account.getUsers = getUsers;
    function getUsers(callback){
      async.waterfall([
        function(callback){
          existsBirthday(callback);
        }
        ,function(userList, callback){
          computeAge(userList, callback);
        }
        ,function(userList,callback){
          exportXlsx(userList,callback);
        }
      ],function(err, result){
        callback(null,result);
      })
    }
    function existsBirthday(callback){
      Fxz_account.find({"fields":{"reg_data":true,
                                  "telephone":true,
                                  "city":true,
                                  "province":true,
                                  "age":true,
                                  "gnant_num":true,
                                  "pregnant_num":true,
                                  "true_name":true,
                                  "birthday":true,
                                  "pre_period":true,
                                  "id":true,
                                },
                        "where":{"birthday":{"neq":null} }},function(err,data){
       if (err) throw err;
       callback(err,data);
      });
    }
    function computeAge(userList,callback){
       var newList = _.reduce(userList,function(mome,item){
         var str = moment().diff(moment(item.birthday),"year");
         item.age = str;
         mome.push(item);
         return mome;
       },[])
      callback(null,newList);
    }
    function exportXlsx(userList,callback){
      var xlsx = require('node-xlsx');
      var fs = require('fs');
      var title = _.keys(userList[0].__data);
      console.log(title);
      var newUsers = _.reduce(userList,function(pre,curr){
        pre.push([curr.telephone||"",
                  curr.age||"",
                  curr.pregnant_num||"",
                  curr.gnant_num||"",
                  curr.province||"",
                  curr.city||"",
                  curr.true_name||"",
                  curr.birthday||"",
                  curr.pre_period||"",
                  curr.id||""
                 ]);
        return pre;
      },[["电话",
      "年龄",
      "pregnant_num",
      "gnant_num",
      "省份",
      "城市",
      "真实名称",
      "生日",
      "pre_period",
      "用户ID"]]);
      const data = newUsers;
      var file = xlsx.build([{name: "mySheetName", data: data}]);
      fs.writeFileSync('user.xlsx', file, 'binary');
      callback(null,newUsers)
    }
};
