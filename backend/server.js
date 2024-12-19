const iconv = require('iconv-lite'); // Установите iconv-lite, если еще не установлено
const Buffer = require('buffer').Buffer;

// npm install nodemailer - почту слать
const nodemailer = require('nodemailer');


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
/* del */  const db_auditor_requests = new Datastore({ filename: 'auditor_requests.db', autoload: true }); // Очередь аудитора
const db_rules = new Datastore({ filename: 'rules.db', autoload: true }); // архив использованных правил и их blake3
const db_grades = new Datastore({ filename: 'grades.db', autoload: true }); // база оценок

const db_audit_mirror = new Datastore({ filename: 'audit_mirror.db', autoload: true }); // Скриншоты аудитов
const db_audit_requests = new Datastore({ filename: 'audit_requests.db', autoload: true }); // Очередь аудитора

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

// Увеличение лимита для body-parser
app.use(bodyParser.json({ limit: '100mb' })); // Увеличение лимита для JSON-данных
app.use(bodyParser.urlencoded({ limit: '100mb', extended: true })); // Увеличение лимита для URL-кодированных данных

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



//           ____ _           _      ____ ____ _____
//          / ___| |__   __ _| |_   / ___|  _ \_   _|
//         | |   | '_ \ / _` | __| | |  _| |_) || |
//         | |___| | | | (_| | |_  | |_| |  __/ | |
//          \____|_| |_|\__,_|\__|  \____|_|    |_|
//
app.post('/gpt_scale', async (req, res) => {
	var [unic,u] = await isUnic(req,res); if(!unic) return; // ты вообще залогинен?
	// var [auditor,au] = await isAuditor(unic,res); if(!auditor) return; // ты вообще Аудитор?
	var ask = req.body.ask; // "Я риэлтор";
	if(!req.body.ask || !req.body.ask.trim || req.body.ask.trim() == '') return '';

const data = {
  "model": SET.gpt_model, // "gpt-4",
  "temperature": 0.7,
  "max_tokens": 1000,
  "messages": [
    {
      "role": "system",
      "content": "You assist the website user in formulating their personal evaluation system and converting it into a machine-readable JSON format for further processing."
+" Answers: JSON only!"
+" It is not necessary, but it is desirable to make one of the parameters min:0 max:1 step:1 (it will turn into a checkbox)"
    },
    {
      "role": "user",
      "content": "Evaluation of my mood and work efficiency."
    },
    {
      "role": "assistant",
      "content": `[
        {"min": -5, "max": 5, "step": 1, "name": "Mood", "description": "My subjective mood from negative to positive."},
        {"min": 1, "max": 100, "step": 1, "name": "Work", "description": "Percentage of tasks completed during the workday."}
      ]`
    },
    {
      "role": "user",
      "content": "How should I evaluate the taste of coffee?"
    },
    {
      "role": "assistant",
      "content": `[
        {"min": 1, "max": 10, "step": 1, "name": "Aroma", "description": "Evaluation of the intensity and complexity of the coffee's aroma."},
        {"min": 1, "max": 10, "step": 1, "name": "Acidity", "description": "The level of brightness and liveliness of the taste."},
        {"min": 1, "max": 10, "step": 1, "name": "Bitterness", "description": "Evaluation of the level of bitterness."},
        {"min": 1, "max": 10, "step": 1, "name": "Aftertaste", "description": "Evaluation of the aftertaste."}
      ]`
    },
    {
      "role": "user",
      "content": ask
    }
  ]
};
    var text = await gpt_ask(data);
    ok(res,text);
});


//             _             _ _ _
//            / \  _   _  __| (_) |_ ___  _ __
//           / _ \| | | |/ _` | | __/ _ \| '__|
//          / ___ \ |_| | (_| | | || (_) | |
//         /_/   \_\__,_|\__,_|_|\__\___/|_|
//

// TODO: убрать I am Auditor, I grade a request
app.post('/auditor_grade_save', async (req, res) => {
	var [unic,u] = await isUnic(req,res); if(!unic) return; // ты вообще залогинен?
	var [auditor,au] = await isAuditor(unic,res); if(!auditor) return; // ты вообще Аудитор?

	// тебя вообще просили это оценивать?
	var request = await DB.Find(db_auditor_requests,{ _id: req.body.request_id, auditor_id: auditor },'_1');
	if( !request ) return err(res,"Request "+req.body.request_id+" not found");

	// ты вообще по своим действующим правилам оцениваешь?
	if(req.body.rules_blake3 != await blake3(JSON.stringify(au.rules),'') ) return err(res,"Rules was changed!");

	// сохраним систему оценки в db_rules если там пока её не было
	var rules_id = await DB.Find(db_rules, { blake3: req.body.rules_blake3 },'_1'); // есть ли такое правило?
	if(rules_id) rules_id=rules_id._id;
	else rules_id = await DB.Add(db_rules, { blake3: req.body.rules_blake3, rules: au.rules }); // тогда добавим

	// сохраним оценку в db_grades
	var ara={
	    auditor_id: auditor, // оценил этот аудитор
	    user_files: request.user_files, // вот этот комплект файлов
	    rules_id: rules_id, // по таким архивным правилам
	    time: unixtime(), // в такую дату
	    grades: [], // такими своими оценками
	};
	for(var i in au.rules) {
	    var x = au.rules[i];
	    var val = 1*req.body['rule_'+i];
	    if(val > x.max) return err(res,"Rules error: ["+x.name+"] more than max ("+x.max+")");
	    if(val < x.min) return err(res,"Rules error: ["+x.name+"] less than min ("+x.min+")");
	    ara.grades.push(val);
	}
	ara.grade_id = await DB.Add(db_grades, ara); // запишем

	// удалим запрос из db_auditor_request
	ara.numdel = await DB.Del(db_auditor_requests, { _id: req.body.request_id });
	ara.result = (ara.numdel==1 && ara.grade_id && ara.grade_id.length ? true : false);
	ok(res,ara);
});



// Add my Packet
// User создаёт запрос для аудитора v2
app.post('/audit_grade_save', async (req, res) => {
    const request_id = req.body.request_id;
    const v = req.body.values;
    const result = 1*req.body.result ? 1 : 0;
    try {
	var [unic,] = await isUnic(req,res); if(!unic) return; // ты вообще залогинен?
        // Проверим, был ли тебе вообще такой запрос
        var request = await DB.Find(db_audit_requests, { _id: request_id, auditor_unic: unic },'_1');
        if(!request) return err(res,`Unknown request [${request_id}]`);

        if(result) { // Если принято

	    // Теперь ищем mirror этого аудита чисто чтоб проверить значения
	    var mirror = await DB.Find(db_audit_mirror, { _id: request.mirror_id },'_1');
    	    if(!request) return err(res,`Unknown mirror [${request.mirror_id}] for request [${request_id}]`);
	    // проверка values (v)
            mirror.rules.forEach((x,i)=>{
	        if(x.type=='yn' && v[i]!==1 && v[i]!==0) throw new Error("Wrong YN ["+v[i]+"] #"+i);
	        if(x.type=='scale' && (isNaN(v[i]) || v[i] < 0 || v[i] > 100)) throw new Error("Wrong Scale ["+v[i]+"] #"+i);
        	if(x.type=='multi' && (
		    !Array.isArray(v[i])
		    || v[i].length !== x.names.length
		    || !v[i].every(el => el === 0 || el === 1)
		)) throw new Error("Wrong Multi ["+v[i]+"] #"+i);
        	if(x.type=='select' && (
		    !Array.isArray(v[i])
		    || v[i].length !== x.names.length
		    || !v[i].every(el => el === 0 || el === 1)
		    || v[i].filter(el => el === 1).length !== 1
		)) throw new Error("Wrong Select ["+v[i]+"] #"+i);
	    });

	    request.values = v;
	}

	request.result = result;
	request.result_time = unixtime();

	// Добавим запрос на Аудит: от unic к audit.blake3
	var id = await DB.AddUpdate(db_audit_requests,
	    { $and: [{ _id: request_id },{ auditor_unic: unic }] }, request
	);
        ok(res, { id: id, request_id: request_id, result: result, comment: "request closed" });

    } catch (er) {
        err(res,'Error updating request: '+er);
    }
});

// Отдать все данные по mirrors, перечисленные в body.mirror_ids
app.post('/get_mirrors', async (req, res) => {
    var mirror_ids = req.body.mirror_ids;
    var mirrors = await DB.Find(db_audit_mirror, { _id: { $in: mirror_ids } });
    ok(res, { mirrors: mirrors, mirror_ids: mirror_ids });
});

// OLD I am Auditor, get my requests
app.post('/auditor_my_requests', async (req, res) => {
	var [unic,] = await isUnic(req,res); if(!unic) return;  // ты вообще залогинен?
	var [auditor,] = await isAuditor(unic,res); if(!auditor) return; // ты вообще Аудитор?

	// все реквесты для этого аудитора
	var requests = await DB.Find(db_auditor_requests,{ auditor_id: auditor });
	if(requests) for(var i=0;i<requests.length;i++) {

	    // найдем файлы в пакетах файлов
	    var filelist = await DB.Find(db_packet,{ _id: requests[i].user_files },'_1');

	    if(filelist) { // найдем файлики
		filelist.files = [];
		var hs=(''+filelist.hashes).split(' ');
		for(var j=0;j<hs.length;j++) {
		    // ищем им добавляем подробности о файлах по хэшам
		    filelist.files.push( await DB.Find(db_cv,{ hash: hs[j] },'_1') );
		}
		requests[i].filelist=filelist;
	    }
	}
	// decision
	ok(res, requests);
});


// I am Auditor, get my requests - новая, старый уберем
app.post('/audit_my_requests', async (req, res) => {
	var [unic,] = await isUnic(req,res); if(!unic) return;  // ты вообще залогинен?
	var [auditor,] = await isAuditor(unic,res); if(!auditor) return; // ты вообще Аудитор?

	// все реквесты для этого аудитора (человека)
	var r = await DB.Find(db_audit_requests,{ auditor_unic: unic });
	if(r) for(var i=0;i<r.length;i++) {
	    var u = await DB.Find(db_unic,{ _id: r[i].unic },'_1');
	    if(!u || !u.login) continue;
	    r[i].login = u.login;
	}
	// decision
	ok(res, r);
});


// Add my Packet
// User создаёт запрос для аудитора v2 (предыдущий потом удалим)
app.post('/audit_request_add', async (req, res) => {
    try {
	var [unic,] = await isUnic(req,res); if(!unic) return; // ты вообще залогинен?
	// есть ли такой аудитор с таким hash?
	var audit_id = req.body.audit_id; if(!audit_id) return err(res,"Audit error");
	var audit_blake3 = req.body.audit_blake3;
	var asks = req.body.asks;
	var audit = await DB.Find(db_auditor, { _id: audit_id, blake3: audit_blake3 }, '_1');
	if(!audit) return err(res,"Audit not found, disabled or changed (reload page)");

	// Есть такие файлы и мои ли они?
	req.body.asks.forEach(async (x) => {
	    var r = await DB.Find(db_cv, { unic: unic, hash: x.file_hash }); // Проверяем файлы
	    if(!r) return err(res,"File not found: "+x.file_name);
	});

	// Ищем или делаем слепок Аудита
	var mirror_id, audit_mirror = await DB.Find(db_audit_mirror, { blake3: audit_blake3 },'_1');
	if(audit_mirror) mirror_id=audit_mirror._id;
	else {
	    mirror_id = await DB.Add(db_audit_mirror,{
		time: unixtime(), // время первого создания слепка аудита
		unic: unic, // unic кандидата
		audit_id: audit._id, // оригинальный id (его может уже не быть)
		rules: audit.rules, // правила оценки
		asks: audit.asks, // запрошенные файлы
		blake3: audit.blake3, // уникальный хэш слепка
		name: audit.name, // имя, каким оно было раньше
		about: audit.about, // описание, каким оно было раньше
	    });
	}
	if(!mirror_id) return err(res,"Error #718");

	// Проверим, был ли такой запрос уже
	var status='exist', request_id, request = await DB.Find(db_audit_requests, { audit_blake3: audit.blake3, unic: unic },'_1');
	if(request) request_id=request._id;
	else {
	    // Добавим запрос на Аудит: от unic к audit.blake3
	    var request_id = await DB.AddUpdate(db_audit_requests,
		{ $and: [{ audit_blake3: audit.blake3 },{ unic: unic }] },
		{
		    unic: unic,
	    	    auditor_unic: audit.unic, // unic аудитора (чтоб искать по нему)
		    audit_blake3: audit.blake3,
		    mirror_id: mirror_id,
		    asks: asks.map(x => ({ blake3: x.file_hash, about: x.file_about })), // пересмотрим asks
		    time: unixtime(), // и время конечно не забыть же
		}
	    );
	    status='added';
	}
	if(!request_id) return err(res,"Error #719");
        ok(res, { id: request_id, status: status, comment: "request added" });

    } catch (er) {
        err(res,'Error creating auditor_my_packet:'+er);
    }
});

// Add my Packet
// User создаёт запрос для аудитора
app.post('/auditor_request_add', async (req, res) => {
    try {
	var [unic,] = await isUnic(req,res); if(!unic) return; // ты вообще залогинен?
	// есть ли такой аудитор?
	var auditor_id = req.body.auditor_id; if(!auditor_id) return err(res,"Auditor error");
	var auditor = await DB.Find(db_auditor, { _id: auditor_id }, '_1');
	if(!auditor) return err(res,"Auditor not found");

        var r = await DB.Find(db_cv, { unic: unic }); // Берем все мои файлы
	// проверим, есть ли файлы
	if(!r || !r.length) return err(res,'No files');
	// проверим, есть ли хоть один элемент visible
	if(! r.some(function(e) { return e.visible === 1;}) ) return err(res,'No visible files');

	var hashes = r.map(item => item.hash); // Извлекаем значения поля hash
	hashes.sort(); // Сортируем массив значений hash
	hashes = hashes.join(' ');

	var ara = await DB.Find(db_packet, { unic: unic, hashes: hashes },'_1'); // есть ли такой?
	var user_files = (ara ? ara._id : await DB.Add(db_packet,{time: unixtime(), unic: unic, hashes: hashes}) ); // если нет, то создать

	// итак, у нас есть пакет файлов от юзера, добавим запрос к Аудитору:
	var id = await DB.AddUpdate(db_auditor_requests,
	    { $and: [{ auditor_id: auditor_id },{ user_files: user_files }] },
	    {
		auditor_id: auditor_id,
		user_files: user_files,
		time: unixtime(), // и время конечно не забыть же
	    }
	);
        ok(res, { id: id, user_files: user_files, hashes: hashes, auditor_id: auditor_id });
    } catch (error) {
        err(res,'Error creating auditor_my_packet');
    }
});

// Delete my Packet
// User удаляет запрос для аудитора
app.post('/auditor_request_del', async (req, res) => {
    try {
	var [unic,] = await isUnic(req,res); if(!unic) return; // ты вообще залогинен?
	var auditor_id = req.body.auditor_id; // аудитор
	// найти user_files
	var user_files = req.body.user_files; if(!user_files) return err(res,"user_files error");
	var packet = await DB.Find(db_packet, { _id: user_files },'_1');
	// а мой ли он?
	if(!packet || packet.unic != unic) return err(res,"Owner error for packet ["+user_files+"]");
	// удаляем:
	var result = await DB.Del(db_auditor_requests, { auditor_id: auditor_id, user_files: user_files });
        ok(res, { result:(result==1?true:false), user_files: user_files, auditor_id: auditor_id });
    } catch (error) {
        err(res,'Error creating auditor_my_packet');
    }
});

/// Get Auditor' settings
/// '/auditor_my' - взять все записи меня как аудитора (unic)
app.post('/auditor_my', async (req, res) => {
    var [unic,] = await isUnic(req,res); if(!unic) return; // ты вообще залогинен?
    var r = await DB.Find(db_auditor, { unic: unic }); // , '_1');
    ok(res, r);
});


/// Get Auditor' settings
/// '/auditor_mirror' - взять все 1 записm из базы слепков mirror по id (не важен unic)
app.post('/auditor_mirror', async (req, res) => {
    var r = await DB.Find(db_audit_mirror, { _id: req.body.id },'_1');
    ok(res, r);
});

// Get Auditor by id' settings
app.post('/auditor_id', async (req, res) => {
    var id = req.body.id; if(!id) err(res,"wrong id");
    var r = await DB.Find(db_auditor, { _id: id }, '_1');
    ok(res, r);
});

// Auditor save data
/// '/auditor_my_save' - мой (unic) старый (фгвш)
app.post('/auditor_my_save', async (req, res) => {
    try {
        var [unic,] = await isUnic(req,res); if(!unic) return; // ты вообще залогинен?

	var rules = !req.body.rules ? [] : req.body.rules.flatMap(rule => {

	    console.log("****************** /auditor_my_save rule=",rule);

	    if( ! ['select', 'scale', 'yn', 'multi'].includes(rule.type) ) {
		console.log(" [ ERROR ] rule.type=",rule.type);
		return [];
	    }
	    var ara = { type: rule.type };

	    if( !rule.name || rule.name.trim()=='' ) return []; // пустые имена просто удаляем
	    ara.name = rule.name;
	    // else console.log("@@@@@ /auditor_my_save: no name");

	    if( rule.about && rule.about.trim() ) ara.about = rule.about;
	    else console.log("@@@@@ /auditor_my_save: no about");

	    if( typeof(rule.names)=='object' ) ara.names = rule.names;
	    else console.log("@@@@@ /auditor_my_save: no names",rule.names);

	    console.log(" [ ret ] ara=",ara);
	    return ara;
	  });

	    console.log(" [ ! ] ************ /auditor_my_save rules=",rules);

/*
  if (someCondition(rule)) {
    return 123; // Возвращаем значение, если условие выполняется
  } else if (anotherCondition(rule)) {
    return {a: 123, b: [1, 2, 3], c: {aaa: 1, bbb: 2}}; // Возвращаем объект, если другое условие выполняется
  }
  return []; // Не добавляем ничего, если условия не выполняются
});


 req.body.rules.map(rule => {
	    if( ! ['select', 'scale', 'yn', 'multi'].includes(rule.type) ) throw new Error("wrong type");
	    var ara = { type: rule.type };
	    if( rule.name && rule.name.trim() ) ara.name = rule.name;
	    if( rule.about && rule.about.trim() ) ara.about = rule.about;
	    try{ ara.names = JSON.parse(rule.names); }catch(er){};
	    return ara;
	});

	    return {
    		// min: Number(rule.min) || 0,  // Преобразует в число, если не удается — будет 0
    		// max: Number(rule.max) || 1,  // Аналогично для max
    		// step: Number(rule.step) || 1, // Если step не задан или равен 0, установит значение по умолчанию 1
		// description: rule.description || "" // Если descript
		names: (()=>{ try{return JSON.parse(rule.names)}catch(e){return []} })(),
    		type: rule.type || "", // Если name не задан, установит "Unnamed"
    		name: rule.name || "", // Если name не задан, установит "Unnamed"
    		about: rule.about || "" // Если descript
	    };
	*/

	var asks = !req.body.asks ? [] : req.body.asks
          .filter(ask => ask.name && ask.name.trim() !== "") // Выбрасываем пустые имена
          .map(ask => ({
              type: ask.type === "text" ? "text" : "file",
              name: ask.name,
              about: ask.about,
          }));

	ara = {
	    unic: unic,
	    time: unixtime(),
	    name: req.body.name,
	    about: req.body.about,
	    rules: rules,
	    asks: asks,
	};
	ara.blake3 = await blake3(
	    // систему оценок и запрошенные файлы нельзя менять, а name и about пусть себе правят
	    JSON.stringify(ara.rules)+JSON.stringify(ara.asks)
	,'');

	var id = await DB.AddUpdate(db_auditor,
	    { $and: [{ unic: unic },{ _id: req.body._id }] },
	ara);

	ok(res, id);
    } catch(er) {
        err(res,'Error updating auditor: '+er);
    }
});

/// Delete Audit
/// "/auditor_del" Аудитор удаляет один из своих Аудитов (audit_id)
app.post('/auditor_del', async (req, res) => {
    try {
	var [unic,] = await isUnic(req,res); if(!unic) return; // ты вообще залогинен?
	var result = await DB.Del(db_auditor, { _id: req.body.audit_id, unic: unic });
        ok(res, result==1?true:false );
    } catch (error) {
        err(res,'Error creating auditor_my_packet');
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


// I am candidat, get my requests - новая
app.post('/candidat_my_requests', async (req, res) => {
	var [unic,] = await isUnic(req,res); if(!unic) return;  // ты вообще залогинен?

	// все реквесты для этого кандидата
	var r = await DB.Find(db_audit_requests,{ unic: unic });
        r = await add_db_data(r, { name:"name", about:"about" }, db_audit_mirror, 'mirror_id', '_id');

// Добавить в массив r поле с именем name (или в корень если '') из базы db данные, где id = idx
// Пример: r = await add_db_data(r, 'auditor', db_auditor, 'auditor_id', '_id');
// r = await add_db_data(r, { "about":"auditor_about", "unic":"auditor_unic" }, db_auditor, 'auditor_id', '_id');
// r = await add_db_data(r, { "email":"auditor_email", "login":"auditor_login" }, db_unic, 'auditor_unic', '_id');
// Также можно выбрать лишь нужные поля и переименовать, поместив в корень, если name - объект переименвания:
// r = await add_db_data(r, { about: 'RRR_about', unic: 'RRR_unic' }, db_auditor, 'auditor_id', '_id');
// async function add_db_data(r, name, db, id, idx) {


//	if(r) for(var i=0;i<r.length;i++) {
//	    var u = await DB.Find(db_unic,{ _id: r[i].unic },'_1');
//	    if(!u || !u.login) continue;
//	    r[i].login = u.login;
//	}
	// decision
	ok(res, r);
});
/*

// Load my requests
app.post('/cv_my_requests', async (req, res) => {
    var [unic,] = await isUnic(req,res); if(!unic) return; // ты вообще залогинен?

    // берем цепочку моих файлов
    var r = await DB.Find(db_cv, { unic: unic }); // Берем все мои файлы (проверок не делаем)
    var hashes = r.map(item => item.hash); // Извлекаем значения поля hash
    hashes.sort(); // Сортируем массив значений hash
    hashes = hashes.join(' ');

    // ищем номер пакета по моей цепочке файлов
    var r = await DB.Find(db_packet, { unic: unic, hashes: hashes },'_1'); // есть ли такой?
    if(!r||!r._id) return ok(res,[]);

    // берем список потревоженных мною аудиторов
    var r = await DB.Find(db_auditor_requests, { user_files: r._id });

    // и дополняем его данными аудитора и его unic
    r = await add_db_data(r, { "about":"auditor_about", "unic":"auditor_unic" }, db_auditor, 'auditor_id', '_id');
    r = await add_db_data(r, { "email":"auditor_email", "login":"auditor_login" }, db_unic, 'auditor_unic', '_id');
    ok(res, r);
});
*/



// Get all my grades
app.post('/cv_my_grades', async (req, res) => {
	var [unic,u] = await isUnic(req,res); if(!unic) return; // ты вообще залогинен?

	// найдем все мои оцененные комплекты файлов
	var packets = await DB.Find(db_packet,{ unic: unic }); // есть ли такое правило?
	if(!packets) return ok(res,[]);

        const ids = packets.map(item => item._id);
        var r = await DB.Find(db_grades, { user_files : { $in: ids } });

	// найдем правила
        r = await add_db_data(r, { "rules":"rules" }, db_rules, 'rules_id', '_id');
	// найдем unic аудитора
	r = await add_db_data(r, { "about":"auditor_about", "unic":"auditor_unic" }, db_auditor, 'auditor_id', '_id');
	// найдем данные аудитора
        r = await add_db_data(r, { "email":"auditor_email", "login":"auditor_login" }, db_unic, 'auditor_unic', '_id');
	ok(res,r);
});

// Get packets grades
app.post('/cv_packets_grades', async (req, res) => {

	var packets = req.body.packets;
	if(!packets || !packets.length) return ok(res,[]);

        var r = await DB.Find(db_grades, { user_files : { $in: packets } });

	// найдем правила
        r = await add_db_data(r, { "rules":"rules" }, db_rules, 'rules_id', '_id');
	// найдем unic аудитора
	r = await add_db_data(r, { "about":"auditor_about", "unic":"auditor_unic" }, db_auditor, 'auditor_id', '_id');
	// найдем данные аудитора
        r = await add_db_data(r, { "email":"auditor_email", "login":"auditor_login" }, db_unic, 'auditor_unic', '_id');
	ok(res,r);
});









// Load my requests
app.post('/cv_my_requests', async (req, res) => {
    var [unic,] = await isUnic(req,res); if(!unic) return; // ты вообще залогинен?

    // берем цепочку моих файлов
    var r = await DB.Find(db_cv, { unic: unic }); // Берем все мои файлы (проверок не делаем)
    var hashes = r.map(item => item.hash); // Извлекаем значения поля hash
    hashes.sort(); // Сортируем массив значений hash
    hashes = hashes.join(' ');

    // ищем номер пакета по моей цепочке файлов
    var r = await DB.Find(db_packet, { unic: unic, hashes: hashes },'_1'); // есть ли такой?
    if(!r||!r._id) return ok(res,[]);

    // берем список потревоженных мною аудиторов
    var r = await DB.Find(db_auditor_requests, { user_files: r._id });

    // и дополняем его данными аудитора и его unic
    r = await add_db_data(r, { "about":"auditor_about", "unic":"auditor_unic" }, db_auditor, 'auditor_id', '_id');
    r = await add_db_data(r, { "email":"auditor_email", "login":"auditor_login" }, db_unic, 'auditor_unic', '_id');
    ok(res, r);
});





// Load all CV
app.post('/cv_all', async (req, res) => {

    var r = await DB.Find(db_packet);
    if(!r) r=[];
    if(req.body.mode!='all') {
	var R={};
	r.forEach(x=>{ if(!R[x.unic] || R[x.unic].time < x.time) R[x.unic]=x; });
	r=Object.values(R);
    }
    r = await add_db_data(r, { "email":"user_email", "login":"user_login" }, db_unic, 'unic', '_id');
    // НЕ r = await add_db_data(r, 'grades', db_grades, '_id', 'user_files');

    for(var i=0;i<r.length;i++) {
	r[i].files = [];
	r[i].hashes.split(' ').forEach(x=>{ r[i].files.push({hash:x}); });
	r[i].files = await add_db_data(r[i].files, { "time":"time", "name":"name", "size":"size", "visible":"visible" }, db_cv, 'hash', 'hash');
	r[i].files.forEach((x,j)=>{ if(!x.visible) delete(r[i].files[j]); });
	r[i].files = r[i].files.filter(item => item !== null && item !== undefined);
	if(!r[i].files.length) delete(r[i]);
    }
    r = r.filter(item => item !== null && item !== undefined);

    return ok(res, r);

});



// Load all IPFS
app.post('/cv_all_ipfs', async (req, res) => {
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
    var [unic,] = await isUnic(req,res); if(!unic) return; // ты вообще залогинен?
    var r = await DB.Find(db_cv, { unic: unic });
    ok(res, r);
});

// Upload my files
app.post('/cv_my_add', upload.array('file[]'), async (req, res) => {

/*
    // del old files
    try {
	var uploadsDir = path.join(__dirname, 'uploads');
        var files = await fs.readdir(uploadsDir); // Читаем файлы в директории
	var expirationTime = Date.now() - 10*60*1000;
        await Promise.all(
	    files.map(async (file) => {
	            const filePath = path.join(uploadsDir, file);
	            const stats = await fs.stat(filePath); // Получаем информацию о файле
	            if(stats.mtimeMs < expirationTime) await fs.unlink(filePath); // Удаляем файл
	    })
	);
    } catch(er) { console.error(`Delete files error: ${er.message}`); }
    // /del
*/

    try {
        var [unic,] = await isUnic(req,res); if(!unic) return; // ты вообще залогинен?
	var time = unixtime();

      if(req.files && req.files.length) { // Если присланы файлы, то записать их в IPFS

        // Создание нового FormData для отправки файлов
        const formData = new FormData();

	formData.maxDataSize = 100 * 1024 * 1024; // Установите лимит на 10 МБ или больше, если необходимо

        req.files.forEach(file => {
	    var name = file.originalname;
	    name = iconv.decode(Buffer.from(name,'binary'),'utf8');
	    console.log("FILE: "+name);
            const fileStream = fs.createReadStream(file.path);
            formData.append('file', fileStream, { filename: name });
	});

	var response = 'ogo';
	try {
        // Отправка данных на IPFS
          response = await axios.post(SET.ipfs_endpointSave, formData, {
            headers: {
                ...formData.getHeaders()
            },
	    maxContentLength: Infinity, // Без ограничения для размера контента
	    maxBodyLength: Infinity     // Без ограничения для размера тела запроса
          });
	} catch(er){
	    console.log("axios.post error:",er);
	    return;
	}

	var j=response.data;
	if(typeof(j)=='object') j=[j];
	else j=JSON.parse('['+response.data.replace(/\}\s*\{/g,'},{')+']');

      } else { // А иначе просто создать текстовые ярлычки с about

	var j=[], i=0;
	while( req.body['name_'+i] != undefined ) {
	    if( !req.body['about_'+i] ) return;
	    j.push({
		Name: req.body['name_'+i],
		Size: req.body['about_'+i].length,
		Hash: ''
	    });
	    i++;
	}

      }

	// var files_saved = [];
	j.forEach((x,i) => {
	    var ara={
		unic: unic,
		time: time,
		name: x.Name,
		size: x.Size,
		hash: x.Hash
	    }
	    if(req.body['about_'+i]) ara.about = req.body['about_'+i]; // добавить about если был

	    DB.AddUpdate(db_cv,
	        { $and: [{ unic: unic },{ hash: x.Hash }] },
	        ara
	    ).then(
		function(id) {
		    console.log('File saved: ['+id+']',ara);
		    // files_saved.push(ara);
		}
	    );
	});
	// console.log('File saved results:',files_saved);
	ok(res, []);
    } catch(er) {
	console.log('Error uploading files: ',er);
        err(res,'Error uploading files: '+er);
    }
});

// Change visible or about: указать hash
// но также можно просто записать текстовую переменную:
// hash - не устанавливается первый раз, задаем about и name
app.post('/cv_set_visible', async (req, res) => {
    try {
	var [unic,] = await isUnic(req,res); if(!unic) return; // ты вообще залогинен?
	var time = unixtime();
	var hash = req.body.hash;
	var about = req.body.about.trim();
	var name = req.body.name;
	if(!hash) hash = await blake3(unic+name);

	var ara = await DB.Find(db_cv, { unic: unic, hash: hash },'_1');
	if(!ara) {
	    var name = req.body.name;
	    if(!name || !about) return;
	    ara = {
		unic: unic,
		time: time,
		name: name,
		size: 0, // about.length,
		hash: hash,
	    };
	}

	if(req.body.visible != undefined) ara.visible = (req.body.visible ? 1 : 0);
	if(about != undefined) ara.about = about;

	const id = ara._id;
	delete(ara._id);

	var r = DB.AddUpdate(db_cv,
		// { _id: id } эдак нам хакеры всё похачат!
		{ $and: [{ unic: unic },{ _id: id }] }
		,ara).then(
		function(id) { console.log('File CV update: ['+id+']',ara); }
	);
	ok(res, r);
    } catch (error) {
        err(res,'Error updating file CV');
    }
});


// Delete file by hash
app.post('/cv_del_file', async (req, res) => {
    try {
        var [unic,] = await isUnic(req,res); if(!unic) return; // ты вообще залогинен?
        var hash=req.body.hash;
	// Удалить с IPFS
        var r = await fetch(SET.ipfs_endpointRm+'?arg='+hash, { method: 'POST' });
        if(!r.ok) throw new Error(`HTTP error: Status: ${r.status}`);
        // Удалить из базы
        var r=await DB.Del(db_cv,{ unic: unic, hash: hash });
	console.log("================ DEL :",r);
        ok(res, r);
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


// M A I L

app.post('/mailme', async (req, res) => { // Check unic

    try {
        // Настройка SMTP
        const transporter = nodemailer.createTransport({
            service: SET.email_service, // 'gmail',
            auth: {
                user: SET.email_user, // 'hey@kampe.la', // Ваш Gmail
                pass: SET.email_pass, // 'aaaa aaaa aaaa aaaa', // SMTP-код
            },
        });

        // Настройки письма
        const mailOptions = {
            from: SET.email_user, // 'hey@kampe.la', // Отправитель
            to: SET.email_to, // 'lleo@lleo.me', // Получатель
            subject: 'посетитель kuvio.pro',
            text: `Информируем, что какой-то аноним на сайте kuvio.pro
по имени якобы «${req.body.name}»
из якобы организации «${req.body.organization}»
оставил якобы свою почту для связи: ${req.body.email}
`,

            html: `<p>Привет, Пион!

<p>Какой-то аноним на сайте kuvio.pro
<br>по имени якобы «${req.body.name}»
<br>из якобы организации «${req.body.organization}»
<br>оставил якобы свою почту для связи: <a href='mailto:${req.body.email}'>${req.body.email}</a></p>
<p>Напиши ему что-нибудь.</p>`,
        };

        // Отправка письма с помощью await
        const info = await transporter.sendMail(mailOptions);

        console.log('Письмо отправлено:', info.response);
	ok(res, info.response );

    } catch (error) {
        console.error('Ошибка при отправке письма:', error);
	err(res, error );
    }

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



// =======================================
async function isUnic(req,res) {
        var u = await unic_check(req.body.unic); // Check unic
	if(!u || !u.email || !u.login) { err(res,"wrong login"); return []; }
	return [u._id,u];
}

async function isAuditor(unic,res) {
	// есть ли такой аудитор?
	var auditor = await DB.Find(db_auditor, { unic: unic }, '_1');
	if(!auditor) { err(res,"Auditor not found"); return []; }
	return [auditor._id,auditor];
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

// ===========================================

// Добавить в массив r поле с именем name (или в корень если '') из базы db данные, где id = idx
// Пример: r = await add_db_data(r, 'auditor', db_auditor, 'auditor_id', '_id');
// r = await add_db_data(r, { "about":"auditor_about", "unic":"auditor_unic" }, db_auditor, 'auditor_id', '_id');
// r = await add_db_data(r, { "email":"auditor_email", "login":"auditor_login" }, db_unic, 'auditor_unic', '_id');
// Также можно выбрать лишь нужные поля и переименовать, поместив в корень, если name - объект переименвания:
// r = await add_db_data(r, { about: 'RRR_about', unic: 'RRR_unic' }, db_auditor, 'auditor_id', '_id');
async function add_db_data(r, name, db, id, idx) {
    // ищем дополнительные данные по полю id в таблице db
    const ids = r.map(item => item[id]);
    var R = await DB.Find(db, { [idx] : { $in: ids } });
	// создаем словарь
    const m = R.reduce((map, R) => {
	    if(typeof(name)=='object') {
		var p={};
		for(var i in name) p[name[i]]=R[i];
		map[R[idx]] = p;
	    } else map[R[idx]] = R;
	return map; }, {}
    );
    return r.map(item => ({ ...item,
	    ...( typeof(name)=='string'
	      ? {[name]: m[item[id]]} // добавить в массив name
	      : m[item[id]] // добавить в корень
	    )
    }));
}

// ================= chat gpt ===========================

async function gpt_ask(data) {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer "+SET.gpt_key
        },
        body: JSON.stringify(data)
    });

    if(!response.ok) {
    return '';
        // throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const result = await response.json();
    /// return result;
    try {
    return result.choices[0].message.content;
    } catch(er) { return ''; }
}
