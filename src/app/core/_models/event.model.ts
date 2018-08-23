export class Event {

    constructor(
        public id?: string,
        public name?: string,
        public date?: string,
        public timeFinishList?: string,
        public famalePrice?: string,
        public malePrice?: string,
        public description?: string,
        public image?: string | any,
        public imageRef?: string,
        public hasList?: number,
        public limitList?: string,
        public active?: number) {
    }

}
