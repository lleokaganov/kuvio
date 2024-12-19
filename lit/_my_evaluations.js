import {LitElement, html, css} from './lit-all.min.js';

export function my_evaluations() {
        const s = Array.from({ length: 30 })
            .map(() => html`
                <div class="stampi" style="background: ${randomGradient()}; color: ${randomColor()};">
                    <img class="icon120" src="/img/verified.svg">
                    <div class="stamp">Auditor’s stamp of approval</div>
                </div>
            `);
        return html`<div class="stampi-parent">${s}</div>`;
}



function randomColor() {
        // Генерация случайного цвета в формате HEX
        return `#${Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0')}`;
}

function randomGradient() {
        // Случайный выбор между линейным и радиальным градиентом
        const isLinear = Math.random() > 0.5;
        if(isLinear) return `linear-gradient(${Math.floor(Math.random() * 360)}deg, ${randomColor()}, ${randomColor()} 50%, ${randomColor()})`;
        else return `radial-gradient(circle, ${randomColor()} 30%, ${randomColor()} 70%)`;
}

export const my_evaluations_css = css`
/********* stampi **********/
.stampi-parent {
    display: flex;
    flex-wrap: wrap;
    gap: 30px;
}

.icon120 {
    width: 120px;
    height: 120px;
}

.stamp {
    position: relative;
    line-height: 140%;
    font-size: 13px;
}

.stampi {
    border-radius: 16px;
    width: 268px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    padding: 24px 40px;
    box-sizing: border-box;
}
.stampi:hover {
    opacity:0.8;
}
`;
