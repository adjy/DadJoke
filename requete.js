(function() {
    let TABNAV = [];
    let CURRENT_TAB = 0;
    let NBJOKES = 0;
    let PREV;
    let NEXT;

    let display = undefined

    /**
     * Recherche de blagues.
     */
    function searchJoke(search) {
        console.log(search)
        let method = "GET"
        let url = "https://icanhazdadjoke.com/search" // url pour la recherche
        let request;
        // construction des paramètres
        if(search ===" ")
            request = "https://icanhazdadjoke.com/"
        else {

            search = encodeURIComponent(search)
            // let params = "?term=" + search + "&limit=5&page=1"

            let params = "?term=" + search;
            request = url + params
        }

        // exécution de la requête
        httpRequest.open(method, request) // ATTENTION : on a remplacé 'url' par 'request'
        httpRequest.setRequestHeader('Accept', 'application/json');
        httpRequest.send()
    }

    function createJoke(results,indice){
        let new_div = document.createElement('div')
        new_div.classList.add("joke") // ajoute la classe thumb
        new_div.innerHTML = results[indice].joke;
        display.append(new_div)
    }
    function createMotsCle(){
        let element = document.getElementById("entrer").value
        let new_div = document.createElement('div')
        new_div.classList.add("affichage") // ajoute la classe thumb
        new_div.innerHTML = "Mots clés : "+element;
        display.append(new_div)
    }
    function Boutton_activated(){
        for(let i of PREV.classList) {
            if (i === "disabled" && CURRENT_TAB !== 0)
                PREV.classList.remove("disabled");
        }
        for(let i of NEXT.classList)
            if(i === "disabled" && CURRENT_TAB !== (NBJOKES/5)-1)
                NEXT.classList.remove("disabled");

    }
    function Boutton_desactivated(){
       let n = 0;
        for(let i of PREV.classList)
            if(i === "disabled")
                n++;

        if( (CURRENT_TAB === 0 && n === 0) || (CURRENT_TAB === 0) )
            PREV.classList.add("disabled");


        n = 0;
        for(let i of NEXT.classList)
            if(i === "disabled")
                n++;

        if( (CURRENT_TAB === (NBJOKES/5)-1 && n ===0) || (CURRENT_TAB === 0) )
            NEXT.classList.add("disabled");
}
    function afficheJokes(results, indice){

        TABNAV[CURRENT_TAB].classList.toggle("active");

        display.innerHTML = "";

        CURRENT_TAB = indice;

        let acc = (CURRENT_TAB * 5 ) % NBJOKES;

        let j = 0;

        for(let i = acc; i<NBJOKES; i++) {
            if(j<5){
                createJoke(results,i)
                j++;
            }
        }
        Boutton_activated();
        Boutton_desactivated();
        TABNAV[CURRENT_TAB].classList.toggle("active");

    }

    function previous(results){
        PREV.addEventListener('click', function (){
            if(CURRENT_TAB - 1 >=0)
                afficheJokes(results, CURRENT_TAB - 1);

        })
    }

    function next(results){
        NEXT.addEventListener('click', function (){
            if (CURRENT_TAB + 1 < NBJOKES/5)
                afficheJokes(results, CURRENT_TAB + 1);
        })
    }

    let httpRequest = new XMLHttpRequest()
    httpRequest.responseType = "json"

    httpRequest.onreadystatechange = function () {

        if (httpRequest.readyState === XMLHttpRequest.DONE) {
            if (httpRequest.status === 200) {
                let results = httpRequest.response.results // la listes des blagues reçues
                let elements = document.getElementById("pag")

                display.innerHTML = "";
                elements.innerHTML= "";

                NBJOKES = results.length;

                if(NBJOKES > 0) {
                    pagination(NBJOKES / 5)
                    TABNAV[CURRENT_TAB].classList.toggle("active");

                    let j = 0;
                    for (let i = 0; i < NBJOKES; i++) {
                        if (j < 5) {
                            createJoke(results, i)
                            j++;
                        }

                    }
                    previous(results);

                    TABNAV.forEach((elm, indice) => {
                        elm.addEventListener('click', function () {
                            afficheJokes(results, indice)
                        })
                    })

                    next(results)
                    createMotsCle()
                }
                else{
                    let new_div = document.createElement('div')
                    new_div.classList.add("joke")
                    new_div.innerHTML ="Pas de résultat !" ;
                    display.append(new_div)
                }

            }
            else
                alert("Erreur")

        }
    }

    document.addEventListener('DOMContentLoaded', function () {
        display = document.querySelector("#jokes")

        let button = document.getElementById("b")
        button.addEventListener('click', function (){
            CURRENT_TAB = 0;
            let element = document.getElementById("entrer").value

            searchJoke(element)

        })

    })

    function createButtNav(classL, name){ // Creer les button de navigation
        let elements = document.getElementById("pag")
        let button = document.createElement('button')

        for( let i of classL )
            button.classList.add(i) // ajoute les classe

        button.innerHTML = name;

        elements.append(button)
        // Ajout dans ma liste les buttons des sections de navs sauf prev et next
        if( !(name === "prev") && !(name === "next"))
            TABNAV.push(button)
        if(name === "prev")
            PREV = button;
        if(name === "next")
            NEXT = button;
    }
    function pagination(nb){
        // prev bouton
        let classL = ["btn", "btn-outline-success", "disabled"];
        createButtNav(classL, "prev");

        for(let i = 0; i<nb; i++){
            classL = ["btn", "btn-outline-success"];
            createButtNav(classL, i+1);
        }
        createButtNav(classL, "next");

    }
})()