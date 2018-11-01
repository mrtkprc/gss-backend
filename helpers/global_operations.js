convertDate2YearMonthDay = (date) => {
    const d = new Date(date.getFullYear(),date.getMonth(),date.getDate(),0,0,0,0);
    const today = d.getFullYear().toString()+"-"+("0" + (d.getMonth() + 1)).slice(-2).toString()+"-"+("0" + d.getDate()).slice(-2).toString();
    return today;
}
convertDate2DateAndTime = (date) => {
    const d = new Date(date.getFullYear(),date.getMonth(),date.getDate(),date.getHours(),date.getMinutes(),date.getSeconds());
    const today = d.getFullYear().toString()+"-"+("0" + (d.getMonth() + 1)).slice(-2).toString()+"-"+("0" + d.getDate()).slice(-2).toString();
    const today_with_hour = today+ " "+ ("0" + d.getHours()).slice(-2).toString()+":"+ ("0" + d.getMinutes()).slice(-2).toString()+":"+("0" + d.getSeconds()).slice(-2).toString();
    return today_with_hour;
}

module.exports.convertDate2YearMonthDay = convertDate2YearMonthDay;
module.exports.convertDate2DateAndTime = convertDate2DateAndTime;