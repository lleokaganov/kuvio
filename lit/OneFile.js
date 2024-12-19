import { LitElement, html, css } from './lit-all.min.js';

class OneFile extends LitElement {

// <one-file mode="file" name="Portfolio.pdf" description="My recent projects" size="15" time="12345678"><

  static properties = {
    mode: { type: String },

    time: { type: Number },
    name: { type: String },
    size: { type: Number },
    hash: { type: String },

    description: { type: String },
    headname: { type: String },
    headdescription: { type: String },


    check: { type: Boolean },
    unimode: { type: String },
  };

  constructor() {
    super();
    this.mode = 'text';
    this.name = 'no name';
    this.description = '';

    this.headname = '';
    this.headdescription = '';

    this.name =  'no name';
    this.size = 0;
    this.time = 0;

    this.unimode = 'edit'; // select

    // this.check = 1;
  }

  connectedCallback() {
    super.connectedCallback();
    // Преобразуем значения 'false' и '0' в логическое значение false
    this.check = this.hasAttribute('check') && this.getAttribute('check') !== 'false' && this.getAttribute('check') !== '0';
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

.icon24 {
    width: 24px;
    height: 24px;
}

.name {
    align-self: stretch;
    position: relative;
    line-height: 130%;
    font-weight: 600;

}

.description {
  font-size: 14px;
  line-height: 140%;
  display: -webkit-box;
  -webkit-line-clamp: 3; /* Ограничение до 3 строк */
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis; /* Многоточие для длинных текстов */
  max-height: calc(1.4em * 3); /* Максимальная высота для 3 строк */
}

.uploaded {
    position: relative;
    font-size: 12px;
    letter-spacing: 0.01em;
    line-height: 130%;
    font-family: 'Roboto Mono';
    opacity: 0.8;
}

.portfoliopdf-parent {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: flex-start;
    gap: 4px;
    flex-grow: 1;
}

/*
.edit {
    width: 26px;
    position: absolute;
    margin: 0 !important;
    top: 16px;
    right: 16px;
    font-size: 14px;
    line-height: 130%;
    font-weight: 500;
    color: #356bff;
    text-align: right;
    display: none;
    z-index: 3;
}
*/

.evidencerequest {
    width: 100%;
    position: relative;
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

    user-select: none;

}




  `;

  render() {
    return html`<div class="evidencerequest" @click="${this.unimode=='select' ? this.select : this.edit}">${this.render_pool()}</div>`;
  }

    select(event) {
	console.log("select");
    }

    edit(event) {
	console.log("edit");

//	dialog(`<win-upload-file name="${this.name}" description="${this.description}"></win-upload-file>`,'Upload File');

	dialog(`<win-file
mode="${this.mode}"
text="${this.description}"
name="${this.name}"
description="${this.description}"
headname="${this.headname}"
headdescription="${this.headdescription}"
></win-file>`,'Edit Text');
    }

    render_pool() {
	if(this.mode=='text') return html`<div class="description">${this.description}</div>`;

	return html`
	    <img class="icon24 mv0" src="${this.check ? "img/check_circle.svg":"img/radio_button_unchecked.svg"}">
	    <div class="portfoliopdf-parent">
    	    <div class="name" hash="${this.hash}" @click="${IPFS.View}">${this.name}</div>
    	    <div class="description">${this.description}</div>
	    </div>
	    <div class="uploaded">Uploaded ${this.formatUnixTime(this.time)}</div>
	`;
    }

    formatUnixTime(time) {
	// Текущая дата в миллисекундах
	var now = Date.now();
// console.log(parseInt(now/1000));
	// Универсальное время преобразуем в миллисекунды
	var timestamp = time * 1000;
	// Если разница меньше 5 минут
	if(now - timestamp <= 5 * 60 * 1000) return html`just now`;
	// Преобразуем в дату
	var date = new Date(timestamp);
	var day = String(date.getDate()).padStart(2, '0');
	var month = String(date.getMonth() + 1).padStart(2, '0'); // Месяцы начинаются с 0
	var year = date.getFullYear();
	return html`${day}-${month}-${year}`;
    }

}

customElements.define('one-file', OneFile);
