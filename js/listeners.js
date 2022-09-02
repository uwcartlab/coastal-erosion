/*****COASTAL EROSION VIEWER*****/
/* Created by the UW Cartgraphy Lab and Wisconsin Sea Grant, 
   Gareth Baldrica-Franklin, Jake Steinberg */

//sidebar and page navigation listeners for the calculator and processes page
(function(){
    //listeners for sidebar links 
    document.querySelectorAll(".section-header").forEach(function(elem){
        elem.addEventListener("click",function(){
            //jump to calculation section on click
            window.location.href = '#' + elem.title;
        })
    })
    //listeners for next buttons
    document.querySelectorAll(".next").forEach(function(elem){
        elem.addEventListener("click",function(){
            document.getElementById('step' + (parseInt(elem.title) + 1)).scrollIntoView();
        })
    })
    //bold menu titles in the sidebar
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
    //dymanic positioning for certain elements
    function positions(){
        //sidebar positions
        let sidebarHeight = document.querySelector(".sidebar").clientHeight,
        menuHeight = document.querySelector(".menu").clientHeight;

        document.querySelector(".menu").style.marginTop = (sidebarHeight/2) - (menuHeight/2) + "px";
        //center image captions
        let w = window.innerWidth;
        if (w > 768){
            if (document.querySelector(".process-caption")){
                document.querySelectorAll(".process-caption").forEach(function(elem){
                    elem.style.marginLeft = window.getComputedStyle(elem.previousElementSibling).marginLeft;
                }) 
            }
        }
    }
    //call position function on page load
    document.addEventListener('DOMContentLoaded', function(){
        positions();
    })
    //call position function on resize
    window.addEventListener('resize', function(){
        positions();
    })
})()