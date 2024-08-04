// page_onstart.push("IPFS.onready=function(){IPFS.List()};IPFS.init()");

IPFS={
// wss://node-shave.zymologia.fi

endpoint: 'https://ipfs.zymologia.fi/', // proxy_pass http://127.0.0.1:8181;
endpoint_doc: 'https://ipfs.zymologia.fi/type_doc/', // proxy_pass http://127.0.0.1:8181;
endpointSave: 'https://ipfs.zymologia.fi/OOO_Add_IDDQD', // proxy_pass http://127.0.0.1:5001/api/v0/add?hash=blake3;
endpointRm: 'https://ipfs.zymologia.fi/OOO_Rm_IDDQD',
endpointLs: 'https://ipfs.zymologia.fi/OOO_ls',

// сюда можно записать свою функцию при старте
onready: function(){},

// Загрузить библиотеку первым делом при старте страницы
init: async function() {
    if(typeof(mainjs)!='undefined') await LOADS_promice(mainjs+'ipfs.js');
    else await LOADS_promice('https://unpkg.com/multiformats/dist/index.min.js');
    IPFS.onready();
},

// перевести массив байт в строку вида "11 22 33 44 55 66 77 88 99 00 aa bb cc dd ee ff"
HEX: function(ara) {
    var o=[]; ara.forEach( (x)=> { o.push( (x >= 16 ? '':'0') + (x & 0xFF).toString(16) ); });
    return o.join(' ').toUpperCase();
},

// перевести массив байт в строку вида "0x11223344556677889900aabbccddeeff"
hex0x: function(ara) {
    var o="0x"; ara.forEach( (x)=> { o+=( (x >= 16 ? '':'0') + (x & 0xFF).toString(16) ); });
    return o;
},

// извлечь массив 32 байт из адреса ipfs
cid2bytes: function(url) {
    if(url.indexOf('/')>=0) {
	url=url.split('/');
	url=url[url.length-1];
    }
    return Multiformats.CID.parse(url).multihash.digest;
},

// перевести значимую часть 32 байта вдреса ipfs в строку вида "0x11223344556677889900aabbccddeeff"
cid2hex: function(url) {
    return IPFS.hex0x(IPFS.cid2bytes(url));
},

// перевести строку вида "0x11223344556677889900aabbccddeeff" в значимую часть 32 байта вдреса ipfs
hex2cid: function(hex) {
    hex = (30).toString(16)+(32).toString(16)+(''+hex).replace(/^0x/g,'');
    const x = Uint8Array.from(hex.match(/.{1,2}/g).map((byte) => parseInt(byte, 16)));
    return Multiformats.CID.createV1(85,{bytes: x}).toString();
},

// добавить в начале https://ipfs.zymologia.fi/
hex2url: function(hex) {
    return IPFS.endpoint+IPFS.hex2cid(hex);
},

// по хэшу найти верхний объект TR в таблице вьювера ipfs-list-table
find_tr: function(e) {
    if(!e) e=window.event.target;
    if(typeof(e)=='object') return (e.nodeName == 'TR' ? e : e.closest('TR') );
    if(typeof(e)!='string') return console.error("find_tr: not String");
    var x=document.querySelector("TR[hash='"+e+"']"); if(x) return x;
    if(e.indexOf('://')<0) e=IPFS.endpoint+e;
    return dom('ipfs-list-table').querySelector("A[href='"+e+"']").closest('TR');
},

// вернуть точно хэш (даже если это был объект)
find_hash: function(hash) {
    if(!hash) hash=window.event.target;
    if(typeof(hash)=='object') {
	var x=hash.getAttribute('hash'); if(x) return x;
	hash=IPFS.find_tr(hash);
	x=hash.getAttribute('hash'); if(x) return x;
	hash.querySelector('A').href;
    }
    return hash.replace(/^.*\//g,'');
},

// Удаление с Веба
Del: function(hash) {
    if(!confirm('Delete?')) return;
    hash=IPFS.find_hash(hash);
    AJAX(IPFS.endpointRm,{
    callback:function(o){
	console.log('Ok callback');
	dier(o);
	try {
	    var j=JSON.parse(o).Pins;
	    if(j.length!=1) do_catch_error();
	    clean( IPFS.find_tr( j[0]) );
	    clean('ipfs-view');
	} catch(er){ alert('error: '+er); }
    },
    onerror:function(o,u,s){
	console.log('Error onerror');
	try { o=print_r(JSON.parse(o));	} catch(er){ o=h(o); }
	ohelpc('idie2',
	    red(h(this.status)+' '+h(IPFS.statusText)),
	    h(this.responseURL)+'<br>[ '+print_r(s)+' ]<br>'+o.replace(/\n/g,'<br>')
	);
    },
    noajax:1
    }, {arg:hash} );
},

// Методом HEAD получить content-type и 'content-length' и выполнить с ними заданную fn()
Type: function(hash,fn) {
    hash=IPFS.find_hash(hash);
    AJAX(IPFS.endpoint+hash,{method:'HEAD',callback:function(o,url){
	var type=this.getResponseHeader('content-type').replace(/;.+/g,'');
	var leng=this.getResponseHeader('content-length');
	if(leng===null) leng='';
	fn(hash,type,leng);
    }});
},

// Веб-вьювер текстовых файлов
ViewFile: function(type,url) {
    AJAX(IPFS.endpoint+url,function(o){
	o=h(o).replace(/\n/g,'<br>');
	if(type.indexOf('unknown')>=0) o="<div class='br'>"+o+"</div>";
	var header="<i alt='Delete' onclick=\"IPFS.Del('"+url+"')\" class='e_cancel mv'></i>&nbsp;"+h(type);
	ohelpc('ipfs-view',header,o);
    });
},

HtmlView: function(html,hash,type) {
    IPFS.viewer("<i alt='Delete' onclick=\"IPFS.Del('"+hash+"')\" class='e_cancel mv'></i>&nbsp;"+h(type),html);
},

PageView: function(url,hash,type) {
    IPFS.viewer("<i alt='Delete' onclick=\"IPFS.Del('"+hash+"')\" class='e_cancel mv'></i>&nbsp;"+h(type),
	`<iframe src="${url}" frameborder='0' style="width:95vw;height:95vh" onload="center('ipfs-view','max')"></iframe>`
    );
},

GoogleView: function(url,hash,type) {
    url = "https://docs.google.com/gview?embedded=true&url="+encodeURIComponent(url);
    IPFS.PageView(url,hash,type);
},

viewer: function(header,html) {
    ohelpc('ipfs-view',header,html);
    center('ipfs-view','max');
},

viewer_iframe: function(name,url) {
    IPFS.viewer(name,`<iframe src="${url}" frameborder='0' style="width:95vw;height:95vh" onload="center('ipfs-view','max')"></iframe>`);
},

// Вьювер всех файлов (для текстовых вызовет ViewFile)
View: function(e) {
    var tr=IPFS.find_tr(e);
    var hash=IPFS.find_hash(tr);
    var url=IPFS.endpoint+hash;
    var name=tr.getAttribute('name');
    if(!name) {
        var type=tr.getAttribute('content-type') || 'text/plain';
        if(type.startsWith('audio/')) name='mp3';
	else if(type.startsWith('video/')) name='mp4';
        else if(type.startsWith('image/')) name='jpg';
        else if(type=='application/msword') name='doc';
        else if(type=='application/x-ole-storage') name='doc';
        else if(type=='application/pdf') name='pdf';
	else if(type=='text/rtf') name='rtf';
        else if(type.startsWith('text/')) name='txt';
	else name='unknown';
    }
    IPFS.view_url(url,name);
    return false;
},

view_url: function(url,name,type) { // type in [image video audio text document archive]
    if(!name) name=url;
    if(!type) type = name.split('.').pop().toLowerCase();

    if(['jpg', 'gif', 'png', 'webp', 'jpeg', 'svg'].includes(type)) {
	IPFS.viewer(name, mpers(`<img src="{#url}" style="max-width:95vw;max-height:95vh" onload="center('ipfs-view','max')">`,{url: url}) );
    }

    else if(['mp3', 'ogg', 'wav'].includes(type)) {
	changemp3x(url+'?type=.mp3',name);
    }

    else if (['mp4', 'avi', 'mkv', 'webm', 'mov', 'flv', 'avi'].includes(type)) {
	changemp3x(url+'?type=.mp4',name);
    }

    else if (['rtf', 'doc', 'docx', 'xls', 'xlsx', 'csv', 'ppt', 'pptx', 'pps', 'ppt'].includes(type)) {
	url = url.replace(IPFS.endpoint, IPFS.endpoint_doc);
	url = "https://docs.google.com/gview?embedded=true&url="+encodeURIComponent(url);
	IPFS.viewer_iframe(name,url);
    }

    else if(type=='pdf') {
        // Браузер умеет PDF сам?
        if( window.navigator && window.navigator.pdfViewerEnabled ) IPFS.viewer_iframe(name,url);
	else {
	    url = "https://docs.google.com/gview?embedded=true&url="+encodeURIComponent(url);
	    IPFS.viewer_iframe(name,url);
	}
    }

    else if(type=='txt') {
        AJAX(url,function(o){
	    o=h(o).replace(/\n/g,'<br>');
	    if(o.length > 4096) o="<div class='br'>"+o+"</div>";
	    IPFS.viewer(name, o);
	});
    }

    else if (['zip', 'rar', '7z', 'tar', 'gz'].includes(type)) {
	salert(h(name)+'<br>archive',1000);
    }

    else salert(h(name)+'<br>unknown type',1000);
},


// Веб-эксплорер файлов ipfs
List: function() {
    AJ(IPFS.endpointLs,function(o){
	try {
	    var j=JSON.parse(o).Keys;
	    var o='',i=0;

	    var tmpl="<tr>"
		+"<td>{i}</td>"
		+"<td><i alt='Delete' onclick='IPFS.Del(this)' class='e_cancel mv'></i></td>"
		+"<td><a class='r' onclick='return IPFS.View(this)' href='{#url}'>{#hash}</a></td>"
		+"<td><i class='e_help'></i></td>"
		+"<td class='r'></td>"
		+"<td class='r leng'></td>"
		+"<td>{type}</td>"
		+"<td class='br'><a href='{ipfsurl}' target='_blank'>ipfs.io</td>"
		+"</tr>";

	    for(var hash in j) {
		var type = j[hash].Type;
		if(type == 'recursive') type=green(type); else type=red(type);
		o+=mpers(tmpl,{
		    i: ++i,
		    type:type,
		    hash:hash,
		    url:IPFS.endpoint+hash,
		    ipfsurl: "https://ipfs.io/ipfs/"+hash,
		});
	    }

	    o="<table border='0' cellspacing='10' id='ipfs-list-table'>"+o+"</table>";
	    if(dom('ipfs-list')) dom('ipfs-list',o); else ohelpc('ipfs-list','IPFS files',o);

	    for(var hash in j) {
	        IPFS.Type(hash,function(hash,type,leng){
		    var tr=IPFS.find_tr(hash);
		    if(!tr) return;
		    tr.setAttribute('content-type',type);
		    tr.querySelector('TD.r').innerHTML=h(type);
		    tr.querySelector('TD.leng').innerHTML=h(leng);
		    var t=type.split('/')[0];
		    var c = 'e_ledpurple'
		    if(type=='text/plain') c='e_kontact_journal';
		    else if(type=='text/html') c='e_kontact_notes';
		    else if(t=='audio') c='e_ljvideo';
		    else if(t=='video') c='e_play-youtube';
		    else if(t=='image') c='e_image';
		    else if(t=='document') c='e_filenew';
		    tr.querySelector('I.e_help').className=c;
		});
	    }
	} catch(e){ alert('error'); }
    },{quiet:true,stream:true,type:"recursive"});
},

save: function(s){
    return new Promise(function(resolve, reject) {
	ajaxon();
	var blob = new Blob([s], { type: "text/plain"});
	var formData = new FormData();
	formData.append("file", blob, "comment.txt");
	AJ(IPFS.endpointSave,function(o){
    	    ajaxoff();
	    try {
		var j=JSON.parse(o);
		if(j.Hash) resolve(j.Hash);
		else resolve(false);
	    } catch(e){ reject(''+e); }
	},formData);
    });
},

// Веб-запись новой итерации в блокчейн
Save: async function(s) {
    s=dom('ipfs_text').value;
    var hash=await IPFS.save(s);
    if(!hash) idie('Error hash!');
    var url=IPFS.endpoint+hash;
    var w=dom('new_ipfs'); if(w) dobavil(w,"<div><a target='_blank' href='"+url+"'>"+url+"</a>"
+"<div class='br'><b>"+IPFS.cid2hex(url)+"</b>"
+" &nbsp; <i onclick=\"if(confirm('Delete?'))IPFS.rm('"+url+"')\" class='e_cancel mv'></i>"
+"</div></div>");
    IPFS.List();
},


// Утилитка для изучения новых JS-библиотек
libtest: function(url) {
    alert('ok');
    return;
   var OiShoBylo=[]; for(var i in window) OiShoBylo.push(i);
   LOADS_sync(url,function(){
    var OiShoStalo={}; Object.assign(OiShoStalo,window);
    for(var i of OiShoBylo) delete(OiShoStalo[i]);
    dier(OiShoStalo);
    });
},

};