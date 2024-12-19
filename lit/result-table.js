import { LitElement, html, css } from './lit-all.min.js';

class ResultTable extends LitElement {
  static styles = css`

.icon24 {
    width: 24px;
    height: 24px;
}

/* кнопки Evaluated Rejected In progress */

.Evaluated, .Rejected, .In-progress {
    border-radius: 8px;
    height: 32px;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    padding: 2px 8px;
    box-sizing: border-box;
    text-align: center;
    gap: 8px;

    line-height: 130%;
    white-space: nowrap;
}

.Evaluated { background-color: #c7e0b3; } .Evaluated::before { content: "Evaluated"; }
.Rejected { background-color: #cacaca; } .Rejected::before { content: "In-progress"; }
.In-progress { background-color: #ffc935; } .In-progress::before { content: "Rejected"; }

.In-progress::before,
.Rejected::before,
.Evaluated::before { font-size: 12px; white-space: nowrap; }

.In-progress::after,
.Rejected::after,
.Evaluated::after {
    content: url('/img/arrow_drop_down.svg');
    width: 16px;
    height: 16px;
    display: inline-block;
}



























.new-talent-2 {
    position: relative;
    letter-spacing: 0.07em;
    line-height: 130%;
    text-transform: uppercase;
    font-weight: 300;
    opacity: 0.7;
}
.new-talent-2-parent {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;
    gap: 4px;
    font-size: 12px;
}
.frame-child {
    width: 20px;
    border-radius: 999px;
    height: 20px;
    object-fit: cover;
}
.sasha-candidate {
    width: 160px;
    position: relative;
    line-height: 130%;
    font-weight: 500;
    display: inline-block;
    flex-shrink: 0;
}
.frame-div {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;
    gap: 8px;
}
.button {
    border-radius: 8px;
    border: 1px solid rgba(0, 0, 0, 0.5);
    box-sizing: border-box;
    height: 42px;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    padding: 12px 16px;
}
.button-parent {
    display: flex;
    flex-direction: row;
    align-items: flex-start;
    justify-content: flex-start;
    gap: 8px;
    font-size: 14px;
}
.frame-container {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;
    gap: 16px;
}
.frame-group {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: flex-start;
    padding: 8px 0px;
    gap: 16px;
}
.evaluated-talent-87 {
    align-self: stretch;
    position: relative;
    font-size: 12px;
    letter-spacing: 0.07em;
    line-height: 130%;
    text-transform: uppercase;
    font-weight: 300;
    display: flex;
    align-items: center;
    height: 32px;
    flex-shrink: 0;
    opacity: 0.7;
}
.frame-parent4 {
    height: 32px;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;
    gap: 8px;
}
.div {
    position: relative;
    line-height: 130%;
    opacity: 0.5;
}
.senior {
    position: relative;
    line-height: 130%;
    text-align: center;
}
.parent {
    width: 83px;
    border-radius: 8px;
    border: 1px solid #cdcdcd;
    box-sizing: border-box;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;
    padding: 8px 12px 8px 10px;
    gap: 4px;
}
.div1 {
    width: 91px;
    position: relative;
    line-height: 130%;
    display: flex;
    align-items: center;
    height: 32px;
    flex-shrink: 0;
    max-width: 122px;
}
.yes {
    width: 44px;
    position: relative;
    line-height: 130%;
    display: flex;
    align-items: center;
    height: 32px;
    flex-shrink: 0;
}
.e-commerce-wrapper {
    border-radius: 24px;
    background-color: #fff;
    border: 1px solid #cdcdcd;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    padding: 6px 10px;
}
.frame-parent6 {
    width: 164px;
    display: flex;
    flex-direction: row;
    align-items: flex-start;
    justify-content: flex-start;
    flex-wrap: wrap;
    align-content: flex-start;
    gap: 4px;
    text-align: center;
}
.group {
    border-radius: 8px;
    border: 1px solid #cdcdcd;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;
    padding: 8px 12px 8px 10px;
    gap: 4px;
}
.frame-parent5 {
    overflow: hidden;
    display: flex;
    flex-direction: row;
    align-items: flex-start;
    justify-content: flex-start;
    gap: 16px;
    font-size: 12px;
}
.frame-parent3 {
    border-top: 1px solid #ddd;
    border-bottom: 1px solid #ddd;
    display: flex;
    flex-direction: row;
    align-items: flex-start;
    justify-content: flex-start;
    padding: 16px 0px;
    gap: 16px;
}
.parent2 {
    width: 83px;
    border-radius: 8px;
    border: 1px solid #cdcdcd;
    box-sizing: border-box;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;
    padding: 8px 12px 8px 10px;
    gap: 4px;
    text-align: left;
}
.div6 {
    width: 91px;
    position: relative;
    line-height: 130%;
    text-align: left;
    display: flex;
    align-items: center;
    height: 32px;
    flex-shrink: 0;
    max-width: 122px;
}
.yes1 {
    width: 44px;
    position: relative;
    line-height: 130%;
    text-align: left;
    display: flex;
    align-items: center;
    height: 32px;
    flex-shrink: 0;
}
.industry-experience {
    position: relative;
    text-decoration: underline;
    line-height: 130%;
}
.industry-experience-wrapper {
    border-radius: 24px;
    background-color: #fff;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    padding: 6px 10px;
}
.frame-wrapper {
    width: 164px;
    display: flex;
    flex-direction: row;
    align-items: flex-start;
    justify-content: flex-start;
    flex-wrap: wrap;
    align-content: flex-start;
    color: #356bff;
}
.collaboration-wrapper {
    width: 91px;
    border-radius: 8px;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;
    padding: 8px 12px 8px 10px;
    box-sizing: border-box;
    color: #356bff;
}
.visual-ui-design-wrapper {
    width: 94px;
    border-radius: 8px;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;
    padding: 8px 12px 8px 10px;
    box-sizing: border-box;
    color: #356bff;
}
.designops-wrapper {
    width: 99px;
    border-radius: 8px;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;
    padding: 8px 12px 8px 10px;
    box-sizing: border-box;
    color: #356bff;
}
.frame-parent9 {
    overflow: hidden;
    display: flex;
    flex-direction: row;
    align-items: flex-start;
    justify-content: flex-start;
    gap: 16px;
    text-align: center;
    font-size: 12px;
}
.parent3 {
    border-radius: 8px;
    border: 1px solid #cdcdcd;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;
    padding: 8px 12px 8px 10px;
    gap: 4px;
    opacity: 0;
}
.div8 {
    width: 91px;
    position: relative;
    line-height: 130%;
    display: flex;
    align-items: center;
    height: 32px;
    flex-shrink: 0;
    opacity: 0;
    max-width: 122px;
}
.yes2 {
    width: 44px;
    position: relative;
    line-height: 130%;
    display: flex;
    align-items: center;
    height: 32px;
    flex-shrink: 0;
    opacity: 0;
}
.frame-parent13 {
    width: 164px;
    display: flex;
    flex-direction: row;
    align-items: flex-start;
    justify-content: flex-start;
    flex-wrap: wrap;
    align-content: flex-start;
    gap: 4px;
    opacity: 0;
    text-align: center;
}
.parent4 {
    width: 91px;
    border-radius: 8px;
    border: 1px solid #cdcdcd;
    box-sizing: border-box;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;
    padding: 8px 12px 8px 10px;
    gap: 4px;
    opacity: 0;
}
.parent5 {
    width: 94px;
    border-radius: 8px;
    border: 1px solid #cdcdcd;
    box-sizing: border-box;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;
    padding: 8px 12px 8px 10px;
    gap: 4px;
    opacity: 0;
}
.parent6 {
    width: 99px;
    border-radius: 8px;
    border: 1px solid #cdcdcd;
    box-sizing: border-box;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;
    padding: 8px 12px 8px 10px;
    gap: 4px;
    opacity: 0;
}
.frame-wrapper1 {
    width: 164px;
    display: flex;
    flex-direction: row;
    align-items: flex-start;
    justify-content: flex-start;
    flex-wrap: wrap;
    align-content: flex-start;
    text-align: center;
}
.parent14 {
    width: 99px;
    border-radius: 8px;
    border: 1px solid #cdcdcd;
    box-sizing: border-box;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;
    padding: 8px 12px 8px 10px;
    gap: 4px;
}
.parent16 {
    width: 91px;
    border-radius: 8px;
    border: 1px solid #cdcdcd;
    box-sizing: border-box;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;
    padding: 8px 12px 8px 10px;
    gap: 4px;
}
.parent17 {
    width: 94px;
    border-radius: 8px;
    border: 1px solid #cdcdcd;
    box-sizing: border-box;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;
    padding: 8px 12px 8px 10px;
    gap: 4px;
}
.frame-parent {
    position: relative;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: flex-start;
    text-align: left;
    font-size: 16px;
    color: #000;
    font-family: Inter;
}


  `;

  render() {
    return html`

    <div class="frame-parent">
	    <div class="new-talent-2-parent">
    	    <div class="new-talent-2">new Talent (2)</div>
    	    <img class="icon24" src="/img/arrow_drop_down.svg">

	    </div>
	    <div class="frame-group">
    	    <div class="frame-container">
    		    <div class="frame-div">
        		    <img class="frame-child" src="/users/user003.webp">
        		    
        		    <div class="sasha-candidate">Sasha Candidate</div>
    		    </div>
    		    <div class="button-parent">
        		    <div class="button">
        			    <div class="k">Evaluate</div>
        		    </div>
        		    <div class="button">
        			    <div class="k">Reject</div>
        		    </div>
    		    </div>
    	    </div>
    	    <div class="frame-container">
    		    <div class="frame-div">
        		    <img class="frame-child" src="/users/user003.webp">
        		    
        		    <div class="sasha-candidate">Monika Ann o’Parts</div>
    		    </div>
    		    <div class="button-parent">
        		    <div class="button">
        			    <div class="k">Evaluate</div>
        		    </div>
        		    <div class="button">
        			    <div class="k">Reject</div>
        		    </div>
    		    </div>
    	    </div>
	    </div>
	    <div class="evaluated-talent-87">Evaluated Talent (87)</div>
	    <div class="frame-parent3">
    	    <div class="frame-parent4">
    		    <img class="frame-child" src="/users/user003.webp">
    		    
    		    <div class="sasha-candidate">Noland Roower</div>
    	    </div>
    	    <div class="frame-parent5">
    		    <div class="parent">
        		    <div class="div">3</div>
        		    <div class="senior">Senior</div>
    		    </div>
    		    <div class="div1">95%</div>
    		    <div class="yes">Yes</div>
    		    <div class="frame-parent6">
        		    <div class="e-commerce-wrapper">
        			    <div class="k">E-commerce</div>
        		    </div>
        		    <div class="e-commerce-wrapper">
        			    <div class="k">Agency</div>
        		    </div>
        		    <div class="e-commerce-wrapper">
        			    <div class="k">Sport, Nutrition...</div>
        		    </div>
    		    </div>
    		    <div class="group">
        		    <div class="div">4</div>
        		    <div class="senior">Facilitator</div>
    		    </div>
    		    <div class="group">
        		    <div class="div">2</div>
        		    <div class="senior">Craftsmen</div>
    		    </div>
    		    <div class="group">
        		    <div class="div">3</div>
        		    <div class="senior">Contributor</div>
    		    </div>
    		    <div class="Evaluated"></div>
    	    </div>
	    </div>
	    <div class="frame-parent3">
    	    <div class="frame-parent4">
    		    <img class="frame-child" src="/users/user003.webp">
    		    
    		    <div class="sasha-candidate">Heike Suni</div>
    	    </div>
    	    <div class="frame-parent9">
    		    <div class="parent2">
        		    <div class="div">5</div>
        		    <div class="senior">Lead</div>
    		    </div>
    		    <div class="div6">65%</div>
    		    <div class="yes1">Yes</div>
    		    <div class="frame-wrapper">
        		    <div class="industry-experience-wrapper">
        			    <div class="industry-experience">Industry experience</div>
        		    </div>
    		    </div>
    		    <div class="collaboration-wrapper">
        		    <div class="industry-experience">Collaboration</div>
    		    </div>
    		    <div class="visual-ui-design-wrapper">
        		    <div class="industry-experience">Visual UI design</div>
    		    </div>
    		    <div class="designops-wrapper">
        		    <div class="industry-experience">DesignOps</div>
    		    </div>

    		    <div class="In-progress"></div>
    	    </div>
	    </div>
	    <div class="frame-parent3">
    	    <div class="frame-parent4">
    		    <img class="frame-child" src="/users/user003.webp">
    		    
    		    <div class="sasha-candidate">Heike Suni</div>
    	    </div>
    	    <div class="frame-parent5">
    		    <div class="parent3">
        		    <div class="div">4</div>
        		    <div class="senior">Principle</div>
    		    </div>
    		    <div class="div8">65%</div>
    		    <div class="yes2">Yes</div>
    		    <div class="frame-parent13">
        		    <div class="e-commerce-wrapper">
        			    <div class="k">E-commerce</div>
        		    </div>
        		    <div class="e-commerce-wrapper">
        			    <div class="k">Public sector</div>
        		    </div>
    		    </div>
    		    <div class="parent4">
        		    <div class="div">2</div>
        		    <div class="senior">Basic</div>
    		    </div>
    		    <div class="parent5">
        		    <div class="div">3</div>
        		    <div class="senior">Master</div>
    		    </div>
    		    <div class="parent6">
        		    <div class="div">5</div>
        		    <div class="senior">Magician</div>
    		    </div>

    		    <div class="Rejected"></div>


    	    </div>
	    </div>
	    <div class="frame-parent3">
    	    <div class="frame-parent4">
    		    <img class="frame-child" src="/users/user003.webp">
    		    
    		    <div class="sasha-candidate">Noland Roower</div>
    	    </div>
    	    <div class="frame-parent5">
    		    <div class="parent">
        		    <div class="div">3</div>
        		    <div class="senior">Senior</div>
    		    </div>
    		    <div class="div1">95%</div>
    		    <div class="yes">Yes</div>
    		    <div class="frame-parent6">
        		    <div class="e-commerce-wrapper">
        			    <div class="k">E-commerce</div>
        		    </div>
        		    <div class="e-commerce-wrapper">
        			    <div class="k">Agency</div>
        		    </div>
        		    <div class="e-commerce-wrapper">
        			    <div class="k">Sport, Nutrition...</div>
        		    </div>
    		    </div>
    		    <div class="group">
        		    <div class="div">4</div>
        		    <div class="senior">Facilitator</div>
    		    </div>
    		    <div class="group">
        		    <div class="div">2</div>
        		    <div class="senior">Craftsmen</div>
    		    </div>
    		    <div class="group">
        		    <div class="div">3</div>
        		    <div class="senior">Contributor</div>
    		    </div>
    		    <div class="Evaluated"></div>
    	    </div>
	    </div>
	    <div class="frame-parent3">
    	    <div class="frame-parent4">
    		    <img class="frame-child" src="/users/user003.webp">
    		    
    		    <div class="sasha-candidate">Heike Suni</div>
    	    </div>
    	    <div class="frame-parent5">
    		    <div class="parent">
        		    <div class="div">5</div>
        		    <div class="senior">Lead</div>
    		    </div>
    		    <div class="div1">65%</div>
    		    <div class="yes">Yes</div>
    		    <div class="frame-wrapper1">
        		    <div class="e-commerce-wrapper">
        			    <div class="k">Agency</div>
        		    </div>
    		    </div>
    		    <div class="group">
        		    <div class="div">4</div>
        		    <div class="senior">Facilitator</div>
    		    </div>
    		    <div class="group">
        		    <div class="div">1</div>
        		    <div class="senior">Apprentice</div>
    		    </div>
    		    <div class="parent14">
        		    <div class="div">2</div>
        		    <div class="senior">Basic</div>
    		    </div>
    		    <div class="Evaluated"></div>
    	    </div>
	    </div>
	    <div class="frame-parent3">
    	    <div class="frame-parent4">
    		    <img class="frame-child" src="/users/user003.webp">
    		    
    		    <div class="sasha-candidate">Heike Suni</div>
    	    </div>
    	    <div class="frame-parent5">
    		    <div class="group">
        		    <div class="div">4</div>
        		    <div class="senior">Principle</div>
    		    </div>
    		    <div class="div1">65%</div>
    		    <div class="yes">Yes</div>
    		    <div class="frame-parent6">
        		    <div class="e-commerce-wrapper">
        			    <div class="k">E-commerce</div>
        		    </div>
        		    <div class="e-commerce-wrapper">
        			    <div class="k">Public sector</div>
        		    </div>
    		    </div>
    		    <div class="parent16">
        		    <div class="div">2</div>
        		    <div class="senior">Basic</div>
    		    </div>
    		    <div class="parent17">
        		    <div class="div">3</div>
        		    <div class="senior">Master</div>
    		    </div>
    		    <div class="parent14">
        		    <div class="div">4</div>
        		    <div class="senior">Manager</div>
    		    </div>
    		    <div class="Evaluated"></div>
    	    </div>
	    </div>
	    <div class="frame-parent3">
    	    <div class="frame-parent4">
    		    <img class="frame-child" src="/users/user003.webp">
    		    
    		    <div class="sasha-candidate">Heike Suni</div>
    	    </div>
    	    <div class="frame-parent5">
    		    <div class="group">
        		    <div class="div">4</div>
        		    <div class="senior">Principle</div>
    		    </div>
    		    <div class="div1">65%</div>
    		    <div class="yes">Yes</div>
    		    <div class="frame-parent6">
        		    <div class="e-commerce-wrapper">
        			    <div class="k">E-commerce</div>
        		    </div>
        		    <div class="e-commerce-wrapper">
        			    <div class="k">Public sector</div>
        		    </div>
    		    </div>
    		    <div class="parent16">
        		    <div class="div">2</div>
        		    <div class="senior">Basic</div>
    		    </div>
    		    <div class="parent17">
        		    <div class="div">3</div>
        		    <div class="senior">Master</div>
    		    </div>
    		    <div class="parent14">
        		    <div class="div">4</div>
        		    <div class="senior">Manager</div>
    		    </div>
    		    <div class="Evaluated"></div>
    	    </div>
	    </div>
	    <div class="frame-parent3">
    	    <div class="frame-parent4">
    		    <img class="frame-child" src="/users/user003.webp">
    		    
    		    <div class="sasha-candidate">Heike Suni</div>
    	    </div>
    	    <div class="frame-parent5">
    		    <div class="parent">
        		    <div class="div">5</div>
        		    <div class="senior">Lead</div>
    		    </div>
    		    <div class="div1">65%</div>
    		    <div class="yes">Yes</div>
    		    <div class="frame-wrapper1">
        		    <div class="e-commerce-wrapper">
        			    <div class="k">Agency</div>
        		    </div>
    		    </div>
    		    <div class="group">
        		    <div class="div">4</div>
        		    <div class="senior">Facilitator</div>
    		    </div>
    		    <div class="group">
        		    <div class="div">1</div>
        		    <div class="senior">Apprentice</div>
    		    </div>
    		    <div class="parent14">
        		    <div class="div">2</div>
        		    <div class="senior">Basic</div>
    		    </div>
    		    <div class="Evaluated"></div>
    	    </div>
	    </div>
	    <div class="frame-parent3">
    	    <div class="frame-parent4">
    		    <img class="frame-child" src="/users/user003.webp">
    		    
    		    <div class="sasha-candidate">Heike Suni</div>
    	    </div>
    	    <div class="frame-parent5">
    		    <div class="group">
        		    <div class="div">4</div>
        		    <div class="senior">Principle</div>
    		    </div>
    		    <div class="div1">65%</div>
    		    <div class="yes">Yes</div>
    		    <div class="frame-parent6">
        		    <div class="e-commerce-wrapper">
        			    <div class="k">E-commerce</div>
        		    </div>
        		    <div class="e-commerce-wrapper">
        			    <div class="k">Public sector</div>
        		    </div>
    		    </div>
    		    <div class="parent16">
        		    <div class="div">2</div>
        		    <div class="senior">Basic</div>
    		    </div>
    		    <div class="parent17">
        		    <div class="div">3</div>
        		    <div class="senior">Master</div>
    		    </div>
    		    <div class="parent14">
        		    <div class="div">4</div>
        		    <div class="senior">Manager</div>
    		    </div>
    		    <div class="Evaluated"></div>
    	    </div>
	    </div>
	    <div class="frame-parent3">
    	    <div class="frame-parent4">
    		    <img class="frame-child" src="/users/user003.webp">
    		    
    		    <div class="sasha-candidate">Heike Suni</div>
    	    </div>
    	    <div class="frame-parent5">
    		    <div class="group">
        		    <div class="div">4</div>
        		    <div class="senior">Principle</div>
    		    </div>
    		    <div class="div1">65%</div>
    		    <div class="yes">Yes</div>
    		    <div class="frame-parent6">
        		    <div class="e-commerce-wrapper">
        			    <div class="k">E-commerce</div>
        		    </div>
        		    <div class="e-commerce-wrapper">
        			    <div class="k">Public sector</div>
        		    </div>
    		    </div>
    		    <div class="parent16">
        		    <div class="div">2</div>
        		    <div class="senior">Basic</div>
    		    </div>
    		    <div class="parent17">
        		    <div class="div">3</div>
        		    <div class="senior">Master</div>
    		    </div>
    		    <div class="parent14">
        		    <div class="div">4</div>
        		    <div class="senior">Manager</div>
    		    </div>
    		    <div class="Evaluated"></div>
    	    </div>
	    </div>
    </div>


    `;
  }
}

customElements.define('result-table', ResultTable);
