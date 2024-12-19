
function bool(x) { return ['0','no','false','undefined'].includes( (''+x).toLowerCase() ) ? false : true; }

function FileTime(x) {
        if( Math.abs( Date.now()/1000 - 1*x ) <= 5*60 ) return "just now";
        const d = new Date(1000*x);
        const yyyy = d.getFullYear();
        const mm = String(d.getMonth()+1).padStart(2,'0');
        const dd = String(d.getDate()).padStart(2,'0');
        return `${yyyy}-${mm}-${dd}`;
}

function INIT(){
    nonav = 1;

    ohelpc=function(id,header,s) { dialog(s,header); }

    salert = function(l,t) {
	var header,k=l.indexOf('<p>');
	if(k>=0) {
	    header=l.substring(0,k);
	    l=l.substring(k+3);
	} else {
	    header='&nbsp;';
	}
	var id=dialog(l,header,{id:'salert'});
        if(t) setTimeout(()=>{dialog.close(id)},t);
        return false;
    };

    document.addEventListener('keydown', function(event) {
	if(event.key === 'Escape') {
	    const p = document.querySelectorAll('dialog[open]');
	    console.log(p);
	    if(p.length > 0) setTimeout(()=>{p[p.length - 1].remove()}, 10); // Удаляем самый верхний открытый
	}
    });

    memli_init();
    return false;
}

unis = "a3IZTNyJ2cPD2A9G-d851f0e3a61f367eddf41fae6673c48b76d42d93b78b88a30e03552287ca7116";

mudaki=function(x){
    if(!x) x = 'T E S T';
    document.querySelector('#buka').innerHTML = x;
}

dialog=function(s,header,set) { if(!set) set={};

    if(set && set.id) {
	var id = set.id;
	var e = document.querySelector('dialog#'+id);
	if(e) {
	    e.querySelector('.dialog-content').innerHTML = s;
	    return id;
	}
    } else {
	dialog.id++;
	var id = 'dialog_'+dialog.id;
    }

    s = (header==undefined ? ''
		    : `<div class="modal-top">
			<div class="modal-item">`+header+`</div>
			<div class="modal-close mv0" onclick="dialog.close('`+id+`')">Close</div>
		    </div>`
		)+`<div`
		    +` class="modal-item dialog-content`+(set.classHead?' '+set.classHead:'')+`"`
		    +` style="padding: 16px 16px 16px 16px;`+(set.styleHead?set.styleHead:'')+`"`
		    +`>`+s+`</div>`;

    var e = document.createElement('dialog');
    e.id = id;
    e.innerHTML = s;
    var x='background-color'; e.style[x] = (set && set[x] ? set[x] : 'white');
    document.body.appendChild(e);

    e.showModal();
    // e.style.backdropFilter = 'opacity(0.75)';
    // e.style.zIndex=dialog.id;
    e.classList.add('showing');
    e.classList.remove('closing');

    return id;
};

dialog.id=0;
dialog.close=function(e) {
    (typeof(e)=='object' ? [e] : document.querySelectorAll( e ? '#'+e : 'dialog') ).forEach(x=>{
        x.classList.add('closing');
	x.classList.remove('showing');
	setTimeout(() => { x.remove(); }, 300); // Таймаут для завершения анимации
    });
};

async function my_confirm(text, opt) {
    if(typeof(opt)!='object') opt={};
    if(!opt.yes) opt.yes='Yes';
    if(!opt.no) opt.no='No';
    var id='confirm_'+(''+Math.random()).replace('.','-');
    return new Promise((resolve) => {
        dialog(`<div style="padding:10px;text-align:center;width:100%;">
    <button class='mv0' id="my-confirm-yes" style="
	    font-size: 20px;
            color: white;
	    font-weight: bold;
        padding: 10px 40px;
        background-color: #4CAF50;
        border: none;
        border-radius: 10px;
        cursor: pointer;
        margin-right: 50px;
    ">`+opt.yes+`</button>
    <button class='mv0' id="my-confirm-no" style="
	    font-size: 20px;
            color: white;
	    font-weight: bold;
        padding: 10px 40px;
        background-color: #f44336;
        border: none;
        border-radius: 10px;
        cursor: pointer;
    ">`+opt.no+`</button>
</div>`,`<div style='font-size:16px;width:400px;'>`+text+`</div>`,{id:id,styleHead:"min-width:400px;"});
        // Обработчики для кнопок
        document.getElementById('my-confirm-yes').onclick = () => { dialog.close(id); resolve(true); };
        document.getElementById('my-confirm-no').onclick = () => { dialog.close(id); resolve(false); };
    });
}


memli_clean=function(){
    dom('memul').querySelectorAll('LI').forEach(x=>{
	x.querySelector('A').style.border='unset';
	x.style.border='unset';
    });
};

memli=function() {
    var e = window.event.target;
    memli_clean();
    e.style.border='1px solid red';
    f_save('memli',e.innerHTML);
    console.log(e.innerHTML);
};


function diafu(){
    var e=window.event.target, name=e.getAttribute('name'), tag=e.getAttribute('tag'), value=e.getAttribute('value');
    e.closest('.pkk').querySelector(tag).setAttribute(name,value);
    e.closest('div').querySelectorAll('input').forEach(x=>{
	x.style.border='2px solid '+(x.getAttribute('value')==value ? 'lightblue' : 'transparent');
    });
}

function dia(s,h) {
    var o='';
    var tag=s.match(/^<(\S+)/)[1];

    s=s.replace(/\s+([0-9a-z\-\_]+)\=\"([^\"]+)\"/g, // "
	function(t0,name,x) {
	    console.log('name='+name);
	    var x=x.split('|');
	    var a=""; x.forEach((l,i)=>{  a+=` <input style="border-radius:5px; border:2px solid `+(i?'transparent':'lightblue')+`;min-width:50px;" type="button" tag="${tag}" name="${name}" value="${l}" onclick="diafu()">`; });
	    o+=`<div style='margin-bottom:5px;'>${name}: ${a}</div>`;
	    return ` ${name}="${x[0]}"`;
	}
    );
    dialog("<div class='pkk' style='margin-bottom:5px;min-width:500px;text-align:left;'>"+o+"<p><div style='margin-top:30px;' class='rama'>"+s+"</div></div>",h);
}

ACTS={

    MENU: function(){ dom('work',`<menu-screen></menu-screen>`); dialog.close(); },

    candidat_screen: function(){ ACTS.default('candidat_screen'); dom('pole',`<candidat-screen id='candidat-screen' mode='Documents'></candidat-screen>`); dialog.close(); },

    main_screen: function(){ ACTS.default('main_screen'); dom('pole',`<main-screen id='main-screen' mode='Candidates'></main-screen>`); dialog.close(); },

    second_screen: function(){ ACTS.default('second_screen'); dom('pole',`<second-screen id='second-screen' mode='Candidates'></second-screen>`); dialog.close(); },

    default: function(act){

	const menu=[
	    "Kuvio",
	    "Assess:main_screen", // Assess (кабинет оценщика)
	    // -- Audits (мои аудиты и их редактирование, все что в Admins-->Audits сейчас)
	    // -- Candidates (кандидаты на оценку, как и сейчас)
	    "Hire:Audit_Content", // Hire
	    // -- Talents (таблица с людьми, которая еще не отрисована, но мы знаем, что она там должна быть)
	    // -- Assessors (оценщики с их профилем и репутацией, еще не отрисовано тоже)
	    // -- Audits (релевантные мне как нанимателю аудиты)
	    "Get hired:candidat_screen", // Get hired (раздел Таланта)
	    // -- Ready to assess you (аудиторы которые могут тебя оценить по своим правилам, сейчас все, а в будущем те, чьему профилю ты соответствуешь, сейчас то, что в Audits)
	    // -- Hiring now (наниматели которые активны на платформе, интерфейса еще нет нарисованного)
	].join('|');

	if(!act) act="";
	dom('work',`<main-first-string act="${act}" menu="${menu}"></main-first-string>
	    <div id='pole' style="display: flex; gap: 20px; padding-right: 40px;"></div>`);
    },

    dialog_login: function(){ KUVIO.LOGIN.login(); },

    all: function(){
	dialog.close(); // закрыть все
	var s=''; for(var i in ACTS) s+=`<div class='l mv0' onclick='memli_init(this.innerHTML)'>`+h(i)+`</div>`;
	dialog('all tests', "<div>"+s+"</div>");
    },

    select_parameter: function(){ ACTS.all(); dia(`<select-parameter
	name='My great name'
        names='["Кетцалькоатль","Шипе-Тотек","Коатликуэ","Майяуэль"]'
        values='[0,1,1,0]'
        edit="1|0"
        mark="1|0"
        type="scale|select|multi|yn"
	header="My great header {percent}%|{percent}%|#|{percent}%-|-|"
    ></select-parameter>`,'New parameter'); },

    "requested-files": function(){ ACTS.all(); dialog(`<requested-files
	mode="talant"
	audit_id="GZtbGYHmlVZ2DI9g"
	files='[{\"type\":\"file\",\"name\":\"Фото автомобиля\",\"about\":\"Пришли те пожалуйста фотографию вашего автомобиля фас или профиль, можно также днище\"},{\"type\":\"text\",\"name\":\"Опишите ваш автомобиль\",\"about\":\"Несколько слов о вашем автомобиле в свободной форме\"},{\"type\":\"file\",\"name\":\"Проверка разных типов медиа-ссылок\",\"about\":\"В описании тоже можно использовать медиа и ссылки. А вот скрипты внедрить наверно не получится.\\n\\nhttps://lleo.me/dnevnik/2013/11/Zilant/Tikkey_DURAKI.mp3\\n\\n\\nhttps://www.youtube.com/watch?v=PMTSanPKGjQ\\n\\nЗа спиной неся зеленый ранец через буреломы и дожди, шел по лесу вегетарианец со значком \\\"Гринписа\\\" на груди. Рис проросший по пути жевал он, запивая струями дождя, ставил себе клизмы на привалах, шлаки по системе выводя. Шел вперед от края и до края, песни пел, молился без конца, комаров-эндемиков гоняя с доброго усатого лица. И, живя в гармонии и мире, двигался туда, где видел дым: так как вел он месяца четыре слежку за геологом одним.\\n\\nПодробнее на моем сайте https://lleo.me\\n\\nhttps://lleo.me/lleo2016site.jpg\\n\\nГоворя по-правде, между нами, был геолог этот всех дрянней: из консервных банок ел руками трупы уничтоженных свиней, спирт глотал из пластиковой фляги, песни непристойные орал, мусорил окурками в овраге и месторождения искал. Этому подонку было надо, чтоб в тайгу бурильщики пришли и достали всяческого яда из планеты-матушки Земли. Чтоб железный грейдер раз за разом растоптал листочки, шишки, мох, кислород сменился смрадным газом и комар-эндемик передох... Шел геолог по тайге, скотина, в душу ей плевал, как в унитаз, а ему смотрела строго в спину вегетарианских пара глаз. Часто думал вегетарианец: погоди, преступник, вот те хрен! И мигал его зеленый ранец, отправляя сводки в CNN!\"}]'
    ></requested-files>`,"requested-files");
    },


//    "talent-grade": function(){ ACTS.all(); dialog(`<talent-grade></talent-grade>`,'talent-grade'); },

    "talent-grade": function(){ ACTS.all(); dialog(`<talent-grade request_id="C7HA1QPL4PoDMDh2" request_time="1731365638" candidat_login="lleo" candidat_unic="a3IZTNyJ2cPD2A9G" mirror_id="uRq4EftMRaBce8cm" asks_json="[{&quot;blake3&quot;:&quot;bafyb4iaiqz2anesfh7u7p5sl3so5ppftandqi4pnlmpyjxyop5myqdkas4&quot;,&quot;about&quot;:&quot;Демо мелодия&quot;},{&quot;blake3&quot;:&quot;8e7a76ae392b3aee8d97ca9f5b5a8b961859dd13f9644fd68790bd02dfe074dd&quot;,&quot;about&quot;:&quot;Смешно с вами разговаривать, сударь.&quot;}]"></talent-grade>`,'talent-grade'); },

    "result-table": function(){ ACTS.all(); dialog(`<result-table></result-table>`,'result-table'); },

    "auditor-info": function(){ ACTS.all(); dialog(`
	<auditor-info audit_id="GZtbGYHmlVZ2DI9g" auditname="Оценка подержанных автомобилей" candidates="0" parameters="0" evidence="0" description="Я очень большой эксперт по автомобилям и пожарным машинам" audit_me="1" edit_me="0">
	    <evaluation-component open="" edit="0" mark="0" data="" num="0" audit_id="" type="select" name="Кому принадлежит автомобиль" about="Попробуем догадаться" names="[&quot;мне&quot;,&quot;нам&quot;,&quot;наше&quot;]"></evaluation-component>
	    <evaluation-component open="" edit="0" mark="0" data="" num="1" audit_id="" type="scale" name="Скорость автомобиля" about="В процентах от световой" names="[&quot;1212&quot;,&quot;2323&quot;,&quot;3434&quot;]"></evaluation-component>
	    <evaluation-component open="" edit="0" mark="0" data="" num="2" audit_id="" type="yn" name="Колеса есть?" about="Хотя бы одно" names="[]"></evaluation-component>
	    <evaluation-component open="" edit="0" mark="0" data="" num="3" audit_id="" type="multi" name="Наличие полезных опций" about="Кстати, можно вводить сразу несколько параметров, разделяя их в окне ввода знаком |" names="[&quot;Руль&quot;,&quot;Задний" бампер","Передний="" бампер","Фары"]=""></evaluation-component>
	</auditor-info>`,'auditor-info');
    },


Audit_Content: async function(){
    ACTS.default('Audit_Content');
    dom('pole',`

<div class="frame-parent">

<audit-search-panel></audit-search-panel>

<DIV id='audits' style="width:100%; display:flex; flex-direction:column; align-items:flex-start; justify-content:flex-start; gap:24px;">
            <div style='width:100%; padding: 12px 16px;'>
                <div class="skeleton" style="width:80%;"></div>
                <div class="skeleton" style="width:60%;"></div>
                <div class="skeleton" style="width:90%;"></div>
            </div>

            <div style='width:100%; padding: 12px 16px;'>
                <div class="skeleton" style="width:80%;"></div>
                <div class="skeleton" style="width:60%;"></div>
                <div class="skeleton" style="width:90%;"></div>
            </div>

            <div style='width:100%; padding: 12px 16px;'>
                <div class="skeleton" style="width:80%;"></div>
                <div class="skeleton" style="width:60%;"></div>
                <div class="skeleton" style="width:90%;"></div>
            </div>
</DIV>

</div>
<div id='about_auditor_place' style='max-width:600px;'></div>
`);
    dialog.close();

    var r = await KUVIO.API('auditor_all');

    dom('audits','');
    r.forEach(p => {
	    let e = document.createElement('audit-panel');
	    e.audit_id=p._id;
	    e.audit_name=p.name;
	    e.audit_description=p.about;
	    e.audit_blake3=p.blake3;
	    e.audit_candidates="0";
	    e.audit_parameters="0";
	    e.audit_evidences="0";
	    // p.time p.login p.unic
	    e.audit_asks = JSON.stringify(p.asks);
	    e.audit_rules = JSON.stringify(p.rules);
	    dom('audits').appendChild(e);
    });

},


Audit_Content1: function(){ ACTS.all(); dialog(`

<audit-panel
    mode="edit"
    audit_id="1"
    audit_name="Product designer"
    audit_description="We conduct a thorough audit of product designers' CVs to ensure they meet the qualifications needed for key roles in tech startups."
    audit_candidates="78"
    audit_parameters="10"
    audit_evidences="4">
</audit-panel>

`,this.constructor.name); },

Document_Content: function(){ ACTS.all(); dialog(`
<document-component
  icon="img/upload_2.svg"
  docType="Uploaded document"
  docName="Portfolio"
  description="Three insightful projects are enough. Quality and depth over quantity. Tell us what the constraints were, which challenges you encountered, how you solved them.">
</document-component>`,this.constructor.name); },

    "file-upload": function(){ ACTS.all(); dia(`<file-upload
	    type="file|text"
	    name='Test task'
	    description='Write a project plan for designing an initial version of a "Heads or Tails" app in 6 weeks. Less is more – the plan should be concise, focused, and demonstrate your ability to think strategically about designing a simple yet engaging app.'
	    ></file-upload>`,'file-upload');
    },

    Upload_File: function(){ ACTS.all(); dialog(`<win-upload-file name='Test task' description='Write a project plan for designing an initial version of a &quot;Heads or Tails&quot; app in 6 weeks. Less is more – the plan should be concise, focused, and demonstrate your ability to think strategically about designing a simple yet engaging app.'></win-upload-file>`,'Upload File'); },
    Upload_Text: function(){ ACTS.all(); dialog(`<win-upload-text name='Test task' description='Write a project plan for designing an initial version of a &quot;Heads or Tails&quot; app in 6 weeks. Less is more – the plan should be concise, focused, and demonstrate your ability to think strategically about designing a simple yet engaging app.'></win-upload-text>`,'Upload Text'); },

    confirm: function(){ ACTS.all(); (async () => { if( await my_confirm('Удалить?') ) alert('Deleting!'); })() },

    header: function(){ ACTS.all(); dialog(`<div style='width: 1900px;padding: 20px 5px 0 5px;background-color:#ccc;'><header-component menu='Один,Два,Три'></header-component><div style='background-color:white;height:250px;'></div></div>`,'Header'); },


/*

    OneFile_Сontent: function(){ ACTS.all(); dia(`
<div>
   <one-file mode="file" name="Portfolio.pdf" description="My recent projects" filesize="15" unixtime="1234567898"></one-file>
   <one-file mode="file" name="Portfolio1.pdf" description="Лошадка придумала конский гей-флаг. В нем десять цветов. Называются так: саврасый, соловый, буланый, каурый, игреневый, рыжий, караковый, бурый, а следом гнедой, и в конце - вороной. Лошадка на прайд поскакала со мной!" filesize="15" unixtime="1726264523"></one-file>
   <one-file mode="file" name="Portfolio2.pdf" description="" filesize="15" unixtime="1234067800"></one-file>
   <one-file mode="text" name="Portfolio3.pdf" description="Углеродный след, углеродный след, давай-ка сделай попроще еблет, ненавидим тебя, злобную вражину, засунь свою нефть обратно в скважину, верни метан коровкам в жопы, почисть океан от Штатов до Европы от радона, гандона да пластикового пакетика, пусть срёт одна лишь зелёная энергетика!" filesize="15" unixtime="102345678"></one-file>
</div>`,this.constructor.name); },


RequestedFiles_Сontent: function(){ ACTS.all(); dia(`
   <requested-files></requested-files>
`,this.constructor.name); },

AuditorInfo_Content: function(){ ACTS.all(); dia(`
<auditor-info
  auditName="Product designer"
  candidates="87"
  parameters="4"
  evidence="1"
  description="We conduct a thorough audit of product designers' CVs to ensure they meet the qualifications needed for key roles in tech startups.">

  <!-- Вставляем компоненты evaluation-component внутрь auditor-info -->
  <evaluation-component mode="yn" data="1" name="Boolean checkbox"></evaluation-component>
  <evaluation-component mode="multi" data="1" name="Select multi items" names="Хуё|Моё|Пятое|Десятое"></evaluation-component>
  <evaluation-component mode="select" data="1" name="Choose one item" names="Junior|Mid-level|Senior|Lead|Principle"></evaluation-component>
  <evaluation-component mode="select" data="1" name="Знание английского" names="Ваще не ебу|Показываю пальцем и говорю Yes|Могу спросить дорогу|Могу объяснить дорогу|Свободный"></evaluation-component>
  <evaluation-component mode="multi" data="1" name="Chushifying Jesus expirience 2" names="E-commerce | Sport, Nutrition, Healthcare | Fintech, Analytics, Accounting | Public sector | Publishing, Art, Culture | Agency"></evaluation-component>

</auditor-info>`,this.constructor.name); },

*/

};

memli_init=function(x) {
    if(!x) {
        var x = document.location.hash.replace(/^#/g,'');
        if(!x || !x.length) x = f_read('memli');
        if(!x || !x.length || !ACTS[x]) x = 'Audit_Content'; // 'all'; // default';
    }
    f_save('memli',x);
    document.location.hash=x;
    ACTS.default(x);
    return ACTS[x]();

    // dom('pole',`<main-screen></main-screen>`);
    // KUVIO.LOGIN.login(0);
};

// йобаные события

document.addEventListener('clean-about_auditor_place',(ev)=>{
    console.log('!!!!!!!!!!!!!!!!!!!!1');
    setTimeout(function(){ clean('about_auditor_place'); },500);
});
