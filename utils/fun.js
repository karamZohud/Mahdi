export function calculateAge(dob) {
    const dobDate = new Date(dob); // Parse the date of birth
    const today = new Date(); // Get today's date
    
    let age = today.getFullYear() - dobDate.getFullYear();
    const monthDiff = today.getMonth() - dobDate.getMonth();
    const dayDiff = today.getDate() - dobDate.getDate();

    // Adjust the age if the current date is before the birth date this year
    if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
        age--;
    }

    return age;
}
export const dateFormate=(date2)=>{
    const date = new Date(date2);
    
    // Format the date
    const formattedDate = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
   
    return formattedDate;
  }
  