import {LitElement, html, css} from './lit-all.min.js';

class HeaderComponent extends LitElement {

    static properties = {
        menu: {type: String},
    }

    constructor() {
        super();
        this.menu = 'none';
    }

    firstUpdated() {
//	console.log(unis);
//	console.log(unis_login);
//	this.unislogin = unis_login;
	this.menu = this.menu.split(',');
	console.log(this.menu);
    }


  static styles = css`
    :host {
        width:100%
    }

.mv,.mv0,.mv00 { transition: transform 0.2s ease-in-out; }
.mv:hover,mv0:hover,mv00:hover { transition-property: transform; transition-duration: 0.2s;
animation: none; transform: scale(1.7); cursor:pointer;}
.mv0:hover { transform: scale(1.1); }
.mv00:hover { transform: scale(1.05); }


    .candidates {
      position: relative;
      line-height: 130%;
      font-weight: 500;
    }
    .item {
      border-bottom: 2px solid #000;
      display: flex;
      flex-direction: row;
      align-items: flex-start;
      justify-content: flex-start;
      padding: 16px 0px;
    }
    .item1 {
      display: flex;
      flex-direction: row;
      align-items: flex-start;
      justify-content: flex-start;
      padding: 16px 0px;
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
    .logout {
      position: relative;
      font-size: 14px;
      line-height: 130%;
      font-weight: 500;
      color: #356bff;
    }
    .frame-parent {
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: flex-start;
      gap: 32px;
    }
    .item-parent {
      width: 100%;
      position: relative;
      border-radius: 16px 16px 0px 0px;
      background-color: #fff;
      border-bottom: 1px solid #eee;
      box-sizing: border-box;
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: flex-start;
      padding: 0px 32px 0px 16px;
      gap: 32px;
      text-align: left;
      font-size: 16px;
      color: #000;
      font-family: 'Inter', sans-serif;
    }
  `;

    login(){
	// KUVIO.LOGIN.login();
	// KUVIO.LOGIN.logout();
    }


  render() {

    return html`
      <div class="item-parent">

        <div class="item">
          <div class="candidates">${this.menu[0]}</div>
        </div>

        <div class="item1">
          <div class="candidates">${this.menu[1]}</div>
        </div>

        <div class="spacer"></div>
        <div class="frame-parent">
          <div class="frame-group">
            <img class="frame-child" alt="" src="Frame 41.png" />
            <div class="candidates">${this.unislogin}</div>
          </div>
          <div class="logout mv0" @click="${this.login}">Logout</div>
        </div>
      </div>
    `;
  }

}


customElements.define('header-component', HeaderComponent);
