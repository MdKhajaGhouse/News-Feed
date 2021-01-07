async function fetchNewsFeed(article){
    try{
        var d = await fetch(`https://api.rss2json.com/v1/api.json?rss_url=${article}`);
        d = await d.json();
        return d;
    }catch(err){
        return null;
    }
}

function createCard(artcl,k,i){
    var cwc = document.getElementById(`crslitm${k}_${i}`);
    var crd = document.createElement("div");
    crd.className = "card";
    var imge = document.createElement("img");
    imge.className = "card-img-top";
    imge.src = artcl.items[i].enclosure.link;
    var crdbdy = document.createElement("div");
    crdbdy.className = "card-body";
    var a = document.createElement("a");
    a.href = artcl.items[i].link;
    var ttl = document.createElement("h5");
    ttl.className = "card-title";
    ttl.innerHTML = artcl.items[i].title;
    a.appendChild(ttl);
    var sbttl = document.createElement("h6");
    sbttl.className = "card-subtitle mb-2 text-muted";
    var dte = new Date(artcl.items[i].pubDate);
    var d = dte.toLocaleDateString("en-IN");
    sbttl.innerHTML = `${artcl.items[i].author} &#9679 ${d}`;
    var crdtxt = document.createElement("p");
    crdtxt.className = "card-text";
    crdtxt.innerHTML = artcl.items[i].content;
    crdbdy.appendChild(a);
    crdbdy.appendChild(sbttl);
    crdbdy.appendChild(crdtxt);
    crd.appendChild(imge);
    crd.appendChild(crdbdy); 
    cwc.appendChild(crd);
}

function createCarousel(ar,k){
    var acw = document.getElementById(`accbdy${k}`);
    var crsl = document.createElement("div");
    crsl.className = "carousel slide";
    crsl.id = `carouselControl${k}`;
    var crslin = document.createElement("div");
    crslin.className = "carousel-inner mx-auto";
    for (var i=0;i<ar.items.length;i++){
        var crslitm = document.createElement("div");
        if (i==0){
            crslitm.className = "carousel-item active";
        }else{
            crslitm.className = "carousel-item";
        }
        crslitm.id = `crslitm${k}_${i}`;
        crslin.appendChild(crslitm);
    }
    crsl.appendChild(crslin)
    var pn = ["prev","next"];
    for(var j=0;j<2;j++){
        var pnicn = document.createElement("a");
        pnicn.className = `carousel-control-${pn[j]}`;
        pnicn.href = `#carouselControl${k}`;
        pnicn.setAttribute("role","button");
        pnicn.setAttribute("data-slide",`${pn[j]}`)
        var rec = document.createElement("div");
        rec.className = "rectangleB";
        var icn = document.createElement("span");
        if (pn[j] == "prev"){
            icn.className = "fa fa-chevron-left";  
        }else{
            icn.className = "fa fa-chevron-right";
        }
        rec.appendChild(icn);
        pnicn.appendChild(rec);
        crsl.appendChild(pnicn);
    };
    acw.appendChild(crsl);
}

function createAcc(categories){
    var cntnt = document.getElementById("data");
    var acc = document.createElement("div");
    acc.id = "accordion";
    for(var i=0;i<3;i++){
        var accitm = document.createElement("div");
        accitm.className = "card";
        accitm.style.border = "hidden";
        var acchdr = document.createElement("div");
        acchdr.className = "card-header bg-white";
        acchdr.id = `heading${i}`;
        acchdr.style.border = "hidden";
        var accbtn = document.createElement("button");
        accbtn.setAttribute("data-toggle","collapse");
        accbtn.setAttribute("data-target",`#collapse${i}`);
        accbtn.setAttribute("aria-controls",`collapse${i}`);
        var accicn = document.createElement("span");
        if(i==0){
            accbtn.className = "btn pl-0";
            accbtn.setAttribute("aria-expanded","true");
            accicn.className = "fa fa-chevron-up";     
        }else{
            accbtn.className = "btn pl-0 collapsed";
            accbtn.setAttribute("aria-expanded","false");
            accicn.className = "fa fa-chevron-down";
        }
              
        var accnme = document.createElement("span");
        accnme.className="pl-2";
        accnme.id = `category${i}`
        accnme.innerHTML = categories[i];
        accbtn.appendChild(accicn);
        accbtn.appendChild(accnme);  
        acchdr.appendChild(accbtn);
        accitm.appendChild(acchdr);
        var accbd = document.createElement("div");
        accbd.id = `collapse${i}`;
        if(i==0){
            accbd.className = "collapse show";
        }else{
            accbd.className = "collapse";
        }
        accbd.setAttribute("aria-labelledby",`heading${i}`);
        accbd.setAttribute("data-parent","#accordion");
        var accbdy = document.createElement("div");
        accbdy.className = "card-body";
        accbdy.id  = `accbdy${i}`;
        accbd.appendChild(accbdy);
        accitm.appendChild(accbd);
        acc.appendChild(accitm);
    } 
    cntnt.appendChild(acc); 
}

async function addToDOM(){
    var data = [];
    var categories = [];
    for (var i=0;i<magazines.length;i++){
        var arc = await fetchNewsFeed(magazines[i]);
        data.push(arc);
        categories.push(arc.feed.title);
    }
    createAcc(categories);
    for (var k=0;k<magazines.length;k++){
        createCarousel(data[k],k);
        for(var i=0;i<data[k].items.length;i++){
            createCard(data[k],k,i);
        }
    }
    function toggleChevron(e) {
        $(e.target)
          .prev('.card-header')
          .find("span.fa")
          .toggleClass('fa-chevron-down fa-chevron-up');
      }
      
    $('#accordion').on('hide.bs.collapse', toggleChevron);
    $('#accordion').on('show.bs.collapse', toggleChevron);

    $('.carousel').carousel({
        interval:false,       
        wrap:false 
    });
}
addToDOM();
