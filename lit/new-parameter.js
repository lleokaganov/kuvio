import { LitElement, html, css } from './lit-all.min.js';

class NewParameter extends LitElement {

    static properties = {
	audit_id: {type: String}, // какой аудит (для записи)
	name: {type: String}, // имя оценки
	about: {type: String}, // описание оценки
	names: {type: String}, // имена опций
        values: {type: String}, // данные для Select или Multi
        type: {type: String}, // тип
	saveready: {type: Boolean}, // отслеживание кнопки
    };

    constructor() {
        super();
        this.type = false;
        this.name="";
        this.about="";
        this.names="";
        this.values = "51";
	this.saveready = false;
    }

    ftype(event) {
	var e=event.target;
	if(!e.classList.contains('parametertype')) e=e.closest('.parametertype');
	this.type = e.getAttribute('name');
	console.log(this.type);
        f_save('NP-typ-last',this.type);
	this.save_needed();
	this.requestUpdate(); // принудительное обновление компонента
    }

    // firstUpdated() {
    connectedCallback() {
        super.connectedCallback();
	if(!this.type) this.type = f_read('NP-typ-last','scale');

        this.names_values = {}; // массив {name1:value1, name2:value2 ...}
        this.value = 50; // значение, если оно одно
	this.names_arr = (() => { try { return JSON.parse(this.names); } catch(er) { return []; } })();
	this.values_arr = (() => { try { return JSON.parse(this.values); } catch(er) { return []; } })();

        if(this.type=='yn' || this.type=='scale') {
	    this.value = isNaN(parseInt(this.values)) ? false : parseInt(this.values);
        } else {
            this.names_arr.forEach((x,i)=>{ this.names_values[x] = this.values_arr[i]; }); // создать массив
        }

	// запомним старые
	this.type_old = this.type;
	this.name_old = this.name;
	this.about_old = this.about;
	this.names_arr_old = this.names_arr;
        this.saveready = false;
    }

  static styles = css`

    :host {
        width:100%
    }

.mv,.mv0,.mv00 { transition: transform 0.2s ease-in-out; }
.mv:hover,mv0:hover,mv00:hover { transition-property: transform; transition-duration: 0.2s;
animation: none; transform: scale(1.7); cursor:pointer;}
.mv0:hover { transform: scale(1.1); }
.mv00:hover { transform: scale(1.05); }


.icon {
    width: 24px;
    position: relative;
    height: 24px;
}

.add-new {
    position: relative;
    line-height: 130%;
    color: #356bff;
    text-align: left;
}

/****************/
    .parameter-name {
      align-self: stretch;
      position: relative;
      line-height: 130%;
      font-weight: 500;
    }
    .parameter-name-parent {
      align-self: stretch;
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      justify-content: flex-start;
      gap: 8px;
    }
    .igg {
      align-self: stretch;
      border-radius: 8px;
      border: 1px solid #ddd;
      display: flex;
      flex-direction: row;
      align-items: flex-start;
      justify-content: flex-start;
      padding: 12px 16px;
      font-size: 12px;
    }
    .type {
      position: relative;
      line-height: 130%;
      font-weight: 500;
    }
    .type-name {
      position: relative;
      letter-spacing: 0.01em;
      line-height: 130%;
      opacity: 0.8;
    }
    .parametertype {
      flex: 1;
      border-radius: 8px;
      background-color: #f5f5f5;
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      justify-content: flex-start;
      padding: 8px 10px;
      gap: 4px;
      user-select: none;
    }
    .parametertype.active { background-color: #dfe3fa; }

    .parametertype-parent {
      align-self: stretch;
      display: flex;
      flex-direction: row;
      align-items: flex-start;
      justify-content: flex-start;
      flex-wrap: wrap;
      align-content: flex-start;
      gap: 8px;
      font-size: 10px;
      font-family: 'Roboto Mono';
    }
    .type-parent {
      width: 448px;
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      justify-content: flex-start;
      gap: 8px;
    }

    .button {
      user-select: none;
      align-self: stretch;
      border-radius: 8px;
      background-color: #000;
      height: 42px;
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: center;
      padding: 12px 16px;
      box-sizing: border-box;
      opacity: 0.5;
      color: #fff;
    }
    .button.act { opacity: unset; }

    .frame-parent {
	width: 482px;
      position: relative;
      background-color: #fff;
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      justify-content: flex-start;
      padding: 16px 16px 24px;
      box-sizing: border-box;
      gap: 24px;
      text-align: left;
      font-size: 14px;
      color: #000;
      font-family: Inter;
    }
  `;

  render() {

    return html`
      <div class="frame-parent">
        <div class="parameter-name-parent">
          <div class="parameter-name">Parameter name</div>
          <input name="name" @input="${this.save_needed}" value="${this.name}" type='text' class="igg" placeholder="i.g. Skill level, Industry experience, Seniority, Leadership">
        </div>
        <div class="parameter-name-parent">
          <div class="parameter-name">Description</div>
          <input name="about" @input="${this.save_needed}" value="${this.about}" type='text' class="igg" placeholder="I.g. What do candidates demonstrate and how the judgement is made">
        </div>
        <div class="type-parent">
          <div class="type">Type</div>
          <div class="parametertype-parent">
            <div class="parametertype${ this.type == 'select' ? ' active' :''}" name='select' @click="${this.ftype}">
              <img class="icon" src="/img/kid_star.svg" />
              <div class="type-name">Rating</div>
            </div>
            <div class="parametertype${ this.type == 'scale' ? ' active' :''}" name='scale' @click="${this.ftype}">
              <img class="icon" src="/img/linear_scale.svg" />
              <div class="type-name">Scale</div>
            </div>
            <div class="parametertype${ this.type == 'yn' ? ' active' :''}" name='yn' @click="${this.ftype}">
              <img class="icon" src="/img/flaky.svg" />
              <div class="type-name">Y/N</div>
            </div>
            <div class="parametertype${ this.type == 'multi' ? ' active' :''}" name='multi' @click="${this.ftype}">
              <img class="icon" src="/img/tag.svg" />
              <div class="type-name">Multi-choice</div>
            </div>
          </div>
        </div>

	<select-parameter
	    @change-names="${this.handle_changeNames}"
	    edit="1"
	    mark="0"
	    audit_id="${this.audit_id}"
	    type="${this.type}"
	    names="${this.names}"
	    values="${this.values}"
	    name="${this.name}"
	    about="${this.about}"
	></select-parameter>

        <div class="button${ this.saveready ? ' act' :''}" @click="${this.save}">
          <div class="type">Save</div>
        </div>

      </div>
    `;
  }

  save_needed(event) {
    var x=false;
    // Имя надо задать
    var e = this.shadowRoot.querySelector("input[name='name']");
    if(e.value=='' && e.defaultValue=='') return this.saveready=x;
    // поменяли тип
    if(this.type_old != this.type) x=true;
    else if(JSON.stringify(this.names_arr_old) != JSON.stringify(this.names_arr)) x=true;
    // поменяли name или about
    else this.shadowRoot.querySelectorAll('input').forEach(e => { if(e.value!=e.defaultValue) x=true; });
    this.saveready=x;
  }

  async save(){
    if(!this.saveready) return;
    console.log("new-parameter.js: new-parameter: save");

	const audit = KUVI.my_audits.find((item)=>{ return item._id === this.audit_id; });
        if(!audit) {
	    console.log(`не нашли [${this.audit_id}]`);
	    return;
	}

        if(typeof(audit.rules)!='object') audit.rules=[];
        var p = {
		type: this.type,
		name: this.shadowRoot.querySelector("input[name='name']").value,
		about: this.shadowRoot.querySelector("input[name='about']").value,
		names: this.names_arr,
        };
        var num = audit.rules.findIndex(x => x.name === this.name_old);
        // console.log("============== num ",num);
        if(num !== -1) audit.rules[num] = p; else audit.rules.push(p); // изменили старый или добавили новый

        console.log('audit.rules перед записью',audit.rules);
        console.log('audit перед записью',audit);

        // Сохраняем данные на сервере
        var id = await KUVIO.API('auditor_my_save',audit); // записали
        if(id!==true) return console.log('error saving');

        // Создаем и отправляем кастомное событие рендера
        KUVI.my_audits=false; // чтобы перечитал заново с сервера
        this.dispatchEvent(new CustomEvent('main-screen_render', { bubbles: true, composed: true }));
        dialog.close('NP_'+this.audit_id);
  }


  // callback: окно редактирования <select-parameter > прислало ответ
  async handle_changeNames(event) {
        console.log("new-parameter.js: ParameterChange ready:",event.detail);
        if(event.detail.audit_id != this.audit_id) return console.log("Dismatch error #31");
	console.log("new-parameter.js: new names:",event.detail.names);

        console.log("new-parameter.js:handle_changeNames() 1: this.names_arr=",this.names_arr);
	this.names_arr = event.detail.names;
	this.save_needed();
        console.log("new-parameter.js:handle_changeNames() 2: this.names_arr=",this.names_arr);
/*
        this.dispatchEvent(new CustomEvent('save-parameter', {
	    detail: { // Данные передаются в событии через `detail`
    	        type: this.type,
	        audit_id: this.audit_id,
    	        name: this.shadowRoot.querySelector("input[name='name']").value,
                about: this.shadowRoot.querySelector("input[name='about']").value,
		names: event.detail.names,
                name_old: this.name_old, // имя, какое было до изменений - для поиска
	        about_old: this.about_old, // about, какое было до изменений - для поиска
    	    },
    	    bubbles: true, // Позволяет событию подниматься вверх по дереву
    	    composed: true // Позволяет событию пересекать границы Shadow DOM
	}));
*/
  }

}

customElements.define('new-parameter', NewParameter);