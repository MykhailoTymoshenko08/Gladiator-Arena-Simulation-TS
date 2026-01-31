
interface Weapon {
    name: string;
    damage: number;
}

abstract class Fighter {
    constructor(
        readonly name: string, 
        public hp: number,
        public weapon: Weapon,
        private _armor: number = 0
    ){};
    abstract attack(target: Fighter) : Promise<void>;
    set armor(value: number){
        if (value > 50){
            console.log("Броня не може бути більшою за 50%!");
            this._armor = 50;
        } else if (value < 0) {
            this._armor = 0;
        } else {
            this._armor = value;
        }
    }
    get armor() : number{
        return this._armor;
    }
    abstract takeDamage(damage: number):number;
}

class Knight extends Fighter{
    constructor(name: string, hp: number, weapon: Weapon, armor: number){
        super(name, hp, weapon, armor);
    }
    async attack(target: Fighter): Promise<void> {
        const delay = (ms: number) => new Promise(res => setTimeout(res, ms));
        await delay(1000);
        const isCrit = getRandomNumber(5) === 0;
        const damage = isCrit ? (this.weapon.damage*2) * (1 - this.armor/100) : this.weapon.damage * (1- this.armor/100);
        const finalDamage = target.takeDamage(damage)
        target.hp = Math.max(0, target.hp - finalDamage);
        console.log(`⚔️ ${this.name} вдарив ${target.name} ${isCrit ? '(КРИТ!) ' : ''}на ${finalDamage}. У ${target.name} залишилось ${target.hp} HP`);
    }
    takeDamage(damage: number):number{
        return damage * (1 - this.armor/100)
    }
}

class Archer extends Fighter{
    constructor(name: string, hp: number, weapon: Weapon, armor: number){
        super(name, hp, weapon, armor);
    }
    async attack(target: Fighter): Promise<void> {
        const delay = (ms: number) => new Promise(res => setTimeout(res, ms));
        await delay(1000);
        const isCrit = getRandomNumber(3) === 0;
        const damage = isCrit ? (this.weapon.damage*2) * (1 - this.armor/100) : this.weapon.damage * (1- this.armor/100);
        const finalDamage = target.takeDamage(damage)
        target.hp = Math.max(0, target.hp - finalDamage);
        console.log(`⚔️ ${this.name} вдарив ${target.name} ${isCrit ? '(КРИТ!) ' : ''}на ${finalDamage}. У ${target.name} залишилось ${target.hp} HP`);
    }
    takeDamage(damage: number):number{
        return damage * (1 - this.armor/100)
    }
}

class Arena {
    async startFight(f1: Fighter, f2: Fighter): Promise<void>{
        console.log(`--- Бій почався: ${f1.name} VS ${f2.name} ---`);
        let turn: number = 1;
        while (f1.hp > 0 && f2.hp > 0) {
            console.log(`Хід №${turn}:`);
            turn%2==1 ? await f1.attack(f2) : await f2.attack(f1);
            turn+=1;
        }
        console.log("====================");
        console.log(f1.hp > 0 ? `🏆 ${f1.name} переміг!` : `🏆 ${f2.name} переміг!`);
    }
}

function getRandomNumber(max: number):number{
    //return Math.random() * (max-min) + min; //  1/5
    return Math.floor(Math.random() * max);
}

const sword = { name: "Екскалібур", damage: 15 };
const bow = { name: "Довгий лук", damage: 10 };

const knight = new Knight("Артур", 100, sword, 40);
const archer = new Archer("Робін", 80, bow, 10);

const colosseum = new Arena();
colosseum.startFight(knight, archer);

