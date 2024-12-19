import { LitElement, html, css } from './lit-all.min.js';

class SelectParameter extends LitElement {

    static properties = {
	audit_id: {type: String}, // аудит
	name: {type: String}, // тип
	// about: {type: String}, // тип
        header: {type: String}, // заголовок для отображения
	names: {type: String}, // имена для Select или Multi (JSON)
	values: {type: String}, // значения для соответствующих Select или Multi (JSON)
	edit: {type: String}, // разрешено редактировать
	mark: {type: String}, // разрешено устанавливать
	view: {type: String}, // показывать либо Yes либо No
	type: {type: String}, // тип: select, multi, scale, yn
    }

    constructor() {
        super();
	this.audit_id = '';
	this.names = [];
        // this.values = '50';
	this.type = 'yn';
	this.header = '';
	this.edit = '0';
	this.mark = '1';
    }

/*
    // updated(changedProperties) {
    willUpdate(changedProperties) {
        super.updated(changedProperties);

        // Проверяем, какие свойства изменились
        if(changedProperties.has('typ') || changedProperties.has('values') || changedProperties.has('mode')
	) {
            // Здесь можно подготовить данные или выполнить нужные операции
            // console.log('typ, values или on_ch изменились, нужно заново подготовить данные');
	//    this.firstUpdated();
        }
    }
*/

    // firstUpdated() {
    connectedCallback() {
	super.connectedCallback();

	this.type_old = this.type;
	this.names_old = this.names;

	this.value_changed = false; // меняли ли

	this.value_scale = isNaN(parseInt(this.values)) ? 50 : parseInt(this.values);

	if(this.values=='1') this.value_yn = true;
	else if(this.values=='0') this.value_yn = false;
	else this.values=='';

        try { this.names_arr = JSON.parse(this.names); } catch(er){ this.names_arr = []; }

	try { this.value_arr = JSON.parse(this.values); } catch(er){ this.value_arr = []; }
	if(this.names_arr && this.names_arr.length && this.names_arr.length > this.value_arr.length) {
	    this.value_arr.push(...new Array(this.names_arr.length - this.value_arr.length).fill(0));
	}
    }

  static styles = css`

    :host {
        width:100%
    }

    input[disabled],input[disabled]:hover {
	opacity: 0.3;
    }

.mv,.mv0,.mv00 { transition: transform 0.2s ease-in-out; cursor: pointer; }
.mv:hover,mv0:hover,mv00:hover { transition-property: transform; transition-duration: 0.2s;
animation: none; transform: scale(1.7); cursor:pointer;}
.mv0:hover { transform: scale(1.1); }
.mv00:hover { transform: scale(1.05); }

.active { background-color: #dfe3fa; }

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

/****** yn ******/

.yn {
    position: relative;
    line-height: 130%;
}
.task-alt-parent {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;
    gap: 8px;
    font-family: Inter;
}
.yn-parent {
    width: 100%;
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: flex-start;
    gap: 8px;
    text-align: left;
    font-size: 12px;
    color: #000;
    font-family: 'Roboto Mono';
}

/****** multi ******/

.multi-choice {
    position: relative;
    line-height: 130%;
}
.me {
	user-select: none;
    border-radius: 24px;
    border: 1px solid #cdcdcd;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    padding: 8px 16px;
    gap: 8px;
}
.fp-multi {
    align-self: stretch;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;
    flex-wrap: wrap;
    align-content: center;
    gap: 8px;
    text-align: center;
    font-family: Inter;
}

.multi-choice-parent {
    width: 100%;
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: flex-start;
    gap: 8px;
    text-align: left;
    font-size: 12px;
    color: #000;
    font-family: 'Roboto Mono';
}

/****** Select ****/

.select-Select-options {
    position: relative;
    line-height: 130%;
}
.select-div {
    position: relative;
    line-height: 130%;
    opacity: 0.5;
}
.select-junior-wrapper {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;
}
.select-parent {
	user-select: none;
    border-radius: 6px;
    border: 1px solid #ddd;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;
    padding: 8px 12px;
    gap: 8px;
}

.select-options-parent {
    width: 100%;
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: flex-start;
    gap: 8px;
    text-align: left;
    font-size: 12px;
    color: #000;
    font-family: 'Roboto Mono';
}

/****** scale ***/

    .scale {
      line-height: 130%;
    }
    .scale-frame-child {
      align-self: stretch;
      position: relative;
      border-radius: 6px;
      background-color: #dfe3fa;
      height: 6px;
    }
    .scale-div {
      position: relative;
      letter-spacing: 0.01em;
      line-height: 130%;
      opacity: 0.8;
    }
    .scale-div1 {
      position: relative;
      letter-spacing: 0.01em;
      line-height: 130%;
      white-space: pre-wrap;
      opacity: 0.8;
    }
    .scale-parent {
	user-select: none;
      align-self: stretch;
      display: flex;
      flex-direction: row;
      align-items: flex-start;
      justify-content: space-between;
    }
    .scale-scale-parent {
      width: 100%;
      position: relative;
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      justify-content: flex-start;
      gap: 8px;
      text-align: left;
      font-size: 12px;
      color: #000;
      font-family: 'Roboto Mono';
    }
    .slider {
      -webkit-appearance: none;
      width: 100%;
      height: 6px;
      border-radius: 6px;
      background: #dfe3fa;
      outline: none;
      opacity: 0.8;
      transition: opacity 0.2s;
    }
    .slider:hover {
      opacity: 1;
    }
    .slider::-webkit-slider-thumb {
      -webkit-appearance: none;
      appearance: none;
      width: 12px;
      height: 12px;
      border-radius: 50%;
      background: #356bff;
      cursor: pointer;
    }
    .slider::-moz-range-thumb {
      width: 12px;
      height: 12px;
      border-radius: 50%;
      background: #356bff;
      cursor: pointer;
    }

/****************/
  `;

    add_new_win() {
	nonav=1;
	return new Promise((resolve) => {
	    var id='add_new_'+(''+Math.random()).replace('.','-');
    	    dialog(`<div style="padding:20px;text-align:center;">
    <input size='60' id="my-input" style="
	width:300px;
        font-size: 14px;
        padding: 5px;
        border: 1px solid #ccc;
        border-radius: 10px;
        cursor: pointer;
        transition: background-color 0.3s ease;
    ">
    <input id="my-button" type='button' class='mv0'
	style="margin-left:20px;border-radius: 8px; background-color: rgb(0, 0, 0); padding: 6px 12px; box-sizing: border-box; color: white;"
    value='Save'>
</div>`,`<div style='font-size:14px'>Add new</div>`,{id:id});
    	    // Обработчик
	    var e=document.getElementById('my-input');
	    e.onchange = document.getElementById('my-button').onclick = () => { dialog.close(id); resolve(e.value); };
	    e.focus();
	});
    }


    async add_new(event) {
	var x = await this.add_new_win();
	x = x.indexOf('|') ? x.split('|') : [x];
	x.forEach(l=>{ if((l=(''+l).trim())!='') this.names_arr.push(l); });
	this.requestUpdate(); // принудительное обновление компонента
	this.update_names();
    }

    update_names() { // доложить наверх об изменениях
	this.names = JSON.stringify(this.names_arr);
        // Создаем и отправляем кастомное событие
        this.dispatchEvent(new CustomEvent('change-names', {
          detail: {
            audit_id: this.audit_id,
	    name: this.name,
	    names: this.names_arr,
            type: this.type,
          }, // Данные передаются в событии через `detail`
          bubbles: true, // Позволяет событию подниматься вверх по дереву
          composed: true // Позволяет событию пересекать границы Shadow DOM
        }));
    }

    async updateValue(event,x,opt) {
	event.stopPropagation(); // предотвращает всплытие события к родителям.
	event.preventDefault(); // предотвращает действие по умолчанию для ссылки, формы

	var i=this.names_arr.indexOf(x);

	if(opt=='del') {
	    if( await my_confirm('Delete "'+h(x)+'"?') ) {
		this.names_arr.splice(i, 1);
		this.requestUpdate(); // принудительное обновление компонента
		this.update_names();
	    }
	    return;
	}

	if(!this.mark) return;

	this.value_changed = true; // хоть раз тыкали в кнопки

	if(this.type=='yn') {
		var l=null; try{ var l = event.currentTarget.getAttribute('value') == '1' ? true : false; } catch(er){}
		if(l!=null) this.value_yn=l;
		else this.value_yn = !bool(this.value_yn);
	} else if(this.type=='scale') {
		this.value_scale = parseInt(event.target.value);
	} else if(this.type=='multi') {
		this.value_arr[i] = this.value_arr[i] ? 0 : 1;
	} else if(this.type=='select') {
		this.value_arr.forEach((x,ind) => { this.value_arr[ind] = (ind==i ? 1: 0) }); // сбросить все, а нужный установить
	}
	this.requestUpdate(); // принудительное обновление компонента

	// доложить наверх об изменениях
        this.dispatchEvent(new CustomEvent('change-value', {
          detail: {
            audit_id: this.audit_id,
            type: this.type,
	    name: this.name,
	    names: this.names_arr,
	    changed: this.value_changed,
	    values: {
		yn: this.value_yn,
		scale: this.value_scale,
		arr: this.value_arr,
	    }
          }, // Данные передаются в событии через `detail`
          bubbles: true, // Позволяет событию подниматься вверх по дереву
          composed: true // Позволяет событию пересекать границы Shadow DOM
        }));

	return; // не обрабатывать промежуточные значения
    }

    render() {
	this.edit=bool(this.edit);
	this.mark = bool(this.mark);
	this.edit = bool(this.edit);
	this.view = bool(this.view);

        try { this.names_arr = JSON.parse(this.names); } catch(er){ this.names_arr = []; }

	if(this.type == 'yn') {
	    if(this.mark) { // разрешено менять значения
		var s=html`
	<div style="display:flex; gap:40px;">
		<div class="task-alt-parent mv0" value="1" @click="${this.updateValue}">
	          <img class="icon mv0" src="/img/${this.value_yn===true?'task_alt.svg':'task_alt_no.svg'}" />
		  <div class="yn">Yes</div>
	        </div>

		<div class="task-alt-parent mv0" value="0" @click="${this.updateValue}">
	          <img class="icon mv0" src="/img/${this.value_yn===false?'task_alt.svg':'task_alt_no.svg'}" />
	          <div class="yn">No</div>
	        </div>
	</div>`;
	    } else if(this.view) { // показывать варианты
		var s=html`
	<div style="display:flex; gap:40px;">
		<div class="task-alt-parent">
	          <img class="icon" src="/img/task_alt.svg" />
		  <div class="yn">Yes</div>
	        </div>

		<div class="task-alt-parent">
	          <img class="icon" src="/img/task_alt_no.svg" />
	          <div class="yn">No</div>
	        </div>
	</div>`;
	    } else { // Старое

	 var s=html`<div
		    class="task-alt-parent${this.mark?' mv0':''}"
		    @click="${this.updateValue}"
		>
	          <img class="icon${this.mark?' mv':''}" src="/img/${this.value_yn?'task_alt.svg':'task_alt_no.svg'}" />
	          <div class="yn">${this.value_yn?'Yes':'No'}</div>
	        </div>`;
	    }

            return html`
	      <div class="yn-parent">
		${this.header==''?html``:html`<div class="yn">${this.header!='#'?this.header:'Y/N'}</div>`/*`*/}
		${s}
	      </div>`;

	} else if(this.type == 'scale') {

	    if(this.header.endsWith("-")) {
		return html`${this.header.slice(0,-1).replace(/\{percent\}/,this.value_scale)}`;
	    }

	    return html`
	      <div class="scale-scale-parent">
	        ${this.header==''?html``:html`<div class="scale">${(this.header!='#'?this.header:'Scale {percent}%').replace(/\{percent\}/,String(this.value_scale).padStart(3,' '))}</div>`/*`*/}

	        <input type="range" min="0" max="100" class="slider" value="${this.value_scale}"
	          @change="${this.updateValue}"
	          @input="${this.updateValue}"
		  ?disabled="${!this.mark}"
	        />

	        <div class="scale-parent">
	          <div class="scale-div">0%</div>
	          <div class="scale-div1">  50%</div>
	          <div class="scale-div">100%</div>
	        </div>
	      </div>`;

	} else if(this.type == 'select') {

	    if(this.mark) { // только 1 элемент может быть выбран в этом режиме
		var x=0; this.value_arr.forEach((val,i) => { if(x) this.value_arr[i]=0; else if(val) x=1; });
	    }

	    if(this.header=='-') {
		var s=this.names_arr.map((x,i) => this.value_arr[i] ? html`
    		<div class="select-parent">
    		    <div class="select-div">${i+1}</div>
    		    <div class="select-junior-wrapper">
        		    <div class="select-options">${x}</div>
    		    </div>
    		</div>
		`:html``);
		return html`<div class="fp-multi">${s}</div>`;
	    }

    	    var s = this.names_arr.map((x, i) => html`
    		<div class="select-parent${this.value_arr[i] ? ' active':''}${this.mark? ' mv0':''}"
		    @click="${(event) => this.updateValue(event, x)}"
		>
    		    <div class="select-div">${i+1}</div>
    		    <div class="select-junior-wrapper">
        		    <div class="select-options">${x}</div>
    		    </div>
		    ${this.edit ? html`<img class="icon mv" @click="${(event)=>this.updateValue(event, x, 'del')}" src="/img/close_small.svg">`:html``/*`*/}
    		</div>`);

	    return html`
		<div class="select-options-parent">
		    ${this.header==''?html``:html`<div class="select-options">${this.header!='#'?this.header:'Rating options'}</div>`/*`*/}
		    <div class="fp-multi">
			${s}
			${this.edit ? html`<div class="add-new mv0" @click="${this.add_new}">Add new</div>` : html``/*`*/}
		    </div>
	        </div>`;

	} else if(this.type === 'multi') {

	    if(this.header=='-') {
		var s=this.names_arr.map((x,i) => this.value_arr[i] ? html`<div class="me"><div class="multi-choice">${x}</div></div>`:html`` );
		return html`<div class="fp-multi">${s}</div>`;
	    }

    	    var s = this.names_arr.map((x, i) => html`
		<div class="me${this.value_arr[i] ? ' active':''}${this.mark? ' mv0':''}"
	    	    @click="${(event) => this.updateValue(event, x)}"
		>
    		    <div class="multi-choice">${x}</div>
		    ${this.edit ? html`<img class="icon mv" @click="${(event)=>this.updateValue(event, x, 'del')}" src="/img/close_small.svg">` : html`` /*`*/}
    		</div>`
	    );

	    return html`
		<div class="multi-choice-parent">
		    ${this.header==''?html``:html`<div class="multi-choice">${this.header!='#'?this.header:'Multi-choice'}</div>`/*`*/}
		    <div class="fp-multi">
			${s}
			${this.edit ? html`<div class="add-new mv0" @click="${this.add_new}">Add new</div>` : html``/*`*/}
		    </div>
		</div>`;

	} else {
	    return html`unknown type: ${this.type}`;
	}
    }
}

customElements.define('select-parameter', SelectParameter);