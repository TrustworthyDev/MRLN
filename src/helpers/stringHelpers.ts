// Shortens the string to the last word in a sentence
import { Agency } from "@/types/Article";

function truncateString(yourString: string, maxLength: number): string {
    // get the index of space after maxLength
    const index = yourString.indexOf(" ", maxLength);
    return index === -1 ? yourString : yourString.substring(0, index);
}

function shortenStringReturnMore(yourString: string, maxLength: number): string {
    if (yourString.length > maxLength) {
        const response: string = truncateString(yourString, maxLength);
        return `${response}...`;
    }
    return yourString;
}

function buildAgenciesString(allAgencies: Array<Agency>): string {
    let agenciesString = '';
    allAgencies.forEach((agency, idx) => {
        if (idx === allAgencies.length - 1) {
            agenciesString += agency.name;
        } else {
            agenciesString += agency.name + ', ';
        }
    });

    return agenciesString;
}

// Shortens the agencies string and returns
function shortenAgencies(allAgencies: Array<Agency>, maxLength: number): string {
    let agenciesString = buildAgenciesString(allAgencies);
    agenciesString = shortenStringReturnMore(agenciesString, maxLength);
    return agenciesString;
}


function formatDateString(inputDateString: string): string {
    const date = new Date(inputDateString);
    const options: Intl.DateTimeFormatOptions = {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        hour12: true
    };
    const dateFormatter = new Intl.DateTimeFormat('en-US', options);
    const formattedDate = dateFormatter.format(date);
    return formattedDate;
}

export {
    shortenStringReturnMore,
    shortenAgencies,
    buildAgenciesString,
    formatDateString
}
