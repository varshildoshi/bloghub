import * as moment from 'moment';

export const convertDate = (date: string, sourceFormat: string, lang: string) => {
    if (lang == 'en') {
        return moment(date, sourceFormat).format('MMM DD, YYYY');
    }
    return date;
}

export const convertDateTime = (dateTime: string, sourceFormat: string, lang: string) => {
    if (lang == 'en') {
        //use always moment.js npm package to deal with date and time
        return moment(dateTime, sourceFormat).format('MMM DD, YYYY HH:MM');
    }
    return dateTime;
}
