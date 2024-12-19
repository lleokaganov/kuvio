import {LitElement, html, css} from './lit-all.min.js';

class AuditPanel extends LitElement {

    static properties = {
        mode: {type: String},
        audit_id: {type: String},
        audit_name: {type: String},
        audit_description: {type: String},
        audit_blake3: {type: String},
        audit_candidates: {type: Number},
        audit_parameters: {type: Number},
        audit_evidences: {type: Number},
        audit_rules: {type: String},
        audit_asks: {type: String},
        audit_KUVIM: {type: Number}, // в какое KUVI.M[???] писать name при сохранении
    };

    constructor() {
        super();
        this.mode = 'view';
        this.audit_id = 'Error_audit_id';
        this.audit_name = 'Error_audit_name';
        this.audit_description = `Error_audit_description`;
        this.audit_blake3 = 'Error_audit_blake3';
        this.audit_candidates = 376;
        this.audit_parameters = 2;
        this.audit_evidences = 1;
	this.audit_rules = '[]';
	this.audit_asks = '[]';
    }

    connectedCallback() {
        super.connectedCallback();
        // Выполняем вычисления
//        this.public = false;
//        this.mode = f_read('Audit_mode','Candidates');
//        this.mode = ( this.mode == 'Audits' ? 'Audits' : 'Candidates' );
//    }
//    firstUpdated() {
        // Выполняем преобразование rules из строки в объект
	try {
	    this.audit_rules = JSON.parse(this.audit_rules);
	} catch(e) {
    	    console.error('Parsing error rules:', e);
	}
    }

    updated(changedProperties) {
	super.updated(changedProperties);
	this.textarea_resize();
    }

    static styles = css`

    :host {
        width:100%
    }

    .mv,.mv0,.mv00 { transition: transform 0.2s ease-in-out; }
    .mv:hover,mv0:hover,mv00:hover { transition-property: transform;
        transition-duration: 0.2s;animation: none; transform: scale(1.7); cursor:pointer;}
    .mv0:hover { transform: scale(1.1); }
    .mv00:hover { transform: scale(1.05); }


        .frame-group {
	    text-align: left;
            border: 2px solid transparent;
            align-self: stretch;
            border-radius: 8px;
            /* background-color: #fff; */
	    background-color: #f5f5f5;
            display: flex;
            flex-direction: column;
            align-items: flex-start;
            justify-content: flex-start;
            padding: 16px;
            gap: 24px;
	    max-width: 600px;
        }
        .frame-group:hover {
            border: 2px solid lightblue;
        }

        .audit-name {
            font-weight: 600;
            width: 100%;
            border-radius: 4px;
            border: 1px solid #ddd;
            box-sizing: border-box;
            height: 41px;
            display: flex;
            flex-direction: row;
            align-items: center;
            justify-content: flex-start;
            padding: 8px 10px;
            font-size: 19px;
        }

        .audit-name-parent {
            display: flex;
            flex-direction: column;
            align-items: flex-start;
            justify-content: flex-start;
            gap: 8px;
            width: 100%;
        }

        .frame-container {
            display: flex;
            flex-direction: row;
            align-items: center;
            justify-content: flex-start;
            gap: 24px;
            opacity: 0.8;
        }

        .icon-and-txt {
            display: flex;
            flex-direction: row;
            align-items: center;
            justify-content: center;
            padding: 2px 0px;
            gap: 8px;
        }

        .audit-description {
	    resize: none;

            width: 100%;
            border-radius: 4px;
            border: 1px solid #ddd;
            box-sizing: border-box;
            min-height: 56px;
            display: flex;
            flex-direction: row;
            align-items: center;
            justify-content: flex-start;
            padding: 8px 10px;
            font-size: 14px;
        }

        .rs {
            font-size: 14px;
            font-weight: 400;
            color: #333;
        }

        .ico16 {
            width: 16px;
            height: 16px;
        }

/********* save button *********/

.save_button {
    line-height: 130%;
    font-weight: 500;
    width: 100%;
    border-radius: 8px;
    background-color: #000;
    height: 42px;
    padding: 12px 16px;
    box-sizing: border-box;
    text-align: center;
    font-size: 14px;
    color: #fff;
    font-family: Inter;
}

    `;

    handleClick() {
	// Передаем текущий элемент в другую функцию
        // this.someOtherFunction(this);
	// alert(this.audit_rules);
	if(this.mode == 'view') return KUVI.www_about_auditor({
	    mode: this.mode, // ?
    	    audit_id: this.audit_id,
    	    audit_name: this.audit_name,
    	    audit_description: this.audit_description,
    	    audit_blake3: this.audit_blake3,
    	    audit_candidates: this.audit_candidates,
    	    audit_parameters: this.audit_parameters,
    	    audit_evidences: this.audit_evidences,
    	    audit_rules: this.audit_rules,
    	    audit_asks: this.audit_asks,
	    element: this,
	});
    }

  textarea_resize(event) {
    this.shadowRoot.querySelectorAll('textarea').forEach(e => { // event.target;
	    // console.log(e.value+' '+e.defaultValue);
    	    e.style.height = 'auto'; // Сбрасываем высоту перед вычислением новой
            e.style.height = Math.min(e.scrollHeight+5, 300)+'px'; // Устанавливаем на основе прокрутки
    });
    this.save_needed();
  }

  save_needed() {
    var sn = false;
    this.shadowRoot.querySelectorAll('textarea, input').forEach(e => { if(e.value!=e.defaultValue) sn=true; });
    this.shadowRoot.querySelector('.save_button').style.display = (sn?'block':'none');
  }

    cheditmode(event) {
	console.log('this.mode = '+this.mode);
	if(this.mode=='edit') this.mode='edited'; // Edit
	else if(this.mode=='edited') { // Cancel
	    this.mode='edit';
	    this.shadowRoot.querySelectorAll('textarea, input').forEach(e => { e.value=e.defaultValue });
	}
	this.requestUpdate(); // принудительное обновление компонента
    }

    goedit(event){
	if(this.mode=='edit') this.mode='edited';
    }


    render() { //  @mouseover=${() => this.handleClick()}
        return html`
            <div class="frame-group" @click="${this.handleClick}">
                <div class="audit-name-parent">
		    <div style="width:100%; display:flex; align-items:center; justify-content:space-between;">

                	<div class="rs">Audit name</div>

			<div style="gap:20px;display:flex;font-size:14px;">
			    ${this.mode !== 'edited' ? html`` : html`
	        		<div class="mv0" style="display:inline-block;letter-spacing: 0.01em; font-weight: 500; color: rgb(53, 107, 255); white-space: nowrap;"
		                @click="${this.handleDel}">Delete</div>`
			    }

			    ${this.mode === 'view' ? html`` : html`
				<div class="mv0" style="display:inline-block;letter-spacing: 0.01em; font-weight: 500; color: rgb(53, 107, 255); white-space: nowrap;"
		                @click="${this.cheditmode}">${this.mode === 'edited' ? 'Cancel' : 'Edit'}</div>`
			    }
			</div>

		    </div>

		    ${
			this.mode=='edited'
			? html`<input @input="${this.save_needed}" placeholder="Unique name" type="text" name='audit-name' class="audit-name" value="${this.audit_name}" />`
			: html`<div class="audit-name" @click="${this.goedit}">${this.audit_name}</div>`
		    }
                </div>
                <div class="audit-name-parent">
                    <div class="rs">Audit description</div>
		    ${
			this.mode=='edited'
			? html`<textarea placeholder="A few words about audit description" name='audit-description' class="audit-description" @input="${this.textarea_resize}">${this.audit_description}</textarea>`
                	: html`<div class="audit-description" @click="${this.goedit}">${this.audit_description}</div>`
		    }
                </div>
                <div class="frame-container rs">
                    <div class="icon-and-txt">
                        <img class="ico16" src="img/frame_person.svg">
                        ${this.audit_candidates}
                    </div>
                    <div>${this.audit_parameters} Evaluation parameters</div>
                    <div>${this.audit_evidences} Requested evidence</div>
                </div>

		<div class="save_button" @click="${this.saveAction}"><div class="login-as-auditor mv0">Save</div></div>

            </div>
        `;
    }

    /// Запись изменений
    async saveAction(event) {
	// взяли и запомнили новые данные
	var p={
	    name: (this.audit_name = this.shadowRoot.querySelector("input[name='audit-name']").value),
	    about: (this.audit_description = this.shadowRoot.querySelector("textarea[name='audit-description']").value),
	    _id: this.audit_id,
	};

	var r = KUVI.my_audits.find(x => x._id === this.audit_id);
	r = (r ? {...r,...p} : p);

	var id = await KUVIO.API('auditor_my_save',r);
	if(typeof(id)=='string'&&id.length) { // добавим в массив если новый
	    p._id = this.audit_id = id;
	    KUVI.my_audits.push(p);
	}

	// console.log(`KUVI.M[${this.audit_KUVIM}] = ${p.name}`,typeof(this.audit_KUVIM));
        // KUVI.M[this.audit_KUVIM] = p.name; // в какое KUVI.M[???] писать name при сохранении
        this.audits_update( { kuvim: this.audit_KUVIM, name: p.name } );
	/// this.mode='edit';
    }

    async handleDel(event) {
	if(!await my_confirm(`Delete «`+h(this.audit_name)+`»?`)) return;
        var result = await KUVIO.API('auditor_del',{audit_id:this.audit_id});
        if(result !== true) return dialog(h(result),"Error deleting");
        this.audits_update();
    }

    async audits_update( detail ) {
            KUVI.my_audits=false; // чтобы перечитал заново с сервера
            this.dispatchEvent(new CustomEvent('main-screen_render', { detail: detail, bubbles: true, composed: true }));
    }

}

customElements.define('audit-panel', AuditPanel);
