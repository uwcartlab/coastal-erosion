//navigation bar 
class TopHeader extends HTMLElement {
    constructor() {
      super();
    }
  
    connectedCallback() {
      this.innerHTML = `
        <nav class="navbar fixed-top navbar-expand-lg navbar-light bg-light">
            <div class="container-fluid">
                <a class="navbar-brand" href="./index.html"><b>Coastal Erosion WI</b></a>
                <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarText" aria-controls="navbarText" aria-expanded="false" aria-label="Toggle navigation">
                    <span class="navbar-toggler-icon"></span>
                </button>
                <div class="collapse navbar-collapse" id="navbarText">
                    <ul class="navbar-nav me-auto mb-2 mb-lg-0 end-0">
                        <li class="nav-item">
                            <a class="nav-link" href="./processes.html">Processes</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" href="./compare.html">Comparison</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" href="./calculator.html">Calculator</a>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
        `;
    }
}
  
customElements.define('top-navbar', TopHeader);
