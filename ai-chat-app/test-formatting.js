// Test the formatting function with the example response
const formatGeminiResponse = (text) => {
  if (!text) return '';
  
  // Split the text into lines
  const lines = text.split('\n');
  const formattedLines = [];
  
  lines.forEach((line, index) => {
    const trimmedLine = line.trim();
    
    // Check for main headings (single asterisk)
    if (trimmedLine.startsWith('* ') && trimmedLine.endsWith('*')) {
      const headingText = trimmedLine.slice(2, -1); // Remove * and *
      formattedLines.push(`<h2 class="text-lg font-bold text-white mb-3 mt-4 first:mt-0">${headingText}</h2>`);
    }
    // Check for sub-headings (double asterisk)
    else if (trimmedLine.startsWith('** ') && trimmedLine.endsWith('**')) {
      const headingText = trimmedLine.slice(3, -2); // Remove ** and **
      formattedLines.push(`<h3 class="text-base font-semibold text-gray-200 mb-2 mt-3">${headingText}</h3>`);
    }
    // Check for bullet points (single asterisk at start)
    else if (trimmedLine.startsWith('* ') && !trimmedLine.endsWith('*')) {
      const bulletText = trimmedLine.slice(2); // Remove *
      
      // Check if the bullet point contains sub-headings (text wrapped in **)
      const formattedBulletText = bulletText.replace(
        /\*\*(.*?)\*\*/g,
        '<strong class="text-white font-semibold">$1</strong>'
      );
      
      formattedLines.push(`<li class="text-sm text-gray-300 mb-1 ml-4">${formattedBulletText}</li>`);
    }
    // Check for sub-bullet points (double asterisk at start)
    else if (trimmedLine.startsWith('** ') && !trimmedLine.endsWith('**')) {
      const bulletText = trimmedLine.slice(3); // Remove **
      formattedLines.push(`<li class="text-xs text-gray-400 mb-1 ml-8">${bulletText}</li>`);
    }
    // Regular text
    else if (trimmedLine) {
      formattedLines.push(`<p class="text-sm text-gray-300 mb-2">${trimmedLine}</p>`);
    }
    // Empty lines
    else {
      formattedLines.push('<br>');
    }
  });
  
  // Wrap bullet points in ul tags
  let formattedText = formattedLines.join('');
  
  // Replace consecutive li tags with ul wrapper
  formattedText = formattedText.replace(
    /(<li[^>]*>.*?<\/li>)+/g,
    (match) => `<ul class="list-disc list-inside mb-3">${match}</ul>`
  );
  
  return formattedText;
};

// Test with the example response
const testResponse = `To suggest beautiful places for your road trip, I need a little more information! Tell me:

* **Where are you starting and ending your trip?** (City and state, or even a general region)
* **How long will your trip be?** (Number of days or weeks)
* **What kind of scenery are you interested in?** (Mountains, beaches, deserts, forests, national parks, charming towns, etc.)
* **What's your budget like?** (Luxury, mid-range, budget-friendly)
* **What time of year are you traveling?** (This greatly impacts weather and accessibility)
* **What kind of activities do you enjoy?** (Hiking, swimming, sightseeing, historical sites, photography, etc.)

Once I have this information, I can give you a much more personalized and helpful list of beautiful places to see on your road trip.`;

console.log('Original response:');
console.log(testResponse);
console.log('\n' + '='.repeat(50) + '\n');
console.log('Formatted response:');
console.log(formatGeminiResponse(testResponse));
