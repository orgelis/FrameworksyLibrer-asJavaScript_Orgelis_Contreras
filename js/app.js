//Variables globales que cuentan puntuación, número de movimientos y clicks del botón iniciar
var puntuacion = 0;
var movimientos =0;
var clicks = 0;
var cambiarColorLetra = true;

//Evento para cambiar el color del título
$(function () {
setInterval(function () {
      cambiarColorLetra ? $(".main-titulo").css('color', 'red') : $(".main-titulo").css('color', 'yellow');
      cambiarColorLetra = !cambiarColorLetra;
  }, 500);
});
$('.btn-reinicio').click(function startTimer() {
//Temporizador//
  var timer = 120;
  var interval= setInterval(function () {
    minutes = parseInt(timer / 60, 10);
    seconds = parseInt(timer % 60, 10);
    minutes = minutes < 10 ? "0" + minutes : minutes;
    seconds = seconds < 10 ? "0" + seconds : seconds;
    $('#timer').text(minutes + ":" + seconds);
    if (--timer < 0) {
      $("body").trigger("finTiempo");
      clearInterval(interval);
      $('.main-titulo').stop();
      tiempoAcabo()
    }
  }, 1000);
  firstClickIniciar();
});
//Evento al presionar el botón iniciar,empezar y reiniciar un juego
function firstClickIniciar(){
  clicks++;
  if(clicks==1){
    $('.btn-reinicio').text('Reiniciar');
    llenarTodos();
    startTimer();
    postJugada();
  }else{
    location.reload();
  }
}
//Función que llena todas las casillas
function llenarTodos(){
  var columna;
  for (var i = 1; i <= 7; i++) {
    columna = ".col-"+i;
    fillElemento($(columna), 7);
  }
}
//Función que crea un nuevo elemento Dulce
//function fillElemento(columna, espacios){
  for (var i = 0; i < espacios; i++) {
    var elemento = document.createElement("img");
    $(elemento)
    .attr("src", randomSrc())
    .addClass("elemento")
    .draggable({
      grid: [120,90],
      revert: "valid"
    })
    .droppable({
      accept: ".elemento",
      drop: function(event, ui){
        var srcFrom = $(this).attr("src");
        var srcTo = $(ui.draggable).attr("src");
        $(this).attr("src", srcTo);
        $(ui.draggable).attr("src", srcFrom);
        window.setTimeout(postJugada, 500);
        sumarMovimiento();
      }
    })
    $(columna).prepend(elemento);
  }
}
//Función  que retorna una ruta de imágen aleatoria
function randomSrc(){
  var sources = ['./image/1.png', './image/2.png', './image/3.png', './image/4.png'];
  return sources[getRandomInt()]
}
//Función para obtener un número entero aleatorio a partir de un rango
function getRandomInt() {
  return Math.floor(Math.random() * 4);
}
//Función que se ejecuta una vez se termina una jugada
function postJugada(){
  checkMatch();
  window.setTimeout(eliminarElementos,2100);
  window.setTimeout(llenarDespuesTurno, 2200);
}
//Función que recorre todo el tablero verificando si hay match de 3 dulces o mas, horizontal y verticalmente
function checkMatch(){
  var elementoCompara;
  var actual;
  var matchIzquierda = false;
  var matchDerecha = false;
  var matchAbajo = false;
  var matchArriba = false;
  for (var col = 1; col <= 7; col++) {
    for (var row = 0; row < 7; row++) {
      matchArriba=matchAbajo=matchDerecha=matchIzquierda=false;
      actual = $(".col-"+col).find("img")[row]
      //Verficacion a la Izquierda
      if($(".col-"+(col-1)).length > 0){ //Verifica si existe elemento a la izquierda
        elementoCompara = $(".col-"+(col-1)).find("img")[row]
        if (checkSrc(actual, elementoCompara)) {
          matchIzquierda = true;
          if($(".col-"+(col-2)).length > 0){ //Verifica si existen dos columnas a la izquierda
            elementoCompara = $(".col-"+(col-2)).find("img")[row]
            if(checkSrc(actual, elementoCompara)){
              punto(actual, $(".col-"+(col-1)).find("img")[row], elementoCompara )

            }
          }
        }
      }
      //Verificacion a la Derecha
      if($(".col-"+(col+1)).length > 0){ //Verifica si existe elemento a la izquierda
        elementoCompara = $(".col-"+(col+1)).find("img")[row]
        if (checkSrc(actual, elementoCompara)) {
          matchDerecha = true;
          if($(".col-"+(col+2)).length > 0){ //Verifica si existen dos columnas a la izquierda
            elementoCompara = $(".col-"+(col+2)).find("img")[row]
            if(checkSrc(actual, elementoCompara)){
              punto(actual, $(".col-"+(col+1)).find("img")[row], elementoCompara )

            }
          }
        }
      }
      //Verificacion ambos izquierda y Derecha
      if (matchIzquierda == true && matchDerecha == true) {
        punto(actual, $(".col-"+(col-1)).find("img")[row], $(".col-"+(col+1)).find("img")[row])
      }
      //Verificación hacia arriba
      if($(".col-"+col).find("img")[row-1]){ //Verifica si existe elemento arriba
        elementoCompara = $(".col-"+col).find("img")[row-1]
        if (checkSrc(actual, elementoCompara)) {
          matchArriba = true;
          if($(".col-"+col).find("img")[row-2]){ //Verifica si existen dos filas hacia arriba
            elementoCompara = $(".col-"+col).find("img")[row-2]
            if(checkSrc(actual, elementoCompara)){
              punto(actual, $(".col-"+col).find("img")[row-1], elementoCompara)
            }
          }
        }
      }
      //Verificacion hacia abajo
      if($(".col-"+col).find("img")[row+1]){ //Verifica si existe elemento abajo
        elementoCompara = $(".col-"+col).find("img")[row+1]
        if (checkSrc(actual, elementoCompara)) {
          matchAbajo = true;
          if($(".col-"+col).find("img")[row+2]){ //Verifica si existen dos filas hacia abajo
            elementoCompara = $(".col-"+col).find("img")[row+2]
            if(checkSrc(actual, elementoCompara)){
              punto(actual, $(".col-"+col).find("img")[row+1], elementoCompara)
            }
          }
        }
      }
      //Verificacion ambos Arriba y Abajo
      if (matchArriba == true && matchAbajo == true) {
        punto(actual, $(".col-"+col).find("img")[row+1], $(".col-"+col).find("img")[row-1])
      }
    }
  }
}
//Función que compara si dos elementos Dulce son iguales
function checkSrc(elemento1, elemento2){
  if ($(elemento1).attr("src")==$(elemento2).attr("src")) {
    return true;
  }else return false;
}
//Función que adiciona los puntos y esconde los elementos en línea
function punto(elemento1, elemento2, elemento3){
  puntuacion= puntuacion + 10;
  $("#score-text").text(puntuacion);
  $(elemento1).hide('pulsate', 2000)
  $(elemento2).hide('pulsate', 2000)
  $(elemento3).hide('pulsate', 2000)
}
//Función que elimina los elementos escondidos de la estructura del DOM
function eliminarElementos(){
  $("img:hidden").each(function(index){
    $(this).remove()
  })
}
//Función que llena cada columna con los elementos faltantes
function llenarDespuesTurno(){
  var numeroElementos = numeroFalta = 0;
  for (var i = 1; i <= 7; i++) {
    numeroElementos=$(".col-"+i).find("img").length;
    numeroFalta = 7 - numeroElementos;
    fillElemento($(".col-"+i), numeroFalta);
  }
  window.setTimeout(postJugada, 500)
}
//Función que suma los movimientos del jugador
function sumarMovimiento(){
  movimientos++;
  $('#movimientos-text').text(movimientos);
}
//Evento que reorganiza la página al acabarse el tiempo.
function tiempoAcabo(){
  $('.panel-tablero').hide(900);
  $('.panel-score')
  .animate({
    width: '100%'
  }, 1000, function(){
    $(this).prepend("<h2 class='titulo-over'>Juego Terminado</h2>")
  })
  $('.time').hide(500)
  $('#score-text').hide()
  $('.score').append("<span class='data-info' id='score-final'>"+puntuacion+"</span>")
}
