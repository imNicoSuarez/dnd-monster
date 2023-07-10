const LETRAS = ["A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","S","T","U","V","W", "Y","Z"]; 

document.addEventListener("DOMContentLoaded", function() {
    const creatureForm = document.getElementById("creatureForm");
    creatureForm.addEventListener("submit", addCreatures);
  
    loadDefaultCreatures();
    loadCreatures();
    loadCreatureOptions();
    createGrid();
    drawCreaturesOnGrid();
  });
  


  function loadDefaultCreatures() {
    fetch('creatures.json')
      .then(response => response.json())
      .then(data => {
        localStorage.setItem('defaultCreatures', JSON.stringify(data));
        console.log('Archivo creatures.json cargado con éxito');
      })
      .catch(error => {
        console.error('Error al cargar el archivo creatures.json:', error);
      });
  }
  
  function addCreatures(event) {
    event.preventDefault();
  
    const nameInput = document.getElementById("name");
    const healthInput = document.getElementById("health");
    const quantityInput = document.getElementById("quantity");
    const selectCreature = document.getElementById("selectCreature");
    const xCoordinateInput = document.getElementById("xCoordinate");
    const yCoordinateInput = document.getElementById("yCoordinate");

    const creature = {
        name: nameInput.value,
        health: parseInt(healthInput.value),
        xCoordinate: xCoordinateInput.value,
        yCoordinate: yCoordinateInput.value
    };
  
    const quantity = parseInt(quantityInput.value);
  
    let creatures = JSON.parse(localStorage.getItem("creatures")) || [];
  
    for (let i = 0; i < quantity; i++) {
      creatures.push(creature);
    }
  
    localStorage.setItem("creatures", JSON.stringify(creatures));
  
    nameInput.value = "";
    healthInput.value = "";
    quantityInput.value = "1";
    selectCreature.value = "";
    xCoordinateInput.value = "";
    yCoordinateInput.value = "";
  
    loadCreatures();
    drawCreaturesOnGrid();
  }
  
  
  function deleteCreature(index) {
    let creatures = JSON.parse(localStorage.getItem("creatures")) || [];
  
    if (index >= 0 && index < creatures.length) {
      creatures.splice(index, 1);
  
      localStorage.setItem("creatures", JSON.stringify(creatures));
      loadCreatures();
      drawCreaturesOnGrid();
    }
  }


  function createGrid() {
    const gridContainer = document.getElementById("grid");
    gridContainer.innerHTML = "";
  
    for (let row = 1; row <= 21; row++) {
      for (let col = 1; col <= 15; col++) {
        const gridCell = document.createElement("div");
        gridCell.classList.add("gridCell");
        gridCell.id = `cell-${row}-${LETRAS[col-1]}`;
        gridContainer.appendChild(gridCell);
      }
    }
  }


  function drawCreaturesOnGrid() {
    const gridContainer = document.getElementById("grid");
    const creatures = JSON.parse(localStorage.getItem("creatures")) || [];
  
    // Clear previous creature positions on the grid
    const gridCells = gridContainer.getElementsByClassName("gridCell");
    Array.from(gridCells).forEach(gridCell => {
      gridCell.textContent = "";
    });
  
    creatures.forEach(function(creature, index) {
      const { xCoordinate, yCoordinate } = creature;
      const cellId = `cell-${yCoordinate}-${xCoordinate}`;
      const gridCell = document.getElementById(cellId);
  
      if (gridCell) {
        const img = document.createElement("img");
        img.classList.add("creatureImageDraw");
        img.src = `/img/${creature.name.toLocaleLowerCase()}.png`;
        gridCell.appendChild(img);
      }
    });
  }

  
  function loadCreatureOptions() {
    const selectCreature = document.getElementById("selectCreature");
  
    let defaultCreatures = JSON.parse(localStorage.getItem("defaultCreatures")) || [];
  
    defaultCreatures.forEach(function(creature) {
      const option = document.createElement("option");
      option.value = creature.name;
      option.textContent = creature.name;
      selectCreature.appendChild(option);
    });
  
    selectCreature.addEventListener("change", function() {
      const selectedCreature = selectCreature.value;
      const selectedCreatureData = defaultCreatures.find(function(creature) {
        return creature.name === selectedCreature;
      });
  
      if (selectedCreatureData) {
        const nameInput = document.getElementById("name");
        const healthInput = document.getElementById("health");
  
        nameInput.value = selectedCreatureData.name;
        healthInput.value = selectedCreatureData.health;
      }
    });
  }

  function subtractCreatureHealth(index) {
    let creatures = JSON.parse(localStorage.getItem("creatures")) || [];
  
    if (index >= 0 && index < creatures.length) {
      const subtractHealthInput = document.getElementById(`subtractHealth-${index}`);
      const subtractedHealth = parseInt(subtractHealthInput.value);
  
      if (!isNaN(subtractedHealth) && subtractedHealth > 0) {
        creatures[index].health -= subtractedHealth;
        if (creatures[index].health < 0) {
          creatures[index].health = 0;
        }
  
        localStorage.setItem("creatures", JSON.stringify(creatures));
        loadCreatures();
      }
  
      subtractHealthInput.value = "";
    }
  }
  


  function updateCoordinates(index) {
    let creatures = JSON.parse(localStorage.getItem("creatures")) || [];
  
    if (index >= 0 && index < creatures.length) {
      const CoordenadasXInput = document.getElementById(`CoordenadasX-${index}`);
      const CoordenadasYInput = document.getElementById(`CoordenadasY-${index}`);
      const coordenadesXValue = CoordenadasXInput.value;
      const coordenadesYValue = CoordenadasYInput.value;
  
        creatures[index].xCoordinate = coordenadesXValue;
        creatures[index].yCoordinate = coordenadesYValue;
  
        localStorage.setItem("creatures", JSON.stringify(creatures));
        loadCreatures();
        drawCreaturesOnGrid();
      
  
        CoordenadasXInput.value = "";
        CoordenadasYInput.value = "";
    }
  }
  
  

  function loadCreatures() {
    const creatureList = document.getElementById("creatureList");
    creatureList.innerHTML = "";
  
    let creatures = JSON.parse(localStorage.getItem("creatures")) || [];
  
    creatures.forEach(function(creature, index) {
      const creatureItem = document.createElement("div");

      if (creature.health <= 0 ) {
        creatureItem.classList.add("creatureDead");
      } 
      creatureItem.classList.add("creatureItem");

      const img = document.createElement("img");
      img.classList.add("creatureImage");
      img.src = `/img/${creature.name.toLocaleLowerCase()}.png`
  
      const name = document.createElement("span");
      name.classList.add("creatureName");
      name.textContent = `Nombre: ${creature.name}`;
  
      const health = document.createElement("span");
      health.classList.add("creatureHealth");
      health.textContent = `Vidas: ${creature.health}`;

      const coordinates = document.createElement("span");
      coordinates.textContent = `Coordenadas:`

      const coordinatesX  = document.createElement("select");
      coordinatesX.classList.add("xCoordinate");

      for (let i = 65; i <= 79; i++) {
        const letra = String.fromCharCode(i);
        const option = document.createElement("option");
        option.value = letra;
        option.textContent = letra;
        coordinatesX.appendChild(option);
     }

      coordinatesX.value= creature.xCoordinate
      coordinatesX.id = `CoordenadasX-${index}`;


    
      const coordinatesY  = document.createElement("select");
      coordinatesY.classList.add("yCoordinate");

      for (let i = 1; i <= 21; i++) {
        const option = document.createElement("option");
        option.value = i;
        option.textContent = i;
        coordinatesY.appendChild(option);
      }
      coordinatesY.value= creature.yCoordinate
      coordinatesY.id = `CoordenadasY-${index}`;

      const coordinatesButton = document.createElement("button");
      coordinatesButton.textContent = "Actualizar";
      coordinatesButton.addEventListener("click", function() {
        updateCoordinates(index);
      });

  
      const subtractHealthInput = document.createElement("input");
      subtractHealthInput.classList.add("subtractHealth");
      subtractHealthInput.type = "number";
      subtractHealthInput.min = "0";
      subtractHealthInput.id = `subtractHealth-${index}`;
  
      const subtractButton = document.createElement("button");
      subtractButton.textContent = "Restar";
      subtractButton.addEventListener("click", function() {
        subtractCreatureHealth(index);
      });
  
      const deleteButton = document.createElement("button");
      deleteButton.classList.add("deleteButton");
      deleteButton.textContent = "Eliminar";
      deleteButton.addEventListener("click", function() {
        deleteCreature(index);
      });
  

      creatureItem.appendChild(img);
      creatureItem.appendChild(name);
      creatureItem.appendChild(health);
      creatureItem.appendChild(coordinates);
      creatureItem.appendChild(coordinatesX);
      creatureItem.appendChild(coordinatesY);
      creatureItem.appendChild(coordinatesButton);

      creatureItem.appendChild(subtractHealthInput);
      creatureItem.appendChild(subtractButton);
      creatureItem.appendChild(deleteButton);
  
      creatureList.appendChild(creatureItem);
    });
  }
  
