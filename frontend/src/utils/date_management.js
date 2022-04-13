
export const currentDate = () => {
    const date = new Date();
    const monthNames = ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];
    return monthNames[date.getMonth()] + " " + date.getDate();
}

export const transformNiceDate = dateString => {
    const date = new Date(dateString);
    const weekDayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];


    return weekDayNames[date.getDay()]+" / "+date.getDate().toString() + " / " + (1+date.getMonth()).toString() 
  }

export const transformNiceShortDate = dateString => {
    const date = new Date(dateString);
    const weekDayNames = ["Su", "M", "Tu", "W", "Th", "F", "Sa"];


    return weekDayNames[date.getDay()]+ "/" + (1+date.getMonth()).toString()  +"/"+date.getDate().toString()
}