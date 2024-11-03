// Debug objects
export const logObject = ({ object }) => {
    console.log(JSON.stringify(object, null, 2));
}

// Return random array
export const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  };