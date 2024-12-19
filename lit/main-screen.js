import {LitElement, html, css} from './lit-all.min.js';
import { my_table_render } from './_my_table_render.js'; // Импорт большой функции рендеринга таблицы

class MainScreen extends LitElement {

    static properties = {
	my_audits_stringify: { type: String }, // Объявляем свойство
	// Для рисования аудита
	audit_mode: { type: String },
	audit_id: { type: String },
	audit_name: { type: String },
	audit_description: { type: String },
	audit_blake3: { type: String },
        audit_candidates: { type: Number },
        audit_parameters: { type: Number },
        audit_evidences: { type: Number },
        audit_asks: { type: Array },
        audit_rules: { type: Array },
	candidates_new_length: { type: Number },
	candidates_old_length: { type: Number },
	// mode: {type: String},
	new: { type: Boolean },
    }

    constructor() {
        super();
	this.new_candidates = false;
	this.old_candidates = false;
	// this.audit_mode="edit";
        // this.mode = 'Audits';
    }


    _handleRequestUpdate(event) {
	this.candidates_update();
	// this.requestUpdate();
    }

    async connectedCallback() {
        super.connectedCallback();
	// включаем общий обработчик для 'save-evidence'
	document.addEventListener('save-evidence', this._handleSaveEvidence.bind(this));
	// включаем общий обработчик для 'save-parameter'
	document.addEventListener('save-parameter', this._handleSaveParameter.bind(this));
	// принудительно обновить по сигналу
	document.addEventListener('main-screen_render', this._handleRequestUpdate.bind(this));

	this.candidates_new_length=0;
	this.candidates_old_length=0;
	this.grid=false;

	this.skelet=html`
	    <div style='width:300px; padding: 12px 16px;'>
	        <div class="skeleton" style="width:80%;"></div>
		<div class="skeleton" style="width:60%;"></div>
	    	<div class="skeleton" style="width:90%;"></div>
	    </div>`;

        // Выполняем вычисления
	this.public = false;
	this.mode = f_read('Audit_mode','Candidates'); // пока так
        this.mode = ( this.mode == 'Audits' ? 'Audits' : 'Candidates' );

	this.audits_update();
	this.candidates_update();
    }

    disconnectedCallback() {
	// отключаем общий обработчик для 'save-evidence'
	document.removeEventListener('save-evidence', this._handleSaveEvidence.bind(this));
	// отключаем общий обработчик для 'save-parameter'
	document.removeEventListener('save-parameter', this._handleSaveParameter.bind(this));
	// отключаем общий обработчик для 'main-screen_render'
	document.removeEventListener('main-screen_render', this._handleRequestUpdate.bind(this));

	super.disconnectedCallback();
    }

    // если дочерний элемент прислал событие
    async handleSaveAudit(event) {
	console.log("ПРИСЛАЛО",event.detail);

	// Получаем данные из дочернего компонента
        const { audit_id, name, about } = event.detail;
        // Обновляем переменные родителя
        this.audit_id = audit_id;
        this.audit_name = name;
        this.audit_description = about;

	// Сохраняем данные на сервере
        var p={ name: name, about: about, _id: audit_id };
        var r = this.find_audit();
        r = (r ? {...r,...p} : p); // нашли - добавили, не нашли - создали
        var id = await KUVIO.API('auditor_my_save',r); // записали
        if(typeof(id)=='string'&&id.length) { // добавим в массив если новый
            p._id = this.audit_id = id;
            KUVI.my_audits.push(p);
        }
	this.audits_update();
    }

    // дочерний элемент прислал событие
    async handleDelAudit(event) {
	console.log("ПРИСЛАЛО DEL",event.detail);
	// Получаем данные из дочернего компонента
        const { audit_id } = event.detail;
        // Обновляем переменные родителя
        // this.audit_id = audit_id;
	// console.log('Before: ',KUVI.my_audits);
	// KUVI.my_audits = KUVI.my_audits.filter(x => x._id !== audit_id);
	// console.log('After: ',KUVI.my_audits);
	// delete(KUVI.my_audits[audit_id]);

        var result = await KUVIO.API('auditor_del',{audit_id:audit_id});
	if(result !== true) return dialog(h(result),"Error deleting");
	this.audit_selected(false);
	this.audits_update();
    }

    async audits_update() {
        while(!unis) await KUVIO.LOGIN.login();
        KUVI.my_audits = await KUVIO.API('auditor_my');
	this.my_audits_stringify = JSON.stringify(KUVI.my_audits);
	console.log("KUVI.my_audits",KUVI.my_audits);
	// Вспомним, какое последнее смотрели
	var id = f_read('last_Audit','');
	if(id!='') this.audit_selected(id);
	// и обновим принудительно
	this.requestUpdate(); // принудительное обновление компонента
    }

    async candidates_update() {
        while(!unis) await KUVIO.LOGIN.login();
	// скачаем список новых кандидатов
	var c = await KUVIO.API('audit_my_requests');
	// обновим наши массивы
        this.new_candidates = c.filter(item => !item.result_time);
	this.old_candidates = c.filter(item => item.result_time);

	this.candidates_new_length = this.new_candidates.length;
	this.candidates_old_length = this.old_candidates.length;
	// и обновим принудительно
	this.requestUpdate(); // принудительное обновление компонента
    }

//    firstUpdated() {
//	console.log(unis);
//	console.log(unis_login);
//	this.unislogin = unis_login;
//	this.menu = this.menu.split(',');
//	console.log(this.menu);
//    }


  static styles = css`

    :host {
        width:100%
    }

.mv,.mv0,.mv00 { transition: transform 0.2s ease-in-out; cursor: pointer; }
.mv:hover,mv0:hover,mv00:hover { transition-property: transform; transition-duration: 0.2s;
animation: none; transform: scale(1.7); cursor:pointer;}
.mv0:hover { transform: scale(1.1); }
.mv00:hover { transform: scale(1.05); }

.oglavnom {
    width:100%;
}

.audit-child {
    top: 93px;
    left: 372px;
    background-color: #fff;
    width: 640px;
}
.audit-item {
    top: 93px;
    left: 1012px;
    background-color: #fff;
    width: 308px;
}
.audit-inner {
    top: 0px;
    left: 0px;
    background-color: #eee;
    width: 1440px;
    height: 40px;
}
.candidates {
    position: relative;
    line-height: 130%;
    font-weight: 500;
}
.item {
    display: flex;
    flex-direction: row;
    align-items: flex-start;
    justify-content: flex-start;
    padding: 16px 0px;

    box-sizing: border-box;
    gap: 6px;
    text-align: left;
    font-size: 16px;
    color: #000;
    font-family: Inter;
}

.item-linked {
    border-bottom: 2px solid #000;
}

.spacer {
    flex: 1;
    position: relative;
    height: 20px;
    overflow: hidden;
}
.frame-child {
    width: 20px;
    border-radius: 999px;
    height: 20px;
    object-fit: cover;
}
.frame-group {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;
    gap: 8px;
}
.logout {
    position: relative;
    font-size: 14px;
    line-height: 130%;
    font-weight: 500;
    color: #356bff;
}
.frame-parent {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;
    gap: 32px;
}
.item-parent {
    border-radius: 16px 16px 0px 0px;
    background-color: #fff;
    border-bottom: 1px solid #eee;
    box-sizing: border-box;
    width: 100%;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;
    padding: 0px 32px 0px 16px;
    gap: 32px;
    font-size: 16px;
}

.item-media {
    border-radius: 0px 0px 16px 16px;
    background-color: #fff;
    box-sizing: border-box;
    width: 100%;
    font-size: 16px;
    min-height: 600px;
    margin-bottom: 40px;
    text-align: left;
display: flex;
align-items: flex-start;
}

.wrapper {
    border-radius: 999px;
    background-color: #ffc935;
    height: 20px;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    padding: 2px 8px;
    box-sizing: border-box;
    font-size: 12px;
}

.product-designer {
    position: relative;
    line-height: 130%;
}
.arrow-right-icon {
    width: 24px;
    position: relative;
    height: 24px;
}
.product-designer-parent {
    width: 220px;
    border-radius: 8px;
    height: 48px;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    padding: 12px 16px;
    box-sizing: border-box;
}
.frame-div {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: flex-start;
    gap: 8px;
}
.drafts {
    flex: 1;
    position: relative;
    line-height: 130%;
    text-transform: capitalize;
    font-weight: 800;
    opacity: 0.7;
}
.drafts-parent {
    align-self: stretch;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;
    padding: 8px 16px 0px;
    gap: 8px;
    font-size: 12px;
}
.frame-container {
    top: 93px;
    left: 120px;
    background-color: #fff;
    border-right: 1px solid #eee;
    box-sizing: border-box;
    EEEEEEEEEEEEEEEwidth: 252px;
    EEEEEEEEEEEEEEEEEEEEheight: 2049px;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: flex-start;
    padding: 24px 16px;
    gap: 24px;
}

.LL {
    width:100%;
    max-width:100%;
    margin: 0 20px 40px 20px;
    box-sizing: border-box;
    EEEEEEEEborder: 1px dotted pink;
    EEEEEEEEEmax-width:1024px;
}



/***************** Auditor: left menu  *******************/

.mnew-audit {
overflow: hidden;
    line-height: 130%;
    font-weight: 500;
white-space: nowrap;
text-overflow: ellipsis;
}
.mnew-audit-wrapper {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    padding: 8px 16px 0px;
    color: #356bff;
white-space: nowrap;
overflow: hidden;
}
.marrow-right-icon {
    width: 24px;
    position: relative;
    height: 24px;
}

.mframe-wrapper {
    align-self: stretch;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: flex-start;
    font-size: 13px;
}


.melement {
    EEEEEEEEEEEEEfont-size: 13px;
    align-self: stretch;
    border-radius: 8px;
    height: 48px;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    padding: 12px 16px;
    box-sizing: border-box;
}
.melement-active {
    background-color: #e6f4ff;
}


.mframe-child {
    width: 100px;
    position: relative;
    height: 100px;
}

.mframe-parent {
    position: relative;
    background-color: #fff;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: flex-start;
    padding: 24px 16px;
    gap: 24px;
    text-align: left;
    font-size: 12px;
    color: #000;
    font-family: Inter;
}

.mmenu {
    display: block;
    max-width:200px;
    border-right: 1px solid #eee;
    height:100%;
}

/***************************** item-header *****************/
.iproduct-designer {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;

    flex: 1;
    position: relative;
    line-height: 130%;
    font-weight: 600;
    display: inline-block;
    height: 26px;
}

.ibutton {
    line-height: 130%;
    font-weight: 500;
    font-size: 14px;
    user-select: none;

    border-radius: 8px;
    background-color: #000;
    height: 42px;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    padding: 12px 16px;
    box-sizing: border-box;
    color: #fff;
}

.iproduct-designer-parent {
    background-color: #e1d7b3;
    width: 100%;

    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;
    padding: 8px 24px;
    box-sizing: border-box;
    gap: 16px;
    text-align: left;
    font-size: 19px;
    color: #000;
    font-family: Inter;
}

.iproduct-designer-parent-act {
    background-color: #c7e0b3 !important;
}

/********* evframe ******/

    .evframe-ev-parameters {
      width: 100%;
      position: relative;
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      justify-content: flex-start;
      gap: 8px;
      text-align: left;
      font-size: 14px;
      color: #000;
      font-family: Inter;
    }

    .requested-evidence {
	font-size: 16px;
	line-height: 130%;
	font-weight: 500;
	margin:20px 0 20px 0;
	display: flex;
	width: 100%;
	justify-content: space-between;
    }

.newlogin-as-auditor {
    position: relative;
    line-height: 130%;
    font-weight: 500;
}
.newbutton {
    position: relative;
    border-radius: 8px;
    background-color: #000;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    padding: 12px 16px;
    box-sizing: border-box;
    text-align: left;
    font-size: 14px;
    color: #fff;
    font-family: Inter;
  user-select: none;
}

/**** skeleton ****/
    .skeleton {
      border-radius: 4px;
      height: 10px;
      margin: 8px 0;
      animation: pulsex 1s infinite ease-in-out;
    }

    @keyframes pulsex {
      0% { background-color: #ddd; }
      50% { background-color: #c9c9c9; }
      100% { background-color: #ddd; }
    }







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

  async click_candidate(event,will,x) {
	if(!will) {
	    if(await my_confirm("Reject talent "+h(x.login)+"?")) {
		// Удалим из массива
		// this.new_candidates = this.new_candidates.map(x => x.filter(i => i._id !== x._id));
		this.new_candidates = this.new_candidates.filter(l => l._id !== x._id);
		// Ебанем на сервере
		// TODO!!!
		var res = await KUVIO.API("audit_grade_save",{ result: false, request_id: x._id });
	        if(res.id !== true) return idie("Error","Error");
	    }
	    this.candidates_update();
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

  render_new_candidates(){
	if(!this.new_candidates) return html`<div class="nframe-group">${this.skelet}</div>`;
	return this.new_candidates.map(x => html`
	    <div class="nframe-group">
    		<div class="nframe-container">
    		    <img class="candidat-img" src="/users/user001.webp">
    		    <div class="candidat-name">${x.login}</div>
    		</div>
    		<div class="nbutton-parent">
    		    <div class="nbutton mv0" @click="${(event)=>{this.click_candidate(event,1,x)}}">Evaluate</div>
    		    <div class="nbutton mv0" @click="${(event)=>{this.click_candidate(event,0,x)}}">Reject</div>
    		</div>
	    </div>`);

  }


    updated(changedProperties) {
        // if(changedProperties.has('tableData'))
	if(this.mode == 'Candidates') my_table_render(this);
    }

  render_old_candidates(){
	if(!this.old_candidates) return html`<div class="nframe-group">${this.skelet}${this.skelet}${this.skelet}</div>`;

	// Получаем уникальные значения из this.old_candidates
	var mirror_ids = [...new Set(this.old_candidates.map(x => x.mirror_id))];
	if(!mirror_ids || !mirror_ids.length) return html``;
	// this.update_for_grid(); // запускаем async процедуру подкачки всяких там новых и рендера
	return mirror_ids.map(x => html`<div id="table_${x}">${this.skelet}</div>`);
  }


  render_part(){
    if(this.mode == 'Candidates') return html`<div style="padding: 10px 16px 10px 16px; width: 100%; box-sizing: border-box;">

    ${!this.candidates_new_length ? html``:html`
	<div class="new-candidates-line">new Candidates (${this.candidates_new_length})</div>
	<div class="nframe-parent">
	    ${this.render_new_candidates()}
        </div>
    `}

    ${!this.candidates_old_length ? html`` : html`
	<div class="new-candidates-line">Evaluated Candidates (${this.candidates_old_length})</div>
	<div class="nframe-parent">
	    ${this.render_old_candidates()}
        </div>
    `}

</div>`;

    return html`
<div class='mmenu'>
    <div class="mframe-parent">

	    <div class="mnew-audit-wrapper">
    		<div class="mnew-audit mv0" @click="${this.newAudit}">New Audit</div>
	    </div>

	    ${this.audits()}

${/*
	    <div class="mframe-wrapper">
    		<div class="melement mv0">
    		    <div class="mnew-audit">Office manager</div>
    		    <img class="marrow-right-icon" src="img/arrow_right.svg">
    		</div>
	    </div>

	    <div class="melement melement-active mv0">
    		<div class="mnew-audit">Product designer</div>
    		<img class="marrow-right-icon" src="img/arrow_right.svg">
	    </div>
	    <!----------------- div class="mframe-child">Ohh</div -------------------->
*/''}


    </div>
</div>

${/* Блок элемента */''}

${ !this.new  && (!this.audit_name || this.audit_name=='') ? html`` : html`

<div class="oglavnom">
    ${/* Шапка цвета "мама, я покакала" */''}
    <div class="iproduct-designer-parent${this.public?' iproduct-designer-parent-act':''}">
	<div class="iproduct-designer">${this.audit_name}</div>
    	<div class="ibutton mv0" @click="${this.chpublic}">${this.public ? "Publish" : "Screen"}</div>
    </div>

    <div style='padding:20px;'>

	${/* Панелька с основными данными Аудита */''}
        <audit-panel
	    mode="${this.audit_id=='' ? 'edited' : 'edit'}"
	    audit_id="${this.audit_id}"
            audit_name="${this.audit_name}"
            audit_description="${this.audit_description}"
            audit_blake3="${this.audit_blake3}"
            audit_candidates="${this.audit_candidates}"
            audit_parameters="${this.audit_parameters}"
            audit_evidences="${this.audit_evidences}"
	    @save-audit="${this.handleSaveAudit}"
	    @del-audit="${this.handleDelAudit}">
        </audit-panel>

	<div style="height:40px;"></div>
	${/* Панелька с требуемыми файлами */''}
        <div class="evframe-ev-parameters">
	    <div class="requested-evidence">Requested evidence

		<div class="newbutton mv0" @click="${this.addEvidence}"><div class="newlogin-as-auditor">Add evidence</div></div>
	    </div>
	</div>

	<a name="upload_all_files"></a>

	<requested-files
	    audit_id="${this.audit_id}"
	    audit_blake3="${this.audit_blake3}"
	    files="${ JSON.stringify(this.find_audit(false,'nofalse').asks) }"
	    mode="auditor"
	    edit="1"
	    audit_me="0"
	    upload="0"
	></requested-files>

	<div style="height:40px;"></div>
	${/* Вставляем компоненты evaluation-component внутрь auditor-info */''}
        <div class="evframe-ev-parameters">
    	    <div class="requested-evidence">Evaluation parameters
		<div class="newbutton mv0" @click="${this.addParameter}"><div class="newlogin-as-auditor">Add parameter</div></div>
	</div>
	${this.rules()}

</div>${/* Блок элемента закончился */''}
`}




<div style="height:40px;"></div>
`;
  }









  chmode(event){
	var e=event.target,name; while(!(name=e.getAttribute('name'))) e=e.parentNode;
	if(this.mode == name) return;
	this.mode = name;
	f_save('Audit_mode',this.mode);
	this.requestUpdate(); // принудительное обновление компонента
  }

  chpublic(event) {
	console.log('123EE');
	this.public = !this.public;
	this.requestUpdate(); // принудительное обновление компонента
  }

  async notodo(event) {
    my_confirm("Мы же понимаем, что у нас редактирование и эта хуйня нам никогда не пригодится?");
  }

  audit_selected(event) {

    if(event===false) { // Сбросить audit_selected(false);
	this.audit_id = false;
	this.audit_name = this.audit_description = '';
        this.audit_candidates = this.audit_parameters = this.audit_evidences = 0;
        this.audit_asks = this.audit_rules = "{}";
	return;
    }

    var pid;
    if(typeof(event)=='string') pid=event;
    else {
        var e=event.target;
        while(!(pid=e.getAttribute('pid'))) e=e.parentNode;
    }

    const r = this.find_audit(pid);
    if(!r) {
        console.log("audit_selected: not found",event);
	return;
    }
    f_save('last_Audit',pid);

    console.log("AUDIT_SELECTED",r);
	this.audit_id = pid;
	this.audit_name = r.name && r.name.length ? r.name : '';
	this.audit_description = r.about;
        this.audit_candidates = Number(r.n_candidat) || 0;
        this.audit_parameters = Number(r.n_parameter) || 0;
        this.audit_evidences = Number(r.n_request) || 0;
        this.audit_asks = JSON.stringify(r.asks);
        this.audit_rules = JSON.stringify(r.rules);
  }



  audits() {
	if( !this.my_audits_stringify) return html`
	    <div style='width:100%; padding: 12px 16px;'>
	        <div class="skeleton" style="width:80%;"></div>
		<div class="skeleton" style="width:60%;"></div>
	    	<div class="skeleton" style="width:90%;"></div>
	    </div>`;

	return html`
	    <div style="width:100%">
		${KUVI.my_audits.map(r => html`
		    <div class="mframe-wrapper" pid="${r._id}" @click="${this.audit_selected}">
        		<div class="melement${this.audit_id === r._id ? ' melement-active':''} mv0">
        		    <div class="mnew-audit">${!r.name || r.name==''?'no name':r.name}</div>
        		    <img class="marrow-right-icon" src="img/arrow_right.svg">
        		</div>
		    </div>
		`)}
	    </div>
	`; // `
  }












  newAudit(){
	this.audit_id=this.audit_name=this.audit_description='';
        this.audit_candidates=this.audit_parameters=this.audit_evidences=0;
        this.audit_asks=[];
        this.audit_rules=[];
        this.new = true;
  }



  rules(){
    try {
	return html`
	    <div style="width:100%">
		${ this.find_audit().rules.map((r,i) => html`
	    	    <evaluation-component
			num="${i}"
			open=""
			edit="1"
			mark="0"
			audit_id="${this.audit_id}"
			type="${r.type}"
			data=""
			name="${r.name}"
			about="${r.about}"
			names="${JSON.stringify(r.names)}"></evaluation-component>
		`)}
	    </div>
	`;
    } catch(er) { return html` [ Rules error ] `; }
  }

  find_audit(pid,mode) {
    if(!pid) pid=this.audit_id;
    var r=false;
    try { r = KUVI.my_audits.find(x => x._id === pid); } catch(er){}
    if(!r) {
	if(mode!='nofalse') return r;
	r={};
    }
    if(typeof(r.rules)!='object') r.rules=[]; // пофиксим если вдруг
    if(typeof(r.asks)!='object') r.asks=[]; // пофиксим если вдруг
    return r;
  }


  // Вызываем окно редактирования new-evidence для нашего Аудита
  // @save-evidence="${this.handle_SaveEvidence}"
  addEvidence(event) {
	dialog(`<new-evidence audit_id="`+h(this.audit_id)+`"></new-evidence>`,'New evidence',{id:'NE_'+this.audit_id});
  }

  // callback: окно редактирования new-evidence прислало ответ
  async _handleSaveEvidence(event) {
	console.log("main-screen.js: SaveEvidence ready:",event.detail);
	// Получаем данные из дочернего компонента
        const { type, audit_id, name, about, name_old, about_old } = event.detail;
	var audit = this.find_audit(audit_id);
	if(audit) {
	    if(typeof(audit.asks)!='object') audit.asks=[];
	    var p = { type, name, about };
	    // var ask = audit.asks.find(x => x.name === name_old);
	    var num = audit.asks.findIndex(x => x.name === name_old);
	    console.log("============== num ",num);
	    if(num !== -1) audit.asks[num] = p; else audit.asks.push(p); // изменили старый или добавили новый

	    // console.log('audit.asks перед записью',audit.asks);
	    // console.log('audit перед записью',audit);

	    // Сохраняем данные на сервере
	    var id = await KUVIO.API('auditor_my_save',audit); // записали
            if(id!==true) return console.log('error saving');
	    this.audits_update();
	}
	dialog.close('NE_'+audit_id);
  }


  // callback: окно редактирования new-parameter прислало ответ
  async _handleSaveParameter(event) {
	console.log("main-screen.js: SaveParameter ready:",event.detail);
	// Получаем данные из дочернего компонента
        const { type, audit_id, name, names, about, name_old, about_old } = event.detail;
	var audit = this.find_audit(audit_id);
	if(audit) {
	    if(typeof(audit.rules)!='object') audit.rules=[];
	    var p = { type, name, about, names };
	    // var ask = audit.asks.find(x => x.name === name_old);
	    var num = audit.rules.findIndex(x => x.name === name_old);
	    console.log("============== num ",num);
	    if(num !== -1) audit.rules[num] = p; else audit.rules.push(p); // изменили старый или добавили новый

	    console.log('audit.rules перед записью',audit.rules);
	    console.log('audit перед записью',audit);

	    // Сохраняем данные на сервере
	    var id = await KUVIO.API('auditor_my_save',audit); // записали
            if(id!==true) return console.log('error saving');
	    this.audits_update();
	}
	dialog.close('NP_'+audit_id);
  }



  addParameter(event) {
	dialog(`<new-parameter audit_id="${h(this.audit_id)}"></new-parameter>`,'New parameter',{id:'NP_'+this.audit_id});
  }

/*
    run_editor(event){
        var e=event.target;
        if(!e.classList.contains('evidencerequest')) e=e.closest(".evidencerequest");
        var num = e.getAttribute('num');
        var p = this.files_pp[num];

        dialog(`<new-evidence
            audit_id="`+h(this.audit_id)+`"
            filetype="`+h(p.type)+`"
            ask_name="`+h(p.name)+`"
            ask_about="`+h(p.about)+`"
            ask_num="`+h(num)+`"
        ></new-evidence>`,'Edit evidence',{id:'NE_'+this.audit_id}); // +num+'_'
    }
*/


  async logout() {
    if(await my_confirm("Logout "+h(unis_login)+"?")) {
	KUVIO.LOGIN.logout();
	this.requestUpdate(); // принудительное обновление компонента
    }
  }

  async login() {
	await KUVIO.LOGIN.login();
	this.requestUpdate(); // принудительное обновление компонента
  }

  render() {

    // dom('buka','tama on Buka');

    const s = html`
       <link rel="stylesheet" href="https://unpkg.com/gridjs/dist/theme/mermaid.min.css" />

	<div class="LL" id='secondScreen'>

	    <div class="item-parent">
		    <div class="item${this.mode=='Audits'?' item-linked':''}" @click="${this.chmode}" name="Audits"><div class="candidates mv0">Audits</div></div>
		    <div class="item${this.mode!='Audits'?' item-linked':''}" @click="${this.chmode}" name="Candidates">
			    <div class="candidates mv0">Candidates</div>
			    ${this.candidates_new_length ? html`<div class="wrapper"><div class="candidates">${this.candidates_new_length}</div></div>`:html``}
		    </div>
		    <div class="spacer"></div>
        	    <div class="frame-parent">
			    ${unis ? html`
			    <div class="frame-group" @click="${KUVIO.LOGIN.login}">
    				    <img class="frame-child" src="/users/userpick_42.webp">
        			    <div class="candidates mv0">${h(unis_login)}</div>
    			    </div>
    			    <div class="logout mv0" @click="${this.logout}">Logout</div>
			    `:html`
    			    <div class="logout mv0" @click="${this.login}">Login</div>
			    `}

		    </div>
    	    </div>

	    <div class="item-media">
		${this.render_part()}
	    </div>
</div>`; // `
    this.new=false;
    return s;

  }

}

customElements.define('main-screen', MainScreen);
