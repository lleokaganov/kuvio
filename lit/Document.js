import { LitElement, html, css } from './lit-all.min.js';

class Document extends LitElement {

  static properties = {
    icon: { type: String },          // Путь к иконке
    docType: { type: String },       // Тип документа
    docName: { type: String },       // Название документа
    description: { type: String }    // Описание документа
  };

  constructor() {
    super();
    // Задаем значения по умолчанию
    this.icon = 'img/upload_2.svg'; 
    this.docType = 'Uploaded document';
    this.docName = 'Portfolio';
    this.description = 'Three insightful projects are enough. Quality and depth over quantity. Tell us what the constraints were, which challenges you encountered, how you solved them.';
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

    .ipfs_type {
      letter-spacing: 0.01em;
      font-family: 'Roboto Mono', monospace;
      opacity: 0.8;
    }

    .icon24 {
      width: 24px;
      height: 24px;
    }

    .ipfs_name {
      font-size: 15px;
      font-weight: 600;
    }

    .ipfs_description {
      align-self: stretch;
    }

    .type-parent {
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      justify-content: flex-start;
      gap: 6px;
      opacity: 0.8;
    }

    .ipfs-icon {
      padding: 6px 0px;
    }

    .document {
      align-self: stretch;
      border-radius: 8px;
      border: 1px solid #ddd;
      display: flex;
      flex-direction: row;
      align-items: flex-start;
      justify-content: flex-start;
      padding: 12px 16px;
      gap: 16px;
    }

    .document-parent {
      align-self: stretch;
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      justify-content: flex-start;
      gap: 16px;
      font-size: 12px;
    }















.check-circle-icon {
    width: 24px;
    position: relative;
    height: 24px;
    z-index: 0;
}
.portfoliopdf {
    width: 151px;
    position: relative;
    line-height: 130%;
    font-weight: 600;
    display: inline-block;
}
.my-recent-projects {
    width: 168px; /*268px;*/
    position: relative;
    font-size: 14px;
    line-height: 140%;
    display: inline-block;
    height: 20px;
    flex-shrink: 0;
}
.portfoliopdf-parent {
    flex: 1;
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
    font-family: 'Roboto Mono';
    opacity: 0.8;
    z-index: 2;
}
.edit {
    width: 26px;
EEEEEEposition: absolute;
    margin: 0 !important;
    top: 16px;
    right: 16px;
    font-size: 14px;
    line-height: 130%;
    font-weight: 500;
    color: #356bff;
    text-align: right;
EEEdisplay: none;
    z-index: 3;
}
.evidencerequest {
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
}



















  `;

  render() {
    return html`
      <div class="document">
        <img class="ipfs-icon icon24 mv" src="${this.icon}" alt="Icon">
        <div class="type-parent">
          <div class="ipfs_type">${this.docType}</div>
          <div class="ipfs_name">${this.docName}</div>
          <div class="ipfs_description">${this.description}</div>


<div class="evidencerequest">
<img class="check-circle-icon" src="img/check_circle.svg">
<div class="portfoliopdf-parent">
<div class="portfoliopdf">Portfolio.pdf</div>
<div class="my-recent-projects">My recent projects</div>
</div>
<div class="uploaded-just-now">Uploaded just now</div>
<div class="edit">Edit</div>
</div>

        </div>
      </div>
    `;
  }
}

customElements.define('document-component', Document);
