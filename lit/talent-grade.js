import { LitElement, html, css, unsafeHTML } from './lit-all.min.js';

class TalentGrade extends LitElement {

    static properties = {
        request_id: {type: String}, // 
        request_time: {type: String}, // 
        candidat_login: {type: String}, //
        candidat_unic: {type: String}, // 
        mirror_id: {type: String}, // 
        asks_json: {type: String}, // 
        asks: {type: Array}, // будет расшифрован тут
	mirror: {type: Object}, // будет загружен
	saveneed: {type: Boolean}, // все ли отмечены
    }

    constructor() {
        super();
        this.asks = [];
        this.mirror = {};
        // this.audit_mode="edit";
        // this.mode = 'Audits';
    }

    async connectedCallback() {
        super.connectedCallback();
	try { this.asks=JSON.parse(this.asks_json); } catch(er){ this.asks=[]; }
	this.mirror = {};
	this.get_mirror();
	this.saveneed = 0;
    }

    async get_mirror() {
	this.mirror = await KUVIO.API("auditor_mirror",{id:this.mirror_id});
	// console.log("MIRO=",this.mirror);
    }


  static styles = css`

    :host {
      width: 100%;
    }

.mv,.mv0,.mv00 { transition: transform 0.2s ease-in-out; cursor: pointer; }
.mv:hover,mv0:hover,mv00:hover { transition-property: transform; transition-duration: 0.2s;
animation: none; transform: scale(1.7); cursor:pointer;}
.mv0:hover { transform: scale(1.1); }
.mv00:hover { transform: scale(1.05); }

    .back-to-all {
      align-self: stretch;
      position: relative;
      line-height: 130%;
      font-weight: 500;
      color: #356bff;
    }

    .talent-audit {
      align-self: stretch;
      position: relative;
      line-height: 130%;
      font-weight: 600;
    }

    .product-designer {
      width: 560px;
      position: relative;
      line-height: 130%;
      font-weight: 600;
      display: inline-block;
    }

    .we-conduct-a {
      width: 560px;
      position: relative;
      font-size: 14px;
      line-height: 140%;
      display: inline-block;
      height: 40px;
      flex-shrink: 0;
    }

    .product-designer-parent {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      justify-content: flex-start;
      padding: 16px 0px;
      gap: 16px;
      font-size: 26px;
    }

    .portfolio-seniority {
      position: relative;
      line-height: 130%;
      font-weight: 600;
      display: flex;
      align-items: center;
      height: 24px;
      flex-shrink: 0;
    }

    .frame-container {
      align-self: stretch;
      border-radius: 8px;
      background-color: #f5f5f5;
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      justify-content: flex-start;
      padding: 12px 16px;
      gap: 8px;
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
      opacity: 1;
      cursor: pointer;
      font-size: 14px;
      color: #fff;
    }

    .nobutton {
      opacity: 0.3;
    }

    .frame-group {
      align-self: stretch;
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      justify-content: flex-start;
      gap: 16px;
      font-size: 14px;
    }

    .back-to-all-talent-parent {
      top: 38px;
      left: 56px;
      EEEEEEEEEEwidth: 560px;
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      justify-content: flex-start;
      gap: 23px;
    }

    .frame-parent {
      width: 100%;
      background-color: #fff;
      text-align: left;
      font-size: 14px;
      color: #000;
      font-family: Inter;
    }
  `;


    async handle_value_change(event) {
	var d=event.detail;

	this.mirror.rules.forEach((x,i)=>{
	    if(x.name == d.name) {
		var l;
		if(x.type=='yn') { l=bool(d.values.yn) ? 1 : 0;
		} else if(x.type=='scale') {
		    l=parseFloat(d.values.scale) || 0;
		    l=Math.min(100,Math.max(0,l));
		} else if(x.type=='multi') {
		    var l=[]; x.names.forEach((x,i) => l[i] = d.values.arr && d.values.arr[i] ? 1 : 0 );
		} else {
		    var l=[],k=0;
		    x.names.forEach((x,i) => {
			if(k) l[i] = 0;
			else {
			    if(d.values.arr && d.values.arr[i]) { l[i]=1; k++; }
			    else l[i]=0;
			}
		    });
		}
		this.mirror.rules[i].value = l;
	    }
	});
	this.mirror.rules.forEach(x => { if(x.type=='scale' && x.value === undefined) x.value = 50; });
	this.saveneed = this.mirror.rules.every(item => 'value' in item);
    }

  async click_save(event) {
	if(!this.saveneed) return;

	var res = await KUVIO.API("audit_grade_save",{
	    result: true,
	    request_id: this.request_id,
	    values: this.mirror.rules.map(x => x.value),
	});
	if(res.id !== true) return idie("Error","Error");

        // доложить наверх об изменениях
        this.dispatchEvent(new CustomEvent('grade-done', {
	  detail: { request_id: this.request_id },
          bubbles: true, // Позволяет событию подниматься вверх по дереву
          composed: true // Позволяет событию пересекать границы Shadow DOM
        }));

        // Создаем и отправляем кастомное событие для закрытия окна
        this.dispatchEvent(new CustomEvent('main-screen_render', { bubbles: true, composed: true }));

	dialog.close();
	// console.log("res = ",res);
  }


  render_rules() {
    if(!this.mirror || !this.mirror.rules || !this.mirror.rules.length) return html``;

    return this.mirror.rules.map((x,i)=>html`
     <div class="frame-container">
	<div class="portfolio-seniority">${x.name}</div>
	<select-parameter
	    @change-value="${this.handle_value_change}"
    	    audit_id=""
    	    type="${x.type}"
    	    name="${x.name}"
    	    about="${x.about}"
    	    header="${x.type=='scale'?'{percent}% ':''}${x.about}"
    	    names='${JSON.stringify(x.names)}'
    	    values=""
    	    edit="0"
    	    mark="1"
    	    view="0"
	><select-parameter>
     </div>
    `);
  }

  render() {
    return html`
      <div class="frame-parent">
        <div class="back-to-all-talent-parent">
          <div class="back-to-all">&lt;- Back to all talent</div>
          <div class="talent-audit">Talent audit</div>
          <div class="product-designer-parent">
            <div class="product-designer">${this.mirror.name?this.mirror.name:html`no`}</div>
            <div class="we-conduct-a">${this.mirror.about?this.mirror.about:html`fffffff`}</div>
          </div>
          <div class="frame-group">
	    ${this.render_rules()}
            <div @click="${this.click_save}" class="button${this.saveneed?'':' nobutton'}">Publish audit</div>
          </div>
        </div>
      </div>
    `;
  }

}

customElements.define('talent-grade', TalentGrade);
