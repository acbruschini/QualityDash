
class Producto {
    
    constructor(id,codigo,seccion,nombre,precio,descripcion,tags)
    {
        if(this.constructor == Producto)
        {
            throw new Error("Producto es una clase abstracta y no puede ser instanciada")
        }
        this.id = parseInt(id);
        this.nombre = nombre;
        this.precio = Number(precio);
        this.descripcion = descripcion;
        this.tags = tags;
        this.codigo = codigo;
        this.seccion = seccion;
    }

    static isPrecio(value){
        // VALIDO ESTO, PERO DESPUES VOY A AGREGAR MAS
        let retorno = Number(value);
        if(isNaN(retorno) || retorno == 0)
        {
            return false;
        }
        return retorno;
    }
    
    getArrayTags() {
        return this.tags.split("|");
    }
    
    getTipoDeProducto() {
        return this.constructor.name;
    }

    getTipoDeProductoPrefijo(){
        let tipoResumido;
        switch (this.getTipoDeProducto()) {
            case "Remera":
                tipoResumido = "re";
                break;
            case "Buzo":
                tipoResumido = "bu";
                    
                break;            
            case "Marco":
                tipoResumido = "mc";
                break;       
            default:
                break;
        }
        return tipoResumido;
    }

    getCodigoConTipo () { 
        return this.getTipoDeProductoPrefijo() + "_" + this.codigo;
        //return this.getTipoDeProductoPrefijo() + this.codigo;
    }

    static getArrayPositionById(arrayProductos,id){
        let i = 0;
        let retorno = false;
        arrayProductos.forEach((e) => {
            if(e.id == id) {
                retorno = i;
            }
            i++
        })
        return retorno;
    }

}

class Remera extends Producto{
    
    static coloresPermitidosRemeras = ["Rojo","Negro","Azul","Blanco","Verde","Amarillo","Marron","Gris"];
    static pesoProductoKg = 0.320;
    static longitudCajaCms = 22;
    static anchoCajaCms = 30;
    static altoCajaCms = 2;
    static direccionImgWooCommerce = "http://qualityserver.ddns.net:50001/img_tienda/ftp_re/"; 
    //static direccionImgWooCommerce = "https://www.qualityartworks.com.ar/wp-content/uploads/re/";

    constructor(id,codigo,seccion,nombre,precio,descripcion,colorPrincipal,tags,imagenPrincipal,imagenesSecundarias){
        super(id,codigo,seccion,nombre,precio,descripcion,tags);
        if(this.esColorPrincipalValido(colorPrincipal)){
            this.colorPrincipal = colorPrincipal;
        }

        this.imagenPrincipal = imagenPrincipal;
        this.imagenesSecundarias = imagenesSecundarias;

    }
    
    getArrayImagenesSecundarias() {
        return this.imagenesSecundarias.split("|");
    }

    getArrayImagenesEstampa(){
        let tempArray = [this.codigo+this.getTipoDeProductoPrefijo()+"_"+this.colorPrincipal.toLowerCase()+"_estampa.jpg"];

        Remera.coloresPermitidosRemeras.forEach(color => {
            color != this.colorPrincipal ? tempArray.push(this.codigo+this.getTipoDeProductoPrefijo()+"_"+color.toLowerCase()+"_estampa.jpg") : null;
        })

        return tempArray;
    }

    getArrayImagenes() {
        const tempArray = [this.imagenPrincipal];
        return tempArray.concat(this.imagenesSecundarias.split("|"));
    }

    getArrayImagenesCompleto(){
        const imagenesEstampaArray = this.getArrayImagenesEstampa();
        imagenesEstampaArray.splice(0,1);
        const imagenes = [this.imagenPrincipal,this.getArrayImagenesEstampa()[0],...this.getArrayImagenesSecundarias(),...imagenesEstampaArray];
        return imagenes;
    }

    esColorPrincipalValido(color){
        return Remera.coloresPermitidosRemeras.includes(color);
    }
    
    static esTalleValido(talle,corte){
        let retorno = false;
        const cortesPermitidos = ["M","F","N"]; //Masculino, Femenino, Niños
        const tallesPermitidosM = ["S","M","L","XL","XXL"];
        const tallesPermitidosF = ["S","M","L"];
        const tallesPermitidosN = ["6","8","10","12","14","16"];
        if(cortesPermitidos.includes(corte.toUpperCase())){
            switch (corte) {
                case "M":
                    if (tallesPermitidosM.includes(talle.toUpperCase()))
                    {
                        retorno = true;
                    }
                    break;
                    case "F":
                        if (tallesPermitidosF.includes(talle.toUpperCase()))
                        {
                            retorno = true;
                        }
                        break;
                case "N":
                    if (tallesPermitidosN.includes(talle.toUpperCase()))
                    {
                        retorno = true;
                    }
                    break;
                }
            } 
            return retorno;
    }

    static arrayDeObjetosRemeras(arrayRemeras) {
        const arrayReturn = new Array();
        arrayRemeras.forEach(element => {
            
            arrayReturn.push(new Remera(element.id,element.codigo,element.seccion,element.titulo,element.precio,element.texto,element.color_principal,element.tags,element.imagen_tienda,element.galeria_tienda))
            
        });
        return arrayReturn;
    }

    static isPesoProducto(value){
        // VALIDO ESTO, PERO DESPUES VOY A AGREGAR MAS
        let retorno = Number(value);
        if(isNaN(retorno) || retorno == 0)
        {
            return false;
        }
        return retorno;      
    }
    static isMedidaCaja(value){
        // VALIDO ESTO, PERO DESPUES VOY A AGREGAR MAS
        let retorno = Number(value);
        if(isNaN(retorno) || retorno == 0)
        {
            return false;
        }
        return retorno;
    }

    getLineaCsv (){
        let separador = "|"
        let descripcionWooCommerce = "\"[block id=\"\"descripcion-remera\"\"]\"";
        let categoriaWooCommerce= "Remeras 100% Velvet Cotton|";

        let imagenesConcat = "";
        let i = 0;

        this.getArrayImagenesCompleto().forEach(elemento => {         
            (i == 0) ? imagenesConcat += Remera.direccionImgWooCommerce+elemento : imagenesConcat += separador+Remera.direccionImgWooCommerce+elemento;
            i++;
        })

        return `${this.id};${this.getTipoDeProductoPrefijo()};${this.getTipoDeProductoPrefijo() + this.codigo};${this.nombre};${descripcionWooCommerce};${this.descripcion};${categoriaWooCommerce+this.seccion};${this.precio};${imagenesConcat};${this.tags};${Remera.pesoProductoKg};${Remera.longitudCajaCms};${Remera.anchoCajaCms};${Remera.altoCajaCms}`;
        //return `${this.id};${this.getTipoDeProductoPrefijo()};${this.getTipoDeProductoPrefijo() + this.codigo};${this.nombre};${descripcionWooCommerce};${this.descripcion};${categoriaWooCommerce+this.seccion};${this.precio};${imagenesConcat};${this.tags};${this.pesoProductoKg};${this.longitudCajaCms};${this.anchoCajaCms};${this.altoCajaCms}`;
    }

}
    
class ExportRemeras {

    static classNameTable = "mainContent-main-productsTable";
    static classNameLine = "productLine";
    static classNameId = "id";
    static classNameMainImg = "mainImg";
    static classNameSku = "sku";
    static classNameTitle = "title";
    static classNameDescription = "description";
    static classNamePrice = "price";
    static classNameImages = "images";
    static classNameTags = "tags";
    static classNameCheckbox = "checkbox";

    static classNameChecked = "producto";
    static classNameCheckedToExport = "productoAExportar";

    static createExportTable(arrayRemeras,checkedSelectorName){  
        if(arrayRemeras == null || arrayRemeras.length == 0)
        {
            let $message = document.createElement("h3");
            $message.innerText = "No existen productos para mostrar.";
            console.log($message);
            return $message;
        }
        let $table = document.createElement("div");
        $table.setAttribute("class",this.classNameTable);
        let i=0;
        arrayRemeras.forEach(element => {
            let line = document.createElement("div");
            line.setAttribute("class",`${this.classNameTable}-${this.classNameLine}`);

            let direccionCompleta = Remera.direccionImgWooCommerce + element.getCodigoConTipo() + "/";
            const imagenes = element.getArrayImagenesCompleto();
            const arrayTags = element.getArrayTags();
            
            line.innerHTML += `<p class="${this.classNameTable}-${this.classNameLine}--${this.classNameId}">${element.id}</p>`;
            line.innerHTML += `<div class="${this.classNameTable}-${this.classNameLine}--${this.classNameMainImg}">
                                    <img src="${direccionCompleta}${imagenes[0]}" alt="">
                                </div>`
            line.innerHTML += `<p class="${this.classNameTable}-${this.classNameLine}--${this.classNameSku}">${element.codigo}</p>`;
            line.innerHTML += `<p class="${this.classNameTable}-${this.classNameLine}--${this.classNameTitle}">${element.nombre}</p>`;
            line.innerHTML += `<p class="${this.classNameTable}-${this.classNameLine}--${this.classNameDescription}">${element.descripcion}</p>`;
            line.innerHTML += `<p class="${this.classNameTable}-${this.classNameLine}--${this.classNamePrice}">${element.precio}</p>`;
            
            let divImg = document.createElement("div");
            divImg.setAttribute("class",`${this.classNameTable}-${this.classNameLine}--${this.classNameImages}`);

            imagenes.splice(0,1);
            imagenes.forEach(imgs => {
                divImg.innerHTML += `<img src="${direccionCompleta}${imgs}" alt="">`;
            });

            line.appendChild(divImg);
            let tagsConEspacio = "";
            arrayTags.forEach(tag => {
                tagsConEspacio += " " + tag;
            });

            line.innerHTML += `<p class="${this.classNameTable}-${this.classNameLine}--${this.classNameTags}">${tagsConEspacio}</p>`;
            line.innerHTML += `<div class="${this.classNameTable}-${this.classNameLine}--${this.classNameCheckbox} "><input class="${checkedSelectorName}" type="checkbox" value="${element.id}" name="${i}" id="${element.id}"></div>`;
            $table.appendChild(line);
            i++;
        });
               
        return $table;
    }

    static setProductosAExportarArray(arrayProductos,arrayProductosAExportar,querry){
        let idsAborrar = querry;
        const deletePositions = [];
        idsAborrar.forEach(element => {
            if(element.checked) {
                arrayProductosAExportar.push(arrayProductos[parseInt(element.name)]);
                deletePositions.push(element.name);
            }
        })
        console.log(deletePositions);
        // RECORRO EL ARRAY DE ATRAS HACIA ADELANTE PARA PODER BORRAR SOBRE EL MISMO ARRAY QUE ITERO
        for (let index = deletePositions.length -1; index >= 0; index--) {
            console.log(deletePositions[index]);
            arrayProductos.splice(deletePositions[index],1);
        }
    }

    static updateTables(tableProductsContainer,tableProductsToExportContainer,arrayProducts,arrayProductsToExport){
        while (tableProductsContainer.firstChild) {
            tableProductsContainer.removeChild(tableProductsContainer.firstChild);
        }
        while (tableProductsToExportContainer.firstChild) {
            tableProductsToExportContainer.removeChild(tableProductsToExportContainer.firstChild);
        }
        tableProductsContainer.appendChild(ExportRemeras.createExportTable(arrayProducts,ExportRemeras.classNameChecked));
        tableProductsToExportContainer.appendChild(ExportRemeras.createExportTable(arrayProductsToExport,ExportRemeras.classNameCheckedToExport));
    }
    
    static renderView(arrayJson,arrayProductos){

        arrayProductos = Remera.arrayDeObjetosRemeras(arrayJson); // ARRAY DE PRODUCTOS

        ExportRemeras.updateTables($tableContainer,$tableProductosAExportar,arrayProductos,arrayProductosAExportar);
 
        $boton.onclick = () => {
            ExportRemeras.setProductosAExportarArray(arrayProductos,arrayProductosAExportar,document.querySelectorAll(`.${ExportRemeras.classNameChecked}`));
            ExportRemeras.updateTables($tableContainer,$tableProductosAExportar,arrayProductos,arrayProductosAExportar);
            ExportRemeras.refreshUI();
        }
        
        $botonRemoveProducts.onclick = () => {
            ExportRemeras.setProductosAExportarArray(arrayProductosAExportar,arrayProductos,document.querySelectorAll(`.${ExportRemeras.classNameCheckedToExport}`));  // MANDO LOS DOS ARRAYS AL REVES
            ExportRemeras.updateTables($tableContainer,$tableProductosAExportar,arrayProductos,arrayProductosAExportar);
            ExportRemeras.refreshUI();
        }
        
        $boton3.onclick = () => {
            console.log($inputFileName.value);
            if(ExportRemeras.isFileName($inputFileName.value)){
                ExportRemeras.updateExportProductsArray(arrayProductosAExportar);
                let content = ExportRemeras.getFullCsv(arrayProductosAExportar);   
                ExportRemeras.exportProducts(content,$inputFileName.value);
            } else {
                console.log("fallo el file name")
                $inputFileName.value = "Nombre de Archivo invalido";
            }


        }

        $testBoton.onclick = () => {
            ExportRemeras.updateExportProductsArray(arrayProductosAExportar);

        }

        $inputImageAddressCheckbox.addEventListener("change", ExportRemeras.refreshOptionsInputs);
        $inputWeightCheckbox.addEventListener("change", ExportRemeras.refreshOptionsInputs);
        $inputBoxLenghtCheckbox.addEventListener("change", ExportRemeras.refreshOptionsInputs);
        $inputBoxWidthCheckbox.addEventListener("change", ExportRemeras.refreshOptionsInputs);
        $inputBoxHeightCheckbox.addEventListener("change", ExportRemeras.refreshOptionsInputs);
        $inputOverwritePriceCheckbox.addEventListener("change", ExportRemeras.refreshOptionsInputs);
        ExportRemeras.refreshUI();


    }

    static async getData(){
        try {
            let res = await fetch("./assets/data.json");
            if(!res.ok) {
                throw { status: res.status, statusText: res.statusText };
            }
            let json = await res.json();
            ExportRemeras.renderView(json,arrayProductos);
        } catch (err) {
            console.log("en el catch",err.status); // MANEJAR EL ERROR
        }
    }

    static exportProducts(string,name){
        let hiddenElement = document.createElement('a');  
        hiddenElement.href = 'data:text/csv;charset=utf-8,' + encodeURI(string);  
        hiddenElement.target = '_blank';  
        
        //provide the name for the CSV file to be downloaded  
        hiddenElement.download = name;  
        hiddenElement.click();  
    }

    static updateExportProductsArray(arrayProductosAExportar){

        if(Remera.isPrecio($inputOverwritePrice.value) && $inputOverwritePriceCheckbox.checked){
            arrayProductosAExportar.map(element => {
                element.precio = Number($inputOverwritePrice.value);
            });            
        }
        if(Remera.isPesoProducto($inputWeight.value) && $inputWeightCheckbox.checked){
            Remera.pesoProductoKg = Number($inputWeight.value);
        }
        if(Remera.isMedidaCaja($inputBoxLenght.value) && $inputBoxLenghtCheckbox.checked){
            Remera.longitudCajaCms = Number($inputBoxLenght.value);
        }
        if(Remera.isMedidaCaja($inputBoxWidth.value) && $inputBoxWidthCheckbox.checked){
            Remera.anchoCajaCms = Number($inputBoxWidth.value);
        }
        if(Remera.isMedidaCaja($inputBoxHeight.value) && $inputBoxHeightCheckbox.checked){
            Remera.altoCajaCms = Number($inputBoxHeight.value);            
        }
        if($inputImageAddress.value != '' && $inputImageAddressCheckbox.checked){
            Remera.direccionImgWooCommerce = $inputImageAddress.value;
        }
    }

    static getFullCsv(arrayProductos){
        let content = "";
        arrayProductos.forEach(element => {               
            content += element.getLineaCsv()+"\n";
        })
        return content;
    }

    static isFileName(string){
        let rg1=/^[^\\/:\*\?"<>\|]+$/; // CARACTERES PROHIBIDOS \ / : * ? " < > |
        let rg2=/^\./; // NO PUEDE EMPEZAR CON PUNTO (.)
        let rg3=/^(nul|prn|con|lpt[0-9]|com[0-9])(\.|$)/i; // NOMBRE DE ARCHIVOS PROHIBIDOS
        return rg1.test(string)&&!rg2.test(string)&&!rg3.test(string);
    }

    static refreshOptionsInputs(){
        $inputImageAddress.value = Remera.direccionImgWooCommerce;
        $inputWeight.value = Remera.pesoProductoKg;
        $inputBoxLenght.value = Remera.longitudCajaCms;
        $inputBoxWidth.value = Remera.anchoCajaCms;
        $inputBoxHeight.value = Remera.altoCajaCms;

        ($inputImageAddressCheckbox.checked) ? $inputImageAddress.disabled = false : $inputImageAddress.disabled = true;
        ($inputWeightCheckbox.checked) ? $inputWeight.disabled = false : $inputWeight.disabled = true;
        ($inputBoxLenghtCheckbox.checked) ? $inputBoxLenght.disabled = false : $inputBoxLenght.disabled = true;
        ($inputBoxWidthCheckbox.checked) ? $inputBoxWidth.disabled = false : $inputBoxWidth.disabled = true;
        ($inputBoxHeightCheckbox.checked) ? $inputBoxHeight.disabled = false : $inputBoxHeight.disabled = true;
        ($inputOverwritePriceCheckbox.checked) ? $inputOverwritePrice.disabled = false : $inputOverwritePrice.disabled = true;

    }

    static refreshUI(){

        ExportRemeras.refreshOptionsInputs();

        if(arrayProductosAExportar == null || arrayProductosAExportar.length == 0){
            $botonRemoveProducts.style.display = "none";
            //console.log(window.getComputedStyle($divOptionsToExport).display);
            $divOptionsToExport.style.display = "none";
            $divProductsToExport.style.display = "none";
        }
        else
        {
            $botonRemoveProducts.style.display = "block";
            $divOptionsToExport.style.display = "grid";
            $divProductsToExport.style.display = "flex";
        }
    }
}

const arrayProductosAExportar = []; // ARRAY DONDE VAN LOS PRODUCTOS PARA EXPORTARSE
const arrayProductos = []; // ARRAY DONDE VAN LOS PRODUCTOS QUE SE PUEDEN EXPORTAR

const $tableProductosAExportar = document.getElementById("containerProductsToExportTable");
const $tableContainer = document.getElementById("containerProductsTable");
const $divOptionsToExport = document.getElementById("divOptionsToExport");
const $divProductsToExport = document.getElementById("divProductsToExport");


const $boton = document.getElementById("btn_addProducts");
const $botonRemoveProducts = document.getElementById("btn_removeProducts");
const $boton3 = document.getElementById("btn_exportProducts");
const $inputFileName = document.getElementById("input_FileName");

const $inputOverwritePrice = document.getElementById("input_OverwritePrice");
const $inputOverwritePriceCheckbox = document.getElementById("input_OverwritePriceCheckbox");

const $inputImageAddress = document.getElementById("input_ImageAddress");
const $inputImageAddressCheckbox = document.getElementById("input_ImageAddressCheckbox");
const $inputWeight = document.getElementById("input_Weight");
const $inputWeightCheckbox = document.getElementById("input_WeightCheckbox");
const $inputBoxLenght = document.getElementById("input_BoxLenght");
const $inputBoxLenghtCheckbox = document.getElementById("input_BoxLenghtCheckbox");
const $inputBoxWidth = document.getElementById("input_BoxWidth");
const $inputBoxWidthCheckbox = document.getElementById("input_BoxWidthCheckbox");
const $inputBoxHeight = document.getElementById("input_BoxHeight");
const $inputBoxHeightCheckbox = document.getElementById("input_BoxHeightCheckbox");

const $testBoton = document.getElementById("test2");

ExportRemeras.getData();