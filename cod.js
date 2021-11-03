let canvas = document.getElementById("myCanvas")
let ctx = canvas.getContext("2d")

let kol_cell_w = 200//количество клеток в ширину
let kol_cell_h = 80//количество клеток в высоту
let convas_w = 2000//ширина конваса
let convas_h = 800//высота конваса
let cell_w = convas_w/kol_cell_w//ширина клетки
let cell_h = convas_h/kol_cell_h//высота клетки
let bufer = 0//буфер
let t = []//деревья
let seeds = []//семена
let gen_len = 10
let s

let pole = [[0]]//создание поля
for (let i = 0; i < kol_cell_w; i++){
    pole[i] = [0]
    for(let j = 0; j < kol_cell_h; j++){
        pole[i][j] = -1
    }
}
class cells {//клетка
    constructor(posx, posy, type){
        this.posx = posx
        this.posy = posy
        this.type = type//номер gen-а по которому работает клетка
        pole [posx][posy] = 1//обазначение на поле
    }
    Draw_s(){//отрисовка клетки(нужно переделать через pole)
        ctx.fillRect (this.posx * cell_w, this.posy * cell_h, cell_w, cell_h)
    }
}

class treas {//деревья
    age = 0
    energy = 20
    cells = []
    my_seeds = []
    constructor(posx, x){
        this.posx = posx
        this.gen = x
        this.cells[0] = new cells(this.posx, kol_cell_h-1, 0)//стартовая позиция
    }
    Draw(){//отрисовка клетки(нужно переделать через pole)
        for(let i = 0; i < this.cells.length; i++){
            this.cells[i].Draw_s()
        }
        for(let i = 0; i < this.my_seeds.length; i++){
            this.my_seeds[i].Draw()
        } 
    }
    run(){
        for(let i = 0; i < this.my_seeds.length; i++){
            this.my_seeds[i].age ++
        } 

        for(let i = 0; i < this.cells.length; i++ ){
            if (this.gen[this.cells[i].type][0] != -1 && pole[this.cells[i].posx][this.cells[i].posy-1] == -1){//рост вверх
                if (this.gen[this.cells[i].type][0] == 1){
                    this.my_seeds.push(new seed(this.cells[i].posx, this.cells[i].posy-1, this.gen))
                }
                else{
                    this.cells.unshift(new cells(this.cells[i].posx, this.cells[i].posy-1, this.gen[this.cells[i].type][0]))
                    i++
                }
            }
            if (this.cells[i].posx != kol_cell_w - 1){
                if (this.gen[this.cells[i].type][1] != -1 && pole[this.cells[i].posx+1][this.cells[i].posy] == -1){//рост вправо
                    if (this.gen[this.cells[i].type][1] == 1){
                        this.my_seeds.push(new seed(this.cells[i].posx+1, this.cells[i].posy, this.gen))
                    }
                    else{
                        this.cells.unshift(new cells(this.cells[i].posx+1, this.cells[i].posy, this.gen[this.cells[i].type][1]))
                        i++
                    }
                }
            }
            else{
                if (this.gen[this.cells[i].type][1] != -1 && pole[0][this.cells[i].posy] == -1){
                    if (this.gen[this.cells[i].type][1] == 1){
                        this.my_seeds.push(new seed(0, this.cells[i].posy, this.gen))
                    }
                    else{
                        this.cells.unshift(new cells(0, this.cells[i].posy, this.gen[this.cells[i].type][1]))
                        i++
                    }
                }
            }
            if (this.gen[this.cells[i].type][2] != -1 && pole[this.cells[i].posx][this.cells[i].posy+1] == -1){//рост вниз
                if (this.gen[this.cells[i].type][2] == 1){
                    this.my_seeds.push(new seed(this.cells[i].posx, this.cells[i].posy+1, this.gen))
                }
                else{
                    this.cells.unshift(new cells(this.cells[i].posx, this.cells[i].posy+1, this.gen[this.cells[i].type][2]))
                    i++
                }
            }
            if (this.cells[i].posx != 0){
                if (this.gen[this.cells[i].type][3] != -1 && pole[this.cells[i].posx-1][this.cells[i].posy] == -1){//рост влево
                    if (this.gen[this.cells[i].type][3] == 1){
                        this.my_seeds.push(new seed(this.cells[i].posx-1, this.cells[i].posy, this.gen))
                    }
                    else{
                        this.cells.unshift(new cells(this.cells[i].posx-1, this.cells[i].posy, this.gen[this.cells[i].type][3]))
                        i++
                    }
                }
            }
            else{
                if (this.gen[this.cells[i].type][3] != -1 && pole[kol_cell_w-1][this.cells[i].posy] == -1){
                    if (this.gen[this.cells[i].type][0] == 1){
                        this.my_seeds.push(new seed(kol_cell_w-1, this.cells[i].posy, this.gen))
                    }
                    else{
                        this.cells.unshift(new cells(kol_cell_w-1, this.cells[i].posy, this.gen[this.cells[i].type][3]))
                        i++
                    }
                }
            }
        }
        this.energy = this.energy - this.cells.length * (1 + this.age/14)//растрата энергии
        for(let i = 0; i < this.cells.length; i++ ){
            bufer = 0
            for (let j = 0; j < this.cells[i].posy; j++){
                if (pole[this.cells[i].posx][j] != -1){
                    bufer++
                }
            }
            if (bufer > 2){}
            else if (bufer == 2){
                this.energy += 2
            }
            else if (bufer == 1){
                this.energy += 3
            }
            else{
                this.energy += 5
            }
        }
        if(this.energy < 0){//смерть от энергии
            this.kill()
        }
        this.age ++
    }
    kill(){//смерть
        for(let i = 0; i < this.cells.length; i++ ){
            pole[this.cells[i].posx][this.cells[i].posy] = -1
        }
        this.cells = []
        for(let i = 0; i < this.my_seeds.length; i++ ){
            pole[this.my_seeds[i].posx][this.my_seeds[i].posy] = -1
            if(this.my_seeds[i].age >= 5){
                seeds.push(this.my_seeds[i])
            }
        }
        this.my_seeds = []
    }
}

class seed{
    age = 0
    constructor(posx,posy,gen){
        this.posx = posx
        this.posy = posy
        this.gen = gen//геном
        pole [posx][posy] = 1//обазначение на поле
    }
    run(){
        //if (this.age >= 5){
            if (this.posy < kol_cell_h - 1){//падение
                pole[this.posx][this.posy] = -1
                this.posy ++
                pole[this.posx][this.posy] = 1
            }
       // }
        this.age++
    }
    Draw(){
        if (this.age >= 5){
            ctx.fillStyle = "#996300"
            ctx.fillRect (this.posx * cell_w, this.posy * cell_h, cell_w, cell_h)
        }
        else if (this.age == 4){
            ctx.fillStyle = "#cc8500"
            ctx.fillRect (this.posx * cell_w, this.posy * cell_h, cell_w, cell_h)
        }
        else if (this.age == 3){
            ctx.fillStyle = "#ffa600"
            ctx.fillRect (this.posx * cell_w, this.posy * cell_h, cell_w, cell_h)
        }
        else if (this.age == 2){
            ctx.fillStyle = "#ffb833"
            ctx.fillRect (this.posx * cell_w, this.posy * cell_h, cell_w, cell_h)
        }
        else if (this.age == 1){
            ctx.fillStyle = "#ffc966"
            ctx.fillRect (this.posx * cell_w, this.posy * cell_h, cell_w, cell_h)
        }
        else if (this.age == 0){
            ctx.fillStyle = "#ffdb99"
            ctx.fillRect (this.posx * cell_w, this.posy * cell_h, cell_w, cell_h)
        }
        ctx.fillStyle = "black"
    }
}

function draw(){//отрисовкка
    ctx.clearRect(0,0,canvas.width, canvas.height)

    ctx.fillStyle = "#009900"
    for (let i = 0; i < kol_cell_w; i++){
        for(let j = 0; j < kol_cell_h; j++){
            if (pole[i][j] == 1){
                ctx.fillRect (i * cell_w, j * cell_h, cell_w, cell_h)
            }
        }
    }
    ctx.fillStyle = "black"

    for(let i = 0; i < t.length; i++){
        t[i].Draw()//отрисовка клетки(нужно переделать через pole)
    }
    for(let i = 0; i < seeds.length; i++){
        seeds[i].Draw()//отрисовка клетки(нужно переделать через pole)
    }
}

function run(){
    for(let i = 0; i < t.length; i++){
        t[i].run()
        if (t[i].energy <= 0){//удаление трупов
            t.splice(i,1)
        }
    }
    for(let i = 0; i < seeds.length; i++){
        if (seeds[i].age >= 5 && pole[seeds[i].posx][seeds[i].posy+1] != -1){
            pole[seeds[i].posx][seeds[i].posy] = -1;
            seeds.splice(i,1)
        }
    } 
    for(let i = 0; i < seeds.length; i++){
        seeds[i].run()
        if (seeds[i].age >= 5 && seeds[i].posy == kol_cell_h-1){
            bufer = Math.floor(Math.random() * 10)
            if (bufer == 1){
                s = Math.floor(Math.random() * 20)
                console.log(s)
                if (s > gen_len - 1){
                    s = -1
                }
                seeds[i].gen[ Math.floor(Math.random() * gen_len) ][Math.floor(Math.random() * 4)] = s
            }
            t.push(new treas(seeds[i].posx, seeds[i].gen))
            console.log(t[t.length-1].gen)
            seeds.splice(i,1)
        }
    }
    draw()
}

let x = [[[0]]]//геном
for (let i = 0; i < gen_len; i++){//генирация генома
    x[0][i] = [0]
    for (let j = 0; j <= 3; j++){
        x[0][i][j] = Math.floor(Math.random() * 20)
        if (x[0][i][j] > gen_len - 1){
            x[0][i][j] = -1
        }
    }
}
x[1] = []
for (let i = 0; i < gen_len; i++){//генирация генома
    x[1][i] = [0]
    for (let j = 0; j <= 3; j++){
        x[1][i][j] = Math.floor(Math.random() * 20)
        if (x[1][i][j] > gen_len - 1){
            x[1][i][j] = -1
        }
    }
}
x[2] = []
for (let i = 0; i < gen_len; i++){//генирация генома
    x[2][i] = [0]
    for (let j = 0; j <= 3; j++){
        x[2][i][j] = Math.floor(Math.random() * 20)
        if (x[2][i][j] > gen_len - 1){
            x[2][i][j] = -1
        }
    }
}
seeds[0] = new seed(5,kol_cell_h-4,x[0])
seeds[1] = new seed(73,kol_cell_h-4,x[1])
seeds[2] = new seed(130,kol_cell_h-4,x[2])
console.log(x)//вывод первого генома


setInterval(run, 200)//цикл выполнения
