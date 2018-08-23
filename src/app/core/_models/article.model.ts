export class Article {

    constructor(
        public id?: string,
        public name?: string,
        public date?: string,
        public description?: string,
        public image?: string | any,
        public imageRef?: string,
        public video?: string,
        public active?: number) {
    }

}
