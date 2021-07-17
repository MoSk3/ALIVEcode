/*$(document).ready(() => {
    $('.activity-tab').click(function() {
        const data = {'csrfmiddlewaretoken': csrftoken}
        const url = $(this).attr("href")
        console.log(url)
        $.ajax({
            type: "POST",
            url,
            data,
            success : function(data) {
                $('#activity-container').html(data)
                //$('.row.replace').html(data);
            }  
        });

         /*
        const request = new Request(
            url,
            { headers: { 'X-CSRFToken': csrftoken } }
        );
        fetch(request, {
            method: 'POST',
            mode: 'same-origin',  // Do not send CSRF token to another domain.
        }).then(function (response) {
            // RESPONSE
            if (response.status === 200) {
                console.log(response)
                console.log(response.blob)
                console.log(response.text)
                return response
            }
        }).then(response => {
            console.log(response)
        });*/
    //})
//})*/


// TODO Mettre icône à côté des sections/activités dépendamment de leur state
/**
 * states pour sections:
 *  -> vérouillé : cadenas barré 🔒
 *  -> dévérouillé : cadenas ouvert 🔓
 *  -> complété toutes les activités obligatoires (de la section) : crochet ✔
 *  -> complété toutes les activités (de la section) : étoile ⭐
 * 
 * states pour activités:
 *  -> vérouillé : cadenas barré 🔒
 *  -> dévérouillé : cadenas ouvert 🔓
 *  -> entamé : point jaune 🟡
 *  -> complété : point vert 🟢
 *  -> optionnel : italique
 */


/**
 * tu cliques sur une section:
 *  -> elle est barrée:
 *      -> animation qui shake la boite de la section
 *  -> elle est dévérouillée
 */
