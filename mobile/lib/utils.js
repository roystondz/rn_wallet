
export function formatDate(dateString){
    const date = new Date(dateString);

    return date.toDateString("en-US",{
        year: "numeric",
        month: "long",
        day: "numeric"
    })

}