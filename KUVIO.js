/*
TODO:

-- Запись в базу по нажатию кнопку записи оценки, вот реально не успел с этими нашими отключениями электричества

-- Вывод CV с этими оценками


? Нью рул выглядит как шкала без пояснения, туда бы хотя бы пояснение минимальное добавить.

Пояснения какого плана? "Нажав на эту кнопку, вы сможете добавить в свою схему оценки новый параметр..."? Или пояснения к уже появившемуся? Типа "Вы можете установить свою шкалу оценки, например от 0 до 100 или от -273.15 до +500 с шагом 99 градусов. Если вам нужно сделать бинарную оценку, просто ставьте min=0 max=1 step=1, если будет время мы потом в дизайне станем превращать такие шкалы в красивенький переключатель..."?

+ И еще надо чтобы когда жмешь на аудитора можно было посмотреть какие у него правила, не нашла это

*/


// Kuvio engine

page_onstart.push("KUVIO.init(); if(INIT()) KUVIO.AUDITOR.settings();");

KUVI={
    mirrors: {},

    /// заявка на аудит
    audit_me: async function(audit_id) {
	while(!unis) { await KUVIO.LOGIN.login(); }
	alert(audit_id);
    },

    // files: false,

    load_files: async function() {
        // скачиваем список файлов файлы
        var r = await KUVIO.API('cv_my');
        if(!r) r=[];
        r.sort((a, b) => b.time - a.time); // Sorting the array by time in descending order
        // Запоминаем
        KUVI.files = r;
    },

    // показать справа окно с подробностями об аудиторе
    www_about_auditor: async function(d) {

// dier(d);

    /*
    try {
	d.rules.forEach((r,i)=>{
	    if(r.mode==undefined) {
		var mms=r.min+','+r.max+','+r.step;
		if(mms == '0,100,1') r.mode ='scale';
		else if( mms == '0,1,1') r.mode ='yn';
		else {
		    r.mode='select';
		    r.values=[]; for(var stop=100,i=1*r.min;i<=1*r.max && stop;i+=1*r.step) { stop--; r.values.push(i); }
		}
	    }
	});
    } catch(er){
	d.rules=[];
    }
    */


// dier(d);
/*
  auditName="{#audit_name}"
  candidates="{#number_of_candidates}"
  parameters="{#number_of_parameters}"
  evidence="{#requested_evidence}"
  description="{#audit_description}"
*/

    dom('about_auditor_place',mpers(`
<auditor-info
  audit_id="{#audit_id}"
  audit_name="{#audit_name}"
  audit_candidates="{#audit_candidates}"
  audit_parameters="{#audit_parameters}"
  audit_evidences="{#audit_evidences}"
  audit_description="{#audit_description}"
  audit_blake3="{#audit_blake3}"
  audit_me="1"
  edit_me="0"
>

{for(audit_rules):
<evaluation-component open="" edit="0" mark="0" view="1" data="" num="{#i}" audit_id="{#audit_id}" type="{#type}" name="{#name}" about="{#about}" names={stringify:names}></evaluation-component>
}

</auditor-info>

<div style='height:10px'></div>

<div style='
background:white;
width: 100%;
border-radius: 8px;
display: flex;
flex-direction: column;
align-items: flex-start;
justify-content: flex-start;
padding: 16px;
box-sizing: border-box;
gap: 24px;
text-align: left;
font-size: 12px;
color: rgb(0, 0, 0);
font-family: Inter;
'>

<div style="font-size: 14px; color:black; font-family: Inter;">Requested evidence</div>

<requested-files
    mode="talant"
    audit_id="{#audit_id}"
    audit_blake3="{#audit_blake3}"
    audit_me="1"
    files='{audit_asks}'
    upload="1"
></requested-files>

</div>

`,d)); // <evaluation-component mode="{#mode}" data="1" name="{#name} {#description}" names="{stringify:values}"></evaluation-component>

	// вычислить место на странице
	var Y = dom('pole').getBoundingClientRect().top + window.scrollY; // Y-координата относительно всей страницы
	var y = d.element.getBoundingClientRect().top + window.scrollY; // Y-координата относительно всей страницы
	dom('about_auditor_place').style.marginTop=(y-Y)+'px';
    },

};

KUVIO={
//    api_url: "http://localhost:8484/{action}",
// api_url: "https://kuvio-backend.zymologia.fi/{action}",
 api_url: `https://kuvio-backend.${document.location.hostname.split('.').slice(-2).join('.')}/{action}`,

 init: async function() {

    if(document.location.host == 'localhost') KUVIO.api_url = "http://localhost:8484/{action}";

    KUVIO.LOGIN.init();

    // KUVIO.CV.all();
    // KUVIO.cartLoad(); // загрузить из памяти браузера корзину
    // KUVIO.load(); // загрузить магазин товаров
    // if(KUVIO.test) KUVIO.test();
    // dom('place','OK');
    // IPFS.List();
    // KUVIO.CV.my();
/*
dier( obracom(`

    Вот такой текст.
    В нем https://lleo.me какие-то ссылки.
    Видео как я разговариваю с бабушкой: https://www.youtube.com/watch?v=oDuK2Ds6V90 `) );
*/

//    KUVIO.AUDITOR.all(); // settings();
//    KUVIO.AUDITOR.settings();
    return;
 },


//           ____ _           _      ____ ____ _____
//          / ___| |__   __ _| |_   / ___|  _ \_   _|
//         | |   | '_ \ / _` | __| | |  _| |_) || |
//         | |___| | | | (_| | |_  | |_| |  __/ | |
//          \____|_| |_|\__,_|\__|  \____|_|    |_|
//

 GPT: {

    www_ask: async function() {
	var ara,ask = document.querySelector('textarea.auditor_about').value;
	ajaxon();
	var s = await KUVIO.API('gpt_scale',{ask:ask});

	ajaxoff();
	s=s.replace(/^.*?[\`]{3}(json|)/g,'').replace(/[\`]{3}.*$/g,'');
	console.log(s);

	try {
	    ara = JSON.parse(s);
	} catch(er){
	    salert('Error',800);
	    return;
	}

	if(ara.error) return idie(ara.error);

	ara = KUVIO.AUDITOR.rerules(ara);
	ara.forEach(x=>{
    	    var tr = document.createElement("tr");
	    document.querySelector("TABLE.rules").appendChild(tr);
    	    tr.innerHTML = mpers(KUVIO.AUDITOR.tmpl,{...x,...{tmpl_rule: KUVIO.AUDITOR.tmpl_rule}});
	});
    },

 },


//             _             _ _ _
//            / \  _   _  __| (_) |_ ___  _ __
//           / _ \| | | |/ _` | | __/ _ \| '__|
//          / ___ \ |_| | (_| | | || (_) | |
//         /_/   \_\__,_|\__,_|_|\__\___/|_|
//
 AUDITOR: {

  www_add_request: async function() {
        if(!unis) return;
	var www_auditor=window.event.target.closest('.auditor');
	var ara = { auditor_id: www_auditor.getAttribute('auditor_id') };
	console.log('add request',ara);
	var r = await KUVIO.API('auditor_request_add',ara);
	if(r.id && r.id.length) {
	    // salert("Request sended",1000);
	    www_auditor.querySelector(".my_request").innerHTML = `<input onclick="KUVIO.AUDITOR.www_del_request()" type='button' value='`+mpers("Delete request {day:now}",{now:unixtime()})+`'>`;
	    www_auditor.setAttribute('user_files',r.user_files);
	}
  },

  www_del_request: async function(auditor_id) {
        if(!unis) return;
	var www_auditor=window.event.target.closest('.auditor');
	var ara={
	    auditor_id: www_auditor.getAttribute('auditor_id'),
	    user_files: www_auditor.getAttribute('user_files'),
	}
	console.log('del request',ara);
	if(!ara.user_files) return;
	var r = await KUVIO.API('auditor_request_del',ara);
	if(r.result) {
	    // salert("Request deleted",1000);
	    www_auditor.querySelector(".my_request").innerHTML = `<input onclick="KUVIO.AUDITOR.www_add_request()" type='button' value='REQUEST'>`;
	}
  },


  rerules: function(r){
	r.forEach(x=>{
	    x.percent = (x.name.indexOf('percent')>=0 || x.name.indexOf('%')>=0 || x.name.indexOf('процент')>=0);
	    if(x.percent) {
		if(x.min==undefined || x.min=='') x.min=0;
		if(x.max==undefined || x.max=='') x.max=100;
		if(x.step==undefined || x.step=='') x.step=1;
	    }
	    x.min=1*x.min;
	    x.max=1*x.max;
	    x.step=1*x.step;
	    x.checkbox = x.min+'/'+x.max+'/'+x.step == '0/1/1';
	    x.averageValue = ( 1*x.max - 1*x.min ) / 2 + 1*x.min;
	    x.randomValue = Math.random() * ( 1*x.max - 1*x.min ) + 1*x.min;
	    x.value = x.averageValue;
	    x.disabled = '';
	});
	return r;
  },

  tmpl_rule: `
    <div class='rule_element' data="{#min}|{#max}|{#step}" style='display:flex; align-items:center; width:400px; white-space:nowrap;'>
	{case(checkbox):
	 {1:<label class='switch'><input{#disabled} name="rule_{i}" type="checkbox" onchange="KUVIO.AUDITOR.chRule()"{case(value):{1: checked}{*:}}><div></div></label> <span class='br val' style='margin:0 10px;'>{case(value):{1:ON}{*:OFF}}</span>
	 }
	 {*:
		<span style='font-size:10px;margin:0 10px;'>{#min}</span>
		<input{#disabled} name="rule_{i}" type="range" oninput="KUVIO.AUDITOR.chRule()" min="{#min}" max="{#max}" step="{#step}" value="{#value}" style="width:60%">
		<span style='font-size:10px;margin:0 10px;'>{#max}</span>
		<span class='val'>{#value}</span>{if(percent):%}
	 }
	}
    </div>`,


  tmpl_rule2: `
	{case(checkbox):
	 {1:{case(value):{1:ON}{*:OFF}}}
	 {*:<span style='font-size:10px;margin:0 10px;'>({#min}...{#max})</span> {#value}{if(percent):%}}
	}
    `,

  www_show_rules: async function(id){
	var d=window.event.target;
	var e=d.closest('.auditor_place');
	// if(!id) id=e.getAttribute('data');
	var rules = await KUVIO.API('auditor_id',{id:id});
	if(!rules || !rules.rules) { salert('No rules for '+h(id),1000); return; }
	rules.rules=KUVIO.AUDITOR.rerules(rules.rules);

	clean(d);

	var s=mpers(`
<div class='rules' style='display:inline-block;margin:10px 30px 30px 10px;padding:10px;border: 1px solid #ccc; box-shadow: 0px 15px 15px 15px rgba(0,0,0,0.6); border-radius: 7px 7px 7px 7px;'>
<table cellspacing='20'>{for(rules):<tr>{tmpl0}</tr>}</table>
</div>`,{
	rules: rules.rules,
	tmpl_rule: KUVIO.AUDITOR.tmpl_rule,
	tmpl0: KUVIO.AUDITOR.tmpl0,
	});
	newdiv(s,{class:'auditor_rules'},e,'last');
  },

  all: async function(rt){
	var r = await KUVIO.API('auditor_all');

	// проставить request_time для тех аудиторов, к кому уже сделан запрос
	if(rt){
	    if(!KUVIO.my_requests) KUVIO.my_requests = await KUVIO.API('cv_my_requests');
            // создаем словарь по unic
            var m = KUVIO.my_requests.reduce((map,l) => { map[l.auditor_unic] = l; return map; }, {});
	    r.forEach(x=>{ if(m[x.unic]) {
		    x.request_time = m[x.unic].time;
		    // x.request_id = m[x.unic]._id;
		    x.user_files = m[x.unic].user_files;
		}
	    });
	    // if(!KUVIO.my_grades) KUVIO.my_grades = await KUVIO.API('cv_my_grades');
	}

/*
	var o=mpers(`
<div style='margin:5px; max-width:600px; min-width:400px;'>
{for(auditors):
<div class='auditor' auditor_id='{#_id}' user_files='{#user_files}'>
   <div class='auditor_place' style='padding:10px 25px 10px 25px;position:relative;'>
    <div style='position:absolute;right:20px;top:25px;' class='br'>
	{noif(rt):
	    <div class='my_request' style='font-size:10px;display:inline-block;'>
	    {case(request_time):
		{undefined:<input onclick="KUVIO.AUDITOR.www_add_request()" type='button' value='REQUEST'>}
		{*:<input onclick="KUVIO.AUDITOR.www_del_request()" type='button' value='Delete request {day:request_time}'>}
	    }
	    </div>
	}
	<!-- {day:time} -->
    </div>

    <div style='font-weight:bold;font-size:18px;padding:5px;'>
	<div style='display:inline-block;font-size:28px;user-select:none;' class='mv' alt='Show rules' onclick="KUVIO.AUDITOR.www_show_rules('{#_id}')">&#129440;</div>{#login}
    </div>

    <div style='font-style:italic;padding-top:8px;'>{#about}</div>

   </div>
</div>
}
</div>`,{
	auditors: r,
	rt: (rt?0:1),
});


	if(rt) ohelpc('auditors','All Auditors',o);
	else dom('place',o);
*/

var o=mpers(`
<div class="frame-parent">

<audit-search-panel></audit-search-panel>

{for(auditors):
<audit-panel
    audit_id="{#_id}"
    audit_name="{#login}"
    audit_description="{#about}"
    number_of_candidates="{#n_candidats}"
    number_of_parameters="{#rules.length}"
    requested_evidence="{#n_evidence}"
    rules='{stringify:rules}'>
</audit-panel>
}

</div>`,{
	auditors: r,
	rt: (rt?0:1),
});

	if(rt) ohelpc('auditors','All Auditors',o);
	// else dom('pole',o);
	else dom('place',`<div class="pole" id='place1'><div id='pole'>`+o+`</div><div id='about_auditor_place'></div></div>`);

  },

  requests: async function(){

        if(!unis) await KUVIO.LOGIN.login();

	var r = await KUVIO.API('auditor_my_requests');

	// my rules
	var rules = await KUVIO.API('auditor_my'); // var st=KUVIO.AUDITOR.string2system(r);

	// if( rules && rules[0] ) rules=rules[0];

	if(!rules || !rules.rules) return;

	rules.rules=KUVIO.AUDITOR.rerules(rules.rules);

	var o=mpers(`
<div style='margin:5px;'>

{for(requests):

<form>

<input type='hidden' name='rules_blake3' value='{#rules.blake3}'>
<input type='hidden' name='request_id' value='{#_id}'>

<div>user_files: {#user_files}</div>
<div>request_id: {#_id}</div>
<div>rules.blake: {#rules.blake3}</div>

<table border='0' cellspacing="10" cellpadding="1">
    {for(filelist.files):

<tr hash="{#hash}" name="{#name}">
    <td align='right'><a onclick="return IPFS.View()" href='{ipfs}{#hash}'>{#name}</a></td>
    <td align='right' class='br'>{#size}</td>
    <td class='r'>{dat:time}</td>
</tr>

    }
</table>

<div class='rules' style='display:inline-block;margin:10px 30px 30px 10px;padding:10px;'>
<table cellspacing='20'>{for(rules.rules):
    <tr>
        <td>{#name}:</td>
        <td>{tmpl_rule}</td>
    </tr>
}</table>
</div>

<center><button type="submit" class="input_btn mv0" style="display:unset;" onclick="KUVIO.AUDITOR.www_request_save();return false;" return false;'>Save</button></center>

</form>
}
</div>`,{
	requests: r,
	rules: rules,
	tmpl_rule: KUVIO.AUDITOR.tmpl_rule,

 });

	dom('place',o);
  },




  www_request_save: async function(){
	var d=window.event.target;
	var form = d.closest('FORM')
	var ara={};
	form.querySelectorAll('INPUT').forEach(e=>{
	    ara[e.name] = (e.type == 'checkbox' ? (e.checked?1:0) : e.value );
	});
	var r = await KUVIO.API('auditor_grade_save',ara);
	// dier(r);
	if(r.result) {
	    clean(form);
	    salert('saved',300);
	}
  },


  tmpl:`
    <td style='white-space: nowrap;'>
	<div style='display:inline-block;font-size:24px;' onclick="KUVIO.AUDITOR.delRule()" class="mv" style="font-size:22px" alt="Delete">🗑</div>
	<div style='display:inline-block;font-size:24px;' onclick="KUVIO.AUDITOR.editRule()" class="mv" style="font-size:22px" alt="Edit">&#128221;</div>
    </td>
    <td>
        <div class='rules_name' style='font-weight:bold;font-size:10px;'>{#name}</div>
        <div class='rules_description' style='font-style:italic;font-size:8px;'>{#description}</div>
    </td>
    <td>{tmpl_rule}</td>
  `,

  tmpl0:`
    <td>
        <div class='rules_name' style='font-weight:bold;font-size:10px;'>{#name}</div>
        <div class='rules_description' style='font-style:italic;font-size:8px;'>{#description}</div>
    </td>
    <td>{tmpl_rule}</td>
  `,

  getTRdata: function(tr) {
	var [min,max,step]=tr.querySelector('.rule_element').getAttribute('data').split('|');
	return {
	    min: min,
	    max: max,
	    step: step,
	    name: tr.querySelector('.rules_name').innerHTML.trim(),
	    description: tr.querySelector('.rules_description').innerHTML.trim(),
	};
  },

  editRule: async function(createNew){
	var name = 'editRule', ara, tr = false;

	if(createNew) {
	    ara = {
		min: 0,
		max: 100,
		step: 1,
		name: "",
		description: "",
	    };
	} else {
	    tr=window.event.target.closest('TR');
	    ara=KUVIO.AUDITOR.getTRdata(tr);
	}

    var ara = await new Promise((resolve) => {

	ohelpc(name,'Edit rule',mpers(`
<div>Name: <input value='{#name}' name='name' type='text' placeholder='English knowledge in percentage' size='20'></div>
<div>Description: <input value='{#description}' name='description' type='text' placeholder='' size='50'></div>
<div>
Min: <input value='{#min}' name='min' type='text' size='3' placeholder='0'>
Max: <input value='{#max}' name='max' type='text' size='3' placeholder='100'>
Step: <input value='{#step}' name='step' type='text' size='2' placeholder='1'>
</div>
<center><button type="submit" class="input_btn mv0" style="display:unset;">Save</button></center>
	`,ara));
	var e=dom(name);

	e.querySelector('button').onclick=function() { // Save

	    //  onclick="KUVIO.AUDITOR.www_request_save();return false;"

	    var ara={},s,q;

	    q=e.querySelector("input[name='name']"); s=q.value.trim();
	    if(!s.length) { q.classList.add('input_warning'); return; }
	    ara.name=s; q.classList.remove('input_warning');

	    q=e.querySelector("input[name='description']"); s=q.value.trim();
	    if(!s.length) { q.classList.add('input_warning'); return; }
	    ara.description=s; q.classList.remove('input_warning');

	    q=e.querySelector("input[name='min']"); s=Number(q.value.trim()) || 0;
	    // if(!s.length) { q.classList.add('input_warning'); return; }
	    ara.min=s; q.classList.remove('input_warning');

	    q=e.querySelector("input[name='max']"); s=Number(q.value.trim()) || 0;
	    if(s >= ara.max) { q.classList.add('input_warning'); return; }
	    ara.max=s; q.classList.remove('input_warning');

	    q=e.querySelector("input[name='step']"); s=Number(q.value.trim()) || 0;
	    if(s == 0 || s > ara.max-ara.min) { q.classList.add('input_warning'); return; }
	    ara.step=s; q.classList.remove('input_warning');

	    resolve(ara);
	};
    });

    // изменим только на странице, а запись будет по кнопке save

    clean(dom(name));
    var [ara]=KUVIO.AUDITOR.rerules([ara]);
    if(!tr) {
	tr = document.createElement("tr");
	document.querySelector("TABLE.rules").appendChild(tr);
    }
    tr.innerHTML = mpers(KUVIO.AUDITOR.tmpl,{...ara,...{tmpl_rule: KUVIO.AUDITOR.tmpl_rule}});
  },

  chRule: async function(){
	var d=window.event.target, val='?';
	if(d.type=='range') val=d.value;
	else if(d.type=='checkbox') val=d.checked?'ON':'OFF';
	else console.log('no: '+d.type);
	var e=d.closest('DIV').querySelectorAll('.val')[0];
	if(e) e.innerHTML=val;
  },

  delRule: function(){
	var e=window.event.target.closest('TR');
	e.classList.add('input_warning');
	if(confirm('Delete rules?')) clean(e);
	else e.classList.remove('input_warning');
  },

  delRuleAll: function(){
    if(confirm('Delete all rules?')) document.querySelectorAll("TABLE.rules TR").forEach(tr=>{ clean(tr); });
  },

  saveRules: async function(){
	var ara={
	    about: document.querySelector('textarea.auditor_about').value,
	    rules: [],
	};
	document.querySelectorAll("TABLE.rules TR").forEach(tr=>{ ara.rules.push(KUVIO.AUDITOR.getTRdata(tr)); });
        var r = await KUVIO.API('auditor_my_save',ara);
	KUVIO.AUDITOR.settings();
  },

  // Установки аудитора и его регистрация
  settings: async function(){
        if(!unis) await KUVIO.LOGIN.login();
	var r = await KUVIO.API('auditor_my'); // var st=KUVIO.AUDITOR.string2system(r);
	if(!r) r={};
	if( r && r[0] ) r=r[0];

	if(!r.rules) r.rules=[];
	r.rules=KUVIO.AUDITOR.rerules(r.rules);

        r.rules.forEach((r,i)=>{
            if(r.mode==undefined) {
                var mms=r.min+','+r.max+','+r.step;
                if(mms == '0,100,1') r.mode ='scale';
                else if( mms == '0,1,1') r.mode ='yn';
                else {
                    r.mode='select';
                    r.values=[]; for(var stop=100,i=1*r.min;i<=1*r.max && stop;i+=1*r.step) { stop--; r.values.push(i); }
                }
            }
        });


// dier(r); return;


	dom('place',mpers(`
<center><div style='text-align:left;max-width:800px;'>
<h2>Registration as Auditor <b>{#unis_login}</b></h2>

<p><br>About:
<div><textarea class='auditor_about' style='width:100%;height:60px;'>{#about}</textarea></div>

<table border='0' cellspacing='10' class='rules'>{for(rules):<tr>{tmpl}</tr>}</table>

<p><br><div>
    <input type='button' onclick='KUVIO.GPT.www_ask()' value='Creative'>
    <input type="button" onclick="KUVIO.AUDITOR.editRule(q)" value='New rule'>
    {if(rules.length): <input type='button' onclick='KUVIO.AUDITOR.delRuleAll()' value='Delete All'> }
</div>

<!--- черта нового -->
eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee
@
<auditor-info
  audit_me
  edit_me
  auditName="{#unis_login}"
  candidates="{#number_of_candidates}"
  parameters="{#number_of_parameters}"
  evidence="{#requested_evidence}"
  description="{#about}">
{for(rules):
    <evaluation-component mode="{#mode}" data="1" name="{#name} {#description}" names="{stringify:values}"></evaluation-component>
}
</auditor-info>
@@

<div style='height:10px'></div>

<requested-files></requested-files>

eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee

<!--- /черта нового -->

<center><button type="submit" class="input_btn mv0" style="display: unset;" onclick='KUVIO.AUDITOR.saveRules(); return false;'>Save</button></center>

</div></center>`,{ ...r,...{
	unis_login: unis_login,
	tmpl: KUVIO.AUDITOR.tmpl,
	tmpl_rule: KUVIO.AUDITOR.tmpl_rule,
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

//=======================================================
	var idx = r.map(item => item._id).filter((value, index, self) => self.indexOf(value) === index);

	var grades = await KUVIO.API('cv_packets_grades',{packets:idx});
	var m={};
	if(!grades) grades=[];
	else grades.forEach(x=>{
	    x.rules=KUVIO.AUDITOR.rerules(x.rules);
	    x.grades.forEach((l,i)=>{
		x.rules[i].value=l;
		x.rules[i].disabled=' disabled';
	    });
	    if(!m[x.user_files]) m[x.user_files]=[];
	    m[x.user_files].push(x);
	});

	r.forEach(x=>{ x.grades = (m[x._id]?m[x._id]:[]); });

// console.log(r);
//=======================================================


	dom('place',mpers(`<h2>All packets: {#packets.length}</h2>
<center><table border='0' cellspacing="20" cellpadding="10">
{for(packets):
<tr valign='top'>

    <td align='right'><a href='mailto:{#user_email}'>{#user_login}</a></td>

    <td>{for(files):
        <div><a onclick="return IPFS.View()" href='{ipfs}{#hash}' hash='{#hash}' name='{#name}'>{#name}</a></div>
    }</td>

    <td>

<div style='text-align:left;'>{for(grades):
    <div style='display:inline-block;padding:10px;user-select:none;' alt="{#auditor_about}<br><a href='mailto:{#auditor_email}'>{#auditor_email}</a>">
      <div style='display:inline-block;font-size:18px;'>&#129440;</div> {#auditor_login}
	<span class='br'>{day:time}</span>
    </div>

    <div style='margin-left:50px'>
      <table border='0'>{for(rules):
       <tr>
        <td class='r'>{#name} <span style='font-size:10px;'>({case(checkbox):
            {1:ON/OFF}
            {*:{#min}...{#max}}
        })</span>:</td>
        <td>
	{case(checkbox):
            {1:{case(value):{1:ON}{*:OFF}}}
            {*:{#value}{if(percent):%}}
        }
	</td>
       </tr>
      }</table>
    </div>
}</div>

    </td>


<!--
    <td align='right'><a onclick="return IPFS.View()" href='{ipfs}{#hash}'>{#name}</a></td>
    <td align='right' class='br'>{#size}</td>
    <td class='r'>{dat:time}</td>
-->
</tr>
}
</table>
</center>`,{
	packets:r,
	ipfs: IPFS.endpoint,
	tmpl_rule: KUVIO.AUDITOR.tmpl_rule2,
    }));

    },


    all_ipfs: async function() {
	var r = await KUVIO.API('cv_all_ipfs');
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

	KUVIO.my_requests = await KUVIO.API('cv_my_requests');

	var grades = await KUVIO.API('cv_my_grades');
	if(!grades) grades=[];
	else grades.forEach(x=>{
	    x.rules=KUVIO.AUDITOR.rerules(x.rules);
	    x.grades.forEach((l,i)=>{
		x.rules[i].value=l;
		x.rules[i].disabled=' disabled';
	    });
	});
	// dier(mpers(``,{gredes:rx}));
	// return;

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
}

</table>

<div>
<input name="file[]" size="30" type="file" multiple onchange="KUVIO.CV.addFiles()" alt='Upload 1 or more file'>
</div>

<div><button type="submit" class="input_btn mv0" style="display: unset;" onclick='KUVIO.CV.add_auditors(); return false;'>Add Auditors</button></div>




<div style='text-align:left;'>{for(grades):
    <div style='display:inline-block;padding:10px;user-select:none;' alt="{#auditor_about}<br><a href='mailto:{#auditor_email}'>{#auditor_email}</a>">
      <div style='display:inline-block;font-size:18px;'>&#129440;</div> {#auditor_login}
	<span class='br'>{day:time}</span>
    </div>

    <div style='margin-left:50px'>
      <table cellspacing='20'>{for(rules):
	<tr>
        <td class='r'>{#name}:</td>
        <td>{tmpl_rule}</td>
	</tr>
      }</table>
    </div>
}</div>


<div style='text-align:left;'>{for(requests):
    <div style='display:block;padding:10px;user-select:none;' alt="{#auditor_about}<br><a href='mailto:{#auditor_email}'>{#auditor_email}</a>">
     <div style='display:inline-block;font-size:18px;'>&#129440;</div>
     {#auditor_login}
     <span class='br'>{day:time}</span>
     <span class='br' style='color:grey'>waiting</span>
    </div>
}</div>




</center>`,{
	files:r,
	ipfs: IPFS.endpoint,
	requests: KUVIO.my_requests,
	grades: grades,
	tmpl_rule: KUVIO.AUDITOR.tmpl_rule,
}));

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

  // требуется e.files
  addFiles: async function(e,set){ if(!set) set={};
    if(!unis) return;
    if(!e) e=window.event.target;
    ajaxon();
    var formData = new FormData();
    if(!e.files) return;
    for(var i=0; i < e.files.length; i++) {
	if(e.files[i].filebody!=undefined) { // если текст файла
	    const file = new File(
		[e.files[i].filebody], // текст файла
		e.files[i].name, // имя файла
		{ type: (e.files[i].type ? e.files[i].type : "text/plain") } // тип файла - по умолчанию текст
	    );
	    formData.append("file[]", file);
	} else {
	    formData.append("file[]", e.files[i], e.files[i].name);
	}
        // Добавить еще about к файлам, если есть
	if(e.files[i].about) formData.append('about_'+i,e.files[i].about);
    }

    formData.append('unic', unis);

    // Отправка данных на сервер с помощью fetch
    try {
        let response = await fetch( mpers(KUVIO.api_url,{action:'cv_my_add'}) , { method: 'POST', body: formData });
        if(response.ok) {
	    ajaxoff();
	    const r = await response.text();
	    if(set.callback) set.callback(r); else KUVIO.CV.my(); // Upload my list
	    return r;
        }
	throw new Error('Upload error: '+response.statusText);
    } catch(er) {
        ajaxoff();
	if(set.error) set.error(er); else KUVIO.error(er);
	return false;
    }
  },

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
//    if(typeof(unis)!='undefined') return; // !!!!!!!!!!!!!!!!!!!!!!!!!!!
    unis=f_read(KUVIO.LOGIN.name);
	console.log('unis('+typeof(unis)+')='+unis);
    unis_login=f_read(KUVIO.LOGIN.name+'_login');
	console.log('unis_login('+typeof(unis_login)+')='+unis_login);
    var l = (unis.indexOf && unis.indexOf('-') && unis_login);
    var e=dom('.unis_login_name');
    if(!e) return;
    e.innerHTML=(l && unis_login && (''+unis_login).length ? '&#128100;&nbsp;'+unis_login : 'Login');
    if(l) { e.setAttribute('alt','Logged in as: <b>'+h(unis_login)+'</b>'); init_tip(e); }
    else { e.removeAttribute('tiptitle'); e.removeAttribute('alt'); }

  },

  logout: async function() {
    f_del(KUVIO.LOGIN.name);
    f_del(KUVIO.LOGIN.name+'_login');
    KUVIO.LOGIN.init();
  },

  login: async function() {
/*
    console.log('login');
    // Получаем стек вызовов
    const stack = new Error().stack;
    // Логируем стек
    console.log('Call stack:', stack);
    // Вы можете попытаться извлечь имя вызывающей функции из стека
    const caller = stack.split('\n')[2].trim(); // Третья строка содержит вызвавший метод
    console.log('Called by:', caller);
*/
    var name = 'enter_password';
    var template = 'dialog-login.html';

    var a = await new Promise((resolve) => {

	if(!dom(name)) {
		var st = mpers( KUVIO.template( template ),{
		    ajaxgif: ajaxgif,
		    unis: unis && (''+unis).length,
		    unis_login: unis_login,
		});
	    // ohelpc(name,'Login',st);
	    dialog(st,'Login');
	}

	var e=dom(name);

	e.querySelector('button').onclick=function(){ // Login

	    console.log('button');

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
    if(!unis||unis=='') {
	    // salert('Error login/password',2000);
	    var e = dom(name).querySelector('.err_message');
	    e.innerHTML = 'Error login/password';
	    e.style.display = 'block';
	    return KUVIO.LOGIN.login();
    }

    var x = dom(name).closest('dialog');
    if( x ) dialog.close(x);
    clean(name);

    f_save(KUVIO.LOGIN.name,unis);
    if(a.login) f_save(KUVIO.LOGIN.name+'_login',a.login);
    console.log('Login=['+a.login+'] Unis: ',unis);
    KUVIO.LOGIN.init();
 },

},

    // Система получения нужных templates по необходимости
    templates: {},
    template: function(name) {
	// Проверяем, есть ли
        if(KUVIO.templates[name]) return KUVIO.templates[name];
        // Если нет, загружаем синхронно
	var xhr = new XMLHttpRequest();
	xhr.open('GET', '/template/' + name, false); // false делает запрос синхронным
	xhr.send();
        if(xhr.status === 200) return KUVIO.templates[name] = xhr.responseText;
	// Обрабатываем ошибку, если шаблон не удалось загрузить
	console.error('Error loading template:', xhr.status, xhr.statusText);
	return null;
    },

};


function unixtime() {
    return Math.floor(Date.now() / 1000);
}
