p
interface Weapon {
    name: string;
    damage: number;
}
const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

abstract class Fighter {
    constructor(
        readonly name: string, 
        public hp: number,
        public mana: number,
        public weapon: Weapon,
        private _armor: number = 0
    ){
        this.armor = _armor;
    };
    set armor(value: number) {
        this._armor = Math.max(0, Math.min(value, 50));
    }
    get armor(): number {
        return this._armor;
    }

    public takeDamage(rawDamage: number): number {
        const reducedDamage = rawDamage * (1 - this.armor / 100);
        this.hp = Math.max(0, this.hp - reducedDamage);
        return reducedDamage;
    }

    abstract attack(target: Fighter): Promise<void>;
}

class Mage extends Fighter {
    async attack(target: Fighter): Promise<void> {
        await delay(1000);
        let finalDamage: number;
        let actionDescription: string;

        if (this.mana >= 20) {
            this.mana -= 20;
            const magicDamage = this.weapon.damage * 3;
            finalDamage = target.takeDamage(magicDamage);
            actionDescription = `випустив 🔥 ВОГНЯНУ КУЛЮ`;
        } else {
            this.mana += 10;
            const weakHit = this.weapon.damage * 0.5;
            finalDamage = target.takeDamage(weakHit);
            actionDescription = `вдарив посохом та відновив ману ✨`;
        }

        console.log(`🧙 ${this.name} ${actionDescription} у ${target.name}. Нанесено ${finalDamage.toFixed(1)} шкоди. (MP: ${this.mana})`);
    }
}

class Knight extends Fighter{
    async attack(target: Fighter): Promise<void> {
        await delay(1000);
        const isCrit = getRandomNumber(5) === 0;
        const rawDamage = isCrit ? this.weapon.damage * 2 : this.weapon.damage;
        const finalDamage = target.takeDamage(rawDamage);
        console.log(`⚔️ ${this.name} атакує ${target.name}${isCrit ? ' (КРИТ!)' : ''}. Нанесено ${finalDamage.toFixed(1)} шкоди. (HP: ${target.hp.toFixed(1)})`);
    }
}

class Archer extends Fighter{
    async attack(target: Fighter): Promise<void> {
        await delay(1000);
        const isCrit = getRandomNumber(3) === 0;
        const rawDamage = isCrit ? this.weapon.damage * 2 : this.weapon.damage;
        const finalDamage = target.takeDamage(rawDamage);

        console.log(`⚔️ ${this.name} атакує ${target.name}${isCrit ? ' (КРИТ!)' : ''}. Нанесено ${finalDamage.toFixed(1)} шкоди. (HP: ${target.hp.toFixed(1)})`);
    }
}

class Arena {
    async startFight(f1: Fighter, f2: Fighter): Promise<void> {
        console.log(`--- БОЙОВЕ ТЕСТУВАННЯ: ${f1.name} VS ${f2.name} ---`);
        let turn = 1;

        while (f1.hp > 0 && f2.hp > 0) {
            console.log(`\nХід №${turn}:`);
            await f1.attack(f2);
            if (f2.hp <= 0) break;
            await f2.attack(f1);
            turn++;
        }

        console.log("\n====================");
        const winner = f1.hp > 0 ? f1.name : f2.name;
        console.log(`🏆 ПЕРЕМОЖЕЦЬ: ${winner.toUpperCase()}!`);
    }
}

function getRandomNumber(max: number):number{
    //return Math.random() * (max-min) + min; //  1/5
    return Math.floor(Math.random() * max);
}

const excalibur = { name: "Екскалібур", damage: 15 };
const staff = { name: "Посох Мудрості", damage: 8 };

const arthur = new Knight("Артур", 120, 0, excalibur, 40);
const gandalf = new Mage("Гендальф", 80, 50, staff, 10);

const arena = new Arena();
arena.startFight(arthur, gandalf);




