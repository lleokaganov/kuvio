import { LitElement, html, css } from './lit-all.min.js';

class NewEvidence extends LitElement {

    static properties = {
        filetype: {type: String}, // тип файла
	audit_id: {type: String}, // имя Аудита
	ask_name: {type: String}, // name
	ask_about: {type: String}, // about
//	ask_num: {type: String}, // id для редактирования
        saveready: {type: Boolean},
    };

    constructor() {
        super();
	// this.name_old = this.ask_name;
	// this.about_old = this.ask_about;
	this.audit_id = "";
//	this.ask_num = "";
	this.ask_name = "";
	this.ask_about = "";
        this.filetype = "text";
        this.saveready = false;
    }

    firstUpdated() {
        this.textarea_resize();
    }

    chtype(event) {
	this.filetype = (this.filetype=="file"?"text":"file");
	console.log("this.filetype=",this.filetype);
	console.log("this.filetype_old=",this.filetype_old);
	this.save_needed();
    }

    // firstUpdated() { }

    connectedCallback() {
        super.connectedCallback();
	this.name_old = this.ask_name;
	this.about_old = this.ask_about;
	this.filetype_old = this.filetype;
	this.saveready = false;

	this.filetype = (this.filetype=='text'?'text':'file');
	// this.ask_name = '';
	// this.ask_about = '';

        var r = KUVI.my_audits.find(x => x._id === this.audit_id);
	if(r && r.find) {
	    var f = r.find(x => x.name === this.ask_name);
	    if(f) {
		this.filetype = f.type;
		this.ask_name = f.name;
		this.ask_about = f.about;
	    }
	}

	this.filetype_old = this.filetype;
    }



  static styles = css`
    :host {
        width:100%
    }

.mv,.mv0,.mv00 { transition: transform 0.2s ease-in-out; cursor: pointer; }
.mv:hover,mv0:hover,mv00:hover { transition-property: transform; transition-duration: 0.2s;animation: none; transform: scale(1.7); cursor:pointer;}
.mv0:hover { transform: scale(1.1); }
.mv00:hover { transform: scale(1.05); }


    .type {
      position: relative;
      line-height: 130%;
      font-weight: 500;
    }
    .upload-2-icon {
      width: 24px;
      position: relative;
      height: 24px;
    }
    .name {
      position: relative;
      line-height: 130%;
    }
    .description {
      align-self: stretch;
      position: relative;
      font-size: 12px;
      letter-spacing: 0.01em;
      line-height: 130%;
      font-family: Inter;
      opacity: 0.8;
    }
    .evidencetype {
      flex: 1;
      border-radius: 8px;
      background-color: #f5f5f5;
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      justify-content: center;
      padding: 12px;
      gap: 4px;
      opacity: 0.8;
    }
    .evidencetype-parent {
      align-self: stretch;
      display: flex;
      flex-direction: row;
      align-items: flex-start;
      justify-content: flex-start;
      gap: 8px;
      font-family: 'Roboto Mono';
    }
    .type-parent {
      align-self: stretch;
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      justify-content: flex-start;
      gap: 8px;
    }
    .evidence-name {
      align-self: stretch;
      position: relative;
      line-height: 130%;
      font-weight: 500;
    }
    .ig-cvw {
      align-self: stretch;
      border-radius: 8px;
      border: 1px solid #d9d9d9;
      padding: 12px 16px;
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
	width: 450px;
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
    .active {background-color: #dfe3fa;}
  `;




  textarea_resize(event) {
    this.shadowRoot.querySelectorAll('textarea').forEach(e => { // event.target;
            // console.log(e.value+' '+e.defaultValue);
            e.style.height = 'auto'; // Сбрасываем высоту перед вычислением новой
            e.style.height = Math.min(e.scrollHeight+5, 300)+'px'; // Устанавливаем на основе прокрутки
    });
    this.save_needed();
  }

  save_needed() {
    var x=false;
    if(this.filetype_old != this.filetype) x=true;
    else this.shadowRoot.querySelectorAll('textarea, input').forEach(e => { if(e.value!=e.defaultValue) x=true; });
    // if(this.shadowRoot.querySelector("input[name='name']").value=='') x=false;
    this.saveready=x;
  }

  async save(){
    if(!this.saveready) return;
    console.log("new-evidence: save");
    const audit = KUVI.my_audits.find((item)=>{ return item._id === this.audit_id; });
    if(audit) {
            if(typeof(audit.asks)!='object') audit.asks=[];

	    var p = {
		type: this.filetype,
		name: this.shadowRoot.querySelector("input[name='name']").value,
		about: this.shadowRoot.querySelector("textarea[name='about']").value,
	    };
            var num = audit.asks.findIndex(x => x.name === this.name_old);
            if(num !== -1) audit.asks[num] = p; else audit.asks.push(p); // изменили старый или добавили новый

            // Сохраняем данные на сервере
            const id = await KUVIO.API('auditor_my_save',audit); // записали
            if(id!==true) return console.log('error saving');

	    // Создаем и отправляем кастомное событие рендера
	    KUVI.my_audits=false; // чтобы перечитал заново с сервера
	    this.dispatchEvent(new CustomEvent('main-screen_render', { bubbles: true, composed: true }));
    }
    dialog.close('NE_'+h(this.audit_id));
  }


  render() {
    return html`
      <div class="frame-parent">

        <div class="type-parent">
          <div class="type">Type</div>
          <div class="evidencetype-parent">
            <div class="mv0 evidencetype${ this.filetype == 'file' ? ' active' :''}" @click="${this.chtype}">
              <img class="upload-2-icon" alt="" src="/img/upload_2.svg" />
              <b class="name">File</b>
              <div class="description">PDF, JPG up to 20mb</div>
            </div>
            <div class="mv0 evidencetype${ this.filetype == 'text' ? ' active' :''}" @click="${this.chtype}">
              <img class="upload-2-icon" alt="" src="/img/notes.svg" />
              <b class="name">Text</b>
              <div class="description">Text up to 1000 characters</div>
            </div>
          </div>
        </div>

        <div class="type-parent">
          <div class="evidence-name">Evidence name</div>
          <input value="${this.ask_name}" @input="${this.save_needed}" name='name' class="ig-cvw" placeholder="I.g. CV, Employer letter, Test task etc.">
        </div>

        <div class="type-parent">
          <div class="evidence-name">Evidence description</div>
          <textarea @input="${this.textarea_resize}" name="about" class="ig-cvw" placeholder="I.g. specific requirements for the document">${this.ask_about}</textarea>
        </div>

        <div class="button${ this.saveready ? ' act' :''}" @click="${this.save}">
          <div class="type">Save</div>
        </div>
      </div>
    `;
  }
}

customElements.define('new-evidence', NewEvidence);
