import { LitElement, html, css, unsafeHTML } from './lit-all.min.js';

class RequestedFiles extends LitElement {

    static properties = {
        mode: {type: String}, // auditor [, talant]
	audit_id: {type: String},
	audit_blake3: {type: String},

	files: {type: String},
	// разрешения
	edit: {type: String}, // 1 - разрешить редактирование
	// unic: {type: String}, // unic чтобы понять можно ли это редактировать
	audit_me: {type: String}, // 1 - разрешить кнопку "audit me"
	upload: {type: String}, // 1 - разрешить upload файлов
	marked_red: {type: Boolean}, // помечать ли красным незаполненные файлы
    }

    constructor() {
        super();
	this.marked_red = false;
        this.mode = 'talant';
        this.audit_id = '';
        this.files = '';
    }

    async connectedCallback() {
        super.connectedCallback();
        // включаем общий обработчик для 'file-uploaded'
        document.addEventListener('file-uploaded', this._handleFileUploaded.bind(this));
        // включаем общий обработчик для 'audit-me'
        document.addEventListener('audit-me', this.click_audit_me.bind(this));
    }
    disconnectedCallback() {
        // отключаем общий обработчик для 'save-evidence'
        document.removeEventListener('file-uploaded', this._handleFileUploaded.bind(this));
        // отключаем общий обработчик для 'audit-me'
        document.removeEventListener('audit-me', this.click_audit_me.bind(this));
    }

  static styles = css`
    :host {
        width:100%;
    }

    .mv,.mv0,.mv00 { transition: transform 0.2s ease-in-out; }
    .mv:hover,mv0:hover,mv00:hover { transition-property: transform;
        transition-duration: 0.2s;animation: none; transform: scale(1.7); cursor:pointer;}
    .mv0:hover { transform: scale(1.1); }
    .mv00:hover { transform: scale(1.05); }

    .button-blue {
      margin-top:10px;
      user-select: none;
      border-radius: 8px;
      background-color: #356bff;
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: center;
      padding: 12px 16px;
      font-size: 14px;
      color: #fff;
    }

    .type {
      position: relative;
      font-size: 12px;
      letter-spacing: 0.01em;
      line-height: 130%;
      font-family: 'Roboto Mono';
      opacity: 0.8;
    }
    .name {
      position: relative;
      font-size: 15px;
      line-height: 130%;
      font-weight: 600;
    }

.edit {
        position: absolute;
        display:inline-block;
        font-size:24px;
        right: 30px;
        color: rgb(53, 107, 255);
        font-size:14px;
        box-shadow: 0 0 10px 10px rgb(255, 255, 255);
        background-color: #fff;
        margin: 0px !important;
          EEtop: 16px;
        line-height: 130%;
        font-weight: 500;
        text-align: right;
  z-index: 2;
  border-radius: 50%;
  cursor: pointer;
  padding: 2px;
}
/*.edit:after { content: "Edit"} 📝 */

    .notes-icon {
      width: 24px;
      height: 24px;
    }
    .notes-wrapper {
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: flex-start;
      padding: 6px 0px;
      z-index: 0;
    }
    .description {
      align-self: stretch;
      position: relative;
      font-size: 14px;
      line-height: 140%;
    }

    .the-project-plan {
      flex: 1;
      position: relative;
      line-height: 130%;
      z-index: 0;
    }

    .evidencerequest {
     border: 2px solid #ddd;
     align-self: stretch;
     border-radius: 8px;
     display: flex;
     flex-direction: row;
     align-items: flex-start;
     justify-content: flex-start;
     padding: 12px 16px;
     position: relative;
     gap: 16px;
    }
    .evidencerequest:hover {
	border: 2px solid lightblue;
    }
    .marked_red {
	 border: 2px dashed red;
    }

    .evidencerequest.active {
      border: 1px solid #356bff;
      text-align: right;
      font-size: 14px;
      color: #356bff;
    }

    .evidencerequest1 {
      align-self: stretch;
      border-radius: 8px;
      display: flex;
      flex-direction: row;
      align-items: flex-start;
      justify-content: flex-start;
      padding: 12px 16px;
      position: relative;
      background-color: #e6f4ff;
      border: 1px solid #ddd;
      gap: 12px;
    }


    .type-parent {
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      justify-content: flex-start;
      gap: 6px;
      opacity: 0.8;
      z-index: 1;
      text-align: left;
      font-size: 12px;
      color: #000;
    }
    .submit-evidence {
      position: absolute;
      margin: 0 !important;
      top: 16px;
      right: 16px;
      font-weight: 500;
      display: inline-block;
      z-index: 1;
    }
    .check-circle-icon {
      width: 24px;
      position: relative;
      height: 24px;
      z-index: 0;
    }

    .filedesc {
      position: relative;
      font-size: 14px;
      line-height: 140%;
      display: inline-block;
      flex-shrink: 0;
    }

    .file {
      display: inline-block;
      position: relative;
      line-height: 130%;
      font-weight: 600;
    }

    .portfoliopdf-parent {
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      justify-content: flex-start;
      gap: 4px;
      z-index: 1;
    }

    .uploaded-just-now {
      white-space: nowrap;
      position: relative;
      font-size: 12px;
      letter-spacing: 0.01em;
      line-height: 130%;
      font-family: 'Roboto Mono';
      opacity: 0.8;
      z-index: 2;
    }
    .type-group {
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      justify-content: flex-start;
      gap: 6px;
      opacity: 0.8;
      z-index: 1;
    }

    .description1 {
      width: 488px;
      position: relative;
      font-size: 14px;
      line-height: 140%;
      display: none;
    }


    .frame-parent {
      width: 100%;
      position: relative;
      border-radius: 16px;
      background-color: #fff;
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      justify-content: flex-start;
    NNNNNNNNNNNNNNNNNNNNNNNNNNNpadding: 16px;
      box-sizing: border-box;
      gap: 24px;
      text-align: left;
      font-size: 16px;
      color: #000;
      font-family: Inter;
    }

.medit {
    font-size:12px;
    display:inline-block;
    letter-spacing: 0.01em;
    font-weight: 500;
    color: rgb(53, 107, 255);
    white-space: nowrap;
}

.medit-main {
    width:100%;
    display:flex;
    align-items:center;
    justify-content:space-between;
}


  `;




  ifuploaded(x,boolret) {
    // создать массивы
    const file = (((KUVI.uploaded ||= {})[this.audit_id] ||= {})[x.name] ||= {});
    if(boolret) return file.name && file.hash;
    if(!file.name || !file.hash) return html``; // Пока не загружено файла

    return html`
        <div class="evidencerequest1">
    	    <img class="check-circle-icon" src="img/check_circle.svg" />

    	    <div class="portfoliopdf-parent">
        	${x.type=='text' ? html`` : html`<div class="file">${file.name}</div>`}
                <div class="filedesc">${file.about}</div>
            </div>

            <div class="uploaded-just-now">Uploaded ${FileTime(file.time)}</div>
        </div>`;
  } // `



  render_all_files() {
    try{
	this.files_pp = JSON.parse(this.files);

	return this.files_pp.map( (x,num) => html`
            <div class="evidencerequest${this.marked_red && !this.ifuploaded(x,1)?' marked_red':''}" num="${num}" @click="${(event)=>{this.run_editor(event,x,num)}}">

              <div @click="${(event)=>{this.clickUpload(event,x,num)}}" class="notes-wrapper${this.edit || this.upload ? ' mv':''}">
		<img class="notes-icon" src="${x.type == 'text' ? "/img/notes.svg" : "/img/upload_2.svg"}">
	      </div>

              <div class="type-group">

		<div class="medit-main">
        	    <div class="type">${x.type == 'text' ? 'Text' : 'Uploaded document'}</div>
            	    ${this.edit ? html`<div class="medit mv0" @click="${(event)=>{this.run_editor(event,x,num)}}">Edit</div>`:/*`*/html``}
		</div>

                <div class="name" num="${num}">${x.name}</div>
                <div class="description" num="${num}">${ unsafeHTML( text2html(x.about) ) }</div>

		${this.upload ? this.ifuploaded(x) : html`` }

              </div>

	      ${this.upload ? html`<div @click="${(event)=>{this.clickUpload(event,x,num)}}" class="edit mv0">Upload</div>`:html``}
	      ${/*this.edit ? html`<div @click="!!!!!!!!!!!!!!!" class="edit mv0">Edit</div>`:html*/``}
            </div>
	`); // `

    } catch(er) {
	console.log('error <requested-files> render');
	return html``;
    }

  }

  // audit-me
  async click_audit_me(event) {
    while(!unis) await KUVIO.LOGIN.login();

    this.marked_red = true;
    // это вопросы:
    this.files_pp = JSON.parse(this.files);
    var r={
	audit_id: this.audit_id,
	audit_blake3: this.audit_blake3,
	asks:[],
    };
    this.files_pp.forEach( (x,i) => { // num: i, type: x.type,  ask_name: x.name,  ask_about: x.about,
	const file = (((KUVI.uploaded ||= {})[this.audit_id] ||= {})[x.name] ||= {});
	if(file.hash) r.asks.push({
	    file_hash: file.hash,
	    file_about: file.about,
	    file_name: file.name,
	});
    });

    if(this.files_pp.length != r.asks.length) {
	console.log("не все файлы введены!");
	// var e = document.querySelector('#main-screen').shadowRoot.querySelector('a[name="some"]');
	var e = document.querySelector('requested-files');
	if(e) window.scrollTo({ top: (e.getBoundingClientRect().top + window.pageYOffset), behavior: 'smooth' });
	return;
    }

    var audit = await KUVIO.API('audit_request_add',r); // заявка на аудит
    if(!audit || !audit.status) return idie("Error");

    if(audit.status=='exist') salert("Request already done",1000);
    else salert("Request: "+audit.id,1000);

    // Создаем и отправляем кастомное событие для закрытия окна
    this.dispatchEvent(new CustomEvent('clean-about_auditor_place', { bubbles: true, composed: true }));

  }

  async clickUpload(event,x,num) {
	event.stopPropagation(); // предотвращает всплытие события к родителям.
	event.preventDefault(); // предотвращает действие по умолчанию для ссылки, формы
// 		@file-uploaded="${this.handle_fileUploaded}" бессмысленно если диалоговое окно

        while(!unis) await KUVIO.LOGIN.login();

	const file = (((KUVI.uploaded ||= {})[this.audit_id] ||= {})[x.name] ||= {});

	dialog(`<file-upload
	        audit_id="`+h(this.audit_id)+`"
    		type="`+h(x.type)+`"
    		name="`+h(x.name)+`"
		file_json='`+h(JSON.stringify(file))+`'
		description="`+h(x.about)+`"
	></file-upload>`,'File upload',{id:'NE_'+h(this.audit_id)}); // +num+'_'
  }

  _handleFileUploaded(event) {
    console.log("requested-files.js",event.detail);
    ((KUVI.uploaded ||= {})[this.audit_id] ||= {})[event.detail.name] = event.detail.file;
    this.requestUpdate(); // принудительное обновление компонента
  }

 run_editor(event,x,num){
	event.stopPropagation(); // предотвращает всплытие события к родителям.
	event.preventDefault(); // предотвращает действие по умолчанию для ссылки, формы

	if(this.upload) return this.clickUpload(event,x,num);
	if(!this.edit) return;
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


  render() {
    this.audit_me=bool(this.audit_me);
    this.upload=bool(this.upload);

    return html`
      <div class="frame-parent">
	    ${this.render_all_files()}
      </div>

      ${this.audit_me?/*`*/html`
	<div class="button-blue" @click="${this.click_audit_me}">
          <div class="login-as-auditor mv0">Audit me!</div>
	</div>
      `:/*`*/html``}
    `;
  }

}

customElements.define('requested-files', RequestedFiles);
