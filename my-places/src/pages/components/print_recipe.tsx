// Import the components
import { RecipeModel } from "../../api";

// Define row formats
const ingredient_row_format = '<li>{0} {1} {2}</li>';
const instruction_row_format = '<li>{0}</li>';
const note_row_format = '<li>{0}: {1}</li>';

function PrintRecipe({recipe}: {recipe: RecipeModel}) {
    // create new window to print from
    let printWindow = window.open('', '', 'width=600,height=1000');
    if (!printWindow) {
        return;
    }

    // add basic html to the new window
    printWindow.document.write('<html><head><title>Print Recipe</title>');
    printWindow.document.write('</head><body>');
    printWindow.document.write('<h1>' + recipe.name + '</h1>');
    printWindow.document.write('<p>' + recipe.description + '</p>');

    // write ingredients
    printWindow.document.write('<h2>Ingredients</h2>');
    printWindow.document.write('<ul>');
    for (let i of recipe.ingredients) {
        let ingredient_row = ingredient_row_format
            .replace('{0}', i.quantity ? i.quantity.toString() : '')
            .replace('{1}', i.measurement ? i.measurement : '')
            .replace('{2}', i.name ? i.name : '');
        printWindow.document.write(ingredient_row);
    }
    printWindow.document.write('</ul>');

    // write instructions
    printWindow.document.write('<h2>Instructions</h2>');
    printWindow.document.write('<ol>');
    for (let i of recipe.instructions) {
        let instruction_row = instruction_row_format
            .replace('{0}', i.description ? i.description : '');
        printWindow.document.write(instruction_row);
    }
    printWindow.document.write('</ol>');

    // write notes
    printWindow.document.write('<h2>Notes</h2>');
    printWindow.document.write('<ul>');
    for (let i of recipe.notes) {
        let note_row = note_row_format
            .replace('{0}', i.title ? i.title : '')
            .replace('{1}', i.body ? i.body : '');
        printWindow.document.write(note_row);
    }
    printWindow.document.write('</ul>');

    // close the html
    printWindow.document.write('</body></html>');
    return printWindow.print();

}

export default PrintRecipe;