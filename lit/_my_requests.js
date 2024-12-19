import {LitElement, html, css} from './lit-all.min.js';

export function my_requests(context,n) {

        if(!KUVI.candidat_requests) {
            load_candidat_requests(context);
            return html`${context.skelet()}${context.skelet()}${context.skelet()}`;
        }

	const s=KUVI.candidat_requests.map(r=>html`
            <audit-panel
                mode='view'
                audit_id='Error_audit_id'
                audit_name="${r.name}"
                audit_description="${r.about}"
                audit_blake3="${r.audit_blake3}"
                audit_candidates='0'
                audit_parameters='0'
                audit_evidences='0'
                audit_rules='[]'
                audit_asks="${r.asks}"
            ></audit-panel>`);

        return html`<div style="display: flex; gap: 30px; flex-direction: column;">${s}</div>`;

        // return html`Requested audits: ${JSON.stringify(KUVI.candidat_requests)}
}

async function load_candidat_requests(context) {
        KUVI.candidat_requests = await KUVIO.API('candidat_my_requests');
        if(KUVI.candidat_requests && KUVI.candidat_requests.length) {
	        context.dispatchEvent(new CustomEvent('main-screen_render', { bubbles: true, composed: true }));
	}
}
