const rangos = ["00:00","00:05","00:10","00:15","00:20","00:25","00:30","00:35","00:40","00:45","00:50","00:55","01:00","01:05","01:10","01:15","01:20","01:25","01:30","01:35","01:40","01:45","01:50","01:55","02:00","02:05","02:10","02:15","02:20","02:25","02:30","02:35","02:40","02:45","02:50","02:55","03:00","03:05","03:10","03:15","03:20","03:25","03:30","03:35","03:40","03:45","03:50","03:55","04:00","04:05","04:10","04:15","04:20","04:25","04:30","04:35","04:40","04:45","04:50","04:55","05:00","05:05","05:10","05:15","05:20","05:25","05:30","05:35","05:40","05:45","05:50","05:55","06:00","06:05","06:10","06:15","06:20","06:25","06:30","06:35","06:40","06:45","06:50","06:55","07:00","07:05","07:10","07:15","07:20","07:25","07:30","07:35","07:40","07:45","07:50","07:55","08:00","08:05","08:10","08:15","08:20","08:25","08:30","08:35","08:40","08:45","08:50","08:55","09:00","09:05","09:10","09:15","09:20","09:25","09:30","09:35","09:40","09:45","09:50","09:55","10:00","10:05","10:10","10:15","10:20","10:25","10:30","10:35","10:40","10:45","10:50","10:55","11:00","11:05","11:10","11:15","11:20","11:25","11:30","11:35","11:40","11:45","11:50","11:55","12:00","12:05","12:10","12:15","12:20","12:25","12:30","12:35","12:40","12:45","12:50","12:55","13:00","13:05","13:10","13:15","13:20","13:25","13:30","13:35","13:40","13:45","13:50","13:55","14:00","14:05","14:10","14:15","14:20","14:25","14:30","14:35","14:40","14:45","14:50","14:55","15:00","15:05","15:10","15:15","15:20","15:25","15:30","15:35","15:40","15:45","15:50","15:55","16:00","16:05","16:10","16:15","16:20","16:25","16:30","16:35","16:40","16:45","16:50","16:55","17:00","17:05","17:10","17:15","17:20","17:25","17:30","17:35","17:40","17:45","17:50","17:55","18:00","18:05","18:10","18:15","18:20","18:25","18:30","18:35","18:40","18:45","18:50","18:55","19:00","19:05","19:10","19:15","19:20","19:25","19:30","19:35","19:40","19:45","19:50","19:55","20:00","20:05","20:10","20:15","20:20","20:25","20:30","20:35","20:40","20:45","20:50","20:55","21:00","21:05","21:10","21:15","21:20","21:25","21:30","21:35","21:40","21:45","21:50","21:55","22:00","22:05","22:10","22:15","22:20","22:25","22:30","22:35","22:40","22:45","22:50","22:55","23:00","23:05","23:10","23:15","23:20","23:25","23:30","23:35","23:40","23:45","23:50","23:55"];
console.log(rangos.length); // 288 filas totales
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
console.log(new Date(1970,0,1,9,30))
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

