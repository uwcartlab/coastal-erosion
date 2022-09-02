//footer component 
class BottomFooter extends HTMLElement {
    constructor() {
      super();
    }
  
    connectedCallback() {
      this.innerHTML = `
            <div class="footer">
                <img src="img/sg_logo.png">
                <img src="img/UWCL_logo_gray.png">
            </div>
        `;
    }
}
  
customElements.define('bottom-footer', BottomFooter);
