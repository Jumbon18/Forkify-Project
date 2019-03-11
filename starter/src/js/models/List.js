import uniqid from 'uniqid';
export default class List{
    constructor(){
        this.items =[];
    }

    addItem(count,unit,ingredient){
        const item = {
           id:uniqid(),
            count,
            unit,
            ingredient
        };
        this.items.push(item);
        this.persistListData();
        return item;
    }
    deleteItem (id){
        const index = this.items.findIndex(el=>el.id ===id);
        this.items.splice(index,1);
        this.persistListData();

    }
    deleteList(){
        this.items=[];
    }
    getNumList(){
       return this.items.length;
    }
    updateCount(id,newCount){
        if(this.items.count >=0.1)
        this.items.find(el=>el.id ===id).count=newCount;

    }
    persistListData(){
         localStorage.setItem('lists',JSON.stringify(this.items));
    }
    readListData(){
        const storage = JSON.parse(localStorage.getItem('lists'));
        if(storage){
            this.items = storage;
        }
    }
/*    parseNewItem(newItem){
        const unitsLong = ['tablespoons', 'tablespoon', 'ounces', 'ounce', 'teaspoon', 'teaspoons', 'cups', 'pounds'];
        const unitsShort = ['tbsp', 'tbsp', 'oz', 'oz', 'tsp', 'tsp', 'cup', 'pound'];
        const units= [...unitsShort,'kg','g'];

        let ingredient = newItem.toLowerCase();

        unitsLong.forEach((unit, i) => {
            ingredient = ingredient.replace(unit, unitsShort[i]);
        });
        ingredient = ingredient.replace(/ *\([^)]*\) *!/g, ' ');
        const arrIng = ingredient.split(' ');
        const unitIndex = arrIng.findIndex(el2 => units.includes(el2));
        let objIng;
        if (unitIndex > -1) {
            const arrCount = arrIng.slice(0, unitIndex); // ex 4 1/2 cups, arrCount is [4,1/2]
            let count;
            if (arrCount.length === 1) {
                count = eval(arrIng[0].replace('-', '+'));
            } else {
                count = eval(arrIng.slice(0, unitIndex).join('+'));
            }
            objIng = {
                count,
                unit: arrIng[unitIndex],
                ingredient: arrIng.slice(unitIndex + 1).join(' ')
            }


        } else if (parseInt(arrIng[0], 10)) {
            objIng = {
                count: parseInt(arrIng[0], 10),
                unit: '',
                ingredient: arrIng.slice(1).join(' ')
            }
        } else if (unitIndex === -1) {
            //There is No unit and No number on 1st position
            objIng = {
                count: 1,
                unit: '',
                ingredient
            }
        }
        return objIng;
    }*/
}