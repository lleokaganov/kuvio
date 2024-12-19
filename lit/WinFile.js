import {LitElement, html, css, repeat} from './lit-all.min.js';

class WinFile extends LitElement {

    static properties = {
        name: {type: String},
        mode: {type: String},
        headname: {type: String},
        headdescription: {type: String},
        text: {type: String},

	open: {type: Boolean},
    }

    constructor() {
        super();
        this.mode = 'file';
        this.name = 'Response';
        this.headname = '';
        this.headdescription = '';
	this.text = '';
	this.file = false;

	this.open = false;
	this.select_id = false;
    }

  static styles = css`
    :host {
        width:100%
    }

    .mv,.mv0,.mv00 { transition: transform 0.2s ease-in-out; }
    .mv:hover,mv0:hover,mv00:hover { transition-property: transform; transition-duration: 0.2s; animation: none; transform: scale(1.7); cursor:pointer;}
    .mv0:hover { transform: scale(1.1); }
    .mv00:hover { transform: scale(1.05); }

/**********************************************************************/

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

/**********************************************************************/
    .icon12 {
      width: 12px;
      height: 12px;
    }

    .icon24 {
      width: 24px;
      height: 24px;
    }

.cv {
    position: relative;
    font-weight: 600;
}
.write-a-project {
    align-self: stretch;
    position: relative;
}
.response {
    align-self: stretch;
    position: relative;
    font-weight: 500;
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
      resize: vertical; /* Разрешить изменение размера только по высоте */
      max-width: 100%;
      min-height: 40px; /* Минимальная высота */
      EEEEmax-height: 300px; /* Максимальная высота */
      overflow: hidden;  /* Скрываем скролл */
}

.response-parent {
    align-self: stretch;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: flex-start;
    gap: 8px;
}

.save {
      font-weight: 500;
}

.button {
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
    opacity: 0.5; /* !!! */
}

.button.act {
    opacity: 1.0; /* !!! */
}

.cv-parent {
    width: 100%;
    background-color: #fff;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: flex-start;
    EEEEEEEEEEEEEpadding: 16px 16px 24px;
    box-sizing: border-box;
    gap: 24px;
    text-align: left;
    font-size: 14px;
    color: #000;
    font-family: Inter;
}


    .drop-zone {
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
      cursor: pointer;
    }

    .drop-zone-wrapper {
      align-self: stretch;
      display: flex;
      flex-direction: row;
      align-items: flex-start;
      justify-content: flex-start;
    }

    .drop-zone-wrapper input {
      display: none;
    }

    .drop-zone-wrapper.active {
      background-color: #bbb;
      border-color: #888;
    }

TEXTAREA { min-width: 414px; }

  `;

  textarea_resize(event) {
    const textarea = ( event ? event.target : this.shadowRoot.querySelector('textarea') );
    if(textarea && textarea.tagName.toLowerCase() === 'textarea') {
      // Сбрасываем высоту перед вычислением новой
      textarea.style.height = 'auto';
      // Устанавливаем высоту на основе прокручиваемой высоты
      textarea.style.height = Math.min(textarea.scrollHeight, 300) + 'px';
    }
  }


  firstUpdated() {
    this.textarea_resize(); // Выполнить функцию один раз при рендере
  }


  // Клик по зоне открывает диалог для выбора файлов
  file_click(event) {
	this.shadowRoot.querySelector('input').click();
  }

  // При перетаскивании файлов в зону
  dragover(event) {
        event.preventDefault();
	this.shadowRoot.querySelector('.drop-zone-wrapper').classList.add('active');
  }

  dragleave(event) {
	this.shadowRoot.querySelector('.drop-zone-wrapper').classList.remove('active');
  }

  drop(event) {
	event.preventDefault();
	this.shadowRoot.querySelector('.drop-zone-wrapper').classList.remove('active');
	const files = event.dataTransfer.files;
	this.file_ready(files[0]);
  }

  // При выборе файлов через диалог
  file_change(event) {
	this.file_ready(event.target.files[0]);
  }

  // Обработка файлов
  file_ready(file) {
        this.file = file;
	console.log(file);
	this.shadowRoot.querySelector('.button').classList.add('act');
	this.name = this.file.name;
	console.log('Файл:', this.file.name);
  }

  async save(event) {
	console.log(event);

	if(this.mode=='file') {
            // var e=this.shadowRoot.querySelector('input');
	    // var s=e.querySelector('input'); // .value;

	    if(!this.file.hash) {

    var e={files:[this.file]};
    var formData = new FormData();
    for(var i=0; i < e.files.length; i++) formData.append("file[]", e.files[i], e.files[i].name);
    formData.append('unic', "a3IZTNyJ2cPD2A9G-d851f0e3a61f367eddf41fae6673c48b76d42d93b78b88a30e03552287ca7116");
    let response = await fetch(
	    mpers(KUVIO.api_url,{action:'cv_my_add'}),
	    { method: 'POST', body: formData }
    );
    if(response.ok) {
        const r = await response.text();
        console.log(r);
    } else {
	console.error('Upload error: '+response.statusText);
    }
	    }
	    salert("Selected file:<p>"+this.file.name,2000); // this.file);
	} else {
            var s=this.shadowRoot.querySelector('textarea').value;
	}
        mudaki(s);
	dialog.close();
  }



















  async onoff(event) {
/*
    const block = this.shadowRoot.querySelector('.block-to-toggle');

    var maxh = 1*(block.getAttribute('maxh'));
    if(!maxh) {
        maxh=400;
        block.style.maxHeight = maxh+`px`;
    }
    // maxh = Math.max(maxh,1*`${block.scrollHeight}`);
    block.setAttribute('maxh',maxh);

    if(this.open) {
        block.style.maxHeight = maxh+`px`;
        setTimeout(() => { block.style.maxHeight = '0px'; }, 10);
        block.addEventListener('transitionend', () => { if(!this.open) block.style.display = 'none'; }, { once: true });
    } else {
        block.style.display = 'block';
        block.style.maxHeight = `0px`;
        setTimeout(() => { block.style.maxHeight = maxh+`px`; }, 10);
    }
*/
    this.open = !this.open;

    if(this.open && !KUVI.files) {
	// скачиваем список файлов файлы
	await KUVI.load_files();
	// и делаем рендер
	this.requestUpdate();
    }

  }




 oclick(event) {
    event.preventDefault();
    const e=event.target;
    this.select_id = Number(e.getAttribute('pid'));

    this.file_ready({
        name: e.getAttribute('name'),
        time: e.getAttribute('time'),
	size: e.getAttribute('size'),
	hash: e.getAttribute('hash'),
    });

    // и делаем рендер
    this.requestUpdate();
 }


  render() {

    return html`
	<div class="cv-parent">

	    ${ this.headname == '' ? '' : '<div class="cv">${this.headname}</div>' }
	    ${ this.headdescription == '' ? html`` : html`<div class="write-a-project">${this.headdescription}</div>` }

	    <div class="response-parent">
		<div class="response">${this.name}</div>
	    ${ this.mode == 'text'
		? html`<textarea class="wrapper" @input="${this.textarea_resize}" placeholder="Text">${this.text}</textarea>`
		: html`
	<div class="drop-zone-wrapper" @dragover="${this.dragover}" @dragleave="${this.dragleave}" @drop="${this.drop}">
          <div class="drop-zone"
	    @click="${this.file_click}"
	    >
            <img class="icon24 mv" src="img/download_2.svg">
          </div>
	  <input type="file" @change="${this.file_change}">
        </div>`
	    }
	    </div>

	    <div class="button mv00" @click="${this.save}">
		<div class="save">Save ${this.name}</div>
	    </div>


	    <!-- files panel -->
    	    <div class="frame-parent">
        	<div class="remove-wrapper mv">
    		    <img class="icon12" @click="${this.onoff}" src="${this.open ? 'img/remove.svg' : 'img/add.svg'}" />
        	</div>
    		<div class="my-documents" @click="${this.onoff}">My documents</div>
	    </div>

	    <div class="block-to-toggle" style="display:${this.open ? 'block' : 'none'}">
		<div style="display: flex; flex-direction: column; gap: 8px;">${repeat(
			(KUVI.files && KUVI.files.length ? KUVI.files : []),
			(x) => x._id,
			(x, i) => html`<one-file
				pid="${i}"
				unimode="select"
				mode="file"
				.check=${ i === this.select_id }

				time="${x.time}"
				name="${x.name}"
				size="${x.size}"
				hash="${x.hash}"

				description=""

				@click="${this.oclick}"
			    ></one-file>`
		    )}
		</div>
	    </div>
	    <!-- /files panel -->

	</div>
    `;

/*
///////////////////////////////

	// html`<li>${index}: ${employee.familyName}, ${employee.givenName}</li>`




///////////////////////////////


    return html`


          <div class="drop-zone">
            <img class="download-2-icon mv" src="img/download_2.svg">
          </div>









    return html`
      <div class="all">
        <div class="frame-parent">
          <div class="remove-wrapper mv">
          <img class="remove-icon" @click="${this.onoff}"
            src="${this.open ? 'img/remove.svg' : 'img/add.svg'}"
          />
          </div>
          <div class="header" @click="${this.onoff}">${this.name}</div>
        </div>
        <div class="block-to-toggle" style="display:${this.open ? 'block' : 'none'}">
         ${this.renderContent()}
        </div>
      </div>
    `;


















    `;
*/

  }






  connectedCallback() {
    super.connectedCallback();
    // Преобразуем значения 'false' и '0' в логическое значение false
    // this.open = this.hasAttribute('open') && this.getAttribute('open') !== 'false' && this.getAttribute('open') !== '0';
    // this.edit = this.hasAttribute('edit') && this.getAttribute('edit') !== 'false' && this.getAttribute('edit') !== '0';
  }



}
















customElements.define('win-file', WinFile);

///////////////////////////////////


