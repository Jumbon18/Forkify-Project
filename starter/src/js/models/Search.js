import axios from 'axios';
import {key, iraKey} from '../config';

export default class Search {
    constructor(query) {
        this.query = query;

    }

    async getResult() {

        try {
            const res = await axios(`https://www.food2fork.com/api/search?key=${key}&q=${this.query}`);
            this.result = res.data.recipes;

            await this.persistedSearch();
        } catch (error) {
            console.log(error);
        }
    }

  async  persistedSearch() {
       const ser = await  localStorage.setItem('searchResults', JSON.stringify(this.result));

    }

    readSearchREsult() {
        const storage = JSON.parse(localStorage.getItem('searchResults'));
        if (storage) {
            this.result = storage;
        }
    }
}

