import { LitElement, html, css } from './lit-all.min.js';

class AuditorInfo extends LitElement {

  static properties = {
    audit_id: { type: String },
    audit_name: { type: String },
    audit_candidates: { type: Number },
    audit_parameters: { type: Number },
    audit_evidences: { type: Number },
    audit_description: { type: String },
    audit_blake3: { type: String },
    audit_me: { type: String },
    edit_me: { type: String },
  };


  static styles = css`
    :host {
        width:100%
    }

    .mv,.mv0,.mv00 { transition: transform 0.2s ease-in-out; }
    .mv:hover,mv0:hover,mv00:hover { transition-property: transform;
        transition-duration: 0.2s;animation: none; transform: scale(1.7); cursor:pointer;}
    .mv0:hover { transform: scale(1.1); }
    .mv00:hover { transform: scale(1.05); }

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
.edit:after { content: "Edit"} /* 📝 */

    .frame-group {
      border: 2px solid transparent;
      align-self: stretch;
      border-radius: 8px;
      background-color: #f5f5f5;
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      justify-content: flex-start;
      padding: 16px;
      gap: 24px;
    }
    .frame-group:hover {
      border: 2px solid lightblue;
    }
    .audit-name {
      font-weight: 600;
      width: 100%;
      border-radius: 4px;
      border: 1px solid #ddd;
      box-sizing: border-box;
      height: 41px;
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: flex-start;
      padding: 8px 10px;
      font-size: 19px;
    }
    .audit-name-parent {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      justify-content: flex-start;
      gap: 8px;
      width: 100%;
    }
    .frame-container {
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: flex-start;
      gap: 24px;
      opacity: 0.8;
    }
    .audit-description {
      width: 100%;
      border-radius: 4px;
      border: 1px solid #ddd;
      box-sizing: border-box;
      min-height: 56px;
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: flex-start;
      padding: 8px 10px;
      font-size: 14px;
    }
    .audit-name2 {
      position: relative;
      font-size: 22px;
      font-weight: 600;
    }
    .verified {
      position: absolute;
      top: -40px;
      right: -40px;
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 8px 10px;
      z-index: 1;
      font-size: 14px;
      color: #356bff;
    }
    .button-blue {
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
    .frame-ev-parameters {
      width: 100%;
      position: relative;
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      justify-content: flex-start;
      gap: 8px;
      text-align: left;
      font-size: 14px;
      color: #000;
      font-family: Inter;
    }








.frame-new {
    width: 100%;
    position: relative;
    border-radius: 8px 8px 8px 8px;
    background-color: #fff;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: flex-start;
    padding: 16px;
    box-sizing: border-box;
    gap: 24px;
    text-align: left;
    font-size: 12px;
    color: #000;
    font-family: Inter;
}
  `;

  constructor() {
    super();
    this.audit_name = 'Default Audit Name';
    this.audit_candidates = 0;
    this.audit_parameters = 0;
    this.audit_evidences = 0;
    this.audit_description = 'Default description of the audit.';
    this.audit_me = "";
    this.edit_me = "";
  }

  click_audit_me(event) {

    // Создаем и отправляем кастомное событие
    this.dispatchEvent(new CustomEvent('audit-me', {
        detail: { // Данные передаются в событии через `detail`
            audit_id: this.audit_id,
        },
        bubbles: true, // Позволяет событию подниматься вверх по дереву
        composed: true // Позволяет событию пересекать границы Shadow DOM
    }));

    // alert(7);
    // KUVI.audit_me(this.audit_id);
  }

  render() {
    this.audit_me=bool(this.audit_me);
    this.edit_me=bool(this.edit_me);

    return html`
      <div class="frame-new">
        <div class="verified"><img src="img/verified.svg" alt="Verified Icon">Auditor’s stamp of approval</div>

        <div class="audit-name-parent audit-name-parent2">
          <div class="rs">Audit name</div>
          <div class="audit-name2">${this.audit_name}</div>

${this.audit_me ? /*`*/html`
          <div @click="${this.click_audit_me}" class="button-blue mv0">
            <div class="login-as-auditor">Audit me!</div>
          </div>`: html``/*`*/
}

          <div class="frame-container rs">
            <div>${this.audit_candidates} Candidates</div>
            <div>${this.audit_parameters} Evaluation parameters</div>
            <div>${this.audit_evidences} Requested evidence</div>
          </div>

        </div>

        <div class="audit-name-parent">
          <div class="rs">Audit description</div>
          <div class="audit-description">${this.audit_description}
	    ${ this.edit_me ? html`<div @click=${() => KUVIO.AUDITOR.editRule()} class="edit mv" alt="Edit"></div>` : html``/*`*/ }
	    </div>
        </div>

        <div class="frame-ev-parameters">
          <div class="evaluation-parameters">Evaluation parameters</div>
          <!-- Вот здесь содержимое, переданное через слот -->
          <slot></slot>
        </div>
      </div>
    `;
  }
}

customElements.define('auditor-info', AuditorInfo);
