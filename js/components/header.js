//navigation bar component
class TopHeader extends HTMLElement {
    constructor() {
      super();
    }
  
    connectedCallback() {
      this.innerHTML = `
        <nav class="navbar fixed-top navbar-expand-lg">
            <div class="container-fluid">
                <a class="navbar-brand" href="./index.html"><b>Wisconsin Coast Erosion</b></a>
                <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarText" aria-controls="navbarText" aria-expanded="false" aria-label="Toggle navigation">
                    &#9552;
                </button>
                <div class="collapse navbar-collapse" id="navbarText">
                    <ul class="navbar-nav me-auto mb-2 mb-lg-0 end-0">
                        <li class="nav-item">
                            <a class="nav-link" id="processes-page" href="processes.html">Processes</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" id="comparison-page" href="compare.html">Comparison</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" id="calculator-page" href="calculator.html">Calculator</a>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
        `;

        document.querySelectorAll(".nav-link").forEach(function(link){
            let page = window.location.href;
            if (page.includes(link.href)){
                link.style.fontWeight = "bold";
            }
        })
    }
}
  
customElements.define('top-navbar', TopHeader);
