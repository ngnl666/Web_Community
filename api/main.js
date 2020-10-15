/*
    npm init
    npm install mysql
    npm install express
    npm install cors-anywhere
    npm install firebase
*/
var mysql = require('mysql');
var crypto = require('crypto');
var express = require('express');
var firebase = require('firebase');
var bodyParser = require('body-parser');
var app = express();

app.use(bodyParser.json());

/* backend info Start */
var host = "34.105.17.84";
/* backend info End */


/*SQL info Start*/
var con = mysql.createConnection({
        host: "34.105.17.84",
        user: "root",
        password : "406261688",
        database : "Connect_db"
    }
);
/*end*/

/*firebase info*/
firebase.initializeApp({
    apiKey: "AIzaSyB9aOtu6zMpJvd4zCM2gnieXs_GCcrI-1M",
    authDomain: "connect-75496.firebaseapp.com",
    databaseURL: "https://connect-75496.firebaseio.com",
    projectId: "connect-75496",
    messagingSenderId: "656533391360",
    appId: "1:656533391360:web:80a8231428fa84e339b0e5",
});

/*test connect*/
app.get('/api/testConnect',function(req,res){
	res.send("success");
});

/*register api*/
app.post('/api/signup', function(req, res){
    console.log(req.body); 

    var name = req.body.user_name.toString();
    var email = req.body.user_Email.toString();
    var password = req.body.user_password.toString();
    var age = req.body.user_age.toString();
    var gender = req.body.user_gender.toString();

    firebase.auth().createUserWithEmailAndPassword(email, password).then(function() {
        // send Database
        var uid = firebase.auth().currentUser.uid;
        password = aesEncrypt(password, uid);
        var sql = 'insert into Connect_db.user_info(user_id , user_name , user_Email , user_password , user_age , user_gender) value( \"' + uid + '\",\"' + name + '\",\"' + email + '\",\"' + password + '\",' + age + ',\"' +gender + '\")';
        con.query(sql, function(err, result) {
            if (err) throw err;
        });
        // send Email
        firebase.auth().currentUser.sendEmailVerification();
        res.send("success");
    }).catch(function(error) {
        // create error
        var errorCode = error.code;
        if (errorCode === "auth/email-already-in-use") {
            res.send("already");
        } else if (errorCode === "auth/invalid-email") {
            res.send("invalid");
        }
    });
});

/*忘記密碼*/
app.post('/api/forgotPwd', function(req, res) {
    console.log(req.body); 
    var email = req.body.user_Email.toString();
    firebase.auth().sendPasswordResetEmail(email).then(function() {
        res.send("success");
    }).catch(function(error) {
        var errorCode = error.code;
        if (errorCode === "auth/user-not-found") {
            res.send("user-not-found");
        }
    });
});


// 引導至重設密碼頁面
app.get('/api/resetPwd/:email', function(req, res) {
    var account = req.params.email.toString();
    var getUserSql = 'SELECT user_id FROM Connect_db.user_info WHERE user_Email=\"' + account + '\"';
    con.query(getUserSql, function(err, result) {
        if (err) throw err;
        var uid = result[0].user_id.toString();
        res.redirect('http://' + host + '/Web_Community/Web/createNew.html?' + uid);
    });
});

// 重設密碼
app.post('/api/changePwd', function(req, res) {
    var uid = req.body.Uid.toString();
    var getUserSql = 'SELECT user_Email, user_password FROM Connect_db.user_info WHERE user_id=\"' + uid + '\"';
    con.query(getUserSql, function(err_1, result_1) {
        if (err_1) throw err_1;
        if (result_1.length == 0) res.send("user-not-found");
        else {
            firebase.auth().signInWithEmailAndPassword(result_1[0].user_Email.toString(), aesDecrypt(result_1[0].user_password.toString(), uid)).then(function() {
                firebase.auth().currentUser.updatePassword(req.body.user_password.toString()).then(function() {
					var editUserSql = 'UPDATE Connect_db.user_info SET user_password =\"' + aesEncrypt(req.body.user_password.toString(), uid) + '\"WHERE user_id=\"' + uid + '\"';
                    //req.body["user_password"] = aesEncrypt(req.body.user_password.toString(), uid);
                    con.query(editUserSql, function(err_2, result_2) {
                        if (err_2) throw err_2;
                        res.send("success");
                    });
                }).catch(function(error) {
                    throw error;
                });
            });
        }
    });
});

// 登入
app.post('/api/login', function(req, res) {
    console.log(req.body);
    var account = req.body.user_Email.toString();
    var password = req.body.user_password.toString();
    firebase.auth().signInWithEmailAndPassword(account, password).then(function() {
        if (firebase.auth().currentUser.emailVerified === false) {
            res.send("notEmailVerified");
        } 
        else {
            var timeSql = 'update Connect_db.user_info set LastLogin = NOW() where user_email=\"' + account + '\"';
            con.query(timeSql, function(err, result) {
                if (err) throw err;
            });
        }
    }).then(function() {
        var getUser = 'SELECT user_id, user_name FROM Connect_db.user_info where user_email=\"' + account + '\"';
        con.query(getUser, function(err, result) {
            if (err) throw err;
            res.send([result[0].user_id.toString(), 'http://' + host + '/Web_Community/Web/index.html']);
        });
    }).catch(function(error) {
        var errorCode = error.code;
        if (errorCode === 'auth/wrong-password') {
            res.send("pwdError");
        } else if (errorCode === "auth/user-not-found") {
            res.send("user-not-found");
        }
    });
});

/*存發文text跟time*/
app.post('/api/index',function(req,res){
    console.log(req.body);
 
    var art_text = req.body.article_text.toString();
    //抓發文時間
    var art_time = new Date();
 
    var insert_art_text = 'insert into Connect_db.article(atricle_text) value( \"' + art_text + '\")';
    con.query(insert_art_text, function(err, result) {
     if (err) throw err;
    });
    var u_id = req.body.user_id.toString();
    var post_lvl = req.body.post_level.toString();
    var select_art_id = 'select article_id from article where article_text = \"' + art_text +'\"';
    var art_id;
    con.query(select_art_id,function(err,result){
        if(err) throw err;
        art_id = JSON.stringify(result);
    });
    var inser_pu_id = 'insert into Connect_db.post(user_id,article_id,post_level) value( \"' + u_id + '\",\"' + art_id + '\",\"' + post_lvl + '\")';
    con.query(inser_pu_id,function(err,result){
        if(err) throw err;
    });
 
    var insert_art_time = 'insert into Connect_db.article(atricle_time) value( \"' + art_time + '\")';
    con.query(insert_art_time, function(err, result) {
     if (err) throw err;
    });
 
 });
 
 /*初始化 設定格式大小*/
 const multer = require('multer');
 const upload  = multer({
     limits:{
         fileSize: 2 * 1024 * 1024
     },
     fileFilter(req,file,cb){
         if(!file.mimetype.match(/^image/)){
             cb(new Error().message = '格式錯誤');
         }
         else{
             cb(null,true);
         }
     }
 });
 
 /*將圖片存入mysql*/
 app.post('/api/index',upload.single('article_picture'),async(req,res) => {
     console.log('file => ',req.file);
     var insert_art_pic = 'insert into Connect_db.article(article_picture) value (\"'+ req.file.buffer +'\")';
     
     con.query(insert_art_pic,function(err,result){
         if(err) throw err;
     });
     res.send({
         success: true,
         message: '上傳成功'
     });
 });

app.get('api/index',async(req,res) => {
    const[art_pic] = await con.query('select img from Connect_db.article where article_id = "${req.Connect_db.article.article_id}"');
    //轉換格式
    art_pic.img = Buffer.from(art_pic.img).toString('base64');
    res.send({
        success: true,
        art_pic,
    });
})

app.post('/api/profile',function(req,res){
    console.log(req.body);

    var u_id = req.body.user_id.toString();
    var u_school = req.body.user_school.toString();
    var u_hobit = req.body.user_hobit.toString();
    var u_nation = req.body.user_nation.toString();
    var u_change = req.body.user_change.toString();
    var u_try = req.body.user_try.toString();

    var insert_profile_info = 'update Connect_db.user_info set user_school = \"'+ u_school +'\",user_hobby = \"'+u_hobit+'\",user_like_country = \"'+u_nation+'\" ,user_change = \"'+u_change+'\",user_try = \"'+u_try+'\" where user_id = \"'+u_id+'\'"';
    con.query(insert_profile_info, function(err, result) {
        if (err) throw err;
    });
});

/*將圖片update存入profile_mysql*/
app.post('/api/profile',upload.single('user_picture'),async(req,res) => {
    console.log('file => ',req.file);
    var update_user_pic = ('update Connect_db.user_info set user_picture = ? where user_id = "${req.Connect_db.user_info.user_id}"',req.file.buffer);
    
    con.query(update_user_pic,function(err,result){
        if(err) throw err;
    });
    res.send({
        success: true,
        message: '上傳成功'
    });
});

/* Password Process Start */
// 加密
function aesEncrypt(data, key) {
    const cipher = crypto.createCipher('aes192', key);
    var crypted = cipher.update(data, 'utf8', 'hex');
    crypted += cipher.final('hex');
    return crypted.toString();
}
// 解密
function aesDecrypt(encrypted, key) {
    const decipher = crypto.createDecipher('aes192', key);
    var decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted.toString();
}
/* Password Process End */

app.listen(process.env.PORT || 3000, function() {
    console.log("Start port 3000");
  });

