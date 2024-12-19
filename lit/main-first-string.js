import {LitElement, html, css} from './lit-all.min.js';

class MainFirstString extends LitElement {

    static properties = {
	login: {type: Boolean}, // залогинен ли
	menu: {type: String}, // имена через |
	act: {type: String}, // имя активной страницы
    }

    constructor() {
        super();
        this.menu = "Az|Buki|Vedi|Medvedi";
    }

/*
    connectedCallback() {
	super.connectedCallback();
	// Выполняем вычисления
	this.myVariable = this.computeValue();
    }

    firstUpdated() {
	console.log("A1");
	this.login = (''+unis_login).length ? true : false;
	this.menu = this.menu.split('|');
	console.log("QQQQQQQQQQQ",this.menu);
//        try { this.val = JSON.parse(this.vals); } catch(e) {
    }
*/


  static styles = css`
    :host {
        width:100%
    }

.mv,.mv0,.mv00 { transition: transform 0.2s ease-in-out; cursor: pointer; }
.mv:hover,mv0:hover,mv00:hover { transition-property: transform; transition-duration: 0.2s;
animation: none; transform: scale(1.7); cursor:pointer;}
.mv0:hover { transform: scale(1.1); }
.mv00:hover { transform: scale(1.05); }


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

.login {
    margin-right: 20px;
    font-weight: 500;
    color: #356bff;
    width: 41px;
    text-align: left;
    white-space: nowrap;
}

.act {
    border-bottom: 2px solid black;
    padding-bottom: 3px;
}

`;

  onlogin(){
    // this.login = !this.login;
    // KUVIO.LOGIN.login();

    dialog(`<dialog-login></dialog-login>`,'Login');
    return;

    dialog(`
<div style="width: 284px;">

<div style='position:relative;margin-bottom: 15px;'>
    <span class='input_symb'>&#128100;</span>
    <input class='input_form' type="text" placeholder="Username" name="username" required>
</div>

<div style='position:relative;margin-bottom: 15px;'>
    <span class='input_symb'>&#128274;</span>
    <input class='input_form' type="password" placeholder="Password" name="password" id="password" required>
    <div class='mv0' onclick="this.innerHTML=(this.innerHTML=='&#128065;'?'&#128065;&#65039;':'&#128065;'); var e=this.parentNode.querySelector('input'); e.setAttribute('type',e.getAttribute('type')=='text'?'password':'text');" style="cursor: pointer;position: absolute; right: 50px; top: 50%; transform: translateY(-50%);">&#128065;</div>
</div>

<div class='login_email' style='position:relative;margin-bottom: 15px;display:none;'>
    <span class='input_symb'>&#9993;&#65039;</span>
    <input class='input_form' type="text" placeholder="contact@email.com" name="email" required>
</div>

<button type="submit" class="input_btn mv0">Sign In</button>

</div>
`,'login');


/*
<div style='width: 300px; text-align: center;'>

{if(unis):
<div style='margin: 20px 0 20px 0;' class="mv0">You are logged as <b>{#unis_login}</b><br><a href="#" onclick="KUVIO.LOGIN.logout(); clean('enter_password');">
Logout</a></div>
}

<div class='ajax' style='display:none'>{ajaxgif}</div>
<!-- todo:
div style='margin-top: 10px;' class="r mv0"><a class='login_forgot' href="#" onclick="alert('Ну и мудак, чо')">Forgot Password?</a></div
-->
<div style='margin-top: 10px;' class="r mv0 ">No account? <a href="#" class='login_create' onclick="alert('Ну и мудак, чо')">Create</a></div>
</div>`,{
    ajaxgif: ajaxgif,
    unis: unis && (''+unis).length,
    unis_login: unis_login,
}));
*/





  }

  render() {

    return html`
    <div class="audit">
        <div class="kuvio-parent">
	    <div style="display: flex; gap: 16px;">
	    	${ this.menu.split('|').map((x, i) => {
		    var t=x.split(':');
		    return ( i
			? html`${i==1
? html`<div class="kuvio mv" onclick="ACTS.all()">•</div>`
: html`<div class="kuvio">•</div>`
}<div class="kuvio mv0${t[1]==this.act?' act':''}" onclick="memli_init('${t[1]}')">${t[0]}</div>`
			: html`<b class="kuvio">${t[0]}</b>`
		    );
		  })
		}
	    </div>
	    <div class="kuvio login mv0" @click="${this.onlogin}">${(''+unis_login).length ? 'Log out': 'Log in'}</div>
	</div>
    </div>
    `;
  }

}

customElements.define('main-first-string', MainFirstString);
