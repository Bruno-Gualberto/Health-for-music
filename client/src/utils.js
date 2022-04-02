export default function formatDate(wholeDate) {
    return `${wholeDate.split(" ").splice(2, 1).join("")} ${wholeDate
        .split(" ")
        .splice(1, 1)
        .join("")} ${wholeDate.split(" ").splice(3, 1).join("")}`;
}
