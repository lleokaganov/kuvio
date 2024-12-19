import {LitElement, html, css} from './lit-all.min.js';

import { my_audits_menu, my_audits_menu_css } from './_my_audits_menu.js'; // Импорт большой функции рендеринга таблицы
import { my_candidates, my_candidates_css } from './_my_candidates.js'; // Импорт большой функции рендеринга таблицы

import { my_evaluations, my_evaluations_css } from './_my_evaluations.js'; // Фейк

import { my_requests } from './_my_requests.js';

class MenuScreen extends LitElement {

    static properties = {
	stop: { type: Number },
    }

    constructor() {
        super();
	this.stop = 0;
    }

    async connectedCallback() {
        super.connectedCallback();
        // включаем общий обработчик для 'save-evidence'
        // document.addEventListener('save-evidence', this._handleSaveEvidence.bind(this));
        // включаем общий обработчик для 'save-parameter'
        // document.addEventListener('save-parameter', this._handleSaveParameter.bind(this));
        // принудительно обновить по сигналу
        document.addEventListener('main-screen_render', this._handleRequestUpdate.bind(this));


	KUVI.M = ['Test','','']; // вот так будет задаваться меню

	KUVI.MENU = {
	    default: 'Test',
	    "Kuvio": '',
	    "Assess": {
		default: "Audits",
        	"Audits": my_audits_menu,
        	"Candidates": my_candidates, // "(кандидаты на оценку, как и сейчас)",
	    },
	    "Hire": {
		default: "Audits",
		"Positions!": "(таблица с людьми, которая еще не отрисована, но мы знаем, что она там должна быть)",
        	"Assessors": "(оценщики с их профилем и репутацией, еще не отрисовано тоже)",
        	"Audits": "(релевантные мне как нанимателю аудиты)",
	    },
	    "Get hired": { //  Get hired (раздел Таланта)
		type: "white",
		default: "Audits",
		"Ready to assess you": "(аудиторы которые могут тебя оценить по своим правилам, сейчас все, а в будущем те, чьему профилю ты соответствуешь, сейчас то, что в Audits)",
        	"Hiring now": "(наниматели которые активны на платформе, интерфейса еще нет нарисованного)",
	    },
	    "Test": {
		default: "Get Hired",
		"Hire": "Все аудиты с поиском",
		"Get Hired": {
		    // type: "grey",
		    default: "My documents",
		    "My evaluations": my_evaluations, // "Базар цыганских ярлычков",
		    "Requested Audits": my_requests, // "Мои запросы на аудит",
		    "My documents": html`<file-upload mode="filelist"></file-upload>`,
		},
	    },
	};

	console.log('---------------------------------');
	this.setR(0);
	console.log('---------------------------------');
    }













  disconnectedCallback() {
        // отключаем общий обработчик для 'save-evidence'
        // document.removeEventListener('save-evidence', this._handleSaveEvidence.bind(this));
        // отключаем общий обработчик для 'save-parameter'
        // document.removeEventListener('save-parameter', this._handleSaveParameter.bind(this));
        // отключаем общий обработчик для 'main-screen_render'
        document.removeEventListener('main-screen_render', this._handleRequestUpdate.bind(this));
        super.disconnectedCallback();
  }

  _handleRequestUpdate(event) {
	if(event.detail) this.msave(parseInt(event.detail.kuvim),event.detail.name); // Если надо обновить точку меню
        this.requestUpdate();
  }


  static styles = [
    my_audits_menu_css,
    my_candidates_css,
    my_evaluations_css,
    css`

    :host {
        width:100%
    }

.mv,.mv0,.mv00 { transition: transform 0.2s ease-in-out; cursor: pointer; }
.mv:hover,mv0:hover,mv00:hover { transition-property: transform; transition-duration: 0.2s;
animation: none; transform: scale(1.7); cursor:pointer;}
.mv0:hover { transform: scale(1.1); }
.mv00:hover { transform: scale(1.05); }


/************************************************************/
/************************************************************/
/************************************************************/
/************************************************************/

.kuvio {
    position: relative;
    letter-spacing: 0.01em;
    line-height: 130%;
}

.kuvio-parent {
    margin: 10px 0px 10px 20px;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between; /*flex-start;*/
    gap: 16px;
}

.audit {
    width: 100%;
    height: 100%;
    background-color: #eee;
    text-align: center;
    font-size: 14px;
    color: #000;
    font-family: Inter;
}


.act {
    border-bottom: 2px solid black;
    padding-bottom: 3px;
}

/************************************************************/

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


.candidates {
    position: relative;
    line-height: 130%;
    font-weight: 500;
}


/***************************************************************/


.frame-group {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;
    gap: 8px;
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



/****************** login *****************/

.logout {
    position: relative;
    font-size: 14px;
    line-height: 130%;
    font-weight: 500;
    color: #356bff;
}

.login-candidates {
    position: relative;
    line-height: 130%;
    font-weight: 500;
}

.login-child {
    width: 20px;
    border-radius: 999px;
    height: 20px;
    object-fit: cover;
}

.login-group {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;
    gap: 8px;
}

.login-frame {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;
    gap: 20px;
    margin-right: 10px;
}

`];



// =========================================================================================================================

  login_panel() {
	if(unis) return html`
		    <div class="login-group" @click="${KUVIO.LOGIN.login}">
    			    <img class="login-child" src="/users/userpick_42.webp">
        		    <div class="login-candidates mv0">${h(unis_login)}</div>
    		    </div>
    		    <div class="logout mv0" @click="${this.logout}">Logout</div>`;
	return html`<div class="logout mv0" @click="${this.login}">Login</div>`;
  }

  async logout() {
    if(await my_confirm("Logout "+h(unis_login)+"?")) {
        KUVIO.LOGIN.logout();
        this.requestUpdate(); // принудительное обновление компонента
    }
  }

  async login() {
        await KUVIO.LOGIN.login();
        this.requestUpdate(); // принудительное обновление компонента
  }

  onlogin(){
    dialog(`<dialog-login></dialog-login>`,'Login');
  }

// =========================================================================================================================


  skelet(width) {
    // if(width===undefined) width=300;
    width = width || 300;
    if(1*width) width=`width:${width}px;`;
    return html`
            <div style='${width} padding: 12px 16px;'>
                <div class="skeleton" style="width:80%;"></div>
                <div class="skeleton" style="width:60%;"></div>
                <div class="skeleton" style="width:90%;"></div>
            </div>`;
  }


  msave(n,x) {
    KUVI.M[n]=x;
    var nm='Menu'; for(var i=1;i<=n;i++) nm+=':'+KUVI.M[i-1];
    // console.log(`--> SAVE [${nm}]="${x}"`);
    f5_save(nm,x);
  }

/*
	// var M = this.readM();
	    // if(!x) x = M[i]; // заданное
  readM() {
    try { KUVI.M = JSON.parse( f5_read('MENU') ); } catch(er){}
    if(!KUVI.M) KUVI.M=[];
    return KUVI.M;
  }

//  saveM(x) {
//    if(x) KUVI.M=x;
//    f5_save('MENU',JSON.stringify(KUVI.M));
//  }
*/

  MENU1() { // ВЕРХНЕЕ БЕЛОЕ МЕНЮ

	const R = this.getR(1);
        if('_$litType$' in R) {
	    console.log('ASC FN 1');
	    return R; // это html``
	}

//        return html`NOT`;

	if(R.type && R.type != "white") return html`Unknown type 1`;

	const s = Object.keys(R).filter(name => name !== 'default' && name !=="type") // Исключаем ключ 'default'
		.map(name => html`
    		    <div class="item${KUVI.M[1] === name ? ' item-linked' : ''}" @click="${(event)=>this.menu_click(event,name,1)}">
        		<div class="candidates mv0">${name}</div>
    		    </div>
		`);
	return html`${s}`;
  }

  MENU2() {  // БОКОВОЕ ЛЕВОЕ МЕНЮ

	const R = this.getR(2);
        if('_$litType$' in R) {
	    console.log('ASC FN 2');
	    return R; // это html``
	}

	if(R.type && R.type != "white") return html`Unknown type 2`;

	const s = Object.keys(R).filter(name => name !== 'default' && name !=="type") // Исключаем ключ 'default'
		.map(name => html`
		    <div class="mframe-wrapper" name="${name}" @click="${(event)=>this.menu_click(event,name,2)}">
        		<div class="melement${KUVI.M[2] === name ? ' melement-active':''} mv0">
        		    <div class="mnew-audit">${!name || name==''?'---':name}</div>
        		    <img class="marrow-right-icon" src="img/arrow_right.svg">
        		</div>
		    </div>
		`);

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

  MENU3() { // ЦЕНТРАЛЬНОЕ ВЫБРАННОЕ
	const R = this.getR(3);
	// R='fff';
	// return html`[${typeof(R)}] ${R}`;
        // if('_$litType$' in R) return R; // это html``
	return html`${R}`;
  }

  getR(n) {
	// if(this.stop++ > 100) {   console.log('getR.stop: false');   return false;	}
	const R = this.setR(n);
	if(typeof(R)==='function') return R(this,n);
	if(typeof(R)==='string') return html`<div style='padding:20px;'>${R}</div>`;
	if(!R) return html`--none R!--`;
	if(typeof(R)!=='object') return html`--none R.obj!--`;
	return R;
  }


  setR(n) {
	if(!KUVI.M) KUVI.M=[];
	var R = KUVI.MENU;
	var nm='Menu';
	for(var i=0;i<=n;i++) {

	    console.log('['+i+'/'+n+'] R=',R);

	    var x = f5_read(nm);

	    if(
		( !x || (i==0 && x=='kuvio')) && R && R[R.default]
	    ) x = R.default; // дефолтное

	    this.msave(i,x); // запомним

	    if(typeof(R)=='function' || i==n) continue; // на любой функции стоп

	    if(R && R[x]) R=R[x];
	    nm+=':'+x;
	}
	// console.log(`....[${n}=${n}] x=${x}`,R);
	return R;
  }


  menu_click(event,name,n) {
    event.stopImmediatePropagation();
    KUVI.M[parseInt(n)]=name;
    // this.saveM();
    console.log(`Click: name="${name}" n="${n}"`);
    this.msave(n,name);
    this.requestUpdate();
  }



  render() {

	const R = this.getR(0);
        if('_$litType$' in R) return R; // это html``

	    var i=-1;
	    const s = Object.keys(R).filter(name => name !== 'default' && name !=="type") // Исключаем ключ 'default'
		.map(name => ( ++i
                        ? html`${i==1
? html`<div class="kuvio mv" onclick="ACTS.all()">•</div>`
: html`<div class="kuvio">•</div>`
}<div class="kuvio mv0${name==KUVI.M[0]?' act':''}" @click="${(event)=>this.menu_click(event,name,0)}">${name}</div>`
                        : html`<b class="kuvio">${name}</b>`
                    )
		);

	return html`
	    <div class="audit">
	        <div class="kuvio-parent">
		    <div style="display: flex; gap: 16px;">${s}</div>
	    	    <div class="login-frame">${this.login_panel()}</div>
		</div>
	    </div>

            <div style="display: flex; gap: 20px; padding-right: 40px;">
		<div class="LL" id='secondScreen'>
		    <div class="item-parent">${this.MENU1()}</div>
		    <div class="item-media">${this.MENU2()}</div>
		</div>
	    </div>
	`;
  }

// =========================================================================================================================



}

customElements.define('menu-screen', MenuScreen);
