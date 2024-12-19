import {LitElement, html, css} from './lit-all.min.js';

class AuditSearchPanel extends LitElement {
  static styles = css`

    :host {
        width:100%
    }

/*
    :host(:hover) {
        background: #333;
    }

    :host(:active) {
        background: #666;
    }
*/



    .audit-search {
     EEEEEEEEE position: relative;
      width: 100%;
      font-size: 14px;
      display: flex;
      gap: 10px;
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
    }

    .audit-search-by-content {
      letter-spacing: 0.01em;
      background-color: white;
      border-radius: 4px;
      border: 1px solid #ddd;
      box-sizing: border-box;
      width: 100%;
      height: 41px;
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: flex-start;
      padding: 8px 10px;
    }

    .button {
      border-radius: 8px;
      background-color: #000;
      height: 100%;
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: center;
      padding: 12px 16px;
      box-sizing: border-box;
      color: #fff;
    }

    .login-as-auditor {
      cursor: pointer;
      position: relative;
      font-weight: 500;
    }
  `;

  render() {
    return html`
      <div class="audit-search">
        <input type="text" class="audit-search-by-content" placeholder="Search audit by content, metric, skills">
        <div class="button">
          <div class="login-as-auditor">Search</div>
        </div>
      </div>
    `;
  }
}

customElements.define('audit-search-panel', AuditSearchPanel);
