import {LitElement, html, css} from './lit-all.min.js';

class CandidatScreen extends LitElement {

    static properties = {
	audit_mode: { type: String }, // Evaluations Requested Documents


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
    }


//    _handleRequestUpdate(event) {
//    }

    async connectedCallback() {
        super.connectedCallback();
	// включаем общий обработчик для 'save-evidence'
	// document.addEventListener('save-evidence', this._handleSaveEvidence.bind(this));

        // Выполняем вычисления
	this.mode = f_read('Candidat_mode','Documents'); // Evaluations Requested Documents
	this.mode = ['Evaluations', 'Requested', 'Documents'].includes(this.mode) ? this.mode : 'Documents';

        this.skelet=html`
            <div style='width:300px; padding: 12px 16px;'>
                <div class="skeleton" style="width:80%;"></div>
                <div class="skeleton" style="width:60%;"></div>
                <div class="skeleton" style="width:90%;"></div>
            </div>`;

	// this.audits_update();
	// this.candidates_update();
    }

    disconnectedCallback() {
	// отключаем общий обработчик для 'save-evidence'
	document.removeEventListener('save-evidence', this._handleSaveEvidence.bind(this));
	super.disconnectedCallback();
    }

    // если дочерний элемент прислал событие
    //async handleSaveAudit(event) {
//	console.log("ПРИСЛАЛО",event.detail);
//	this.audits_update();
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
/**** skeleton ****/



.check-circle-icon {
    width: 24px;
    position: relative;
    height: 24px;
    z-index: 0;
}
.portfoliopdf {
    align-self: stretch;
    position: relative;
    line-height: 130%;
    font-weight: 600;
}
.my-recent-projects {
    width: 268px;
    position: relative;
    font-size: 14px;
    line-height: 140%;
    display: inline-block;
    height: 20px;
    flex-shrink: 0;
}
.portfoliopdf-parent {
    width: 288px;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: flex-start;
    gap: 4px;
    z-index: 1;
}
.uploaded-just-now {
    position: relative;
    font-size: 12px;
    letter-spacing: 0.01em;
    line-height: 130%;
    font-family: 'Roboto Mono';
    opacity: 0.8;
    z-index: 2;
}
.edit {
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
.evidencerequest {
    position: absolute;
    top: 117px;
    left: calc(50% - 264px);
    border-radius: 8px;
    background-color: #e6f4ff;
    border: 1px solid #ddd;
    box-sizing: border-box;
    width: 528px;
    display: flex;
    flex-direction: row;
    align-items: flex-start;
    justify-content: flex-start;
    padding: 12px 16px;
    gap: 12px;
}
.cv-finalpdf {
    width: 288px;
    position: relative;
    line-height: 130%;
    font-weight: 600;
    display: inline-block;
    flex-shrink: 0;
    z-index: 1;
}
.evidencerequest1 {
    position: absolute;
    top: 200px;
    left: calc(50% - 264px);
    border-radius: 8px;
    background-color: #e6f4ff;
    border: 1px solid #ddd;
    box-sizing: border-box;
    width: 528px;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;
    padding: 12px 16px;
    gap: 12px;
}
.spacer {
    position: absolute;
    top: 40px;
    left: 136px;
    width: 853px;
    height: 53px;
}
.frame-child {
    width: 20px;
    border-radius: 999px;
    height: 20px;
    object-fit: cover;
}
.sasha-candidate {
    position: relative;
    line-height: 130%;
    font-weight: 500;
}
.frame-parent {
    position: absolute;
    top: 56px;
    left: calc(50% - 78.5px);
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;
    gap: 8px;
    font-size: 16px;
}
.icon24 {
    width: 24px;
    height: 24px;
}

.kuvio {
    position: relative;
    letter-spacing: 0.01em;
    line-height: 130%;
}
.kuvio-wrapper {
    position: absolute;
    top: 11px;
    left: 139px;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;
    font-size: 14px;
}
.evidences {
    width: 100%;
    position: relative;
    background-color: #eee;
    height: 883px;
    overflow: hidden;
    text-align: left;
    font-size: 15px;
    color: #000;
    font-family: Inter;
}

.menu {
    white-space: nowrap;
}

.menu-parent {
    border: 2px solid transparent;
    border-radius: 8px;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    EEEEEEEjustify-content: flex-start;
    padding: 12px 16px;
    box-sizing: border-box;
    opacity: 0.5;
}

.menu-parent:hover {
    EEEEEEEborder: 2px solid #e6f4ff;
    background-color: #e6f4ff;
    EEEEEopacity: 1.0;
}

.menu-selected {
    background-color: #e6f4ff;
    opacity: 1.0;
}

.left-menu {
  width: 100%;
  font-size: 13px;
  margin-top: 117px;
  margin-left: 136px;
  width: 220px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.menu-parent.menu-selected::after {
    content: url('/img/arrow_right.svg');
    display: inline-block;
    width: 24px;
    height: 24px;
    margin-left: 8px;
    vertical-align: middle;
}

.wall {
    width:100%
    box-sizing: border-box;
    display: flex;
    gap: 20px;
    padding-right: 40px;
    margin-bottom: 40px;
}

/********* stampi **********/
.stampi-parent {
    display: flex;
    flex-wrap: wrap;
    gap: 30px;
}

.icon120 {
    width: 120px;
    height: 120px;
}

.stamp {
    position: relative;
    line-height: 140%;
    font-size: 13px;
}

.stampi {
    border-radius: 16px;
    width: 268px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    padding: 24px 40px;
    box-sizing: border-box;
}
.stampi:hover {
    opacity:0.8;
}

`;

  async load_candidat_requests() {
	KUVI.candidat_requests = await KUVIO.API('candidat_my_requests');
	if(KUVI.candidat_requests && KUVI.candidat_requests.length) this.requestUpdate(); // принудительное обновление компонента
  }

  render_deal() {
    if(this.mode=='Documents') return html`<file-upload mode="filelist"></file-upload>`;

    if(this.mode=='Requested') {
	if(!KUVI.candidat_requests) {
	    this.load_candidat_requests();
	    return html`${this.skelet}${this.skelet}${this.skelet}`;
	}

	return html`<div style="display: flex; gap: 30px; flex-direction: column;">
	    ${ KUVI.candidat_requests.map(r=>html`
	    <audit-panel
    		mode='view'
                audit_id='Error_audit_id'
	        audit_name="${r.name}"
                audit_description="${r.about}"
                audit_blake3="${r.audit_blake3}"
                audit_candidates='0'
                audit_parameters='0'
                audit_evidences='0'
                audit_rules='[]'
                audit_asks="${r.asks}"
	    ></audit-panel>`) }
	</div>`;

	// return html`Requested audits: ${JSON.stringify(KUVI.candidat_requests)}
    }

    if(this.mode=='Evaluations') {
	return html`

	<div class="stampi-parent">
	    ${Array.from({ length: 30 }).map(() => html`
	        <div class="stampi" style="background: ${this.randomGradient()}; color: ${this.randomColor()};">
	            <img class="icon120" src="/img/verified.svg">
	            <div class="stamp">Auditor’s stamp of approval</div>
	        </div>
	    `)}
	</div>
	`;
    }

    return html`Error mode: ${this.mode}`;
  }

    randomColor() {
	// Генерация случайного цвета в формате HEX
        return `#${Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0')}`;
    }

    randomGradient() {
	// Случайный выбор между линейным и радиальным градиентом
        const isLinear = Math.random() > 0.5;
        if(isLinear) return `linear-gradient(${Math.floor(Math.random() * 360)}deg, ${this.randomColor()}, ${this.randomColor()} 50%, ${this.randomColor()})`;
	else return `radial-gradient(circle, ${this.randomColor()} 30%, ${this.randomColor()} 70%)`;
    }












  render() {
    return html`
    <div class="wall">
      <div class="left-menu">
	    <div name="Evaluations" @click="${this.click_chmode}" class="menu-parent${this.mode=='Evaluations'?' menu-selected':''}">
    		<div class="menu">My evaluations</div>
	    </div>

	    <div name="Requested" @click="${this.click_chmode}" class="menu-parent${this.mode=='Requested'?' menu-selected':''}">
    		<div class="menu">Requested audits</div>
	    </div>

	    <div name="Documents" @click="${this.click_chmode}" class="menu-parent${this.mode=='Documents'?' menu-selected':''}">
    		<div class="menu">My documents</div>
	    </div>
      </div>
      <div class="right-menu">
	    ${this.render_deal()}
      </div>
    </div>

    `;
  }

  click_chmode(event) {
	this.mode = event.currentTarget.getAttribute('name');
	f_save('Candidat_mode',this.mode); // Сохраним
	this.requestUpdate(); // принудительное обновление компонента
  }

}

customElements.define('candidat-screen', CandidatScreen);
