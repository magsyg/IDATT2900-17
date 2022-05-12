
const monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
];
const weekDayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const shortWeekDayNames = ["Su", "M", "Tu", "W", "Th", "F", "Sa"];
export const currentDate = () => {
    const date = new Date();
    return monthNames[date.getMonth()] + " " + date.getDate();
}

export const transformNiceDate = dateString => {
    const date = new Date(dateString);
    return weekDayNames[date.getDay()]+" / "+date.getDate().toString() + " / " + (1+date.getMonth()).toString() 
  }

export const transformNiceShortDate = dateString => {
    const date = new Date(dateString);
    return shortWeekDayNames[date.getDay()]+ "/" + (1+date.getMonth()).toString()  +"/"+date.getDate().toString()
}

export const transformMonthDate = dateString => {
    const date = new Date(dateString);
    return monthNames[1+date.getMonth()] + " "  + date.getDate();
}
