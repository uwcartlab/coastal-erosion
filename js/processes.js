/*****COASTAL EROSION VIEWER*****/
/* Created by the UW Cartgraphy Lab and Wisconsin Sea Grant, 
   Gareth Baldrica-Franklin, Jake Steinberg */
(function(){
    function setListeners(){
        //position sidebar
        let sidebarHeight = document.querySelector(".sidebar").clientHeight,
            menuHeight = document.querySelector(".menu").clientHeight;

        document.querySelector(".menu").style.marginTop = (sidebarHeight/2) - (menuHeight/2) + "px";

        //set listener to collapse each section of the calculator
        document.querySelectorAll(".section-header").forEach(function(elem){
            elem.addEventListener("click",function(){
                //jump to calculation section on click
                window.location.href = '#' + elem.title;
            })
        })
        //update display based on button selection
        document.querySelectorAll(".next").forEach(function(elem){
            elem.addEventListener("click",function(){
                document.getElementById('step' + (parseInt(elem.title) + 1)).scrollIntoView();
            })
        })
        //bold menu titles
        document.addEventListener("scroll",function(){
            let scrollPos = window.pageYOffset;
            document.querySelectorAll(".section-content").forEach(function(elem, i){
                let scrollBottom = elem.offsetTop + (elem.clientHeight), scrollTop = elem.offsetTop - (elem.clientHeight/2);
                if (scrollPos >= scrollTop && scrollPos <= scrollBottom){
                    document.querySelector("#title" + (i+1)).style.fontWeight = "bold";
                }
                else{
                    document.querySelector("#title" + (i+1)).style.fontWeight = "normal";
                }
            })
        })
        
    }

    document.addEventListener('DOMContentLoaded', function(){
        setListeners();
    })
})()