import { html, css, LitElement } from './lit-all.min.js';

class PlayMedia extends LitElement {
    static properties = {
        type: { type: String }, // Тип медиа (например, 'youtube' или 'mp3')
        url: { type: String },  // URL медиа-ресурса
        img: { type: String },  // URL изображения превью
        isPlaying: { type: Boolean } // Контроль состояния воспроизведения
    };

    constructor() {
        super();
        this.type = 'youtube'; // Тип по умолчанию
        this.url = '';
        this.img = '';
        this.isPlaying = false;
    }

    static styles = css`
        .preview {
            border: 1px solid #ccc;
            box-shadow: 0px 5px 5px rgba(0, 0, 0, 0.6);
            width: 320px;
            height: 180px;
            position: relative;
            display: inline-block;
            background-size: cover;
            background-position: center;
            cursor: pointer;
        }
        .play-button {
            display: inline-block;
            background-color: rgba(255, 251, 251, 0.54);
            position: absolute;
            top: 56px;
            left: 126px;
            font-size: 48px;
            padding: 0 20px 10px;
            border-radius: 10px;
            color: #842222;
        }
        .video-container iframe {
            width: 100%;
            height: 100%;
        }

        .video-container {
            position: relative;
            width: 100%;
        }
    `;

/*
    firstUpdated() {
        this.updateIframeHeight();
        window.addEventListener('resize', this.updateIframeHeight.bind(this));
        this.updateIframeHeight();
    }

    disconnectedCallback() {
        window.removeEventListener('resize', this.updateIframeHeight.bind(this));
        super.disconnectedCallback();
    }
*/
    updateIframeHeight() {
        const iframe = this.shadowRoot.querySelector('iframe');
        if(iframe) {
            const width = iframe.offsetWidth;
            const aspectRatio = 9 / 16; // Соотношение сторон 16:9
            iframe.style.height = `${width * aspectRatio}px`;
        }
    }

    playMedia(event) {
	event.stopPropagation(); // Останавливаем всплытие события
        this.isPlaying = true;
    }

    render() { // todo="(start?'&start='+start:'')"
        return html`
            ${this.isPlaying
                ? html`
                    ${this.type === 'youtube' ? html`
                            <div class="video-container">
                                <iframe @load="${this.updateIframeHeight}"
                                    src="https://www.youtube.com/embed/${this.url}?rel=0&autoplay=1"
                                    frameborder="0" allowfullscreen
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                ></iframe>
                            </div>`
                        : this.type === 'mp3' ? html`<audio src="${this.url}" controls>${this.url}</audio>`
                        : html`<div class="audio-container">PLAY ${this.type}: ${this.url}</div>`
                    }
                  `
                : html`
                    ${this.type === 'youtube' ? html`
                	<div class="preview" @click="${this.playMedia}" style="background-image: url('${this.img}');">
                    	    <div class="play-button">&#9654;</div>
                	</div>`
		    : this.type === 'mp3' ? html`<audio src="${this.url}" controls></audio>`
		    : html`unknown`
		    }
		`
            }
        `;
    }
}

customElements.define('play-media', PlayMedia);
