const express = require('express');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const router = express.Router();
require('../config/passport')(passport);
// const Product = require('../models').Product;
const User = require('../models').User;
const Survey = require('../models').Surveys;
const Answer = require('../models').Answers;
const Reports = require('../models').Reports;
const links_statistics = require('../models').links_statistics;
const db = require('../models');



const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/config.json')[env];
const testData = require(__dirname + '/../config/data.json');
const testDataIncalzite = require(__dirname + '/../config/data_incalzite.json');
const testDataLichide = require(__dirname + '/../config/data_lichid.json');
var _ = require('lodash');
const authorize = require('../_helpers/authorize');
const Sequelize = require('sequelize');
// const https = require('https');
const axios = require('axios');
const qs = require('querystring');




var crypto = require('crypto');


router.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  if (req.method === 'OPTIONS') {
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH');
    return res.status(200).json({});
  };
  next();
});


router.post('/signup', function (req, res) {
  console.log(req.body);
  if (!req.body.username || !req.body.password) {
    res.status(400).send({
      msg: 'Please pass username and password.'
    })
  } else {
    User
      .create({
        username: req.body.username,
        password: req.body.password,
        role:1,
        metaData:'{}',
        flags:1
      })
      .then((user) => res.status(201).send(user))
      .catch((error) => {
        console.log(error);
        res.status(400).send(error);
      });
  }
});

router.post('/signin', function (req, res) {
  User
    .find({
      where: {
        username: req.body.username
      }
    })
    .then((user) => {
      if (!user) {
        return res.status(401).send({
          message: 'Authentication failed. User not found.',
        });
      }
      user.comparePassword(req.body.password, (err, isMatch) => {
        if (isMatch && !err) {
          var token = jwt.sign(JSON.parse(JSON.stringify(user)), config.jwtSecret, {
            expiresIn: 86400 * 30
          });
          jwt.verify(token, config.jwtSecret, function (err, data) {
            console.log(err, data);
          })
          res.json({
            success: true,
            token: 'JWT ' + token,
            orr:user.role
          });
        } else {
          res.status(401).send({
            success: false,
            msg: 'Authentication failed. Wrong password.'
          });
        }
      })
    })
    .catch((error) => res.status(400).send(error));
});

router.post('/survey/list', passport.authenticate('jwt', {
  session: false
}),
authorize([1,2]),
 function (req, res) {
  var token = getToken(req.headers);
  if (token) {
    Survey
      .findAll()
      .then((surveys) => res.status(200).send(surveys))
      .catch((error) => {
        res.status(400).send(error);
      });
  } else {
    return res.status(403).send({
      success: false,
      msg: 'Unauthorized.'
    });
  }
});

router.post('/survey/get',
  // passport.authenticate('jwt', { session: false}),
  function (req, res) {
    var token = getToken(req.headers);
    if(token){}else{
      console.log(config.crypto.algorithm, config.crypto.key);
      
      var decipher = crypto.createDecipher(config.crypto.algorithm, config.crypto.key);
      var decrypted = decipher.update(req.body.id, 'hex', 'utf8') + decipher.final('utf8');
      console.log(decrypted);
      var encObj =JSON.parse(decrypted);
      console.log(encObj);

      req.body.id = encObj.survey_id;
    }
    Survey
      .findByPk(req.body.id)
      .then((surveys) => {
        if (token) {
          res.status(200).send(surveys);
        } else {
          if(surveys.status==2){
            res.status(200).send(surveys);
          }else
          return res.status(403).send({success: false, msg: 'Survey is not Active !'});
        }
       
      })
      .catch((error) => {
        res.status(400).send(error);
      });
     
   
  });

  
  router.post('/answer/find-by-survey',
  passport.authenticate('jwt', { session: false}),
  function (req, res) {
    Answer
    .findAll({
      where: {
        survey_id: req.body.survey_id+''
      }
    })
      .then((answer) => {
            res.status(200).send(answer);
       
      })
      .catch((error) => {
        res.status(400).send(error);
      });
      var token = getToken(req.headers);
   
  });

  router.post('/answer/get',
  // passport.authenticate('jwt', { session: false}),
  function (req, res) {
    var token = getToken(req.headers);
    var that=this;
    if (token) {

    }else{
    var decipher = crypto.createDecipher(config.crypto.algorithm, config.crypto.key);
    var decrypted = decipher.update(req.body.survey_id, 'hex', 'utf8') + decipher.final('utf8');
    req.body.survey_id=JSON.parse(decrypted).survey_id+'';
    req.body.consumer_id=JSON.parse(decrypted).consumer_id+'';
    }
    Answer
    .findOne({
      where: {
        survey_id: req.body.survey_id,
        consumer_id:req.body.consumer_id
      }
    })
      .then((answer) => {
        // console.log('PROGRES==>',answer.progress);
        // if (token) {
        //   res.status(200).send(surveys);
        // } else {
          if(answer.progress!=100){
            res.status(200).send(answer);
          }else{
            return res.status(403).send({success: false, msg: 'Survey Completed Once'});
        }
       
      })
      .catch((error) => {
        res.status(400).send(error);
      });
      var token = getToken(req.headers);
   
  });

  router.post('/reports/get',
  passport.authenticate('jwt', {
    session: false
  }),
  authorize([2]),
  function (req, res) {
    Reports
    .findOne({
      where: {
        survey_id: req.body.survey_id
      }
    })
      .then((report) => {
  
            res.status(200).send(report);
      })
      .catch((error) => {
        res.status(400).send(error);
      });
      var token = getToken(req.headers);
   
  });

  router.post('/reports/accessed-times-count',
  // passport.authenticate('jwt', {
  //   session: false
  // }),
  // authorize([2]),
  function (req, res) {
    let surveyId=req.body.survey_id;
    db.sequelize
    .query("select sum(mici) m,sum(medii) me,sum(mari) ma from ( "+
    "select count(*) as mici,0 as medii,0 as mari from \"Answers\" a "+
    "where survey_id='"+surveyId+"' "+
   "and accessed::INTEGER < 5 "+
    "union "+
    "select 0 as mici, count(*) as medii,0 as mari from \"Answers\" a "+
   "where  survey_id='"+surveyId+"' "+
    "and accessed::INTEGER > 5 "+
    "and accessed::INTEGER < 10 " +
    "union "+
    "select 0 as mici,0 as medii, count(*) as mari from \"Answers\" a "+
    "where survey_id='"+surveyId+"' "+
    "and  accessed::INTEGER > 10 ) cr ",
     { type: db.sequelize.QueryTypes.SELECT})
      .then((report) => {
            res.status(200).send(report);
      })
      .catch((error) => {
        res.status(400).send(error);
      });
      var token = getToken(req.headers);
   
  });

  
  router.get('/data/brands',
  // passport.authenticate('jwt', { session: false}),
  function (req, res) {

  var tst =testData
  var grouped = _.groupBy(tst, function(item) {
    return item.Brand;
  });
  console.log(Object.keys(grouped));
  res.status(200).send(Object.keys(grouped));
   
  });
  router.get('/data/brands-incalzite',
  // passport.authenticate('jwt', { session: false}),
  function (req, res) {
  var tst =testDataIncalzite;
  var grouped = _.groupBy(tst, function(item) {
    return item.Brand;
  });
  console.log(Object.keys(grouped));
  res.status(200).send(Object.keys(grouped));
   
  });
  router.get('/data/brands-lichide',
  // passport.authenticate('jwt', { session: false}),
  function (req, res) {
  var tst =testDataLichide;
  var grouped = _.groupBy(tst, function(item) {
    return item.Brand;
  });
  console.log(Object.keys(grouped));
  res.status(200).send(Object.keys(grouped));
   
  });

  router.post('/data/sku',
  // passport.authenticate('jwt', { session: false}),
  function (req, res) {

  var tst1 =testData.concat(testDataIncalzite);
  var tst =tst1.concat(testDataLichide);

  var grouped = _.groupBy(tst, function(item) {
    return item.Brand;
  });
  res.status(200).send(grouped[req.body.brand]);
   
  });

  getTotalNoQuestion = function(survey){
    var pages =survey.pages;
    let qs=0;
    try{
        for(let idx=0; idx < pages.length ; idx++){
          qs+=pages[idx].elements.length;
        }
    }catch(ex){

    }
    return qs;
 }

router.post('/survey/save', passport.authenticate('jwt', {
  session: false
}), function (req, res) {
  var token = getToken(req.headers);
  var that=this;
  if (token) {
    Survey
      .create(req.body)
      .then((survey) =>{ 
        let qNo = that.getTotalNoQuestion(JSON.parse(survey.form));
        console.log('===---===',survey.form);
        let now = new Date();
        Reports
        .create({
          survey_id:survey.id,
          params:JSON.stringify({
            question_no:qNo
          }),
          generated_links:0,
          accessed_links:0,
          survey_finished:0,
          createdAt:now,
          updatedAt:now,
          flags:'1'
        })
        .then((survey) =>{ 
            res.status(201).send(survey)
         });
      })
      .catch((error) => res.status(400).send(error));
  } else {
    return res.status(403).send({
      success: false,
      msg: 'Unauthorized.'
    });
  }
});

router.post('/survey/update', passport.authenticate('jwt', {
  session: false
}), 
authorize([1]),
function (req, res) {
  var token = getToken(req.headers);
  if (token) {
    Survey
      .update(req.body.survey, {
        where: {
          id: req.body.id
        }
      })
      .then(num => {
        if (num == 1) {
          res.send({
            message: "Tutorial was updated successfully."
          });
        } else {
          res.send({
            message: `Cannot update Tutorial with id=${id}. Maybe Tutorial was not found or req.body is empty!`
          });
        }
      })
      .catch((error) => res.status(400).send(error));
  } else {
    return res.status(403).send({
      success: false,
      msg: 'Unauthorized.'
    });
  }
});

router.post('/answer/save',
  // passport.authenticate('jwt', { session: false}),
  function (req, res) {
    var token = getToken(req.headers);
    if (token) { return res.status(304)}
      var decipher = crypto.createDecipher(config.crypto.algorithm, config.crypto.key);
      var decrypted = decipher.update(req.body.survey_id, 'hex', 'utf8') + decipher.final('utf8');
      req.body.survey_id=JSON.parse(decrypted).survey_id+'';
      req.body.consumer_id=JSON.parse(decrypted).consumer_id+''

      var body =req.body;
      links_statistics
      .find({
        where: {
          survey_id:  req.body.survey_id,
          consumer_id:req.body.consumer_id
        }
      })
      .then((stat) => {
        links_statistics
        .update({
          progress:parseInt(body.progress),
          updatedAt:body.createdAt
        }, {
          where: {
            id: stat.id
          }
        })
        .then(num => {})
      });
      Answer
      .find({
        where: {
          survey_id:  req.body.survey_id,
          consumer_id:req.body.consumer_id
        }
      })
      .then((answer) => {
        if(answer){
          Answer
          .update({
            answer:body.answer,
            progress:body.progress+'',
            updatedAt:body.createdAt
          }, {
            where: {
              id: answer.id
            }
          })
          .then(num => {
            if (num == 1) {
              res.send({
                message: "Answer was updated successfully."
              });
            } else {
              res.send({
                message: `Cannot update Answer with id=${id}. Maybe Answer was not found or req.body is empty!`
              });
            }
          })
          .catch((error) => res.status(400).send(error));
        }else{
          Answer
            .create(req.body)
            .then((answer) => res.status(201).send(answer))
            .catch((error) => res.status(400).send(error));
              }
      });

   
    // } else {
    //   return res.status(403).send({success: false, msg: 'Unauthorized.'});
    // }
  });


  router.post('/answer/update-acces',
  // passport.authenticate('jwt', { session: false}),
  function (req, res) {
      var decipher = crypto.createDecipher(config.crypto.algorithm, config.crypto.key);
      var decrypted = decipher.update(req.body.survey_id, 'hex', 'utf8') + decipher.final('utf8');
      req.body.survey_id=JSON.parse(decrypted).survey_id+'';
      req.body.consumer_id=JSON.parse(decrypted).consumer_id+''

      var body =req.body;
      links_statistics.find({
        where: {
          survey_id:  req.body.survey_id,
          consumer_id:req.body.consumer_id
        }
      })
      .then((stat) => {
        if(stat){
         links_statistics
          .update({
            accessed:parseInt(stat.accessed)+1,
            updatedAt:body.createdAt
          }, {
            where: {
              id: stat.id
            }
          })
          .then(num => {
           
          })
          .catch((error) =>
          console.log(error)
           );
        }})


      Answer
      .find({
        where: {
          survey_id:  req.body.survey_id,
          consumer_id:req.body.consumer_id
        }
      })
      .then((answer) => {
        if(answer){
         let acc =  !answer.accessed?0:answer.accessed;
          Answer
          .update({
            accessed:(parseInt(acc)+1)+'',
            updatedAt:body.createdAt
          }, {
            where: {
              id: answer.id
            }
          })
          .then(num => {
            if (num == 1) {
              res.send({
                message: "Answer was updated successfully."
              });
            } else {
              res.send({
                message: `Cannot update Answer with id=${id}. Maybe Answer was not found or req.body is empty!`
              });
            }
          })
          .catch((error) => res.status(400).send(error));
        }else{
          Answer
            .create({
              survey_id:  req.body.survey_id,
              consumer_id:req.body.consumer_id,
              progress:'0',
              answer:'{}',
              createdAt:req.body.updatedAt,
              updatedAt:req.body.updatedAt,
              accessed:'1',
              flags:'1'
            })
            .then((answer) =>{
try{
              let now = new Date();
              Reports
              .update({
                accessed_links:Sequelize.literal('accessed_links + 1'),
                updatedAt:now
              },{
                where: {
                  survey_id: req.body.survey_id
                }
              })
              .then((survey) =>{ 
              });
            }catch(exxx){
console.log('Exception===',exxx);
            }
             res.status(201).send(answer);
            
            })
            .catch((error) => res.status(400).send(error));
              }
      });

   
    // } else {
    //   return res.status(403).send({success: false, msg: 'Unauthorized.'});
    // }
  });
  router.post('/survey/generate-link-bulk', 
  // passport.authenticate('jwt', {    session: false  }),
   function (req, res) {
    var surveyId=req.body.id;
    var consumerIds = req.body.consumer_ids.split(';');
    var url =req.headers.host;
    var hostnameUrl=url;
    if(url.indexOf(':')>0){
      hostnameUrl = url.split(':')[0];
    }
    let surveys=[];


        Survey
        .findByPk(req.body.id)
        .then((survey) => {
          if(survey.status==2){
            for(var idx=0; idx < consumerIds.length;idx++){
              
    // console.log('consumerids====',idx,consumerIds[idx]);
              if(consumerIds[idx] && consumerIds[idx]!=''){
        
                var cipher = crypto.createCipher(config.crypto.algorithm, config.crypto.key);  
                var encrypted = cipher.update(JSON.stringify({
                  consumer_id:consumerIds[idx],
                  survey_id:surveyId
                }), 'utf8', 'hex') + cipher.final('hex');
                surveys.push({
                  consumer_id:consumerIds[idx],
                  link:hostnameUrl+'/fill-survey/'+encrypted+'/'+consumerIds[idx]
                });
              }

            }
            // console.log('consumerids====',surveys);

                let now = new Date();
                Reports
                .update({
                  generated_links:surveys.length,
                  updatedAt:now
                },{
                  
                  where: {
                    survey_id: surveyId
                  }
                })
                .then((survey) =>{ 
                });
            res.status(200).send(surveys);
          }else{
            res.status(200).send({
              link:'',
              message:'Survey not active!'
            });
          }
       
        })
        .catch((error) => {
          res.status(400).send(error);
        });
         

  });

  router.post('/survey/generate-link', 
  // passport.authenticate('jwt', {    session: false  }),
   function (req, res) {
     var finalResponse = res;

    var url =req.headers.host;
    var hostnameUrl=url;
    if(url.indexOf(':')>0){
      hostnameUrl = url.split(':')[0];
    }
    var isGhilimele=req.body.data.indexOf('""');
    var cleanData;
    var callbackPosition = req.body.data.indexOf('callbackPath');
    if(isGhilimele > -1){
      var lastSubstring = req.body.data.substring(callbackPosition+"callbackPath\":\"".length);
       cleanData = req.body.data.substring(0,callbackPosition+"callbackPath\":\"".length)+lastSubstring.replace('"',"").replace('"',"");
    }else{
      cleanData = req.body.data;
    }
    var data=JSON.parse(cleanData);
    var surveyId=data.id;
    var consumerId = data.consumer_id;
    var domainName = data.domainName;
    var callbackPath = data.callbackPath;
 
   var triggerEventId =data.triggerEventId;
   var subCampaignId = data.subcampaignId;


   var statistics={};
   statistics.consumer_id = consumerId;
   statistics.trigger_event_id = triggerEventId;
   statistics.params = cleanData;
   statistics.date_created = new Date();
   statistics.date_updated = new Date();
   statistics.progress=0;
   statistics.accessed=0;
   statistics.sub_campaign_id=subCampaignId;
   statistics.flags=1;



    var cipher = crypto.createCipher(config.crypto.algorithm, config.crypto.key);  
    var encrypted = cipher.update(JSON.stringify({
      consumer_id:consumerId,
      survey_id:surveyId
    }), 'utf8', 'hex') + cipher.final('hex');

      Survey
      .findByPk(data.id)
      .then((survey) => {
        if(survey.status==2){
          var link = domainName+'/fill-survey/'+encrypted+'/'+consumerId;
          // res.status(200).send({
          //   link:domainName+'/fill-survey/'+encrypted+'/'+consumerId
          // });
          var dataShortLInk ={
            apikey: 'API_KEY_HUB_R6CKNYY443D56JUH49G79H2RST8Q2WZ8',
            url:link,
            callbackurl:callbackPath
          };
          statistics.link=link;
          statistics.survey_id=surveyId;


         
console.log(" HTTP OPTIONS", qs.stringify(dataShortLInk));

const config = {
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded'
  }
}

axios.post('http://fr3.ro/createshortforurl', qs.stringify(dataShortLInk), config)
  .then((result) => {
    statistics.short_url=result.data.shorturl;
    console.log('====SAVE ===>',statistics);
    links_statistics.create(statistics)
   .then((ss) => console.log(ss))
  .catch((error) => {
    console.log(error);
    res.status(400).send(error);
  });
    // Do somthing
    // console.log(`statusCode: ${result.statusCode}`)
    // console.log(result.data)
    finalResponse.status(200).send({
                        link:result.data.shorturl
                      });

  })
  .catch((err) => {
    // Do somthing
  });
//           const options = {
//             hostname: 'fr3.ro',
//             // port: 443,
//             path: '/createshortforurl',
//             method: 'POST',
//             headers: {
//               'Content-Type': 'application/x-www-form-urlencoded',
//               'Content-Length':dataShortLInk.length
//             }
//           }
// console.log(" HTTP OPTIONS",dataShortLInk);
//           const reqShort = https.request(options, resShort => {
//             console.log(`statusCode: ${resShort.statusCode}`)
          
//             resShort.on('data', d => {
//               // process.stdout.write(d)
//               let buff = new Buffer(d);
//               let text = buff.toString('ascii');

//               // var bArr = JSON.parse(JSON.stringify(d));
//               console.log("---------- FINAL RESPONSE",text);
//               finalResponse.status(200).send({
//                   link:d.shorturl
//                 });
//             })
//           })
          
//           reqShort.on('error', error => {
//             console.error(error)
//           })
          
//           reqShort.write(dataShortLInk)
//           reqShort.end();

        }else{
          res.status(200).send({
            link:'',
            message:'Survey not active!'
          });
        }
     
      })
      .catch((error) => {
        res.status(400).send(error);
      });

  });

getToken = function (headers) {
  if (headers && headers.authorization) {
    var parted = headers.authorization.split(' ');
    if (parted.length === 2) {
      return parted[1];
    } else {
      return null;
    }
  } else {
    return null;
  }
};

module.exports = router;