export default class Likes {
    constructor(){
        this.like = [];
    }
    addLike(id,title,author,img){
        const like = {
            id,
            title,
            author,
            img
        };
        this.like.push(like);
        //Persist data in LocalStorage
        this.persistData();
        return like;
    }

    deleteLike(id){
        const index= this.like.findIndex(el=>el.id === id);
        this.like.splice(index,1);
        //Persist data in LocalStorage
this.persistData();
    }
    isLiked(id){
        return this.like.findIndex(el =>el.id === id) !== -1;
    }
    getNumLikes(){
        return this.like.length;
    }
    persistData(){
   localStorage.setItem('likes',JSON.stringify(this.like));
    }
    readStorage(){
        const storage = JSON.parse(localStorage.getItem('likes'));
   //Restoring likes from the local storage
    if(storage){
        this.like = storage;
    }
    }
}
