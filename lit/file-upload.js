import {LitElement, html, css} from './lit-all.min.js';

class FileUpload extends LitElement {

    static properties = {
	audit_id: {type: String},
	type: {type: String}, // 'file', 'text'
        name: {type: String},
        description: {type: String},
	my_files: {type: Array},
	saveneed: {type: Boolean},
	file: {type: Object}, // имя выбранного файла
	file_json: {type: String}, // имя выбранного файла
	open: {type: String}, // открыт или закрыт блок своих файлов
	mode: {type: String}, // select или fileview
    }

    constructor() {
        super();
        this.mode = 'select';
        this.name = '';
        this.description = '';
        this.file = {};
    }

    async connectedCallback() {
        super.connectedCallback();
	try { this.file = JSON.parse(this.file_json); } catch(er){}
	this.my_files = null;
	this.open = bool( this.open != undefined ? this.open : f_read('Fileslist_open','1') );
    }

    firstUpdated() {
	if(this.open) this.update_my_files();
    }

    async update_my_files() {
        this.my_files = await KUVIO.API('cv_my'); // все мои файлы
    }

  static styles = css`
    :host {
        width:100%
    }

    .mv,.mv0,.mv00 { transition: transform 0.2s ease-in-out; cursor: pointer; }
    .mv:hover,mv0:hover,mv00:hover { transition-property: transform; transition-duration: 0.2s;animation: none; transform: scale(1.7); cursor:pointer;}
    .mv0:hover { transform: scale(1.1); }
    .mv00:hover { transform: scale(1.05); }

    .cv {
      position: relative;
      font-weight: 600;
    }

    .icon24 {
      width: 24px;
      height: 24px;
    }

    .zone {
      flex: 1;
      border-radius: 8px;
      background-color: #f5f5f5;
      width: 448px;
      height: 160px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 12px;
      box-sizing: border-box;
      opacity: 0.8;
    }

    .fzone {
      align-self: stretch;
      display: flex;
      flex-direction: row;
      align-items: flex-start;
      justify-content: flex-start;
      border: 1px dashed transparent;
    }
    .active {
      background-color: #bbb;
      border: 1px dashed #ccc;
    }

    .dd {
      align-self: stretch;
      position: relative;
      font-size: 14px;
      line-height: 140%;
      EEEEEEEEEEfont-weight: 500;
    }

    .wrapper {
      align-self: stretch;
      border-radius: 8px;
      border: 1px solid #356bff;
      display: flex;
      flex-direction: row;
      align-items: flex-start;
      justify-content: flex-start;
      padding: 12px 16px;
      max-width: 100%;
      min-height: 40px; /* Минимальная высота */
      overflow: hidden;  /* Скрываем скролл */
    }

    .dd-parent {
      align-self: stretch;
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      justify-content: flex-start;
      gap: 8px;
    }

    .icon12 {
      width: 12px;
      height: 12px;
    }

    .remove-wrapper {
      width: 24px;
      height: 24px;
      border-radius: 4px;
      background-color: #fff;
      border: 1px solid #eee;
      box-sizing: border-box;
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: center;
      padding: 0px 8px;
    }

    .my-documents {
      flex: 1;
      font-weight: 600;
    }

    .frame-parent {
      align-self: stretch;
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: flex-start;
      gap: 8px;
    }

    .fw {
      font-weight: 500;
    }

    .button {
      cursor: pointer;
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
      color: #fff;
        opacity: 0.5;
    }
    .buttonact {
	opacity: 1.0;
    }

    .cv-parent {
      width: 100%;
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
      font-family: 'Inter', sans-serif;
    }

/*============ file =============*/
.file {
  width: 100%;
  padding: 2px;
  border: 2px solid transparent;
  border-radius: 5px;
  EEEEEEEEEEEEEEEEEEEEEEEEmargin-top: 8px;
}
.file:hover {
  border: 2px solid lightblue;
}

.file-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.file-name {
  font-weight: bold;
  font-size: 12px;
  text-decoration: none;
  color: #184396;
}

.file-details {
  display: flex;
  gap: 12px; /* Расстояние между размером и датой */
  font-size: 8px;
}

.file-size {
  color: #555;
  font-family: monospace;
}

.file-date {
  text-align:right;
  color: #555;
  min-width: 50px;
  font-family: monospace;
}

.file-left {
  display: flex;
  align-items: center;
  gap: 8px; /* Расстояние между иконкой и именем файла */
}

.file-about {
  margin-left: 32px;
  font-size: 8px;
}

.file-about-filelist {
  font-size: 10px;
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

/********* file ***********/

.files {
    position: relative;
    margin: 6px;
    width: 100%;
    border-radius: 8px;
    background-color: #e6f4ff;
    border: 1px solid #ddd;
    box-sizing: border-box;
    display: flex;
    flex-direction: row;
    align-items: flex-start;
    justify-content: flex-start;
    padding: 12px 16px;
    gap: 12px;
    text-align: left;
    font-size: 15px;
    color: #000;
    font-family: Inter;
    border: 2px solid transparent;
}

.files:hover {
  border: 2px solid lightblue;
}


.files-parent {
    width: 288px;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: flex-start;
    gap: 4px;
    z-index: 1;
}

.files-name {
    EEEEEEEEEEEalign-self: stretch;
    position: relative;
    line-height: 130%;
    font-weight: 600;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
}

.files-about {
    width: 268px;
    position: relative;
    font-size: 14px;
    line-height: 140%;
    display: inline-block;
    height: 20px;
    flex-shrink: 0;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
}

.files-time {
    position: relative;
    font-size: 12px;
    letter-spacing: 0.01em;
    line-height: 130%;
    font-family: 'Roboto Mono';
    opacity: 0.8;
    z-index: 2;
}
.files-edit {
    position: absolute;
    margin: 0 !important;
    top: 0;
    right: 0;
    font-size: 14px;
    line-height: 130%;
    font-weight: 500;
    color: #356bff;
    text-align: right;
    z-index: 3;
}










.ue {
    display: inline-block; /* Чтобы анимация работала для текста */
    position: relative;    /* Создаём контекст для псевдоэлемента */
    cursor: pointer;       /* Указывает, что элемент кликабельный */
    text-decoration: none; /* Убирает стандартное подчеркивание */
}

.ue::after {
    content: '';                   /* Псевдоэлемент без текста */
    position: absolute;            /* Абсолютное позиционирование */
    left: 0;
    bottom: 0;
    width: 0;                      /* Изначально линия невидима */
    height: 2px;                   /* Толщина линии */
    background-color: #007BFF;     /* Цвет линии (выберите любой) */
    transition: width 0.3s ease;   /* Плавное увеличение ширины */
}

.ue:hover::after {
    width: 100%;                   /* Линия расширяется при наведении */
}


`;


  textarea_resize(event) {
    const textarea = event.target;
    if(textarea.tagName.toLowerCase() === 'textarea') {
      // Сбрасываем высоту перед вычислением новой
      textarea.style.height = 'auto';
      // Устанавливаем высоту на основе прокручиваемой высоты
      textarea.style.height = Math.min(textarea.scrollHeight, 300) + 'px';
      this.ifsaveneed(textarea);
    }
  }

  ifsaveneed(textarea) {
	if(this.type == 'text') {
	    if(textarea) this.saveneed = textarea.defaultValue != textarea.value;
	}
	else (this.saveneed = this.file) && this.file.name && this.file.hash && this.file.hash.length;
  }

  async save(event) {
    this.ifsaveneed(); if(!this.saveneed) return; // проверим, готов ли файл

    var s = this.shadowRoot.querySelector("textarea[name='about']").value;

    console.log(`File save: audit: [${this.audit_id}] name: [${this.name}]`);

    if(this.type == 'text') {

	var file = {
	    about: s,
	    name: this.audit_id+'_'+this.name,
	};
	var rs = await KUVIO.API('cv_set_visible',file); // обновить

	console.log(`Text save result:`,rs);

        await this.update_my_files();

	console.log(`this.my_files:`,this.my_files);
        this.file = this.my_files.find(x => x.name === file.name);
	if(!this.file) idie(`Error loadin text: [${this.audit_id}] name: [${this.name}]`,this.file);
	else console.log(`this.file:`,this.file);

    } else {
	if(this.file.about != s) { // Обновить описание файла в базе
	    this.file.about = s;
	    await KUVIO.API('cv_set_visible',{hash:this.file.hash,about:this.file.about}); // обновить about
	    this.update_my_files();
	}
    }

    // Создаем и отправляем кастомное событие
    this.dispatchEvent(new CustomEvent('file-uploaded', {
        detail: { // Данные передаются в событии через `detail`
            audit_id: this.audit_id,
            type: this.type,
	    name: this.name,
    	    description: this.description,
	    file: this.file, // Собственно файл
        },
        bubbles: true, // Позволяет событию подниматься вверх по дереву
        composed: true // Позволяет событию пересекать границы Shadow DOM
    }));

    dialog.close();
  }

  render() {

    // console.log("this.file",this.file);
    if(this.mode == "filelist") return this.render_filelist();

    return html`
	<div class="cv-parent">
	    <div class="cv">${this.name}</div>
	    <div class="dd">${this.description}</div>

	    ${this.type=='text' ? this.render_text() : this.render_file() }
	    <div class="button mv00${this.saveneed?' buttonact':''}" @click="${this.save}"><div class="fw">Attach response</div></div>
	</div>
    `;
  }

  render_text() {
    return html`
        <div class="dd-parent">
	    <div class="dd">Response</div>
    	    <textarea name="about" class="wrapper" @input="${this.textarea_resize}" placeholder="Text">${this.file.about}</textarea>
        </div>
    `;
  }

  render_file() {

    return html`
	${/* зона загрузки файла */``}
        <div class="fzone" @dragover="${this.dragover}" @dragleave="${this.dragleave}" @drop="${this.drop}">
          <div class="zone" @click="${this.file_click}">
	    <div style="margin-bottom:10px" class="cv">${this.file.name}</div>
            <img class="icon24 mv" src="img/download_2.svg" />
          </div>
	  <input name="zone" style='display:none' type="file" @change="${this.file_change}" />
        </div>

	${/* textarea about file */``}
        <div class="dd-parent">
            <div class="dd">Document description</div>
	    <textarea name="about" class="wrapper" @input="${this.textarea_resize}" placeholder="description">${this.file.about}</textarea>
        </div>

	${/* кнопка открыть-закрыть список файлов */``}
	<div style="width:100%">
    	    <div class="frame-parent">
        	<div class="remove-wrapper">
        	<img class="icon12 mv" @click="${this.onoff}" src="${this.open ? 'img/remove.svg' : 'img/add.svg'}" />
            </div>
            <div class="my-documents" @click="${this.onoff}" src="${this.open ? 'img/remove.svg' : 'img/add.svg'}" >My documents</div>
	</div>

	${ this.open ? this.render_filelist() : html``}
    `;
  }

  render_filelist() {
	if( this.my_files === null ) return this.skeleton(); // Еще не загружен ждем

	if( !this.my_files || !this.my_files.length ) return html``; // нет ничего


	if(this.mode=='filelist') return this.my_files.map(x => html`

	<div class="files">
	    <img class="icon24" src="/img/check_circle.svg">
	    <div class="files-parent">
		<div class="files-name ue"
			@click="${(event)=>{this.View(event)}}"
			hash="${x.hash}"
			name="${x.name}"
			href="${IPFS.endpoint}${x.hash}"
	    	    >${x.name}</div>
		<div class="files-about">${x.about}</div>
	    </div>
	    <div class="files-time">${FileTime(x.time)}</div>

	    <img @click="${(event)=>{this.delFile(event,x.name,x.hash)}}"
		class="files-edit icon24 mv"
		src="/img/close_small.svg"
		title="Delete">
	</div>

	`);




	return this.my_files.map(x => html`
	    <div class="file">
	      <div class="file-info">
		<div class="file-left">
		${this.mode=='filelist' ? '' : html`
		    <img class="icon24 mv0"
			@click="${(event)=>{
			    this.file = x;
			    this.shadowRoot.querySelector("textarea[name='about']").value = x.about?x.about:'';
			    this.ifsaveneed();
			    this.requestUpdate();
			}}"
			src="${this.file.name==x.name ? "/img/task_alt.svg":"/img/task_alt_no.svg"}"
		    >`
		}
		    <a class="file-name mv0"
			@click="${(event)=>{this.View(event)}}"
			hash="${x.hash}"
			name="${x.name}"
			href="${IPFS.endpoint}${x.hash}"
	    	    >${x.name}</a>
		</div>
	        <div class="file-details">
		    <span class="file-size">${this.formatBytes(x.size)}</span>
		    <span class="file-date">${FileTime(x.time)}</span>
		    <div @click="${(event)=>{this.delFile(event,x.name,x.hash)}}" class="mv0" style="font-size:22px" title="Delete">🗑</div>
		</div>
	      </div>
	      <div class="${this.mode=='filelist' ? 'file-about-filelist' :'file-about'}">${x.about}</div>
	    </div>
	`);
  }

  skeleton() {
    return html`
        <div style='width:100%; padding: 12px 16px;'>
            <div class="skeleton" style="width:80%;"></div>
            <div class="skeleton" style="width:60%;"></div>
            <div class="skeleton" style="width:90%;"></div>
            <div class="skeleton" style="width:80%;"></div>
            <div class="skeleton" style="width:60%;"></div>
            <div class="skeleton" style="width:90%;"></div>
        </div>
    `;
  }

  async onoff(event) {
    this.open = !bool(this.open);
    f_save('Fileslist_open',this.open);
    // Если их еще не скачивали, а хотят, то скачать срочно
    if(this.open) {
	if(!this.my_files) this.my_files = await KUVIO.API('cv_my'); // все мои файлы
    } // else this.my_files = null;
  }

  async delFile(event,name,hash) {
    if(!await my_confirm(`Delete "${h(name)}" ?`)) return;
    if(this.file.name == name) this.file={};
    var r = await KUVIO.API('cv_del_file',{hash:hash});
    this.update_my_files();
  }

   View(event) {
	// window.event=event;
	event.preventDefault();
	console.log(event.target);
	IPFS.View(event);
   }

   // Клик по зоне открывает диалог для выбора файлов
   file_click(event) {
        this.shadowRoot.querySelector("input[name='zone']").click();
   }

   // При перетаскивании файлов в зону
   dragover(event) {
         event.preventDefault();
         this.shadowRoot.querySelector('.fzone').classList.add('active');
   }

   dragleave(event) {
         event.preventDefault();
         this.shadowRoot.querySelector('.fzone').classList.remove('active');
   }

   drop(event) {
         event.preventDefault();
         this.shadowRoot.querySelector('.fzone').classList.remove('active');
         this.file_ready( event.dataTransfer );
   }

   // При выборе файлов через диалог
   file_change(event) {
         this.file_ready( event.target );
   }

   // Обработка файлов
   async file_ready(e) {
        var file = e.files[0];
        this.file = {};
        console.log('FILE:', file.name);
	this.ifsaveneed();

	var about_new = this.shadowRoot.querySelector("textarea[name='about']").value;
	if(about_new) e.files[0].about=about_new;

	var res = await KUVIO.CV.addFiles(e,{
		callback:function(x){
		    console.log('File loaded: '+file.name,x);
		},
		error:function(x){
		    console.log('Error load: '+file.name,x);
		    idie(h(x),'Error loading: '+h(file.name));
		},
	});
	if(res) {
	    console.log('res=',res);
	    await this.update_my_files();
	    this.file = this.my_files.find(x => x.name === file.name);
	    this.ifsaveneed();
	    console.log("this.file",this.file);
	}
   }

    formatBytes(x) { x=1*x;
	if(x < 1024) return `${x}B`;
	const units = ['KB','MB','GB','TB'];
	let i = -1;
	do { x /= 1024; i++; } while (x >= 1024 && i < units.length-1);
	return `${x.toFixed(2)}${units[i]}`;
    }

}

customElements.define('file-upload', FileUpload);
