import {LitElement, html, css} from './lit-all.min.js';

class DialogLogin extends LitElement {
  static styles = css`
    :host { }
    .input-container {
      position: relative;
      margin-bottom: 15px;
    }
    .input_symb {
      position: absolute;
      top: 50%;
      left: 10px;
      transform: translateY(-50%);
      font-size: 18px;
    }
    .input_form {
      padding: 10px 10px 10px 35px;
      font-size: 16px;
      border: 1px solid #ddd;
      border-radius: 4px;
      box-shadow: 0 0 4px 2px white;
    }
    .toggle-password {
      cursor: pointer;
      position: absolute;
      right: 10px;
      top: 50%;
      transform: translateY(-50%);
      font-size: 18px;
    }
    .input_btn {
      width: 100%;
      padding: 10px;
      font-size: 16px;
      background-color: #4CAF50;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
    }
    .input_btn:hover {
      background-color: #45a049;
    }
    .login_email {
    }
  `;

  constructor() {
    super();
    this.passwordVisible = false;
  }

  togglePasswordVisibility() {
    this.passwordVisible = !this.passwordVisible;
    this.requestUpdate();
  }

  render() {
    return html`
      <div>
        <div class="input-container">
          <span class="input_symb">&#128100;</span>
          <input class="input_form" type="text" placeholder="Username" name="username" required />
        </div>

        <div class="input-container">
          <span class="input_symb">&#128274;</span>
          <input class="input_form" type="${this.passwordVisible ? 'text' : 'password'}"
            placeholder="Password" name="password" id="password" required />
          <div class="toggle-password" @click="${this.togglePasswordVisibility}" title="Show/Hide Password">
            ${this.passwordVisible ? html`&#128065;&#65039;` : html`&#128065;`}
          </div>
        </div>

        <div class="input-container login_email">
          <span class="input_symb">&#9993;&#65039;</span>
          <input class="input_form" type="text" placeholder="contact@email.com" name="email" required />
        </div>

        <button type="submit" class="input_btn">Sign In</button>

	<div style="margin-top: 10px;" class="r mv0 ">No account? <a href="#" class="login_create"
onclick="alert('Ну и мудак, чо')">Create</a></div>
      </div>
    `;
  }
}

customElements.define('dialog-login', DialogLogin);
