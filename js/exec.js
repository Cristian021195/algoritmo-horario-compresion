let arr = [
    [[0,1]],
    [[0,1],[3],[9]],
    [[0,1],[3],[9]],
    [[0],[3],[9]],
    [[0]],
    [[0,2],[4,8],[10]],
    [[0,5],[7,10]],
    [[0,5],[7,8],[10]],
    [[0,8],[10]],
    [[0,8],[10]]
];
function notacionRangoArray(evalarr){
    let resultarr;
    if (Array.isArray(evalarr) && evalarr?.length) {// no vacio
        const res = [];
        let jumper = false;
        let rng = [evalarr[0]];
        for(let i=1; i < evalarr.length; i++){
            if(evalarr[i]-evalarr[i-1] == 1){
                jumper = true;
            }
            else{
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
        res.push(rng);
        rng = [];
        resultarr = res;
    }else{
        resultarr = [];
    }
    if(resultarr.length > 1){
        resultarr = resultarr.map(ra=>{
            if(ra.length == 2){
                if(ra[0] == ra[1]){
                    return [ra[0]]
                }
                return ra
            }else{
                return ra
            }
        })
    }
    return resultarr;
}
/* 
    - Densidad: 288 x [4 a 20 ciudades] = 1152 a  5760 celdas 
    - El horario mas largo hasta ahora tiene 12 columnas, lo que daría: 288 x 12 = 3456 columnas
    - El numero de columnas es el numero a reducir por coincidencias de horarios en diferentes ciudades y frecuencias de tuplas.
    - La mayoria de los horarios tiene en las ciudades lejanas menos lineas (valor *, nulo), es casi el 30-40% de la densidad total de la tabla
    lo que nos deja 3456 x [0.6, 0.7] = 2074 a 2500 celdas
    - De esas 2074 a 2500 celdas, podemos quitar las coincidentes, (mayormente coincidencias de a 2 y 3)
    en un 10-20% de la densidad, lo que equivale a 1800, 1600, 2250, 2000 celdas resultantes.

    Calculo Aproximado Real: 50x12 = 600 celdas
    - Densidad: 50 x 12 = 600 celdas 
    - El horario mas largo hasta ahora tiene 12 columnas, lo que daría: 50 x 12 = 600 celdas
    - El numero de columnas es el numero a reducir por coincidencias de horarios en diferentes ciudades y frecuencias de tuplas.
    - La mayoria de los horarios tiene en las ciudades lejanas menos lineas (valor *, nulo), es casi el 30-40% de la densidad total de la tabla
    lo que nos deja 600 x [0.6, 0.7] = 360 a 420 celdas
    - De esas 360 a 420 celdas, podemos quitar las coincidentes, (mayormente coincidencias de a 2 y 3)
    en un 10-20% de la densidad, lo que equivale a 324, 288, 378, 336 celdas resultantes.
    - pueden ser menos celdas, muchos horarios son 40 celdas promedios. lo que darian < 300 celdas

    - tomando la maxima: "t":"08:45", "f":[1,4,5], "c":[9,4,2] // 39 caracteres x celdas
        - 11.700 caracteres maximo
        - 5000 caracteres minimo
    - 

    Calculo Aproximado Real Minomo: 41x10 = 410 celdas
        - 30-40%
        - 10-20%
        240 a 300 celdas, 9360 caracteres
*/
//console.log(Date.parse("1970-01-01 09:30 GMT-3"))


/* El arreglo de frecuencias verticales, el pivote, analizar de donde empezamos. pero en caso de obtenerlo hacer el arreglo
que tome como base la primer celda de dicha columna pivote, y vaya haciendo diferencias y sumandolas / comparandolas cn el horario principal 
05:30	06:00	06:30	07:00	08:00	08:30	09:10	10:00	10:30	11:00
0min    30min   60min   90min   150min  180min  220min  270min  300min  330min - respecto de 50:30 (el original)

- lo que se me ocurre es, crear el algoritmo (puede ser recursivo, tomando el n max de filas) para obtener la columna
pivote, y asi calcular dichas frecuencias verticales
- en caso de no encontrar la columna pivote en el primer llamado o ciclo, hacerlo como maximo en el segundo, pero a medida que restemos
tuplas, hay que guardarlas a estas tuplas como estan en un arreglo, indicando su posicion. por ejemplo nuestro excel.

- pivote: [0min     110min    30min   60min   90min   150min  180min  220min  270min  300min  330min - respecto de 50:30 (el original)]
- teniendo el pivote, recorremos fila x celda, y si tienen un valor dif de *, ver que valor es y posicion de fila corresponde, y calcular sus respectivos con f vertical
- llenaremos celdas que no van, pero luego restamos las columnas vacias, y al final, hacermos el recorrido para vaciar las que no van, habiendo guardado
previamente este arreglo

*/

