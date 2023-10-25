import data from "./json/exprebus-38-sabados-ns.json" assert { type: 'json' };

const horario = "exprebus-38-sabados-ab.json"; // harcoded: porque esto lo evaluariamos con nodejs
const columnas = data.data_header;
const filas = data.data_body;
const vigencia = data.data_validity;
//[fy][cx]
const n_columnas = columnas.length;
const n_filas = filas.length;

const columnas_vacias = [];

const evaluador = /[(*) -/+.¡?!#$%&=°|<>_]/g;
const orientation_regex = /\b((ab)|(ba))\b/g; // si cambia la posicion de sentido en nemotecnica, mover de lugar "-" /{-}\b(ab|ba)\b/g;
const evaluador_vacio = "*"; //a futuro, hacerlo expresion regular

console.log(validarNombreArchivo(horario));
console.log("Data body:",filas);
columnasVacias();
console.log("Columnas Vacias:",columnas_vacias);


function columnasVacias(){
    for(let c = 0; c<n_columnas; c++){
        for(let f = 0; f<n_filas; f++){
            
            //if(!evaluador.test(filas[0][c].trim())){
            if(filas[0][c].trim().charAt(0) != "*"){
                break;
            }
            if(filas[f][c] == "*"){
                if(f === (n_filas-1)){
                    columnas_vacias.push(c);
                }
            }else{
                break;
            }
        }
    }
}

function validarNombreArchivo(nombre=""){
    const name_arr_dot = horario.split('.');

    if(name_arr_dot.length === 2){
        const name_arr_orientation = name_arr_dot[0].split('-');
        const str_orientation = name_arr_orientation[name_arr_orientation.length - 1];
        if(true){
            console.log(orientation_regex.test(str_orientation));
        }else{
            throw new Error("La nemotecnica es empresa-ruta-dias-sentido: no se encontró sentido ab | ba en nombre de archivo");    
        }
    }else{
        throw new Error("El archivo es invalido, debe tener formato JSON, y un solo punto en su nombre");
    }
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
