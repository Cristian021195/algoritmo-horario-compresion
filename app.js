//import data from "./json/exprebus-38-sabados-ns.json" assert { type: 'json' };
//const NOMBRE_ARCHIVO = "exprebus-38-sabados-ab.json";
import data from "./json/exprebus-38-sabados-sn.json" assert { type: 'json' };
const NOMBRE_ARCHIVO = "exprebus-38-sabados-ba.json";
const HORARIO = {
    empresa: "",
    ruta: 0,
    dias: "",
    sentido: "",
    vigencia: data.data_validity
};

//Expresiones regulares
const evaluador = /^[(*) -/+.¡?!#$%&=°|<>_]/g; // quitar ^ si causa mas problemas
const orientation_regex = /\b((ab)|(ba))\b/g; // si cambia la posicion de sentido en nemotecnica, mover de lugar "-" /{-}\b(ab|ba)\b/g;
const words = /^[a-z]+/g;
const number = /[0-9]/g;
const evaluador_vacio = "*"; //a futuro, hacerlo expresion regular

// Arreglos y Datos
const COLUMNAS = data.data_header;
const FILAS = [...data.data_body];
const N_COLUMNAS = COLUMNAS.length;
const N_FILAS = FILAS.length;
const RANGO_COLUMNAS_VACIAS = [];
const rango_filas_vacias = [];

let NOMBRE_OK = false;
let COL_PIVOTE = []; let INDICE_PIVOTE_VERTICAL = 0;
let FRECUENCIAS_VERTICALES = [];
let FRECUENCIAS_HORIZONTALES_EXPRESO = [];
let FILAS_REGULARES;
let FILAS_EXPRESO;
let PRIMERAS_CELDAS_REGULARES = [];
let PRIMERAS_CELDAS_EXPRESO = [];
let INSTRUCCION;

/* El algoritmo consta de los siguientes pasos: 
    1 - se recibe el archivo, y se valida el nombre.
    2 - se carga la columna pivote, (es la columna que mas celdas tiene, suele ser la primera segun el sentido del viaje)
    3 - se carga el objeto, son las frecuencias verticales para expreso y comun, pero es probable que solo retornemos la de expresos.
    4 - se carga FILAS_REGULARES, FILAS_EXPRESO que guardan el indice en filas, ya sea regulares o expreso. se usa para freq horizontal
    5 - frecuenciasHorizontales() - falta desarrollar mas
    6 - se carga RANGO_COLUMNAS_VACIAS, es importante para desarrollar la compresion de instrucciones, sirve para llenar al final todas las columnas vacias
    7 - primerasCeldasRegulares() - falta desarrollar mas, nos da las instrucciones de llenado
    8 - ponerColumnasVacias(param), - falta desarrollar mas, pero hace uso de FILA en su totalidad, y su algoritmo se aplica con las instruccioens de RANGO_COLUMNAS_VACIAS para cargar las celdas vacias
*/

console.table(FILAS);

// Ejecucion del programa
NOMBRE_OK = validarNombreArchivo(NOMBRE_ARCHIVO);
COL_PIVOTE = pivoteVertical();
FRECUENCIAS_VERTICALES = frecuenciasVerticales();
//PRIMERAS_CELDAS_REGULARES = primerasCeldasRegulares();
PRIMERAS_CELDAS_REGULARES = primerasCeldasRegularesAlt();
arregloExpresos(); // carga FILAS_EXPRESO FILAS_REGULARES
//PRIMERAS_CELDAS_EXPRESO = primerasCeldasExpreso()
PRIMERAS_CELDAS_EXPRESO = primerasCeldasExpresoAlt();
FRECUENCIAS_HORIZONTALES_EXPRESO = frecuenciasHorizontalesExpreso("si"); // hacer evaluacion de expreso si no 1 - 0
rangoColumnasVacias();
//ponerColumnasVacias(r_c_v);
//console.table(FILAS);
INSTRUCCION = armarInstruccion();
console.log(INSTRUCCION);


function armarInstruccion(tolerancia=2){
    const INDX = ['A','B','C','D','E','F','G','H','I']; 
    const rangos = []; const tam = INDX.length;
    let division = INDX.length / tolerancia;
    const instruccion = [];

    // Objeto sin division de tolerancia para trabajar
    const OBJ = {
        A:HORARIO.empresa+"-"+HORARIO.ruta+"-"+HORARIO.dias+"-"+HORARIO.sentido,
        B:HORARIO.vigencia,
        C:COLUMNAS,
        D:FRECUENCIAS_VERTICALES,
        E: PRIMERAS_CELDAS_REGULARES,
        F: PRIMERAS_CELDAS_EXPRESO,
        G: FRECUENCIAS_HORIZONTALES_EXPRESO,
        H: RANGO_COLUMNAS_VACIAS,
        I:N_FILAS // n columnas no lo ponemos, ya que lo podemos inferir de las columnas
    }
    //console.log(OBJ)
    const name_token = OBJ.A;

    // ALGORITMO DIVISION OBJETO CON TOLERANCIA
    if(division % 1 === 0){
        for(let i = 0; i < tam; i+=3){
            let arr = [];
            for(let c = 0; c < division; c++){
                arr.push(INDX[i+c])
            }  
            rangos.push(arr);
        }
    }else{
        division = Math.trunc(division);//4 = [0,3][4,8] *
        //let faltante = INDX.length - division; //5
        //console.log({division, faltante})
        for (let i = 0; i < tam; i+=division) {
            let arr = [];
            for(let c = 0; c < division; c++){
                if(INDX[i+c] !== undefined){
                    arr.push(INDX[i+c])
                }                
            }
            rangos.push(arr);
        }
    }
    if(rangos[rangos.length-1].length === 1 && division !== 1){
        rangos[rangos.length-2].push(rangos[rangos.length-1][0])
        rangos.pop();
    }

    rangos.forEach((r,ri)=>{
        let ob = {K:ri+1};
        if(ri>0){
            ob["A"] = name_token;
        }
        r.forEach((e,ei)=>{
            ob[e]=OBJ[e];
        })
        instruccion.push(ob);
    })

    return instruccion;
}

// Desarrollo de Funciones
function validarNombreArchivo(nombre=""){
    const name_arr_dot = nombre.split('.');
    const name_arr_script = name_arr_dot[0].split('-');
    if(name_arr_script.length === 4){
        if(words.test(name_arr_script[0]) && number.test(name_arr_script[1])){
            if(words.test(name_arr_script[3])){
                if(words.test(name_arr_script[2])){
                    console.log('ok')
                }else{
                    throw new Error("Nombre de archivo incorrecto, ej: exprebus-38-sabados-ab");    
                }
            }
        }
        if(name_arr_dot.length === 2){
            const str_orientation = name_arr_script[3];
            if(str_orientation.length == 2 && orientation_regex.test(str_orientation)){
                if(name_arr_dot[1] !== "json"){
                    throw new Error("Formato invalido, debe ser .json");
                }
                HORARIO.empresa = name_arr_script[0]; HORARIO.ruta = name_arr_script[1];
                HORARIO.dias = name_arr_script[2]; HORARIO.sentido = name_arr_script[3];
                return true;
            }else{
                throw new Error("La nemotecnica es empresa-ruta-dias-sentido: no se encontró sentido ab | ba en nombre de archivo");    
            }
        }else{
            throw new Error("El archivo es invalido, debe tener formato JSON, y un solo punto en su nombre");
        }
    }else{
        throw new Error("Nombre invalido, 4 palabras separadas por guion, y con extension .json, ej: exprebus-38-sabados-ab");
    }    
}
function pivoteVertical(){
    //la primera parte toma el indice si es ns o sn, siempre teniendo en cuenta que la ultima col es expreso, se quita siempre
    let saferow = 0;
    if(HORARIO?.sentido === 'ab'){
        INDICE_PIVOTE_VERTICAL = 0;
    }else if(HORARIO?.sentido === 'ba'){
        INDICE_PIVOTE_VERTICAL = N_COLUMNAS - 1;
    }
    return buscarPivoteAuto(N_FILAS, saferow);
}
function buscarPivoteAuto(N_FILAS, safeRow){//quitando la ultima -1,//return traerColumna(0,0);
    /* busca por columna, cual es la que mas filas para tomarla como pivote*/
    const long_arr = [];
    const obj = {pos:0, val:0}
    let max_elem = 0;
    for(let c = 0; c<N_COLUMNAS-1; c++){
        let col = traerColumna(c, safeRow).filter(e=>e!=="*");
        long_arr.push(col.length);
    }
    for(let i = 0; i < long_arr.length; i++){
        if(obj.val < long_arr[i]){
            obj.val = long_arr[i];
        }
    }

    max_elem = Math.max(...long_arr); // toma el mayor valor del arreglo de columa
    obj.pos = long_arr.findIndex(e=>e===max_elem); // trae el indice de la primer columna con mayor cantidad de registros
    return traerColumna(obj.pos, 0).filter(e=>e!=="*");
}
function traerColumna(indice, safeRow=0){//safeRow tiene que ser 1 si queremos rescatar la columna sin los valores de la primera fila
    const columna = [];
    for(let c = 0; c<N_COLUMNAS; c++){
        for(let f = 0+safeRow; f<N_FILAS; f++){
            columna.push(FILAS[f][indice]);
        }
        break;
    }    
    return columna;
}

function frecuenciasVerticales(){// tomando referencia 0 a ultimo arreglo con sumatoria de minutos
    const freq_arr = []; const freq_diff = []; const freq_step = [];

    //freq_arr
    for(let f = 0; f<COL_PIVOTE.length; f++){// recorre por cada elemento de la columna pivote
        let timeval = COL_PIVOTE[f].split(':');// cortamos los valores de json hhmmss
        let hh = timeval[0]; let mm = timeval[1];
        let dTime = new Date(1970,0,1,hh,mm); // creamos el tipo de dato fecha
        freq_arr.push(dTime.getTime()/1000); // guardamos un arreglo de tiempos en milisegundos para comparar
    }

    for(let i = 0; i < COL_PIVOTE.length; i++){ // por eliminar
        let diff = 0;
        if(i+1 !== COL_PIVOTE.length){
            diff = freq_arr[i + 1] - freq_arr[i];
        }else{
            diff = freq_arr[i];
        }
        freq_diff.push(diff);
    }

    let sum;
    let arr_aux = freq_diff.map(elem => sum = (sum || 0) + elem);
    arr_aux.pop();
    let res_arr = [0,...arr_aux];

    /*freq_step: calcula la diferencia entre celdas de la columna con su contigua y las mete en un arreglo
    obteniendo asi un arreglo de diferencias de horario */
    for(let i = 0; i < COL_PIVOTE.length; i++){
        let diff = 0;
        if(i+1 !== COL_PIVOTE.length){
            diff = freq_arr[i + 1] - freq_arr[i];
            freq_step.push(diff);            
        }
    }
    return freq_step;
}
function arregloExpresos(){
    const freq_arr_exp = [];
    const freq_arr_reg = [];
    for(let c = 0; c<N_COLUMNAS; c++){
        for(let f = 0; f<N_FILAS; f++){
            if(c === N_COLUMNAS-1){
                if(FILAS[f][N_COLUMNAS-1] == "si"){ // a futuro 1 o 0
                    freq_arr_exp.push(f);
                }else{
                    freq_arr_reg.push(f);
                }
            }            
        }
    }
    //sacamos cual tiene el mayor numero de horarios, guardamos el indice y calculamos con algoritmo de frecuencias
    FILAS_EXPRESO = freq_arr_exp;
    FILAS_REGULARES = freq_arr_reg;
}


function frecuenciasHorizontalesExpreso(condicion="si"){ // expreso, luego renombrar 1 a 0 o ver
    
    let pivote = armarPivoteHorizontal(condicion);
    let freqarr = pivote.map((e)=>{
        if(e===0) return 0
        let timestr = e.split(":");
        let hh = timestr[0]; let mm = timestr[1];
        let dTime = new Date(1970,0,1,hh,mm);
        return dTime.getTime();
    })
    let zero_pos = freqarr.map((e,ei)=>{if(e===0) return ei}).filter(e=>e!==undefined)
    let time_pos_aux = freqarr.map((e,ei)=>{if(e!==0) return ei}).filter(e=>e!==undefined)
    let time_pos = time_pos_aux.slice(1);
    
    let timearr = freqarr.map((e,ei)=>{if(e!==0) return e}).filter(e=>e!==undefined)
    let freqcalc = [];    

    for (let td = 0; td < timearr.length; td++) {
        if(td+1 == timearr.length) break;
        let calc = Math.abs(timearr[td] - timearr[td+1])/1000;
        freqcalc.push({t:calc, c:time_pos[td]});
    }


    //console.log({freqarr, zero_pos, time_pos, timearr, freqcalc});


    let valpivstr = FILAS[3][0].split(":");
    let hh = valpivstr[0]; let mm = valpivstr[1];
    let dpivTime = new Date(1970,0,1,hh,mm);
    let valpiv = dpivTime.getTime(); //igual hacer validacion
    let arr = Array.from({length: 11});
    arr[0] = valpiv; arr[arr.length-1] = 'si'; // futuro 1 o 0
    
    freqcalc.forEach((fc)=>{
        valpiv += (fc.calc*1000);
        arr[fc.c] = valpiv;
    })

    let resultado = arr.map((e)=>{
        if(e===undefined){
            return "*";
        }else if(!isNaN(e)){
            let dat = new Date(e);
            let gh = dat.getHours();  let gm = dat.getMinutes(); 
            let hh = gh < 10 ? '0'+gh : gh;
            let mm = gm < 10 ? '0'+gm : gm;
            return `${hh}:${mm}`;
        }else{
            return e;
        }
    })

    return freqcalc;
}
function armarPivoteHorizontal(valor_ultima_celda){
    let filtrado = FILAS.filter(e=>e[N_COLUMNAS-1]==valor_ultima_celda)
    let filtrado_h = [];
    let max = 0; let pos = 0;
    for (let f = 0; f < filtrado.length; f++) {
        
        let fila = filtrado[f].filter(e=>{if(e!==valor_ultima_celda)return e});

        if(max <= fila.length){
            max = fila.length; pos = f;
            filtrado_h.push(fila);
        }
    }
    let pivote =  filtrado_h[pos]
    
    pivote = pivote.map(e=>{if(e==="*"){return 0}else{return e}})
    return pivote;
}

function rangoColumnasVacias(){
    for(let c = 0; c<N_COLUMNAS; c++){
        const a = {c:c,r:[]};
        for(let f = 0; f<N_FILAS; f++){
            const ev = FILAS[f][c].trim().charAt(0);
            if(ev === "*"){
                a.r.push(f);
            }
        }
        RANGO_COLUMNAS_VACIAS.push(a);
    }    
    RANGO_COLUMNAS_VACIAS.forEach(e=> {
        e.r = notacionRangoArray(e.r);
    });
}

function notacionRangoArray(evalarr){//[0,1,2,3,4,5,7,8,10]
    // Este algoritmo de compresion de instruccion, reduce entre un 17% a 20% el tamaño de arreglo de filas vacias
    if (Array.isArray(evalarr) && evalarr?.length) {// no vacio
        const res = [];
        let jumper = false;
        let rng = [evalarr[0]];
        for(let i=1; i < evalarr.length; i++){
            if(evalarr[i]-evalarr[i-1] === 1){
                jumper = true;
            }else{
                rng.push(evalarr[i-1]);
                res.push(rng);
                rng = [evalarr[i]]
                jumper = false;
            }
        }
        if(rng[0] === evalarr[evalarr.length-1]){

        }else{
            rng.push(evalarr[evalarr.length-1]);
        }
        //rng.push(evalarr[evalarr.length-1]); // descomentar y quitar if else de arriba para volver como antes
        res.push(rng);
        rng = [];
        return res;    
    }else{
        return [];
    }    
}



function primerasCeldasRegularesAlt(){
    const nfila = N_FILAS; const ncol = N_COLUMNAS - 1;//Puede dar error, analizar si es f o col
    const arr_pos_a_llenar_col = []; const arr_pos_a_llenar_row = [];
    const arr_pos_a_llenar = []; const res_aux = [];

/* itera buscando aquellas filas que no sean expreso, llenando un arreglo de los indices de columnas y otro de filas correspondientes */
    for (let f = 0; f < nfila; f++) {        
        for (let c = 0; c < ncol; c++) {
            const evex = FILAS[f][ncol];
            if(evex == 'si'){ // en futuro 1 o 0

            }else{
                const ev = FILAS[f][c].trim().charAt(0);
                if(ev !== "*"){
                    if(!arr_pos_a_llenar_col.includes(c)){
                        arr_pos_a_llenar_col.push(c);
                        arr_pos_a_llenar_row.push(f);
                    }
                }else{
                    //console.log('a')
                }
            }
        }        
    }

/* Una vez llenadi los arreglos, iteramos el de columnas y agregamos a otro arreglo objetos donde alojan, valor de fila, valor de colmna y tiempos asociados
a esos rangos */
    for (let i = 0; i < arr_pos_a_llenar_col.length; i++) {
        arr_pos_a_llenar.push(
            {
                f:arr_pos_a_llenar_row[i],
                c:arr_pos_a_llenar_col[i],
                t:FILAS[arr_pos_a_llenar_row[i]][arr_pos_a_llenar_col[i]].substring(0,5)
            }
        );
    }

    /*en un nuevo arreglo res_aux, guardamos aquellos elementos de pos_a_llenar que no se repitan*/
    let fila = 0; let columnas = []; let horas = [];
    arr_pos_a_llenar.forEach((e,ei)=>{        
        if(arr_pos_a_llenar[ei+1] !== undefined){
            if(arr_pos_a_llenar[ei].f === arr_pos_a_llenar[ei+1].f){
                fila = arr_pos_a_llenar[ei].f;
                columnas.push(arr_pos_a_llenar[ei].c);
                horas.push(arr_pos_a_llenar[ei].t);
            }else{
                columnas.push(arr_pos_a_llenar[ei].c);
                horas.push(arr_pos_a_llenar[ei].t);
                res_aux.push([fila, columnas, horas]);
                fila = 0; columnas = []; horas = [];
            }            
        }else{
            columnas.push(arr_pos_a_llenar[ei].c);
            horas.push(arr_pos_a_llenar[ei].t);
            res_aux.push([fila, columnas, horas]);
        }
    })
    return res_aux;
    //crearColumnaHorario(1,5); // de descompresion    
}

function primerasCeldasExpresoAlt(){
    const nfila = N_FILAS; const ncol = N_COLUMNAS - 1;//Puede dar error, analizar si es f o col
    const res_aux = [];
    const arr_pos_a_llenar = []; let cabeza = 0; // sentido cambiaria con sn/ns ab/ba
    
    if(HORARIO.sentido == "ab"){ // cambiar por 1 o 0
        cabeza = 0;
    }else if (HORARIO.sentido == "ba"){
        cabeza = N_COLUMNAS - 2;// puede ser error
    }

    FILAS_EXPRESO.forEach((e,ei)=>{
        const evex = FILAS[e][cabeza];
        // [{"f":3,"c":0, "t":"06:30"},{"f":5,"c":0,"t":"08:00"},{"f":9,"c":0,"t":"10:30"}],
        if(evex != '*'){ // en futuro 1 o 0
            arr_pos_a_llenar.push({f:e, c:cabeza, t:evex});
        }
    })

    let columna = 0; let filas = []; let horas = [];
    arr_pos_a_llenar.forEach((e,ei)=>{        
        filas.push(arr_pos_a_llenar[ei].f);
        horas.push(arr_pos_a_llenar[ei].t.substring(0,5));
        if(arr_pos_a_llenar[ei+1] !== undefined){                
            if(arr_pos_a_llenar[ei].c === arr_pos_a_llenar[ei+1].c){
                columna = arr_pos_a_llenar[ei].c;
            }else{                
                res_aux.push([columna, filas, horas]);
                columna = 0; filas = []; horas = [];
            }            
        }else{
            res_aux.push([columna, filas, horas]);
        }
    })

    return res_aux;

    //crearColumnaHorario(1,5); // de descompresion    
}

function primerasCeldasExpreso(){
    const nfila = N_FILAS; const ncol = N_COLUMNAS - 1;//Puede dar error, analizar si es f o col
    const arr_pos_a_llenar_col = []; const arr_pos_a_llenar_row = [];
    const arr_pos_a_llenar = []; const sentido = 0; // sentido cambiaria con sn/ns ab/ba

    FILAS_EXPRESO.forEach((e,ei)=>{
        const evex = FILAS[e][sentido];
        // [{"f":3,"c":0, "t":"06:30"},{"f":5,"c":0,"t":"08:00"},{"f":9,"c":0,"t":"10:30"}],
        if(evex != '*'){ // en futuro 1 o 0
            arr_pos_a_llenar.push({f:e, c:sentido, t:evex.substring(0,5)}); // los substring eventualmente deberian de desaparecer cuando ordenemos el backend
        }
    })
    //console.log(arr_pos_a_llenar)
    return arr_pos_a_llenar;

    //crearColumnaHorario(1,5); // de descompresion    
}

function primerasCeldasRegulares(){
    const nfila = N_FILAS; const ncol = N_COLUMNAS - 1;//Puede dar error, analizar si es f o col
    const arr_pos_a_llenar_col = []; const arr_pos_a_llenar_row = [];
    const arr_pos_a_llenar = []; const res_aux = [];
    for (let f = 0; f < nfila; f++) {
        
        for (let c = 0; c < ncol; c++) {
            const evex = FILAS[f][ncol];
            if(evex == 'si'){ // en futuro 1 o 0

            }else{
                const ev = FILAS[f][c].trim().charAt(0);
                if(ev !== "*"){
                    if(!arr_pos_a_llenar_col.includes(c)){
                        arr_pos_a_llenar_col.push(c);
                        arr_pos_a_llenar_row.push(f);
                    }
                }else{
                    //console.log('a')
                }
            }
        }        
    }

    for (let i = 0; i < arr_pos_a_llenar_col.length; i++) {
        arr_pos_a_llenar.push(
            {
                f:arr_pos_a_llenar_row[i],
                c:arr_pos_a_llenar_col[i],
                //t:FILAS[arr_pos_a_llenar_row[i]][arr_pos_a_llenar_col[i]]
                t:FILAS[arr_pos_a_llenar_row[i]][arr_pos_a_llenar_col[i]].substring(0,5)
            });
    }
    return arr_pos_a_llenar;
    //crearColumnaHorario(1,5); // de descompresion    
}

function crearColumnaHorario(f,c){ // si bien recive/usa el arreglo de frecuencias para armar se aplicó solo a horarios comun
    let hora_str = FILAS[2][0];
    if(hora_str == "*"){
        throw new Error("El valor evaluado no es del formato correcto hh:mm:ss o hh:mm");
    }
    let timeval  = hora_str.split(':');
    let hh = timeval[0]; let mm = timeval[1];
    const dTime = new Date(1970,0,1,hh,mm).getTime() / 1000;
    let accTime = dTime;

    //console.log(hora_str, dTime);
    let arraxf = [dTime*1000];

    for (let fr = f; fr < FRECUENCIAS_VERTICALES.length; fr++) { // es el numero de frecuencias ver si lo guardamos aparte
        let addTime = FRECUENCIAS_VERTICALES[fr];
        accTime+=addTime;
        arraxf.push(accTime*1000);
    }

    arraxf.forEach(e=>{
        //console.log(new Date(e))
    })
    /*for (let fr = f; fr < n_filas; fr++) { // aplicamos fila 2 en este caso
        if(fr+1 == n_filas) break;
        //let addTime = Math.abs(frecuencias_verticales.freq_diff[fr] - frecuencias_verticales.freq_diff[fr+1]);
        let addTime = frecuencias_verticales.freq_step[fr];
        accTime+=addTime;
        arraxf.push(accTime);
    }
    console.log(arraxf)*/
}

function ponerColumnasVacias(r_c_v){// demo, se aplica al final
    const arr_template = [
        ["08:25:00","08:25:00","08:25:00","08:25:00","08:25:00","08:25:00","08:25:00","08:25:00","08:25:00","08:25:00","no"],["08:25:00","08:25:00","08:25:00","08:25:00","08:25:00","08:25:00","08:25:00","08:25:00","08:25:00","08:25:00","si"],["08:25:00","08:25:00","08:25:00","08:25:00","08:25:00","08:25:00","08:25:00","08:25:00","08:25:00","08:25:00","no"],
        ["08:25:00","08:25:00","08:25:00","08:25:00","08:25:00","08:25:00","08:25:00","08:25:00","08:25:00","08:25:00","no"],["08:25:00","08:25:00","08:25:00","08:25:00","08:25:00","08:25:00","08:25:00","08:25:00","08:25:00","08:25:00","si"],["08:25:00","08:25:00","08:25:00","08:25:00","08:25:00","08:25:00","08:25:00","08:25:00","08:25:00","08:25:00","no"],
        ["08:25:00","08:25:00","08:25:00","08:25:00","08:25:00","08:25:00","08:25:00","08:25:00","08:25:00","08:25:00","no"],["08:25:00","08:25:00","08:25:00","08:25:00","08:25:00","08:25:00","08:25:00","08:25:00","08:25:00","08:25:00","si"],["08:25:00","08:25:00","08:25:00","08:25:00","08:25:00","08:25:00","08:25:00","08:25:00","08:25:00","08:25:00","no"],
        ["08:25:00","08:25:00","08:25:00","08:25:00","08:25:00","08:25:00","08:25:00","08:25:00","08:25:00","08:25:00","no"],["08:25:00","08:25:00","08:25:00","08:25:00","08:25:00","08:25:00","08:25:00","08:25:00","08:25:00","08:25:00","si"],
    ]; // LO DEBERIAMOS REEMPLAZAR POR FILAS O [...FILAS]
    /* //quizas podemos comprimir mas, suprimiendo c:0, c:n, solo dejando por tupla, r:[]
        [
            {"c":0,"r":[[0,1]]},
            {"c":1,"r":[[0,1]]},
            {"c":2,"r":[[0,1]]},
            {"c":3,"r":[[0]]},
            {"c":4,"r":[[0]]},
            {"c":5,"r":[[0,10]]},
            {"c":6,"r":[[0,5],[7,8],[10]]},
            {"c":7,"r":[[0,5],[7,10]]},
            {"c":8,"r":[[0,10]]},
            {"c":9,"r":[[0,10]]},
            {"c":10,"r":[]}
        ]
    */
    for(let c = 0; c < N_COLUMNAS; c++){//tener en cuenta que puede ser n_columnas - 1 si queremos salvar la columna final de expreso, aun asi funciona ahora
        const f_range = RANGO_COLUMNAS_VACIAS[c].r.length;
        
        for(let f = 0; f<f_range; f++){// evaluar
            let min = 0;
            if(RANGO_COLUMNAS_VACIAS[c].r[f][0] !== undefined || RANGO_COLUMNAS_VACIAS[c].r[f][0] !== null){
                min = RANGO_COLUMNAS_VACIAS[c].r[f][0];
            }
            let max = RANGO_COLUMNAS_VACIAS[c].r[f][1];
            if(max === undefined){
                max = min;
            }
            for (let z = min; z <= max; z++) {
                arr_template[z][c] = "*";
            }
        }
    }
    return arr_template;
}





