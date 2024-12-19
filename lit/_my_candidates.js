import {LitElement, html, css} from './lit-all.min.js';

var my_candidates_loading = false;

// import { my_table_render } from './_my_table_render.js'; // Импорт большой функции рендеринга таблицы

//   <link rel="stylesheet" href="https://unpkg.com/gridjs/dist/theme/mermaid.min.css" />

var savedScrollX = false; // window.scrollX;
var savedScrollY = false; // window.scrollY;

export function my_candidates(context,n) {

        if( KUVI.candidates_new_length===undefined ) {

            if(savedScrollX === false) savedScrollX = window.scrollX;
            if(savedScrollY === false) savedScrollY = window.scrollY;

            candidates_update(context);

            return context.skelet('width:100%;');
        }

	setTimeout(function(){ my_table_render(context); },10);

	return html`

<link rel="stylesheet" href="https://unpkg.com/gridjs/dist/theme/mermaid.min.css" />

<div style="padding: 10px 16px 10px 16px; width: 100%; box-sizing: border-box;">
    		    ${render_new_candidates(context)}
		    ${render_old_candidates(context)}
		</div>`;
}

function render_new_candidates(context){
	if(!KUVI.candidates_new_length) return html``;
        if(!KUVI.new_candidates) return html`<div class="nframe-group">${context.skelet()}</div>`;

        const s=this.new_candidates.map(x => html`
            <div class="nframe-group">
                <div class="nframe-container">
                    <img class="candidat-img" src="/users/user001.webp">
                    <div class="candidat-name">${x.login}</div>
                </div>
                <div class="nbutton-parent">
                    <div class="nbutton mv0" @click="${(event)=>{click_candidate(event,1,x)}}">Evaluate</div>
                    <div class="nbutton mv0" @click="${(event)=>{click_candidate(event,0,x)}}">Reject</div>
                </div>
            </div>`);

	return html`
    	    <div class="new-candidates-line">new Candidates (${KUVI.candidates_new_length})</div>
    	    <div class="nframe-parent">${s}</div>
	`;
}

function render_old_candidates(context){
	if(!KUVI.candidates_old_length) return html``;
        if(!KUVI.old_candidates) return html`<div class="nframe-group">${context.skelet()+context.skelet()+context.skelet()}</div>`;

        // Получаем уникальные значения из this.old_candidates
        var mirror_ids = [...new Set(KUVI.old_candidates.map(x => x.mirror_id))];
        if(!mirror_ids || !mirror_ids.length) return``;
        // this.update_for_grid(); // запускаем async процедуру подкачки всяких там новых и рендера
        const s = mirror_ids.map(x => html`<div id="table_${x}">${context.skelet()}</div>`);

	return html`
    	    <div class="new-candidates-line">Evaluated Candidates (${KUVI.candidates_old_length})</div>
    	    <div class="nframe-parent">${s}</div>
	`;
}

async function click_candidate(event,will,x) {
        if(!will) {
            if(await my_confirm("Reject talent "+h(x.login)+"?")) {
                // Удалим из массива
                // this.new_candidates = this.new_candidates.map(x => x.filter(i => i._id !== x._id));
                KUVI.new_candidates = KUVI.new_candidates.filter(l => l._id !== x._id);
                // Ебанем на сервере
                // TODO!!!
                var res = await KUVIO.API("audit_grade_save",{ result: false, request_id: x._id });
                if(res.id !== true) return idie("Error","Error");
            }
            candidates_update();
            // this.requestUpdate(); // принудительное обновление компонента
            return;
        }

        // Evaluate

        console.log(x);

        dialog(`<talent-grade
            request_id="`+h(x._id)+`"
            request_time="`+h(x.time)+`"
            candidat_login="`+h(x.login)+`"
            candidat_unic="`+h(x.unic)+`"
            mirror_id="`+h(x.mirror_id)+`"
            asks_json='`+JSON.stringify(x.asks)+`'
        ></talent-grade>`,'talent-grade');
}

// var grid=false;

async function candidates_update(context) {
        if( my_candidates_loading ) return;
	my_candidates_loading = true;
        setTimeout( function(){ my_candidates_loading=false;},5000 );

        while(!unis) await KUVIO.LOGIN.login();
        // скачаем список новых кандидатов
        var c = await KUVIO.API('audit_my_requests');
	my_candidates_loading = false;
        // обновим наши массивы
        KUVI.new_candidates = c.filter(item => !item.result_time);
        KUVI.old_candidates = c.filter(item => item.result_time);

        KUVI.candidates_new_length = KUVI.new_candidates.length;
        KUVI.candidates_old_length = KUVI.old_candidates.length;
        // и обновим принудительно
        context.requestUpdate(); // принудительное обновление компонента
	my_table_render(context);
        context.updateComplete.then(() => {
    	    window.scrollTo(savedScrollX, savedScrollY);
    	    savedScrollX=savedScrollY=false;
        });


}































/******* ПРОДОЛЖАЕМ КРУГОВОРОТ СТРАДАНИЙ *********/
/*
.new-candidates-line {
    width: 100%;
    font-size: 12px;
    line-height: 130%;
    text-transform: uppercase;
    font-family: Inter;
    color: #000;
    text-align: left;
    display: flex;
    align-items: center;
    height: 32px;
    opacity: 0.8;
}
*/
/*** новые кандидаты ***/
/*
.candidat-img {
    width: 20px;
    height: 20px;
    border-radius: 999px;
    object-fit: cover;
}

.candidat-name {
    width: 160px;
    position: relative;
    line-height: 130%;
    font-weight: 500;
    display: inline-block;
    flex-shrink: 0;
}
.nframe-container {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;
    gap: 8px;
}
.nbutton {
    border-radius: 8px;
    border: 1px solid rgba(0, 0, 0, 0.5);
    box-sizing: border-box;
    height: 42px;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    padding: 12px 16px;
}
.nbutton-parent {
    display: flex;
    flex-direction: row;
    align-items: flex-start;
    justify-content: flex-start;
    gap: 8px;
    font-size: 14px;
}
.nframe-group {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;
    gap: 16px;
}
.nframe-parent {
    position: relative;
    width: 100%;
    display: flex;
    flex-direction: column;
    EEEEEEEEEEEalign-items: flex-start;
    justify-content: flex-start;
    padding: 8px 0px;
    box-sizing: border-box;
    gap: 16px;
    text-align: left;
    font-size: 16px;
    color: #000;
    font-family: Inter;
}
*/































// fff.js
async function my_table_render(context) {
    if(!KUVI.old_candidates || !KUVI.old_candidates.length) return;

    // Получаем уникальные значения из this.old_candidates
    var mirror_ids = [...new Set(KUVI.old_candidates.map(x => x.mirror_id))];
    if(!mirror_ids || !mirror_ids.length) return;

    // Оставляем только те, которых нет в mirrors
    var need = mirror_ids.filter(x => !KUVI.mirrors[x]);
    if(need.length) { // подгрузим недостающие
            var new_mirrors = await KUVIO.API('get_mirrors',{mirror_ids:need});
            if(new_mirrors) KUVI.mirrors = { ...KUVI.mirrors, ...new_mirrors.mirrors };
    }

    console.log("KUVI.old_candidates.find",KUVI.old_candidates);

    mirror_ids.forEach(audit_id => {

	// Найдем все данные аудита
	const audit = Object.values(KUVI.mirrors).find(item => item._id === audit_id);

	// Разметим место под таблицу
	var e = context.shadowRoot.querySelector(`#table_${audit_id}`);
	// e.style.width='100%';
	e.innerHTML = `
    <h2>${h(audit.name)}</h2>
    <div class="r">${h(audit.about)}</div>
    <div style='width:100%;' id='tb_${audit_id}'></div>
`;

	// выбираем всех кандидатов для этого аудита
	const candidates = KUVI.old_candidates.filter(item => item.mirror_id === audit_id);

	// Создадим дату
	var data = candidates.map(r => [
		r.login,
		...(r.values?r.values:[]),
		r.result
	    ]);

	// Функция-фабрика для создания форматтера с сохранённым номером
	const createFormatter = (i) => {
	    return function(cell) {
		if(!cell) cell='null';
		// if(!i) return i+': '+cell; // ghtml(`Formatted: ${cell}`); // ghtml(`<b>${cell}</b>`);
		const type = audit.rules[i].type;
		if(type=='yn') return 1*cell ? 'Yes' : 'No';
		if(type=='scale') return 1*cell +'%';
		if(type=='select') {
		    var key = cell.indexOf(1);
		    if(key<0) return '';
		    return `${audit.rules[i].names[key]}`;
		}
		if(type=='multi') {
		    var res = [];
		    if(cell.forEach) cell.forEach((v, key) => {
			if(v) res.push(audit.rules[i].names[key]);
		    });
		    return res.join(', ');
		}
    		return 'err'; // ghtml(`Column [${audit_id}] ${i+1}: ${cell}`); // Пример использования индекса
	    };
	};

	var columns = audit.rules.map((r, i) => {
	    const n = h( r.name.split(' ')[0] );
	    return {
		// id: n,
		name: n,
		formatter: createFormatter(i), // Используем фабрику форматтера
	    }
	  }
	);
	columns = [
		{
		    name: 'Name',
        	    formatter: (cell) => {
        		return ghtml(`<div class='mv0' onclick="alert('c')"><u>${h(cell)}</u></div>`);
    		    },
		},
		...columns,
		{
		    name: 'Result',
        	    formatter: (cell) => {
			var n='';
			// if(!cell) n='Rejected';
			// else if(cell==1) n='Evaluated';
        		return ghtml(`<div class='mv0' onclick="alert('c')"><u>${n}</u></div>`);
    		    },
		},
	];

	var elem = context.shadowRoot.querySelector('#tb_'+audit_id);
        const grid = new window.Grid({
                search: { selector: (cell, rowIndex, cellIndex) => cellIndex === 0 ? cell.firstName : cell },
                pagination: { limit: 20 },
                sort: true,
                resizable: true,
                fixedHeader: true,
		// height: '400px',
		// "max-height": '40px',
                columns: columns,
        	data: data,
    	});
        grid.render(elem);

    // grid.on('rowClick', (...args) => console.log('row: ' + JSON.stringify(args), args));
    grid.on('cellClick', (...args) => {
	    if(args[2].id != 'name') return;
	    console.log('cell: ' + JSON.stringify(args), args);
	}
    );


    });

}

export const my_candidates_css = css`

/******* ПРОДОЛЖАЕМ КРУГОВОРОТ СТРАДАНИЙ *********/

.new-candidates-line {
    width: 100%;
    font-size: 12px;
    line-height: 130%;
    text-transform: uppercase;
    font-family: Inter;
    color: #000;
    text-align: left;
    display: flex;
    align-items: center;
    height: 32px;
    opacity: 0.8;
}

/*** новые кандидаты ***/

.candidat-img {
    width: 20px;
    height: 20px;
    border-radius: 999px;
    object-fit: cover;
}

.candidat-name {
    width: 160px;
    position: relative;
    line-height: 130%;
    font-weight: 500;
    display: inline-block;
    flex-shrink: 0;
}
.nframe-container {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;
    gap: 8px;
}
.nbutton {
    border-radius: 8px;
    border: 1px solid rgba(0, 0, 0, 0.5);
    box-sizing: border-box;
    height: 42px;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    padding: 12px 16px;
}
.nbutton-parent {
    display: flex;
    flex-direction: row;
    align-items: flex-start;
    justify-content: flex-start;
    gap: 8px;
    font-size: 14px;
}
.nframe-group {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;
    gap: 16px;
}
.nframe-parent {
    position: relative;
    width: 100%;
    display: flex;
    flex-direction: column;
    EEEEEEEEEEEalign-items: flex-start;
    justify-content: flex-start;
    padding: 8px 0px;
    box-sizing: border-box;
    gap: 16px;
    text-align: left;
    font-size: 16px;
    color: #000;
    font-family: Inter;
}

`;

