import data from "./json/exprebus-38-sabados-ns.json" assert { type: 'json' };

const horario_str = "exprebus-38-sabados-ab.json"; // harcoded: porque esto lo evaluariamos con nodejs
const HORARIO_OBJ = {
    empresa: "",
    ruta: 0,
    dias: "",
    sentido: ""
};
const columnas = data.data_header;
const filas = data.data_body;
const filas_bk = [...filas];
const filas_copy = [...filas];
const vigencia = data.data_validity;
//[fy][cx]
const n_columnas = columnas.length;
const n_filas = filas.length;
const columnas_vacias = [];
const rango_columnas_vacias = [];
const rango_filas_vacias = [];

let frecuencias_verticales = [];
let filas_regulares;
let filas_expreso;

const evaluador = /^[(*) -/+.¡?!#$%&=°|<>_]/g; // quitar ^ si causa mas problemas
const orientation_regex = /\b((ab)|(ba))\b/g; // si cambia la posicion de sentido en nemotecnica, mover de lugar "-" /{-}\b(ab|ba)\b/g;
const words = /^[a-z]+/g;
const number = /[0-9]/g;
const evaluador_vacio = "*"; //a futuro, hacerlo expresion regular


//Funciones del sistema
console.log(validarNombreArchivo(horario_str));
console.log("Data body:",[...filas]);
frecuenciaVertical(HORARIO_OBJ, [...filas]);
rangoColumnasVacias([...filas]);
ponerColumnasVacias([...filas]); //se ejecuta al final
llenadoDeHorariosComun([...filas]);


//Funciones para probar en caso de fallas
//console.log(notacionRangoArray([0,1,2,3,4,5,7,8,10]));

function llenadoDeHorariosComun(_filas){
    const nfila = n_filas; const ncol = n_filas - 1;
    const arr_pos_a_llenar_col = []; const arr_pos_a_llenar_row = [];
    const arr_pos_a_llenar = [];
    for (let f = 0; f < ncol; f++) {
        
        for (let c = 0; c < ncol; c++) {
            const evex = _filas[f][ncol];
            if(evex == 'si'){ // en futuro 1 o 0

            }else{
                const ev = _filas[f][c].trim().charAt(0);
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
        arr_pos_a_llenar.push({f:arr_pos_a_llenar_row[i],c:arr_pos_a_llenar_col[i]});
    }

    console.log(JSON.stringify(arr_pos_a_llenar));
    crearColumnaHorario(1,5);
    
}

function crearColumnaHorario(f,c){ // si bien recive/usa el arreglo de frecuencias para armar se aplicó solo a horarios comun
    let hora_str = filas_copy[2][0];
    if(hora_str == "*"){
        throw new Error("El valor evaluado no es del formato correcto hh:mm:ss o hh:mm");
    }
    let timeval  = hora_str.split(':');
    let hh = timeval[0]; let mm = timeval[1];
    const dTime = new Date(1970,0,1,hh,mm).getTime() / 1000;
    let accTime = dTime;

    console.log(hora_str, dTime);
    let arraxf = [dTime*1000];

    for (let fr = f; fr < frecuencias_verticales.freq_step.length; fr++) { // es el numero de frecuencias ver si lo guardamos aparte
        let addTime = frecuencias_verticales.freq_step[fr];
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
    ];
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
    for(let c = 0; c < n_columnas; c++){//tener en cuenta que puede ser n_columnas - 1 si queremos salvar la columna final de expreso, aun asi funciona ahora
        const f_range = rango_columnas_vacias[c].r.length;
        
        for(let f = 0; f<f_range; f++){// evaluar
            let min = 0;
            if(rango_columnas_vacias[c].r[f][0] !== undefined || rango_columnas_vacias[c].r[f][0] !== null){
                min = rango_columnas_vacias[c].r[f][0];
            }
            let max = rango_columnas_vacias[c].r[f][1];
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


function ponerFilasVacias(r_c_v){//sirve si la cantidad de columnas supera a filas, se aplica al final
    const arr_template = [
        ["08:25:00","08:25:00","08:25:00","08:25:00","08:25:00","08:25:00","08:25:00","08:25:00","08:25:00","08:25:00","no"],["08:25:00","08:25:00","08:25:00","08:25:00","08:25:00","08:25:00","08:25:00","08:25:00","08:25:00","08:25:00","si"],["08:25:00","08:25:00","08:25:00","08:25:00","08:25:00","08:25:00","08:25:00","08:25:00","08:25:00","08:25:00","no"],
        ["08:25:00","08:25:00","08:25:00","08:25:00","08:25:00","08:25:00","08:25:00","08:25:00","08:25:00","08:25:00","no"],["08:25:00","08:25:00","08:25:00","08:25:00","08:25:00","08:25:00","08:25:00","08:25:00","08:25:00","08:25:00","si"],["08:25:00","08:25:00","08:25:00","08:25:00","08:25:00","08:25:00","08:25:00","08:25:00","08:25:00","08:25:00","no"],
        ["08:25:00","08:25:00","08:25:00","08:25:00","08:25:00","08:25:00","08:25:00","08:25:00","08:25:00","08:25:00","no"],["08:25:00","08:25:00","08:25:00","08:25:00","08:25:00","08:25:00","08:25:00","08:25:00","08:25:00","08:25:00","si"],["08:25:00","08:25:00","08:25:00","08:25:00","08:25:00","08:25:00","08:25:00","08:25:00","08:25:00","08:25:00","no"],
        ["08:25:00","08:25:00","08:25:00","08:25:00","08:25:00","08:25:00","08:25:00","08:25:00","08:25:00","08:25:00","no"],["08:25:00","08:25:00","08:25:00","08:25:00","08:25:00","08:25:00","08:25:00","08:25:00","08:25:00","08:25:00","si"],
    ];
    /*
        [
            {"r":0,"c":[[0,9]]},
            {"r":1,"c":[[0,2],[5,9]]},
            {"r":2,"c":[[5,9]]},
            {"r":3,"c":[[5,9]]},
            {"r":4,"c":[[5,9]]},
            {"r":5,"c":[[5,9]]},
            {"r":6,"c":[[5,5],[8,9]]},
            {"r":7,"c":[[5,9]]},
            {"r":8,"c":[[5,9]]},
            {"r":9,"c":[[5,5],[7,9]]},
            {"r":10,"c":[[5,9]]}
        ]
    */
    for(let f = 0; f < n_filas; f++){
        const c_range = rango_filas_vacias[f].c.length;
        for(let c = 0; c<c_range; c++){
            const min = rango_filas_vacias[f].c[c][0];
            const max = rango_filas_vacias[f].c[c][1];
            for (let z = min; z <= max; z++) {
                arr_template[f][z] = "*";
            }
        }
    }    
    console.log(arr_template);
}

function columnasVacias(_filas){ //gracias a que tenemos la fn ponerColumnasVacias no seria necesario, igual se deja porlas
    for(let c = 0; c<n_columnas; c++){
        for(let f = 0; f<n_filas; f++){
            const numeral = _filas[0][c].trim().charAt(0);
            //if(evaluador.test(numeral)){
            if(numeral !== "*"){
                break;
            }
            if(_filas[f][c] == "*"){
                if(f === (n_filas-1)){
                    columnas_vacias.push(c);
                }
            }else{
                break;
            }
        }
    }
}

function rangoFilasVacias(_filas){// solo necesario cuando n_columas > n_filas
    for(let f = 0; f<n_filas; f++){
        const a = {r:f,c:[]};
        for(let c = 0; c<n_columnas; c++){ //  ['*', '*', '*', '06:50:00', '07:15:00', '*', '*', '*', '*', '*', 'no']
            const ev = _filas[f][c].trim().charAt(0);
            if(ev === "*"){
                a.c.push(c);
            }
        }
        rango_filas_vacias.push(a);
    }
    rango_filas_vacias.forEach(e=> {
        e.c = notacionRangoArray(e.c);
        //console.log(e.r);
    });
    console.log("Rango filas vacias: ", JSON.stringify(rango_filas_vacias))
}

function rangoColumnasVacias(_filas){
    for(let c = 0; c<n_columnas; c++){
        const a = {c:c,r:[]};
        for(let f = 0; f<n_filas; f++){
            const ev = _filas[f][c].trim().charAt(0);
            if(ev === "*"){
                a.r.push(f);
            }
        }
        rango_columnas_vacias.push(a);
    }
    
    rango_columnas_vacias.forEach(e=> {
        e.r = notacionRangoArray(e.r);
        //console.log(e.r);
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

function reconstruccionVacio(){
    const col = [];
    for(let c = 0; c<n_columnas; c++){
        const row = [];
        for(let f = 0; f<n_filas; f++){
            row.push("a");
        }
        col.push(row);
    }

    rango_columnas_vacias.forEach(e=>{
        
    })
}

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
                HORARIO_OBJ.empresa = name_arr_script[0]; HORARIO_OBJ.ruta = name_arr_script[1];
                HORARIO_OBJ.dias = name_arr_script[2]; HORARIO_OBJ.sentido = name_arr_script[3];
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

function frecuenciaVertical(OH){
    let indice_pivote = 0;
    let columna_pivote;
    let saferow = 0;
    if(OH?.sentido === 'ab'){
        indice_pivote = 0;
    }else if(OH?.sentido === 'ba'){
        indice_pivote = n_columnas - 1;
    }

    /*  
    buscamos columna la pivote: la que tenga mas horarios
    col_aux_a = buscarPivoteIndice(indice_pivote,0); // no borramos
    col_aux_b = buscarPivoteIndice(indice_pivote,1);
    console.log(col_aux_a);
    console.log(col_aux_b);
    */

    columna_pivote = buscarPivoteAuto(n_filas, saferow);
    frecuencias_verticales = frecuenciasVerticalesAlt(columna_pivote);
    console.log(frecuencias_verticales);
    arregloExpresos();// console.log({filas_expreso, filas_regulares});
    console.log(frecienciasHorizontales());
}

function buscarPivoteAuto(n_filas, safeRow){//quitando la ultima -1
    //return traerColumna(0,0);
    const long_arr = [];
    const obj = {pos:0, val:0}
    for(let c = 0; c<n_columnas-1; c++){
        let col = traerColumna(c, safeRow).filter(e=>e!=="*");
        long_arr.push(col.length);
    }
    for(let i = 0; i < long_arr.length; i++){
        if (obj.val < long_arr[i]){
            obj.val = long_arr[i];
        }
    }
    obj.pos = long_arr.findIndex(e=>e===10);
    return traerColumna(obj.pos, 0).filter(e=>e!=="*");
}

function buscarPivoteIndice(indice, safeRow=undefined){
    let _filas = [...filas];
    let columna_pivote;
    let fila_safe;
    if(safeRow !== undefined){
        fila_safe = _filas[safeRow];
        safeRow++;
    }else{
        safeRow = 0;
    }
    columna_pivote = traerColumna(indice, safeRow).filter(e=>e!=="*")
    if(n_filas !== columna_pivote.length){
        for(let i = 1; i < n_columnas-1; i++){// -1 evita la columna con valor no/si
            let columna_analizar = traerColumna(i,safeRow).filter(e=>e!=="*");
            if(columna_analizar.length === n_filas-safeRow){
                columna_pivote = columna_analizar;
                break;
            }
        }
    }
    return {columna_pivote, fila_safe};
}

function traerColumna(indice, safeRow=0){//safeRow tiene que ser 1 si queremos rescatar la columna sin los valores de la primera fila
    const _filas = [...filas];
    const columna = [];
    for(let c = 0; c<n_columnas; c++){
        for(let f = 0+safeRow; f<n_filas; f++){
            columna.push(_filas[f][indice]);
        }
        break;
    }    
    return columna;
}

function armarPivoteHorizontalExpreso(){
    const _filas = [...filas];

    let filtrado = _filas.filter(e=>e[n_columnas-1]=="si")
    let filtrado_h = [];
    let max = 0; let pos = 0;
    for (let f = 0; f < filtrado.length; f++) {
        
        let fila = filtrado[f].filter(e=>{if(e!=="si")return e});

        if(max <= fila.length){
            max = fila.length; pos = f;
            filtrado_h.push(fila);
        }
    }
    let pivote =  filtrado_h[pos]
    
    pivote = pivote.map(e=>{if(e==="*"){return 0}else{return e}})
    return pivote;
}

function frecienciasHorizontales(){ // expreso, luego renombrar
    const _filas = [...filas];

    let evalua = _filas[3];
    
    let pivote = armarPivoteHorizontalExpreso();
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
        freqcalc.push({calc, c:time_pos[td]});
    }


    console.log({freqarr, zero_pos, time_pos, timearr, freqcalc});


    let valpivstr = _filas[3][0].split(":");
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
    console.log(resultado)

    return {freq:[]}
}

function frecienciasHorizontalesAlt(){
    const _filas = [...filas];
    const freq_diff_reg_zero = []; const freq_diff_exp_zero = [];
    const freq_h_reg = []; const freq_h_exp = [];
    let freq_h_regular; let freq_h_expreso;
    let max = 0;
    
    filas_expreso.forEach(fe => {
        const arr = _filas[fe].filter(e=>e!=="*");
        if(max < arr.length){
            max = arr.length;
            freq_h_expreso = _filas[fe];
        }
    });
    max = 0;
    filas_regulares.forEach(fr => {
        const arr = _filas[fr].filter(e=>e!=="*");
        if(max < arr.length){
            max = arr.length;
            freq_h_regular = _filas[fr];
        }
    });    
    //freq_h_regular.pop();
    //freq_h_expreso.pop();
    //console.log(freq_h_regular);
    //console.log(freq_h_expreso);
    for(let f = 0; f<freq_h_regular.length; f++){
        
        if(freq_h_regular[f] === "*"){
            freq_h_reg.push(0);//puede remplazarse por null o por -10000000
        }else{
            let timeval_reg = freq_h_regular[f].split(':');// cortamos los valores de json hhmmss
            let hh_reg = timeval_reg[0]; let mm_reg = timeval_reg[1];
            let dTime_reg = new Date(1970,0,1,hh_reg,mm_reg); // creamos el tipo de dato fecha
            freq_h_reg.push(dTime_reg.getTime()); // guardamos un arreglo de tiempos en milisegundos para comparar
        }
        if(freq_h_expreso[f] === "*"){
            freq_h_exp.push(0);//puede remplazarse por null o por -10000000
        }else{
            let timeval_exp = freq_h_expreso[f].split(':');// cortamos los valores de json hhmmss
            let hh_exp = timeval_exp[0]; let mm_exp = timeval_exp[1];
            let dTime_exp = new Date(1970,0,1,hh_exp,mm_exp); // creamos el tipo de dato fecha
            freq_h_exp.push(dTime_exp.getTime()); // guardamos un arreglo de tiempos en milisegundos para comparar
        }        

    }
    for(let i = 0; i<freq_h_regular.length; i++){

        let diff_r = 0; let diff_e = 0;
        if(i+1 !== freq_h_exp.length){
            diff_r = freq_h_reg[i + 1] - freq_h_reg[i];
            diff_e = freq_h_exp[i + 1] - freq_h_exp[i];
        }else{
            diff_r = freq_h_reg[i];
            diff_e = freq_h_exp[i];
        }
        freq_diff_reg_zero.push(diff_r);
        freq_diff_exp_zero.push(diff_e);
    }
    freq_diff_reg_zero.pop();
    freq_diff_exp_zero.pop();
    //console.log(freq_diff_reg_zero);
    //console.log(freq_diff_exp_zero);
    let sum_r, sum_e;
    let arr_aux_r = freq_diff_reg_zero.map(elem => sum_r = (sum_r || 0) + elem);
    let arr_aux_e = freq_diff_exp_zero.map(elem => sum_e = (sum_e || 0) + elem);
    arr_aux_r.pop(); arr_aux_e.pop();
    let res_arr_r = [0,...arr_aux_r];
    let res_arr_e = [0,...arr_aux_e];

    //console.log(res_arr_r.map(re=>re<0 ? 0 : re));
    //console.log(res_arr_e.map(rr=>rr<0 ? 0 : rr));
    let freq_reg_h = res_arr_r.map(re=>re<0 ? 0 : re);
    let freq_exp_h = res_arr_e.map(rr=>rr<0 ? 0 : rr);


    return {freq_exp_h, freq_reg_h}
}

function arregloExpresos(){
    const _filas = [...filas];
    const freq_arr_exp = [];
    const freq_arr_reg = [];
    for(let c = 0; c<n_columnas; c++){
        for(let f = 0; f<n_filas; f++){
            if(c === n_columnas-1){
                if(_filas[f][n_columnas-1] == "si"){ // a futuro 1 o 0
                    freq_arr_exp.push(f);
                }else{
                    freq_arr_reg.push(f);
                }
            }            
        }
    }
    //sacamos cual tiene el mayor numero de horarios, guardamos el indice y calculamos con algoritmo de frecuencias
    filas_expreso = freq_arr_exp;
    filas_regulares = freq_arr_reg;
}
function frecuenciasVerticales(pivote){
    const freq_arr = [];
    const freq_diff = [];

    for(let f = 0; f<pivote.length; f++){
        //console.log(new Date(1970,0,1,9,30))
        let timeval = pivote[f].split(':');// cortamos los valores de json hhmmss
        let hh = timeval[0]; let mm = timeval[1];
        let dTime = new Date(1970,0,1,hh,mm); // creamos el tipo de dato fecha
        freq_arr.push(dTime.getTime()); // guardamos un arreglo de tiempos en milisegundos para comparar
    }

    
    for(let i = 0; i < pivote.length; i++){
        let diff = 0; let prev_diff = 0;
        if(i+1 !== pivote.length){
            diff = freq_arr[i + 1] - freq_arr[i];                
        }else{
            diff = freq_arr[i];
        }
        freq_diff.push(diff);
    }
    return {freq_arr, freq_diff};

}
function frecuenciasVerticalesAlt(pivote){// tomando referencia 0 a ultimo arreglo con sumatoria de minutos
    //evaluar
    const freq_arr = [];
    const freq_diff = [];
    const freq_step = [];

    //freq_arr
    for(let f = 0; f<pivote.length; f++){
        //console.log(new Date(1970,0,1,9,30))
        let timeval = pivote[f].split(':');// cortamos los valores de json hhmmss
        let hh = timeval[0]; let mm = timeval[1];
        let dTime = new Date(1970,0,1,hh,mm); // creamos el tipo de dato fecha
        freq_arr.push(dTime.getTime()/1000); // guardamos un arreglo de tiempos en milisegundos para comparar
    }

    //freq_diff
    for(let i = 0; i < pivote.length; i++){
        let diff = 0;
        if(i+1 !== pivote.length){
            diff = freq_arr[i + 1] - freq_arr[i];
            
        }else{
            diff = freq_arr[i];
        }
        freq_diff.push(diff);
    }

    let sum;
    let arr_aux = freq_diff.map(elem => sum = (sum || 0) + elem);
    arr_aux.pop()
    let res_arr = [0,...arr_aux];

    //freq_step
    for(let i = 0; i < pivote.length; i++){
        let diff = 0;
        if(i+1 !== pivote.length){
            diff = freq_arr[i + 1] - freq_arr[i];
            freq_step.push(diff);            
        }
    }

    return {freq_arr, freq_diff:res_arr, freq_step};

}

/*
function frecuenciasVerticales(safeRow=true, columnPosition=0){
    const freq_arr = []; let primer_valor = filas[0][0];
    let primer_tiempo = ""; let sr = safeRow ? 1 : 0;
    let freq_arr_size = 0;

    for(let c = 0; c<columnPosition+1; c++){
        for(let f = sr; f<n_filas; f++){
            //console.log(new Date(1970,0,1,9,30))
            let timeval = filas[f][columnPosition].split(':');// cortamos los valores de json hhmmss
            let hh = timeval[0]; let mm = timeval[1];
            let dTime = new Date(1970,0,1,hh,mm); // creamos el tipo de dato fecha
            freq_arr.push(dTime.getTime()); // guardamos un arreglo de tiempos en milisegundos para comparar
        }
    }
    
    freq_arr_size = freq_arr.length;
    const fqwe = [];
    if(primer_tiempo.trim().charAt(0) !== "*" && primer_valor.trim().charAt(0) === "*"){

        for(let i = 0; i < freq_arr_size; i++){
            let diff = 0; let prev_diff = 0;
            if(i+1 !== freq_arr_size){
                diff = freq_arr[i + 1] - freq_arr[i];                
            }else{
                diff = freq_arr[i];
            }
            fqwe.push(diff);
        }

        console.log(fqwe);
    }

}
*/
