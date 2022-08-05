//navigation bar 
class BottomFooter extends HTMLElement {
    constructor() {
      super();
    }
  
    connectedCallback() {
      this.innerHTML = `
            <div class="footer">
                <a class="return">Return to Top</a>
            </div>
        `;
    }
}
  
customElements.define('bottom-footer', BottomFooter);
