import {LitElement, html, css} from './lit-all.min.js';

class SecondScreen extends LitElement {

    static properties = {
//	menu0: { type: String }, // имя выбранного меню
//	menu1: { type: String }, // имя выбранного меню
//	menu2: { type: String }, // имя выбранного меню
/*
	my_audits_stringify: { type: String }, // Объявляем свойство
	// Для рисования аудита
	audit_mode: { type: String },
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
*/
    }

    constructor() {
        super();
//	this.menu0 = false;
//	this.menu1 = false;
//	this.menu2 = false;
    }

    async connectedCallback() {
        super.connectedCallback();
        // включаем общий обработчик для 'save-evidence'
        // document.addEventListener('save-evidence', this._handleSaveEvidence.bind(this));

	KUVI.M = ['Test','','']; // вот так будет задаваться меню

	KUVI.MENU = {
	    default: 'Test',
	    "Kuvio": '',
	    "Assess": function(){ memli_init('main_screen') },
	    "Hire": function(){ memli_init('Audit_Content') },
	    "Get hired": function(){ memli_init('candidat_screen') },
	    "Test": {
		type: "white",
		default: "Два",
		"Раз": 'Тут пока ничего нет', // имя функции String или объект
		"Два": {
		    type: "white",
		    default: "Третье",
	    	    "Первое": "_ale",
		    "Второе": "idie",
		    "Третье": "_ale",
		    },
		"Три": 'И тут пока ничего нет',
	    },
	};

	console.log('---------------------------------');
	this.setR(0);
	console.log('---------------------------------');
    }



  static styles = css`

    :host {
        width:100%
    }

.mv,.mv0,.mv00 { transition: transform 0.2s ease-in-out; cursor: pointer; }
.mv:hover,mv0:hover,mv00:hover { transition-property: transform; transition-duration: 0.2s;
animation: none; transform: scale(1.7); cursor:pointer;}
.mv0:hover { transform: scale(1.1); }
.mv00:hover { transform: scale(1.05); }

.LL {
    width:100%;
    max-width:100%;
    margin: 0 20px 40px 20px;
    box-sizing: border-box;
}

.item {
    display: flex;
    flex-direction: row;
    align-items: flex-start;
    justify-content: flex-start;
    padding: 16px 0px;

    box-sizing: border-box;
    gap: 6px;
    text-align: left;
    font-size: 16px;
    color: #000;
    font-family: Inter;
}

.item-linked {
    border-bottom: 2px solid #000;
}

.item-parent {
    border-radius: 16px 16px 0px 0px;
    background-color: #fff;
    border-bottom: 1px solid #eee;
    box-sizing: border-box;
    width: 100%;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;
    padding: 0px 32px 0px 16px;
    gap: 32px;
    font-size: 16px;
}

.item-media {
    border-radius: 0px 0px 16px 16px;
    background-color: #fff;
    box-sizing: border-box;
    width: 100%;
    font-size: 16px;
    min-height: 600px;
    margin-bottom: 40px;
    text-align: left;
display: flex;
align-items: flex-start;
}

.logout {
    position: relative;
    font-size: 14px;
    line-height: 130%;
    font-weight: 500;
    color: #356bff;
}

.candidates {
    position: relative;
    line-height: 130%;
    font-weight: 500;
}

.spacer {
    flex: 1;
    position: relative;
    height: 20px;
    overflow: hidden;
}

.frame-child {
    width: 20px;
    border-radius: 999px;
    height: 20px;
    object-fit: cover;
}
.frame-group {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;
    gap: 8px;
}
.frame-parent {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;
    gap: 32px;
}

.wrapper {
    border-radius: 999px;
    background-color: #ffc935;
    height: 20px;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    padding: 2px 8px;
    box-sizing: border-box;
    font-size: 12px;
}


/***********************************/

.oglavnom {
    width:100%;
}

.mframe-wrapper {
    align-self: stretch;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: flex-start;
    font-size: 13px;
}

.mframe-parent {
    position: relative;
    background-color: #fff;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: flex-start;
    padding: 24px 16px;
    gap: 24px;
    text-align: left;
    font-size: 12px;
    color: #000;
    font-family: Inter;
}

.mmenu {
    display: block;
    max-width:200px;
    border-right: 1px solid #eee;
    height:100%;
}

.mnew-audit {
overflow: hidden;
    line-height: 130%;
    font-weight: 500;
white-space: nowrap;
text-overflow: ellipsis;
}
.mnew-audit-wrapper {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    padding: 8px 16px 0px;
    color: #356bff;
white-space: nowrap;
overflow: hidden;
}
.marrow-right-icon {
    width: 24px;
    position: relative;
    height: 24px;
}

.melement {
    align-self: stretch;
    border-radius: 8px;
    height: 48px;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    padding: 12px 16px;
    box-sizing: border-box;
}
.melement-active {
    background-color: #e6f4ff;
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

`;


/*
  render_part(){
    if(this.mode == 'Candidates') return html`candidate mode`;
    return html`other mode`;
  }
*/

  skelet(width) { width =  width || 300;
    return html`
            <div style='width:${width}px; padding: 12px 16px;'>
                <div class="skeleton" style="width:80%;"></div>
                <div class="skeleton" style="width:60%;"></div>
                <div class="skeleton" style="width:90%;"></div>
            </div>`;
  }


  setR(n) {
	var M = this.readM();
	var R = KUVI.MENU;

	for(var i=0;i<n;i++) {
	    var x = M[i]; // заданное
	    if(!x || !R[x]) x = R.default; // дефолтное
	    R=R[x]; if(!R) break; // нету даже дефолта
	    M[i] = x;
	}

	this.saveM(M);
	return R;
  }

  readM() {
    try { KUVI.M = JSON.parse( f5_read('MENU') ); } catch(er){}
    if(!KUVI.M) KUVI.M=[];
    return KUVI.M;
  }

  saveM(x) {
    if(x) KUVI.M=x;
    f5_save('MENU',JSON.stringify(KUVI.M));
  }


  MENU1(R) {
	// const R = this.setR(1);
	if(!R) return html`--none--`;
	if(typeof(R)==='function') return html`1: function: ${R}`;
        if(typeof(R)==='object' && '_$litType$' in R) return R; // это html``

	if(R.type == "white") {
	    const s = Object.keys(R).filter(name => name !== 'default' && name !=="type") // Исключаем ключ 'default'
		.map(name => html`
    		    <div class="item${KUVI.M[1] === name ? ' item-linked' : ''}" @click="${(event)=>this.menu_click(event,name,1)}">
        		<div class="candidates mv0">${name}</div>
    		    </div>
		`);
	    return html`${s}`;
	}

	return html`Unknown type 1`;
  }

  MENU2() {
	const R = this.setR(2);
	if(!R) return html`--none!--`;
        if(typeof(R)==='object' && '_$litType$' in R) return R; // это html``
	if(typeof(R)==='function') return html`2: function: ${R}`;
	if(typeof(R)==='string') return html`<div style='padding:20px;'>${R}</div>`;

	if(R.type == "white") {

	    const s = Object.keys(R).filter(name => name !== 'default' && name !=="type") // Исключаем ключ 'default'
		.map(name => html`
		    <div class="mframe-wrapper" name="${name}" @click="${(event)=>this.menu_click(event,name,2)}">
        		<div class="melement${KUVI.M[2] === name ? ' melement-active':''} mv0">
        		    <div class="mnew-audit">${!name || name==''?'---':name}</div>
        		    <img class="marrow-right-icon" src="img/arrow_right.svg">
        		</div>
		    </div>
		`);

	    /*
	    <div class="mnew-audit-wrapper">
    		<div class="mnew-audit mv0" @click="${this.newAudit}">New Audit</div>
	    </div>
	    */

	    return html`
		<div class='mmenu'>
		    <div class="mframe-parent" style="width:100%">${s}</div>
		</div>

		<div class="oglavnom">
		    <div style='padding:20px;'>${this.MENU3()}</div>
		</div>

		<div style="height:40px;"></div>
	    `;
	}

    	return html`Unknown type 2`;

  }


  MENU3() {
	const R = this.setR(3);
	if(!R) return html`--none!--`;
        if(typeof(R)==='object' && '_$litType$' in R) return R; // это html``
	if(typeof(R)==='function') return html`3: function: ${R}`;
	return html`${R}`;
  }



  menu_click(event,name,n) {
    // event = window.event;
    event.stopImmediatePropagation();
    // saveR(n,name);
    KUVI.M[parseInt(n)]=name;
    this.saveM();
    // alert(name+'/'+n);
    this.requestUpdate();
    // alert(JSON.stringify(ara));
    // r.fname.substring(0,1)=='_' ? this[r.fname.substring(1)] : r.fname
  }




  login_panel() {
	if(unis) return html`
		    <div class="frame-group" @click="${KUVIO.LOGIN.login}">
    			    <img class="frame-child" src="/users/userpick_42.webp">
        		    <div class="candidates mv0">${h(unis_login)}</div>
    		    </div>
    		    <div class="logout mv0" @click="${this.logout}">Logout</div>`;
	return html`<div class="logout mv0" @click="${this.login}">Login</div>`;
  }

  render() {

    const R = this.setR(1);
    var t = typeof(R);
    if(t === 'object' && '_$litType$' in R) { // это html``
	return R;
    }
    if(t === 'function') { // это результат функции - поставить плейсхолдер и выполнить функцию
	return html`== placeholder ==`;
    }

    // иначе это Object для рендера


/*

    default: function(act){

        const menu=[
            "Kuvio",
            "Assess:main_screen", // Assess (кабинет оценщика)
            // -- Audits (мои аудиты и их редактирование, все что в Admins-->Audits сейчас)
            // -- Candidates (кандидаты на оценку, как и сейчас)
            "Hire:Audit_Content", // Hire
            // -- Talents (таблица с людьми, которая еще не отрисована, но мы знаем, что она там должна быть)
            // -- Assessors (оценщики с их профилем и репутацией, еще не отрисовано тоже)
            // -- Audits (релевантные мне как нанимателю аудиты)
            "Get hired:candidat_screen", // Get hired (раздел Таланта)
            // -- Ready to assess you (аудиторы которые могут тебя оценить по своим правилам, сейчас все, а в будущем те, чьему профилю ты соответствуешь, сейчас то, что в Audits)
            // -- Hiring now (наниматели которые активны на платформе, интерфейса еще нет нарисованного)
        ].join('|');

        if(!act) act="";
        dom('work',`<main-first-string act="${act}" menu="${menu}"></main-first-string>
            <div id='pole' style="display: flex; gap: 20px; padding-right: 40px;"></div>`);
    },
*/








































    return html`

	<div class="LL" id='secondScreen'>

	    <div class="item-parent">
		${this.MENU1(R)}
		<div class="spacer"></div>
        	<div class="frame-parent">${this.login_panel()}</div>
    	    </div>

	    <div class="item-media">
		${this.MENU2()}
	    </div>
	</div>`;

  }

}

customElements.define('second-screen', SecondScreen);