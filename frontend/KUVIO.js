// Kuvio engine

page_onstart.push("KUVIO.init()");

KUVIO={
    api_url: "http://localhost:8484/{action}",

//             _             _ _ _
//            / \  _   _  __| (_) |_ ___  _ __
//           / _ \| | | |/ _` | | __/ _ \| '__|
//          / ___ \ |_| | (_| | | || (_) | |
//         /_/   \_\__,_|\__,_|_|\__\___/|_|
//
 AUDITOR: {

  request: async function(auditor_id){
	console.log('request');
        if(!unis) return;
	var r = await KUVIO.API('auditor_my_packet',{auditor_id: auditor_id});
	if(r===true || (r && r.length) ) salert("Request sended",1000);
  },

  all: async function(rt){
	var r = await KUVIO.API('auditor_all');
	var o=mpers(`
<div style='width: 300px;margin:5px;'>
{for(auditors):
<div>
<h2>{if(rt):
    <input onclick="KUVIO.AUDITOR.request('{#_id}')" type='button' value='REQUEST'> &nbsp;
}{#login} <span class='br'>{day:time}</span></h2>
<i>{#about}</i>
</div>
}
</div>`,{ auditors: r, rt: (rt?1:0) });

	if(rt) ohelpc('auditors','All Auditors',o);
	else dom('place',o);
  },

  requests: async function(){
	var r = await KUVIO.API('auditor_my_requests');

	// my rules
	var rules = await KUVIO.API('auditor_my'); // var st=KUVIO.AUDITOR.string2system(r);
	if(!rules || !rules.rules) return;

	var o=mpers(`
<div style='margin:5px;'>
{for(requests):
    <h2>{#user_files}</h2>

<table border='0' cellspacing="10" cellpadding="1">
    {for(filelist.files):

<tr hash="{#hash}" name="{#name}">
    <td align='right'><a onclick="return IPFS.View()" href='{ipfs}{#hash}'>{#name}</a></td>
    <td align='right' class='br'>{#size}</td>
    <td class='r'>{dat:time}</td>
</tr>

    }
</table>

<div class='rules'>
{for(rules):
 <div class=r>{#name}</div>
 <input type="range" oninput="KUVIO.AUDITOR.chRule()" min="{#min}" max="{#max}" step="{#step}" value="{#min}" style="width:60%">
 <span class='val'></span><span class='perc'></span>
}
</div>
<center><button type="submit" class="input_btn mv0" style="display: unset;" onclick="alert('todo')" return false;'>Save</button></center>

}
</div>`,{ requests: r, rules: rules.rules });

/*
[
	{
	    "user_files": "cDU6vXd9HYxkSTfU",
	    "filelist": {
		"time": 1722776272,
		"unic": "dgA0Rs4HP9Myacq6",
		"hashes": "bafkr4ibwbt3gshd6p5pobpawnuicamvylhc4rqvskfj6jrdfd6uymmqysi bafkr4icb7nxrkgor3w4hvydrwsmktvkkr3azly37xngvcbbulkblcdtxze bafkr4icgspczpxyzotoped2g6psong2umcszu6alsmycgkalhfrvuychey",
		"_id": "cDU6vXd9HYxkSTfU",
		"files": [
		    {
			"unic": "dgA0Rs4HP9Myacq6",
			"time": 1722556426,
			"name": "сивка-бурка-каурка.jpg",
			"size": "183312",
			"hash": "bafkr4ibwbt3gshd6p5pobpawnuicamvylhc4rqvskfj6jrdfd6uymmqysi",
			"_id": "LkoHxMMMcIphbnOo",
			"visible": 0
		    },
		    {
			"unic": "dgA0Rs4HP9Myacq6",
			"time": 1722556426,
			"name": "horse_raduga_flag.webp",
			"size": "62076",
			"hash": "bafkr4icb7nxrkgor3w4hvydrwsmktvkkr3azly37xngvcbbulkblcdtxze",
			"_id": "7SpeamtYUjZum9tT",
			"visible": 1
		    },
		    {
			"unic": "dgA0Rs4HP9Myacq6",
			"time": 1722556426,
			"name": "horse_colors.jpg",
			"size": "35140",
			"hash": "bafkr4icgspczpxyzotoped2g6psong2umcszu6alsmycgkalhfrvuychey",
			"_id": "mrMDKmRBvVsIbjFA",
			"visible": 0
		    }
		]
	    }
	}
    ]
*/


	dom('place',o);
  },

/*
  string2system: function(r) {
	if(!r||!r.about) r={about: '', system: ''};
	var s=r.system, about=r.about.toLowerCase();
	var prc = (about.indexOf('percent')>=0 || about.indexOf('%')>=0 || about.indexOf('процент')>=0);
	var st=[]; // min|max|step|name
	if(s&&typeof(s)=='string') s=s.replace("\r","").split("\n").forEach(l=>{
	    l=l.split('|',4);
	    var ara={
		min: l[0],
		max: l[1],
		step: l[2],
		name: l[3],
	    };
	    ara.val = (ara.min < 0 ? 0: ara.min);
	    ara.mper = (prc ? "<span>{#val}</span>%" : "<span>{#val}</span>%");
	    st.push(ara);
	});
	return st;
  },
*/

  tmpl:`
    <div class='param'>
<span onclick="KUVIO.AUDITOR.delRule()" class="mv" style="font-size:22px" alt="Delete">🗑</span>
&nbsp;
Name: <input value='{#name}' onchange="KUVIO.AUDITOR.chRule()" name='name' type='text' placeholder='English knowledge in percentage' style='width:100%'></div>
    <div class='param'>Min: <input value='{#min}' onchange="KUVIO.AUDITOR.chRule()" name='min' type='text' size='5' placeholder='0'></div>
    <div class='param'>Max: <input value='{#max}' onchange="KUVIO.AUDITOR.chRule()" name='max' type='text' size='5' placeholder='100'></div>
    <div class='param'>Step: <input value='{#step}' onchange="KUVIO.AUDITOR.chRule()" name='step' type='text' size='5' placeholder='1'></div>
    <div>
    Test here: <input type="range" oninput="KUVIO.AUDITOR.chRule()" min="{#min}" max="{#max}" step="{#step}" value="{#min}" style="width:60%">
      <span class='val'></span><span class='perc'></span>
    </div>
  `,

  chRule: function(){
	var d=window.event.target;
	var e=d.closest('.rule');
	if(d.type=='range') {
	    dom( e.querySelector('.val'), d.value );
	} else {
	    d=e.querySelector("input[type='range']").value;
	    d.min=1*e.querySelector("input[name='min']").value;
	    d.max=1*e.querySelector("input[name='max']").value;
	    d.step=1*e.querySelector("input[name='step']").value;
	}
	var name = e.querySelector("input[name='name']").value.toLowerCase();
	var prc=(name.indexOf('percent')>=0 || name.indexOf('%')>=0 || name.indexOf('процент')>=0);
	if(prc) {
	    var x=e.querySelector("input[name='min']"); if(x.value=='') x.value=0;
	    x=e.querySelector("input[name='max']"); if(x.value=='') x.value=100;
	    x=e.querySelector("input[name='step']"); if(x.value=='') x.value=1;
	}

	dom( e.querySelector('.perc'), prc ? '&nbsp;%' : '' );
  },

  addRule: function(){
	var e=window.event.target.closest('FORM');
	var table=e.querySelector('.rules');
	var flag=1;
	table.querySelectorAll('DIV.param input').forEach(x=>{
		if(x.value=='') {
		    flag=0;
		    x.classList.add('input_warning');
		} else {
            	    x.classList.remove('input_warning');
		}
	});
	if(!flag) return;

	let div = document.createElement("div");
	div.className='rule';
	dom(div,mpers(KUVIO.AUDITOR.tmpl,{}));
	table.appendChild(div);
  },

  delRule: function(){
	var e=window.event.target.closest('.rule');
	e.classList.add('input_warning');
	if(confirm('Delete rules?')) clean(e);
	else e.classList.remove('input_warning');
  },

  save: async function(){
	var e=window.event.target.closest('FORM');
	var table=e.querySelector('.rules');
	var flag=1;
	table.querySelectorAll("DIV.param input").forEach(x=>{
		if(x.value=='') {
		    flag=0;
		    x.classList.add('input_warning');
		} else {
            	    x.classList.remove('input_warning');
		}
	});
	if(!flag) return;

	var ara={
	    about: e.querySelector('textarea').value,
	    rules: [],
	};
	e.querySelectorAll('DIV.rule').forEach(tr=>{
	    var a={};
	    tr.querySelectorAll("DIV.param input").forEach(x=>{a[x.name]=x.value;});
	    ara.rules.push(a);
	});

        var r = await KUVIO.API('auditor_my_save',ara);
	KUVIO.AUDITOR.settings();
  },



  // Установки аудиотора и его регистрация
  settings: async function(){
        if(!unis) await KUVIO.LOGIN.login();

	var r = await KUVIO.API('auditor_my'); // var st=KUVIO.AUDITOR.string2system(r);
	if(!r) r={};
	if(!r.rules) r.rules=[];

	dom('place',mpers(`
<center><div style='text-align: left; width:80vh;'>
<h2>Registration as Auditor <b>{#unis_login}</b></h2>

<form>

<p><br>About:
<div><textarea style='width:100%;height:60px;'>{#about}</textarea></div>

<div class='rules'>

{for(rules):
<div class='rule' style='margin-top:10px; margin-bottom:10px; border-bottom:1px dotted #ccc'>{tmpl}</div>
}

</div>

<p><br>
<div><input type="button" size="30" type="file" onclick="KUVIO.AUDITOR.addRule()" value='New rule'></div>

<center><button type="submit" class="input_btn mv0" style="display: unset;" onclick='KUVIO.AUDITOR.save(); return false;'>Save</button></center>

</form>

</div></center>`,{ ...r,...{
	unis_login: unis_login,
	tmpl: KUVIO.AUDITOR.tmpl,
} }));

/*
{_STYLES:
  .oce SPAN { margin-left:20px; }
_}

function cha() {
   var e=window.event.target;
   var v=e.value;
console.log('min: '+typeof(e.min)+' '+e.min);
console.log('max: '+typeof(e.max)+' '+e.max);
console.log('step: '+typeof(e.step)+' '+e.step);
console.log('v: '+typeof(v)+' '+v);
   if(1*e.min==0 && 1*e.max==1 && (1*e.step==1||1*e.step==0)) v=(1*v?'да':'нет');
   e.closest('div').querySelector('span').innerHTML=v;
}
*/


  },

 },

//           ____  __     __
//          / ___| \ \   / /
//         | |      \ \ / /
//         | |___    \ V /
//          \____|    \_/
//

 CV: {

    all: async function() {
	var r = await KUVIO.API('cv_all');
	if(!r) return dom('place','No CV');

	r.sort((a, b) => b.time - a.time); // Sorting the array by time in descending order
	dom('place',mpers(`<h2>All files: {#files.length}</h2>
<center><table border='0' cellspacing="10" cellpadding="1">{for(files):
<tr hash="{#hash}" name="{#name}">
    <td align='right'><a onclick="return IPFS.View()" href='{ipfs}{#hash}'>{#name}</a></td>
    <td align='right' class='br'>{#size}</td>
    <td class='r'>{dat:time}</td>
    <td><div alt='Delete' onclick='KUVIO.CV.delFile()' class='mv' style='font-size:22px'>&#x1F5D1;</div></td>
</tr>
}</table>
</center>`,{files:r, ipfs: IPFS.endpoint}));

    },

    my: async function() {
        if(!unis) await KUVIO.LOGIN.login();

	var r = await KUVIO.API('cv_my');
	if(!r) r=[];
	r.sort((a, b) => b.time - a.time); // Sorting the array by time in descending order

	dom('place',mpers(`<h2>My files: {#files.length}</h2>

<center><table border='0' cellspacing="10" cellpadding="1">

<tr class='br' align='center'>
    <td>visible</td>
    <td>name</td>
    <td>size</td>
    <td>time</td>
    <td></td>
</tr>

{for(files):
<tr hash="{#hash}" name="{#name}">
    <td><input onchange='KUVIO.CV.setVisible()' type='checkbox' {if(visible): checked}></td>
    <td align='right'><a onclick="return IPFS.View()" href='{ipfs}{#hash}'>{#name}</a></td>
    <td align='right' class='br'>{#size}</td>
    <td class='r'>{dat:time}</td>
    <td><div alt='Delete' onclick='KUVIO.CV.delFile()' class='mv' style='font-size:22px'>&#x1F5D1;</div></td>
</tr>
}</table>

<div>
<input name="file[]" size="30" type="file" multiple onchange="KUVIO.CV.addFiles()" alt='Upload 1 or more file'>
</div>

<center><button type="submit" class="input_btn mv0" style="display: unset;" onclick='KUVIO.CV.add_auditors(); return false;'>Add Auditors</button></center>

</center>`,{files:r, ipfs: IPFS.endpoint}));

    },

  add_auditors: async function(){
	KUVIO.AUDITOR.all(1);
  },

  setVisible: async function(){
    var e=window.event.target;
    var hash=IPFS.find_hash(e);
    var r = await KUVIO.API('cv_set_visible',{hash:hash, visible:e.checked});
    KUVIO.CV.my(); // Upload my list
  },

  delFile: async function(){
    var e=window.event.target;
    var hash=IPFS.find_hash(e);
    var name=IPFS.find_tr(e).getAttribute('name');
    if(!confirm(`Delete "${name}" ?`)) return;
    var r = await KUVIO.API('cv_del_file',{hash:hash});
    KUVIO.CV.my(); // Upload my list
  },

  addFiles: async function(){
    if(!unis) return;
    var e=window.event.target;
    ajaxon();
    var formData = new FormData();
    for(var i=0; i < e.files.length; i++) formData.append("file[]", e.files[i], e.files[i].name);
    formData.append('unic', unis);
    // Отправка данных на сервер с помощью fetch
    try {
        let response = await fetch( mpers(KUVIO.api_url,{action:'cv_my_add'}) , { method: 'POST', body: formData });
	ajaxoff();
        if(response.ok) {
	    const r = await response.text();
	    KUVIO.CV.my(); // Upload my list
        } else KUVIO.error('Upload error: '+response.statusText);
    } catch(er) {
        ajaxoff();
	KUVIO.error('Upload files error: '+er);
    }
  },

},
 init: async function() {
    KUVIO.LOGIN.init();
    // KUVIO.CV.all();
    // KUVIO.cartLoad(); // загрузить из памяти браузера корзину
    // KUVIO.load(); // загрузить магазин товаров
    // if(KUVIO.test) KUVIO.test();
    // dom('place','OK');
    // IPFS.List();
    // KUVIO.CV.my();

    KUVIO.AUDITOR.settings();
    return;
 },

 error: function(s){ console.error(s); idie(s); return false; },

 API: async function(action,data) {
	if(!data) data={};
	KUVIO.API_last={data:data,action:action};
	data.action = action;
	data.num = num;
	data.unic = (typeof(unis)=='undefined' ? false : unis);
	var url = mpers(KUVIO.api_url,data);
	try {
    	    const response = await fetch(url, {
        	method: 'POST',
        	body: JSON.stringify(data),
    	    });
    	    if(!response.ok) throw new Error(`HTTP error status: ${response.status}`);
	    const r = await response.json();
	KUVIO.API_last.error=r.error;
	KUVIO.API_last.result=r.result;
	    if(r.error || typeof(r.result)=='undefined') return KUVIO.error('Error API.'+action+': '+r.error);
	    return r.result;
	} catch(er) {
	    return KUVIO.error('Error during API call: '+er);
	}
    },
 API_last: {
 },

//          _        ___     ____   ___   _   _
//         | |      / _ \   / ___| |_ _| | \ | |
//         | |     | | | | | |  _   | |  |  \| |
//         | |___  | |_| | | |_| |  | |  | |\  |
//         |_____|  \___/   \____| |___| |_| \_|
//

 LOGIN: {

  name: 'kuvio',

  init: async function() {
    unis=f_read(KUVIO.LOGIN.name);
	console.log('unis('+typeof(unis)+')='+unis);
    unis_login=f_read(KUVIO.LOGIN.name+'_login');
	console.log('unis_login('+typeof(unis_login)+')='+unis_login);
    var l = (unis.indexOf && unis.indexOf('-') && unis_login);

    var e=dom('.unis_login_name');
    e.innerHTML=(l && unis_login && (''+unis_login).length ? '&#128100;&nbsp;'+unis_login : 'Login');

//    max-width:10ch; white-space:nowrap; overflow:hidden;

    if(l) { e.setAttribute('alt','Logged in as: <b>'+h(unis_login)+'</b>'); init_tip(e); }
    else { e.removeAttribute('tiptitle'); e.removeAttribute('alt'); }
  },

  logout: async function() {
    f_del(KUVIO.LOGIN.name);
    f_del(KUVIO.LOGIN.name+'_login');
    KUVIO.LOGIN.init();
  },

/*
  check: async function() {
    // restore unis
    unis=f_read(KUVIO.LOGIN.name);
    if(!unis) {
	unis = await KUVIO.API('login_create');
        if(!unis) return KUVIO.error('Server error: login/create');
	f_save(KUVIO.LOGIN.name,unis);
	console.log('Login created: ',unis);
    }
  },
*/



  login: async function() {
    var name='enter_password';
    var a = await new Promise((resolve) => {
	if(!dom(name)) ohelpc(name,'Login',mpers(`
<div style='width: 300px; text-align: center;'>

{if(unis):
<div style='margin: 20px 0 20px 0;' class="mv0">You are logged as <b>{#unis_login}</b><br><a href="#" onclick="KUVIO.LOGIN.logout(); clean('enter_password');">Logout</a></div>
}

<div style='position:relative;margin-bottom: 15px;'>
    <span class='input_symb'>&#128100;</span>
    <input class='input_form' type="text" placeholder="Username" name="username" required>
</div>

<div style='position:relative;margin-bottom: 15px;'>
    <span class='input_symb'>&#128274;</span>
    <input class='input_form' type="password" placeholder="Password" name="password" id="password" required>
    <div class='mv0' onclick="this.innerHTML=(this.innerHTML=='&#128065;'?'&#128065;&#65039;':'&#128065;'); var e=this.parentNode.querySelector('input');e.setAttribute('type',e.getAttribute('type')=='text'?'password':'text');" style="cursor: pointer; position: absolute; right: 50px; top: 50%; transform: translateY(-50%);">&#128065;</div>
</div>

<div class='login_email' style='position:relative;margin-bottom: 15px;display:none;'>
    <span class='input_symb'>&#9993;&#65039;</span>
    <input class='input_form' type="text" placeholder="contact@email.com" name="email" required>
</div>

<button type="submit" class="input_btn mv0">Sign In</button>
<div class='ajax' style='display:none'>{ajaxgif}</div>
<!-- todo:
div style='margin-top: 10px;' class="r mv0"><a class='login_forgot' href="#" onclick="alert('Ну и мудак, чо')">Forgot Password?</a></div
-->
<div style='margin-top: 10px;' class="r mv0 ">No account? <a href="#" class='login_create' onclick="alert('Ну и мудак, чо')">Create</a></div>
</div>`,{
    ajaxgif: ajaxgif,
    unis: unis && (''+unis).length,
    unis_login: unis_login,
}));
	var e=dom(name);

	e.querySelector('button').onclick=function(){ // Login
	    var a={},q;
	    q=e.querySelector("input[name='username']"); a.login = q.value;
	    if(a.login.length<3) { q.classList.add('input_warning'); return; }
	    q.classList.remove('input_warning');

	    q=e.querySelector("input[name='password']"); a.password = q.value;
	    if(a.password.length<1) { q.classList.add('input_warning'); return; }
	    q.classList.remove('input_warning');

	    if(e.querySelector('.login_email').style.display!='none') {
		q=e.querySelector("input[name='email']"); a.email = q.value;
		if(!(/^[^\s@]+@[^\s@]+\.[^\s@\.]+$/).test(a.email)) { q.classList.add('input_warning'); return; }
		q.classList.remove('input_warning');
	    }
	    dom(e.querySelector('button')).style.display='none';
	    dom.on(e.querySelector('.ajax'));
	    resolve(a);
	};

	e.querySelector('.login_create').onclick=function(){ // Switch to register form
	    dom.on(e.querySelector('.login_email'));
	    dom(e.querySelector('button')).innerHTML='Register';
	    dom.off(e.querySelector('.login_noacc'));
	};

	e.querySelector('button').style.display='unset';
	e.querySelector('.ajax').style.display='none';
    });

    if(a.email) unis = await KUVIO.API('unic_create',a);
    else unis = await KUVIO.API('unic_login',a);
    if(!unis||unis=='') { salert('Error login/password',2000); return KUVIO.LOGIN.login(); }
    clean(name);
    f_save(KUVIO.LOGIN.name,unis);
    if(a.login) f_save(KUVIO.LOGIN.name+'_login',a.login);
    console.log('Login=['+a.login+'] Unis: ',unis);
    KUVIO.LOGIN.init();
 },

},

};
