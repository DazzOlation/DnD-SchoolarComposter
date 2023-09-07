document.addEventListener('DOMContentLoaded', function () {
    const CARDS = 7;
    let points = 0;
    let elementos = [];

    async function generateCards() {
        while (elementos.length < CARDS) {
            const id = getRandomId(21);
            if (!elementos.some(elem => elem.id === id)) {
                await searchElementoId(id);
            }
        }
        updateDraggableElements();
    }

    function getRandomId(max) {
        return Math.floor(Math.random() * max) + 1;
    }

    let draggableElements = document.querySelector('.draggable-elements');
    

    async function searchElementoId(id) {
        const res = await fetch('./json/elementos.json');
        const data = await res.json();
        const elemento = data.objetos.find(obj => obj.id === id.toString());

        if (elemento && !elementos.some(elem => elem.id === elemento.id)) {
            elementos.push(elemento);
        }
    }

    function updateDraggableElements() {
        draggableElements.innerHTML = '';

      
    elementos.forEach(elem => {
        const element = createElementFromJSON(elem);
        draggableElements.appendChild(element);

        // Configura el evento dragstart en los elementos arrastrables
        element.addEventListener('dragstart', event => {
            event.dataTransfer.setData('text/plain', event.target.id);
        });

        // Asegúrate de que los elementos sean arrastrables
        element.draggable = true;
        
    });
        let objetos = document.querySelectorAll('.Objeto');
        objetos = [...objetos];
        objetos.forEach(obj => {
            obj.addEventListener('dragstart', event => {
                event.dataTransfer.setData('text/plain', event.target.id); 
            });
        });

        let tipo = document.querySelectorAll('.Espacio');
        tipo = [...tipo];

    
        let wrongMsg = document.querySelector('.wrong');

        tipo.forEach(tipoItem => {
            tipoItem.addEventListener('dragover', event => {
                event.preventDefault();
            });

            tipoItem.addEventListener('drop', event => {
                event.stopPropagation();
                const draggableElementId = event.dataTransfer.getData('text/plain'); 
                const draggedElement = elementos.find(elem => elem.imagen === draggableElementId); 

                console.log(draggableElementId, draggedElement)
                if (draggedElement && tipoItem.classList.contains(draggedElement.tipo)) {
                    wrongMsg.innerText = ' ';
                    event.target.appendChild(createElementFromJSON(draggedElement));
                    points = points + 1;
                    removeDraggedElement(draggedElement.id);                 
                    if (points === CARDS) {
                        draggableElements.innerHTML = `<p class="win">¡Ganaste! ¡Bien hecho!</p>
                                                            <button id="restart">Reiniciar</button>`;
                                                            document.getElementById('restart').addEventListener('click',()=>{
                                                                window.location.reload();
                                                            })
                    }
                } else {
                    wrongMsg.innerText = 'Vuelve a intentar!';
                }
            });
        });
    }

    function createElementFromJSON(jsonObj) {
        const div = document.createElement('div');
        div.classList.add('Objeto', jsonObj.tipo);
        div.id = jsonObj.id;
        div.removeEventListener('dragstart', null);
        div.removeEventListener('dragover', null);
        div.removeEventListener('drop', null)   
        div.innerHTML = `
            <img src="${jsonObj.imagen}" alt="${jsonObj.nombre}" class="image">
            <h3>${jsonObj.nombre}</h3>
        `;
    
        return div;
    }
    

    function removeDraggedElement(id) {
        const obj = document.getElementById(id);
        if (obj) {
            obj.remove();
        }
    }

    generateCards();
});
