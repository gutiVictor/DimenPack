let boxes = [];
let productos = [];

// Cargar productos desde el archivo JSON
fetch('productos.json')
    .then(response => response.json())
    .then(data => productos = data)
    .catch(error => console.error('Error al cargar productos.json:', error));

// Buscar dimensiones de la caja con el código
function fetchBoxDimensions() {
    const inputElement = document.getElementById('box-code');
    const boxCode = inputElement.value.toUpperCase();  // Convertir a mayúsculas
    
    inputElement.value = boxCode;  // Actualizar el input con mayúsculas
    
    // Buscar el producto en el archivo JSON
    const boxData = productos.find(product => product.codigo === boxCode);
    
    if (boxData) {
        document.getElementById('box-length').value = boxData.largo;
        document.getElementById('box-height').value = boxData.alto;
        document.getElementById('box-width').value = boxData.ancho;
        document.getElementById('box-package-type').value = boxData.tipo_empaque;
    } else {
        // Limpiar los campos si no se encuentra el código
        document.getElementById('box-length').value = '';
        document.getElementById('box-height').value = '';
        document.getElementById('box-width').value = '';
        document.getElementById('box-package-type').value = '';
    }
}

// Añadir una caja al arreglo 'boxes'
function addBox() {
    const boxLength = parseFloat(document.getElementById('box-length').value);
    const boxHeight = parseFloat(document.getElementById('box-height').value);
    const boxWidth = parseFloat(document.getElementById('box-width').value);
    const quantity = parseInt(document.getElementById('quantity').value);

    if ( boxLength> 0 && boxHeight > 0 && boxWidth > 0 && quantity > 0) {
        boxes.push({  length: boxLength, height: boxHeight,width: boxWidth , quantity: quantity });

        // Limpiar campos después de añadir
        document.getElementById('box-length').value = '';
        document.getElementById('box-height').value = '';
        document.getElementById('box-width').value = '';
        document.getElementById('quantity').value = '';

        displayBoxes();  // Mostrar cajas añadidas
    } else {
        alert('Por favor, ingresa dimensiones y cantidad válidas.');
    }
}

// Eliminar caja por índice
function removeBox(index) {
    boxes.splice(index, 1);
    displayBoxes();
}

// Mostrar cajas añadidas
function displayBoxes() {
    const resultDiv = document.getElementById('result');
    resultDiv.innerHTML = '';

    let totalVolume = 0;
    boxes.forEach((box, index) => {
        const boxVolume =  box.length * box.height *box.width ;
        const totalBoxVolume = boxVolume * box.quantity;
        totalVolume += totalBoxVolume;

        resultDiv.innerHTML += `
            <p>
                Caja ${index + 1}: ${box.quantity} cajas (${box.length}x${box.height}x${box.width} cm) - Volumen Total: ${totalBoxVolume.toFixed(2)} cm³
                <button type="button" onclick="removeBox(${index})">Eliminar</button>
            </p>
        `;
    });
}

// Seleccionar dimensiones de contenedor predefinido
function selectPredefinedContainer() {
    const containerSelect = document.getElementById('predefined-container');
    const containerLengthInput = document.getElementById('container-length');
    const containerHeightInput = document.getElementById('container-height');
    const containerWidthInput = document.getElementById('container-width');
    const manualInputSection = document.getElementById('manual-dimensions');

    if (containerSelect.value === "") {
        containerLengthInput.value = '';
        containerHeightInput.value = '';
        containerWidthInput.value = '';
        manualInputSection.style.display = 'block';  // Mostrar sección manual
        return;
    }

    // Dimensiones predefinidas
    let containerDimensions;
    switch (containerSelect.value) {
        case '1':
            containerDimensions = { length: 64, height: 38, width: 50 };
            break;
        case '2':
            containerDimensions = { length: 44, height: 23, width: 36 };
            break;
        case '3':
            containerDimensions = { length: 25, height: 17, width: 20 };
            break;
    }

    if (containerDimensions) {
        containerLengthInput.value = containerDimensions.length;
        containerHeightInput.value = containerDimensions.height;
        containerWidthInput.value = containerDimensions.width;
        manualInputSection.style.display = 'none';  // Ocultar entrada manual
    }
}

// Aplicar dimensiones manuales
function applyManualDimensions() {
    const containerLengthInput = document.getElementById('container-length');
    const containerHeightInput = document.getElementById('container-height');
    const containerWidthInput = document.getElementById('container-width');
    
    containerLengthInput.value = document.getElementById('manual-length').value;
    containerHeightInput.value = document.getElementById('manual-height').value;
    containerWidthInput.value = document.getElementById('manual-width').value;
    
    document.getElementById('manual-dimensions').style.display = 'none';  // Ocultar sección manual
}

// Calcular cantidad de contenedores necesarios
function calculate() {
    let containerLength = parseFloat(document.getElementById('container-length').value);
    let containerHeight = parseFloat(document.getElementById('container-height').value);
    let containerWidth = parseFloat(document.getElementById('container-width').value);

    if (containerWidth <= 0 || containerHeight <= 0 || containerLength <= 0) {
        alert('Por favor, ingrese dimensiones válidas para el contenedor.');
        return;
    }

    // Ajustar dimensiones interiores
    containerWidth -= 0.5; 
    containerHeight -= 0.5;
    containerLength -= 0.5;

    if (containerLength <= 0 || containerHeight <= 0 || containerWidth  <= 0) {
        alert('Las dimensiones interiores del contenedor deben ser mayores a cero después del ajuste.');
        return;
    }

    const containerVolumeInterior = containerLength * containerHeight * containerWidth;
    let totalBoxVolume = 0;

    boxes.forEach(box => {
        const boxVolume = box.length * box.height * box.width;
        totalBoxVolume += boxVolume * box.quantity;
    });

    const containersNeeded = Math.ceil(totalBoxVolume / containerVolumeInterior);
    const volumeUsed = containersNeeded * containerVolumeInterior;
    const volumeUnused = volumeUsed - totalBoxVolume;
    const percentageUsed = (totalBoxVolume / volumeUsed) * 100;

    // Detalles de cada caja
    const volumePerBoxType = boxes.reduce((acc, box) => acc + (box.length * box.height * box.width) * box.quantity, 0);
    const unusedSpace = containerVolumeInterior - totalBoxVolume;
    const efficiency = (totalBoxVolume / containerVolumeInterior) * 100;

    const resultDiv = document.getElementById('result');
    resultDiv.innerHTML = `
        <h2>Resultado del Cálculo</h2>
        <p><strong>Dimensiones Interiores del Contenedor:</strong> ${containerLength}x${containerHeight}x${containerWidth} cm</p>
        <p><strong>Volumen del Contenedor (Interior):</strong> ${containerVolumeInterior.toFixed(2)} cm³</p>
        <p><strong>Cantidad Total de Cajas:</strong> ${boxes.reduce((total, box) => total + box.quantity, 0)}</p>
        <p><strong>Cantidad de Contenedores Necesarios:</strong> ${containersNeeded}</p>
        <p><strong>Volumen Total Utilizado:</strong> ${totalBoxVolume.toFixed(2)} cm³</p>
        <p><strong>Volumen No Utilizado:</strong> ${volumeUnused.toFixed(2)} cm³</p>
        <p><strong>Porcentaje de Uso del Contenedor:</strong> ${percentageUsed.toFixed(2)}%</p>
        <h3>Detalles por Caja</h3>
    `;

    boxes.forEach((box, index) => {
        const boxVolume = box.length * box.height * box.width;
        const totalBoxVolume = boxVolume * box.quantity;
        resultDiv.innerHTML += `
            <p><strong>Caja ${index + 1}:</strong></p>
            <ul>
                <li><strong>Cantidad:</strong> ${box.quantity}</li>
                <li><strong>Dimensiones:</strong> ${box.length}x${box.height}x${box.width} cm</li>
                <li><strong>Volumen por Caja:</strong> ${boxVolume.toFixed(2)} cm³</li>
                <li><strong>Volumen Total (para todas las cajas de este tipo):</strong> ${totalBoxVolume.toFixed(2)} cm³</li>
            </ul>
        `;
    });

    resultDiv.innerHTML += `
        <h3>Información Adicional</h3>
        <p><strong>Volumen Total de Todas las Cajas:</strong> ${volumePerBoxType.toFixed(2)} cm³</p>
        <p><strong>Espacio No Utilizado en el Contenedor:</strong> ${unusedSpace.toFixed(2)} cm³</p>
        <p><strong>Eficiencia del Empaque:</strong> ${efficiency.toFixed(2)}%</p>
    `;

    drawContainerChart(percentageUsed);  // Dibujar gráfico
}

// Dibujar gráfico de uso del contenedor
function drawContainerChart(percentageUsed) {
    const ctx = document.getElementById('containerChart').getContext('2d');
    
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);  // Limpiar canvas

    new Chart(ctx, {
        type: 'pie',
        data: {
            labels: ['Usado', 'No Usado'],
            datasets: [{
                data: [percentageUsed, 100 - percentageUsed],
                backgroundColor: ['#36A2EB', '#FF6384'],
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: { position: 'top' },
                tooltip: {
                    callbacks: {
                        label: function(tooltipItem) {
                            return tooltipItem.label + ': ' + tooltipItem.raw.toFixed(2) + '%';
                        }
                    }
                }
            }
        }
    });
}
