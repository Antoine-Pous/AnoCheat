// ==UserScript==
// @name          Geck'SpArrow - DVP I/O
// @author	      Antoine 'Gecko' Pous <gecko@dvp.io>
// @licence       BEER-WARE https://github.com/Antoine-Pous/AnoCheat/blob/master/LICENSE-BEER-WARE
// @namespace     http://dl.dvp.io/anocheat/GeckSPArrow.user.js
// @description   Ajoute des flèches qui facilitent l'accès visuel aux interventions sur le chat
// @include       http://chat.developpez.com/
// @version       2015.03.21.2
// @downloadURL   http://dl.dvp.io/anocheat/GeckSPArrow.user.js
// @updateURL     http://dl.dvp.io/anocheat/GeckSPArrow.user.js
// @website       http://www.dvp.io
// ==/UserScript==
 
var getGlobal = function(callback) {
  var script = document.createElement("script");
  script.type = "text/javascript";
  script.id = callback.name;
  script.textContent = "(" + callback.toString() + ")();";
  document.body.appendChild(script);
};
 
function GeckSpArrow() {
  
    $(document).ajaxComplete(function(event, xhr, settings) {
      
      var imgInc = {
        url:'http://media.dvp.io/anocheat/16x16_message_incoming.png',
        rot:0
      };
      var imgOut = {
        url:'http://media.dvp.io/anocheat/16x16_message_outgoing.png',
        rot:0
      };
      var imgInf = {
        url:'http://media.dvp.io/anocheat/16x16_message_noinfo.png',
        rot:0
      };
      
      if(settings.url == 'ajax.php') {
        
        var data = $.parseJSON(xhr.responseText);
        
        if(data.salon != ''){
          
          var selector = "#conversation0";
          var entry = data.salon.split('<br />');
          	  		 
        } else if(data.pvs != ''){
          // Pour les MP on affiche pas les flèches (comportement natif)
          return;
          var selector = '#conversation'.concat(data.pvs[0].id);
          var entries = data.pvs[0].html.split('<br />');
          
        } else {
          
          // Si on est pas en conv c'est une erreur on skip
          return;
          
        }
        
        /* On parcourt la liste des nouvelles entrées
         * Fix issue #6
         */ 
        $.each(entry, function(e) {
          
          /*
           * Si la ligne contient des images on retire le endslash des noeuds img
           * Fix issue #2
           */ 
          var imgRe = entry[e].match(/(<img.*?.*?>)/gi);
          if (imgRe instanceof Array) {
            var i = -1;
            while(imgRe[++i]) {
              var newImg = imgRe[i].replace(' />','>');
              entry[e] = entry[e].replace(imgRe[i], newImg);
            }
          }
          
          var conv = $(selector).html().toString();
          if (entry[e].match(/images\/fleche\.png/g)) {
            var ret = conv.replace('images/fleche.png',imgInc.url);
            $(selector).html(ret);
          } else {
              var imgOutNode = '<img src="' + imgOut.url + '" title="" alt="">';
              if ($(entry[e]).text().indexOf("[" + pseudo + "]:") === 0) {
                /* Ajout de l'attribut data-timer pour casser le match des messages identiques
                 * Fix issue #13
                 */
                var ret = conv.replace(entry[e], '<img src="'.concat(imgOut.url,'" title="" alt="">' + entry[e].replace('<span','<span data-timer="' + Date.now() + '"')));
                $(selector).html(ret);
              }
          }
          
        });
        
      }
     
    });
    
};
 
getGlobal(GeckSpArrow);
