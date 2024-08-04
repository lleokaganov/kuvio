const iconv = require('iconv-lite'); // Установите iconv-lite, если еще не установлено
const Buffer = require('buffer').Buffer;


/*

// Пример строки
// const s = 'Ñ\x81Ð¸Ð²ÐºÐ°-Ð±Ñ\x83Ñ\x80ÐºÐ°-ÐºÐ°Ñ\x83Ñ\x80ÐºÐ°.jpg';
// const s = "Ñ�Ð¸Ð²ÐºÐ°-Ð±Ñ�Ñ�ÐºÐ°-ÐºÐ°Ñ�Ñ�ÐºÐ°.jpg";

console.log("ORIG: "+s); // Выведет: "Сивка-бурка-кашка.jpg" или другой правильный текст

// Преобразование строки из неправильной кодировки в UTF-8
var e = iconv.decode(Buffer.from(s, 'binary'), 'windows-1251');
console.log("DECODE: "+e);

var e = iconv.decode(Buffer.from(s, 'binary'), 'utf8');
console.log("DECODE: "+e);

*/









// npm install nedb --save

// const fs = require('fs');
// const path = require('path');
const FormData = require('form-data');
const axios = require('axios');

const { createBLAKE3 } = require('hash-wasm');

// настройки баз

const DB_DEBUG = 1; // каждый раз переписывать файлы баз
const Datastore = require('nedb');
const db_unic = new Datastore({ filename: 'unic.db', autoload: true }); // reg
const db_cv = new Datastore({ filename: 'cv.db', autoload: true }); // CV
const db_auditor = new Datastore({ filename: 'auditor.db', autoload: true }); // Auditor settings
const db_packet = new Datastore({ filename: 'packet.db', autoload: true }); // Пакет, поданный аудиторам
const db_auditor_requests = new Datastore({ filename: 'auditor_requests.db', autoload: true }); // Очередь аудитора

/*
const db_users = new Datastore({ filename: 'users.db', autoload: true }); // Юзера
const db_user_files = new Datastore({ filename: 'users_files.db', autoload: true }); // Хэши файлов юзера
const db_auditors = new Datastore({ filename: 'auditors.db', autoload: true }); // Аудиторы и их оценки

const db_item = new Datastore({ filename: 'items.db', autoload: true }); // товары
const db_order = new Datastore({ filename: 'order.db', autoload: true }); // заказы
const db_order_events = new Datastore({ filename: 'order_events.db', autoload: true }); // лог заказа
const db_unic_address = new Datastore({ filename: 'unic_address.db', autoload: true }); // адреса покупателей
const db_saler = new Datastore({ filename: 'saler.db', autoload: true }); // продавцы
*/

// Read Config
const fs = require('fs');
var SET={}; // {...{port:3000},...process.env};
var txt = fs.readFileSync('config.txt', 'utf8');
txt.split('\n').forEach(s => {
        if( s=!'' && !s.trim().startsWith('#') && (m=s.match(/^\s*(\w+)\s*=\s*(.+?)\s*$/i))) SET[m[1]]=m[2];
});
console.log('config.txt:',SET);

// настройки сервера
const express = require('express');
const bodyParser = require('body-parser');
const app = express();

const json_def = {
    api_version: "Kuvio-JS 0.0.1",
    server_url: `http://localhost:${SET.port}`,
};

// Разрешить всем
// app.use(bodyParser.json());
// app.use(express.json());


const multer = require('multer');
const upload = multer({
    dest: 'uploads/',
    limits: { fileSize: 10 * 1024 * 1024 } // Ограничение размера файла, например, 10MB
});

// Middleware для принудительного парсинга JSON
app.use((req, res, next) => {
    let data = '';
    // Получаем значение Content-Type заголовка
    const contentType = req.headers['content-type'];
    if(contentType && (
	    contentType.includes('application/json')
	||  contentType.includes('text/plain')
    )) {
        req.on('data', chunk => { data += chunk; });
        req.on('end', () => {
            try { req.body = JSON.parse(data); } catch(er) { req.body = {}; }
            next();
        });
    } else next();
});

app.use((req, res, next) => {
    // res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    // res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    // res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Origin', (req.headers.origin?req.headers.origin:'*') );
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Headers', 'X-PINGOTHER, Content-Type, x-requested-with');

    console.log('Received: ',req.headers['content-type']);
    console.log('Received '+req.path, req.body);
    // print req.query
    console.log('Received query:',req.query);

    // if(req.method === 'OPTIONS') return res.sendStatus(204);
    next();
});

// Работа сервера

function err(res,text) {
    return res.json({...json_def,...{error: text}});
}

function ok(res,result) {
    return res.json({...json_def,...{result: result}});
}



/*
Я к вам лечу из дальней дали,
на эти два прекрасных дня,
мне ненадолго визу дали,
Троллейбус синий, жди меня!
*/


//             _             _ _ _
//            / \  _   _  __| (_) |_ ___  _ __
//           / _ \| | | |/ _` | | __/ _ \| '__|
//          / ___ \ |_| | (_| | | || (_) | |
//         /_/   \_\__,_|\__,_|_|\__\___/|_|
//


// I am Auditor, get my requests
app.post('/auditor_my_requests', async (req, res) => {
	// ты вообще залогинен?
        var u = await unic_check(req.body.unic); // Check unic
	if(!u || !u.email || !u.login) err(res,"wrong login");
	var unic=u._id;

	// есть ли такой аудитор?
	var auditor = await DB.Find(db_auditor, { unic: unic }, '_1');
	if(!auditor) err(res,"Auditor not found");

	// Мои реквесты
	var requests = await DB.Find(db_auditor_requests,{ auditor_id: auditor._id });
	if(requests) for(var i=0;i<requests.length;i++) {
	    // найдем файлы
	    var filelist = await DB.Find(db_packet,{ _id: requests[i].user_files },'_1');

console.log('/////////////////////////',filelist);

	    if(filelist) { // найдесм файлики
		filelist.files = [];
		var hs=(''+filelist.hashes).split(' ');
		for(var j=0;j<hs.length;j++) {
		    filelist.files.push( await DB.Find(db_cv,{ hash: hs[j] },'_1') );
		}
		requests[i].filelist=filelist;
	    }

	}
	// decision
	ok(res, requests);
});

// Make my Packet
// User создаёт пакет данных для аудитора
app.post('/auditor_my_packet', async (req, res) => {
    try {
	// ты вообще залогинен?
        var u = await unic_check(req.body.unic); // Check unic
	if(!u || !u.email || !u.login) err(res,"wrong login");
	var unic=u._id;

	// есть ли такой аудитор?
	var auditor_id = req.body.auditor_id;
	if(!auditor_id) err(res,"Auditor error");
	var auditor = await DB.Find(db_auditor, { _id: auditor_id }, '_1');
	if(!auditor) err(res,"Auditor not found");

        var r = await DB.Find(db_cv, { unic: unic }); // Берем все мои файлы
	// проверим, есть ли файлы
	if(!r || !r.length) err(res,'No files');
	// проверим, есть ли хоть один элемент visible
	if(! r.some(function(e) { return e.visible === 1;}) ) err(res,'No visible files');

	var hashes = r.map(item => item.hash); // Извлекаем значения поля hash
	hashes.sort(); // Сортируем массив значений hash
	hashes = hashes.join(' ');

	var id, ara = await DB.Find(db_packet, { unic: unic, hashes: hashes },'_1'); // есть ли такой?
	console.log('ara:['+typeof(ara)+']',ara);
	id = (ara ? ara._id : await DB.Add(db_packet,{time: unixtime(), unic: unic, hashes: hashes}) ); // если нет, то создать

	// итак, у нас есть пакет файлов от юзера, добавим их в очередь:
	var ida = await DB.AddUpdate(db_auditor_requests,
	    { $and: [{ auditor_id: auditor_id },{ user_files: id }] },
	    { auditor_id: auditor_id, user_files: id }
	);

        ok(res, ida);
    } catch (error) {
        err(res,'Error creating auditor_my_packet');
    }
});

// Get Auditor' settings
app.post('/auditor_my', async (req, res) => {
    var unic = await unic_check(req.body.unic); // Check unic
    if(!unic || !unic.email || !unic.login) err(res,"wrong login");
    var r = await DB.Find(db_auditor, { unic: unic._id }, '_1');
    ok(res, r);
});

// Auditor save data
app.post('/auditor_my_save', async (req, res) => {
    try {
        var u = await unic_check(req.body.unic); // Check unic
	if(!u || !u.email || !u.login) err(res,"wrong login");
	var unic=u._id;
	ara = {
	    unic: unic,
	    time: unixtime(),
	    about: req.body.about,
	    rules: req.body.rules,
	};
	var id = await DB.AddUpdate(db_auditor,{ unic: unic },ara);
	ok(res, id);
    } catch (error) {
        err(res,'Error updating auditor');
    }
});

// Auditors list
app.post('/auditor_all', async (req, res) => {
    var r = await DB.Find(db_auditor);
    for(var i=0;i<r.length;i++) {
	var p = await DB.Find(db_unic,{ _id: r[i].unic },'_1');
	if(p) r[i].login=p.login;
    }
    ok(res, r);
});

//           ____  __     __
//          / ___| \ \   / /
//         | |      \ \ / /
//         | |___    \ V /
//          \____|    \_/
//

// Load all CV
app.post('/cv_all', async (req, res) => {
    // var r = await DB.Find(db_cv);
    // ok(res, r);

    try {
        // 1. Получение списка закрепленных файлов
        const pinLsResponse = await fetch(SET.ipfs_endpointLs, { method: 'POST' });
        const pinLsData = await pinLsResponse.json();
        if (!pinLsData.Keys) throw new Error('No files found');
        const fileDetailsPromises = Object.keys(pinLsData.Keys).map(async (hash) => {
            try {
	        const response = await fetch(SET.ipfs_endpoint+hash, { method: 'HEAD' });
	        if(response.ok) {
	            const size = response.headers.get('content-length');
		    if(!size) return false;
    		    const type = response.headers.get('content-type').split(';')[0];
                    return {
			name: hash+"."+type2ras(type),
			hash: hash,
	                size: size,
    	                type: type,
        	    };
	        } else {
    		    console.error('Failed to fetch headers:', response.status, response.statusText);
		    return false;
	        }
            } catch (er) {
                console.error(`Error fetching details for ${hash}:` + er);
                return false;
            }
        });

        var r = await Promise.all(fileDetailsPromises);
	ok(res, r.filter(Boolean));

    } catch(er) {
        console.error('Error fetching list:', error);
	err(res, 'Error fetching list:'+er);
    }
});

// Load my CV
app.post('/cv_my', async (req, res) => {
    var unic = await unic_check(req.body.unic); // Check unic
    if(!unic || !unic.email || !unic.login) err(res,"wrong login");
    var r = await DB.Find(db_cv, { unic: unic._id });
    ok(res, r);
});

// Upload my files
app.post('/cv_my_add', upload.array('file[]'), async (req, res) => {
    try {
	var u = await unic_check(req.body.unic); // Check unic
        if(!u || !u.email || !u.login) err(res,"wrong login");
        var unic=u._id;
	var time = unixtime();

        // Создание нового FormData для отправки файлов
        const formData = new FormData();
        req.files.forEach(file => {
	    var name = file.originalname;
	    name = iconv.decode(Buffer.from(name,'binary'),'utf8');
	    console.log("FILE: "+name);
            const fileStream = fs.createReadStream(file.path);
            formData.append('file', fileStream, { filename: name });
	});

        // Отправка данных на IPFS
        const response = await axios.post(SET.ipfs_endpointSave, formData, {
            headers: {
                ...formData.getHeaders()
            }
        });

	var j=response.data;
	if(typeof(j)=='object') j=[j];
	else j=JSON.parse('['+response.data.replace(/\}\s*\{/g,'},{')+']');

	j.forEach(x=>{
	    var ara={ unic: unic, time: time, name: x.Name, size: x.Size, hash: x.Hash }
	    DB.AddUpdate(db_cv,
	        { $and: [{ unic: unic },{ hash: x.Hash }] },
	        ara
	    ).then(
		function(id) {
		    console.log('File saved: ['+id+']',ara);
		}
	    );
	});
	ok(res, []);
    } catch (error) {
        err(res,'Error uploading files');
    }
});


// Set visible
app.post('/cv_set_visible', async (req, res) => {
    try {
	var u = await unic_check(req.body.unic); // Check unic
        if(!u || !u.email || !u.login) err(res,"wrong login");
        var unic=u._id;
	var time = unixtime();
	var hash = req.body.hash;

        var ara = await DB.Find(db_cv, { unic: unic, hash: hash },'_1');
	ara.visible = (req.body.visible ? 1 : 0);
	const id=ara._id;
	delete(ara._id);
	DB.AddUpdate(db_cv,{ _id: id },ara).then(
		function(id) {  console.log('Visible updated: ['+id+']',ara); }
	);
	ok(res, []);
    } catch (error) {
        err(res,'Error updating visible');
    }
});


// Delete file by hash
app.post('/cv_del_file', async (req, res) => {
    try {
        var u = await unic_check(req.body.unic); // Check unic
	if(!u || !u.email || !u.login) err(res,"wrong login");
        var unic=u._id;
        var hash=req.body.hash;
	// Удалить с IPFS
        var r = await fetch(SET.ipfs_endpointRm+'?arg='+hash, { method: 'POST' });
        if(!r.ok) throw new Error(`HTTP error: Status: ${r.status}`);
        // Удалить из базы
        var r=await DB.Del(db_cv,{ unic: unic, hash: hash });
	console.log("================ DEL :",r);
        ok(res, []);
    } catch(er) { err(res,'Error:'+er); }
});


//                          _
//          _   _   _ __   (_)   ___
//         | | | | | '_ \  | |  / __|
//         | |_| | | | | | | | | (__
//          \__,_| |_| |_| |_|  \___|
//
//

// Create/update unic
app.post('/unic_create', async (req, res) => {
    var a={login: req.body.login}, password = req.body.password;
    if(!a.login) { // Create random password
	a.login=''; password='';
	const c = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789',cl=c.length;
        for(let i=0; i<cl; i++) password += c.charAt(Math.floor(Math.random()*cl));
    } else {
	a.email=req.body.email;
	if(!(/^[^\s@]+@[^\s@]+\.[^\s@\.]+$/).test(a.email)) return err(res,"email wrong format");
	if(a.login.length < 3) return err(res,"login too short");
	if(password.length < 1) return err(res,"password too short");
    }
    a.blake3 = await blake3(a.login,password);
    var id,unic = await unic_check(req.body.unic); // Check unic
    if(!unic) id = await DB.Add(db_unic,{...a,...{time: unixtime()}});
    else await DB.AddUpdate(db_unic, { _id: (id=unic._id) } , unic);
    ok(res, id+'-'+a.blake3);
});

// Login by login/password
app.post('/unic_login', async (req, res) => { // Check unic
    const a = {login: req.body.login, password: req.body.password};
    a.blake3 = await blake3(a.login,a.password);
    var ud = await DB.Find(db_unic, { blake3: a.blake3, login: a.login },'_1');
    if(!ud) { await delay(3); return ok(res,''); }
    ok(res, ud._id+'-'+ud.blake3 );
});


// ==========================================================
// Функции

// Запускаем сервер
app.listen(SET.port, () => {
	console.log(`Server is running on http://localhost:${SET.port}`);
});

// Обработчик для несуществующих маршрутов (404)
// app.use((req, res) => {
//    console.log(res);
//    if(!res.writableEnded) res.status(404).json({ error: 'Not Found' });
// });

async function unic_check(unic) {
    if(!unic || !unic.split) return false;
    var p = await DB.Find(db_unic,{ _id: unic.split('-')[0], blake3: unic.split('-')[1] },'_1');
    return (p ? p : false);
}

// ==========================================================
// Функции DB

DB={
  Find: function(db,query,opt) { // { instock: 1 }
    return new Promise((resolve, reject) => {
        db[opt==='_1'?'findOne':'find'](query, (err, p) => {
            if(err) reject(err); // Ошибка при поиске
            else resolve(p); // Возвращаем найденные товары
        });
    });
 },

  Add: function(db,data) {
    return new Promise((resolve, reject) => {
        db.insert(data,(err,newDoc) => {
            if(err) reject(err);
            else resolve(newDoc._id);
        });
    });
  },

  Del: function(db,query) { // { _id: idToRemove, unic: unicToRemove }
    return new Promise((resolve, reject) => {
        db.remove(query, {}, (err, numRemoved) => {
            if(err) reject(err);
            else {
		if(!DB_DEBUG) resolve(numRemoved);
		else { db.persistence.compactDatafile(); db.on('compaction.done', () => { resolve(numRemoved); }); }
	    }
        });
    });
  },

  AddUpdate: function(db,query,data,upsert) { // query = { _id: id }
    console.log("~~~ DB.AddUpdate query:",query);
    console.log("~~~ DB.AddUpdate data:",data);
    return new Promise((resolve, reject) => {
	// db.update(query, data, { upsert: true }, (err, numReplaced, upsert) => {
    	db.update(query, { $set: data }, { upsert: (upsert!=undefined?upsert:true) }, (err, numReplaced, upsert) => {
            if(err) {
		console.error('Update error:', err);
		reject(err);
	    } else {
	        console.log('numReplaced:', numReplaced);
		console.log('upsert:', upsert);
		if(!DB_DEBUG) resolve( upsert && upsert._id ? upsert._id : true );
		else { db.persistence.compactDatafile(); db.on('compaction.done', () => { resolve(upsert && upsert._id ? upsert._id : true); }); }
	    }
        });
    });
  },

  Update: function(db, query, data) { // то же, просто upsert другой
    return DB.AddUpdate(db,query,data,false);
  },

  Re: function(db) {
    return new Promise((resolve, reject) => {
	db.persistence.compactDatafile();
	db.on('compaction.done', () => { resolve(); });
    });
  },

};

function unixtime() {
    return Math.floor(Date.now() / 1000);
}

function delay(seconds) {
  return new Promise(resolve => setTimeout(resolve, seconds * 1000));
}

async function blake3(login,password) {
    const hash = await createBLAKE3();
    hash.update(SET.unic_salt+login+password);
    return hash.digest();
}

// ================== ipfs

function type2ras(x) {

  let contentTypes = {
    // Images
    'jpg': 'image/jpeg',
    'jpeg':'image/jpeg',
    'gif': 'image/gif',
    'png': 'image/png',
    'webp':'image/webp',
    'svg': 'image/svg+xml',
    // Audio
    'mp3': 'audio/mpeg',
    'ogg': 'audio/ogg',
    'wav': 'audio/wav',
    // Video
    'mp4': 'video/mp4',
    'avi': 'video/x-msvideo',
    'mkv': 'video/x-matroska',
    'webm':'video/webm',
    'mov': 'video/quicktime',
    'flv': 'video/x-flv',
    // Documents
    'rtf': 'application/rtf',
    'doc': 'application/msword',
    'docx':'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'xls': 'application/vnd.ms-excel',
    'xlsx':'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'csv': 'text/csv',
    'ppt': 'application/vnd.ms-powerpoint',
    'pptx':'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    'pps': 'application/vnd.ms-powerpoint',
    'txt': 'text/plain',
    'pdf': 'application/pdf',
    // Archives
    'zip': 'application/zip',
    'rar': 'application/x-rar-compressed',
    '7z':  'application/x-7z-compressed',
    'tar': 'application/x-tar',
    'gz':  'application/gzip'
  };

    for(const [ext, type] of Object.entries(contentTypes)) { if(x === type) return ext; }
    return 'unknown';
};