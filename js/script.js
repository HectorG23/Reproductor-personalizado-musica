const wrapper = document.querySelector(".wrapper"),
imgCancion= wrapper.querySelector(".img-area img"),
nombreCancion= wrapper.querySelector(".song-details .name"),
artistaCancion= wrapper.querySelector(".song-details .artist"),
cancion= wrapper.querySelector("#main-audio"),
pausarReaunBtn= wrapper.querySelector(".play-pause"),
prevBtn= wrapper.querySelector("#prev"),
siguienteBtn= wrapper.querySelector("#siguiente"),
areaProgreso= wrapper.querySelector(".progress-area"),
barraProgreso= wrapper.querySelector(".progress-bar"),
listaMusica= wrapper.querySelector(".music-list"),
masMusica= wrapper.querySelector("#mas-musica"),
OcultarMasMusica= listaMusica.querySelector("#cerrar");

let musicIndex = 1;

window.addEventListener("load", ()=>{
    cargarMusica(musicIndex);
})

function cargarMusica(indexNumb){
    nombreCancion.innerText = musicaToda[indexNumb-1].name;
    artistaCancion.innerText = musicaToda[indexNumb-1].artist;
    imgCancion.src = `${musicaToda[indexNumb-1].img}`;
    cancion.src = `${musicaToda[indexNumb-1].src}`;
}

function musicaReanudada(){
    wrapper.classList.add("paused");
    pausarReaunBtn.querySelector("i").innerText = "pause";
    cancion.play();
}

function musicaPausada(){
    wrapper.classList.remove("paused");
    pausarReaunBtn.querySelector("i").innerText = "play_arrow";
    cancion.pause();
}

function siguienteCancion(){
    musicIndex++;
    musicIndex > musicaToda.length ? musicIndex = 1 : musicIndex = musicIndex;
    cargarMusica(musicIndex);
    musicaReanudada();
}
function cancionPrev(){
    musicIndex--;
    musicIndex < 1 ? musicIndex = musicaToda.length :  musicIndex = musicIndex;
    cargarMusica(musicIndex);
    musicaReanudada();
}

pausarReaunBtn.addEventListener("click", ()=>{
    const pausarMusica = wrapper.classList.contains("paused");
    pausarMusica ? musicaPausada() : musicaReanudada();
});
siguienteBtn.addEventListener("click", ()=>{
    siguienteCancion()
})
prevBtn.addEventListener("click", ()=>{
    cancionPrev()
})

cancion.addEventListener("timeupdate", (e)=>{
    const tiempoActual = e.target.currentTime;
    const duracion = e.target.duration;
    let anchorProgress= (tiempoActual / duracion)*100;
    barraProgreso.style.width = `${anchorProgress}%`;

    let tiempoActCancion= wrapper.querySelector(".current"),
    duracionCancion= wrapper.querySelector(".duration");

    cancion.addEventListener("loadeddata", ()=>{

        let duracionAudio = cancion.duration;
        let totalminutos = Math.floor(duracionAudio / 60);
        let totalSegundos = Math.floor(duracionAudio % 60);
        if(totalSegundos < 10){
            totalSegundos = `0${totalSegundos}`;
        }
        duracionCancion.innerText = `${totalminutos}:${totalSegundos}`;

    });

    let minutosActuales= Math.floor(tiempoActual / 60);
        let segundosActuales = Math.floor(tiempoActual % 60);
        if(segundosActuales < 10){
            segundosActuales = `0${segundosActuales}`;
        }
        tiempoActCancion.innerText = `${minutosActuales}:${segundosActuales}`;
});

areaProgreso.addEventListener("click", (e)=>{
    let valorAnchorBarra=areaProgreso.clientWidth;
    let clickedOffSetX= e.offsetX;
    let duracionCancion = cancion.duration;
    
    cancion.currentTime = (clickedOffSetX / valorAnchorBarra) * duracionCancion;
    musicaReanudada();
});

const repetirBtn = wrapper.querySelector("#repetir-playlist");
repetirBtn.addEventListener("click", ()=>{
    let obtenerTexto= repetirBtn.innerText;
    switch(obtenerTexto){
        case "repeat":
            repetirBtn.innerText = "repeat_one";
            repetirBtn.setAttribute("title", "Song looped");
            break;
        case "repeat_one":
            repetirBtn.innerText = "shuffle";
            repetirBtn.setAttribute("title", "Playback shuffle");
            break;
        case "shuffle":
            repetirBtn.innerText = "repeat";
            repetirBtn.setAttribute("title", "Playlist looped");
            break;
    }
});

cancion.addEventListener("ended", ()=>{

    let obtenerTexto= repetirBtn.innerText;
    switch(obtenerTexto){
        case "repeat":
            siguienteCancion();
            break;
        case "repeat_one":
            cancion.currentTime = 0;
            cargarMusica(musicIndex);
            musicaReanudada();
            break;
        case "shuffle":
            let aleatorioIndex = Math.floor((Math.random() * musicaToda.length) + 1);
            do{
                aleatorioIndex = Math.floor((Math.random() * musicaToda.length) + 1);
            }while(musicIndex == aleatorioIndex);
            musicIndex = aleatorioIndex;
            cargarMusica(musicIndex);
            musicaReanudada();
            break;
    }   
});

masMusica.addEventListener("click", ()=>{
    listaMusica.classList.toggle("show");
});
OcultarMasMusica.addEventListener("click", ()=>{
    masMusica.click();
});
const ulTag = wrapper.querySelector("ul");

for (let i = 0; i < musicaToda.length; i++) {
    let liTag = `<li li-index="${i}">
                    <div class="row">
                        <span>${musicaToda[i].name}</span>
                        <p>${musicaToda[i].artist}</p>
                    </div>
                    <audio class="${musicaToda[i].src}" src="${musicaToda[i].src}"></audio>
                    <span id="duration-${i}" class="audio-duration">4:00</span>
                </li>`;
    ulTag.insertAdjacentHTML("beforeend", liTag);

    let liAudioDuration = ulTag.querySelector(`#duration-${i}`);
    let liAudioTag = ulTag.querySelector(`audio[src="${musicaToda[i].src}"]`);

    liAudioTag.addEventListener("loadeddata", () => {
        let duracionAudio = liAudioTag.duration;
        let totalminutos = Math.floor(duracionAudio / 60);
        let totalSegundos = Math.floor(duracionAudio % 60);
        if (totalSegundos < 10) {
            totalSegundos = `0${totalSegundos}`;
        }
        liAudioDuration.innerText = `${totalminutos}:${totalSegundos}`;
    });
}

const allLiTags = ulTag.querySelectorAll("li");
for (let j = 0; j < allLiTags.length; j++){
    if(allLiTags[j].getAttribute("li-index") == musicIndex){
        allLiTags[j].classList.add("playing");
    }
    allLiTags[j].setAttribute("onclick", "clicked(this)");
}

function clicked(element){
    let getLiIndex = element.getAttribute("li-index");
    musicIndex = getLiIndex;
    cargarMusica(musicIndex);
    musicaReanudada();
    ulTag.querySelector(".playing").classList.remove("playing");
    element.classList.add("playing");
}