import {LitElement, html, css} from './lit-all.min.js';

var my_audits_loading = false;

var my_audits_new = false;

export function my_audits_menu(context,n) {
    if(n==2) return menu2(context,n);
    if(n==3) return menu3(context,n);
    return html `error`;
}

function menu3(context,n) {

    if(my_audits_new) {
	my_audits_new = false;
	return elerenr(context,{});
    }

    if(!KUVI.my_audits) return html``;

    const name = KUVI.M[2];
    const r = KUVI.my_audits.find(function(item) { return item.name === name; });

    if(!r) return html``;

    return elerenr(context,r);

}


function elerenr(context,r) {

// console.log('RRRRRRRRRRRRRRRRRRRRRRRRRRRRRRR:',r);

return html`
${/* Блок элемента */''}

<div class="oglavnom">

    ${/* Шапка цвета "мама, я покакала" */''}
    <div class="iproduct-designer-parent${r.public?' iproduct-designer-parent-act':''}">
    <div class="iproduct-designer">${r.name}</div>
	<div class="ibutton mv0" @click="${r.chpublic}">${r.public ? "Publish" : "Screen"}</div>
    </div>

    <div style='padding:20px;'>

    ${/* Панелька с основными данными Аудита */''}
        <audit-panel
    	    mode="${r._id=='' ? 'edited' : 'edit'}"
    	    audit_id="${r._id}"
            audit_name="${r.name}"
            audit_description="${r.about}"
            audit_blake3="${r.blake3}"
            audit_candidates="${r.audit_candidates}"
            audit_parameters="${r.audit_parameters}"
            audit_evidences="${r.audit_evidences}"
	    audit_KUVIM="2"
	></audit-panel>

    <div style="height:40px;"></div>
    ${/* Панелька с требуемыми файлами */''}
        <div class="evframe-ev-parameters">
        <div class="requested-evidence">Requested evidence
	    <div class="newbutton mv0" @click="${(event)=>addEvidence(event,r)}"><div class="newlogin-as-auditor">Add evidence</div></div>
        </div>
    </div>

    <a name="upload_all_files"></a>

    <requested-files
        audit_id="${r._id}"
        audit_blake3="${r.blake3}"
        files="${ JSON.stringify(r.asks) }"
        mode="auditor"
        edit="1"
        audit_me="0"
        upload="0"
    ></requested-files>

    <div style="height:40px;"></div>
    ${/* Вставляем компоненты evaluation-component внутрь auditor-info */''}
        <div class="evframe-ev-parameters">
	    <div class="requested-evidence">Evaluation parameters
	<div class="newbutton mv0" @click="${(event)=>addParameter(event,r)}"><div class="newlogin-as-auditor">Add parameter</div></div>
    </div>

    ${rules(r)}

</div>${/* Блок элемента закончился */''}
`;

}

function newAudit(){
    my_audits_new = true;
    // KUVI.my_audits=false; // чтобы перечитал заново с сервера
    this.dispatchEvent(new CustomEvent('main-screen_render', { bubbles: true, composed: true }));
}


function rules(r){
    try {
	var s=r.rules.map((p,i) => html`
                    <evaluation-component
                        num="${i}"
                        open=""
                        edit="1"
                        mark="0"
                        audit_id="${r._id}"
                        type="${p.type}"
                        data=""
                        name="${p.name}"
                        about="${p.about}"
                        names="${JSON.stringify(p.names)}"></evaluation-component>
                `);
        return html`<div style="width:100%">${s}</div>`;
    } catch(er) { return html` [ Rules error ] `; }
}


function menu2(context,n) {

 console.log(`### my_audits_menu: [${n}]`);

  return html`
    <div class='mmenu'>
	<div class="mframe-parent">

	    <div class="mnew-audit-wrapper">
    		<div class="mnew-audit mv0" @click="${newAudit}">New Audit</div>
	    </div>

	    ${audits(context)}

        </div>
    </div>

    ${context.MENU3()}

    <div style="height:40px;"></div>
`;

}


var savedScrollX = false; // window.scrollX;
var savedScrollY = false; // window.scrollY;

function audits(context) {

	var s;
	if( !KUVI.my_audits || !KUVI.my_audits.length) {

	    if(savedScrollX === false) savedScrollX = window.scrollX;
	    if(savedScrollY === false) savedScrollY = window.scrollY;

	    audits_update(context);

	    return context.skelet('width:100%;');
	}

	var s= KUVI.my_audits.map(r => html`
                    <div class="mframe-wrapper" pid="${r._id}" name="${r.name}" @click="${(event)=>context.menu_click(event,r.name,2)}">
                        <div class="melement${KUVI.M[2] === r.name ? ' melement-active':''} mv0">
                            <div class="mnew-audit">${!r.name || r.name==''?'---':r.name}</div>
                            <img class="marrow-right-icon" src="img/arrow_right.svg">
                        </div>
                    </div>
                `);

//                <div class='mmenu'>
//                    <div class="mframe-parent" style="width:100%">${s}</div>
//                </div>


	return html`<div style="width:100%">${s}</div>`;

/*
                <div class="oglavnom">
                    <div style='padding:20px;'>${context.MENU3()}</div>
                </div>

                <div style="height:40px;"></div>
        `;


	// <div style="width:100%">${s}</div>`;
*/
}


async function audits_update(context) {

	if( my_audits_loading ) return;
	my_audits_loading = true;
	setTimeout( function(){ my_audits_loading=false;},5000 );

        while(!unis) await KUVIO.LOGIN.login();

        KUVI.my_audits = await KUVIO.API('auditor_my');

	my_audits_loading = false;

	console.log("KUVI.my_audits",KUVI.my_audits);
	context.requestUpdate(); // принудительное обновление компонента
        context.updateComplete.then(() => {
	    window.scrollTo(savedScrollX, savedScrollY);
	    savedScrollX=savedScrollY=false;
	});

}

// ==============================================================================================

function addParameter(event,r) {
    const id=h(r._id);
    dialog(`<new-parameter audit_id="${id}"></new-parameter>`,'New parameter',{id:'NP_'+id});
}

  // Вызываем окно редактирования new-evidence для нашего Аудита
  // @save-evidence="${this.handle_SaveEvidence}"
function addEvidence(event,r) {
    const id=h(r._id);
    dialog(`<new-evidence audit_id="${id}"></new-evidence>`,'New evidence',{id:'NE_'+id});
}


export const my_audits_menu_css = css`

/***************************** item-header шапочка цвета детской неожиданности *****************/
.iproduct-designer {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;

    flex: 1;
    position: relative;
    line-height: 130%;
    font-weight: 600;
    display: inline-block;
    height: 26px;
}

.ibutton {
    line-height: 130%;
    font-weight: 500;
    font-size: 14px;
    user-select: none;

    border-radius: 8px;
    background-color: #000;
    height: 42px;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    padding: 12px 16px;
    box-sizing: border-box;
    color: #fff;
}

.iproduct-designer-parent {
    background-color: #e1d7b3;
    width: 100%;

    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;
    padding: 8px 24px;
    box-sizing: border-box;
    gap: 16px;
    text-align: left;
    font-size: 19px;
    color: #000;
    font-family: Inter;
}

.iproduct-designer-parent-act {
    background-color: #c7e0b3 !important;
}


/********* evframe ******/

    .evframe-ev-parameters {
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

    .requested-evidence {
        font-size: 16px;
        line-height: 130%;
        font-weight: 500;
        margin:20px 0 20px 0;
        display: flex;
        width: 100%;
        justify-content: space-between;
    }

.newlogin-as-auditor {
    position: relative;
    line-height: 130%;
    font-weight: 500;
}
.newbutton {
    position: relative;
    border-radius: 8px;
    background-color: #000;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    padding: 12px 16px;
    box-sizing: border-box;
    text-align: left;
    font-size: 14px;
    color: #fff;
    font-family: Inter;
  user-select: none;
}


`;

